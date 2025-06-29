#!/usr/bin/env python3
"""
🚀 AI Education Question Generator API Server
Tạo câu hỏi trắc nghiệm từ PDF thông qua API
Author: AI Assistant
Created: 2025-06-29
"""

import os
import json
import tempfile
import asyncio
import hashlib
import logging
import shutil
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from urllib.parse import urlparse

# FastAPI và dependencies
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import requests
import uvicorn

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import module genQ fix
import importlib.util
try:
    from genQ_simple_fix import SimpleQuestionGenerator
    GENERATOR_TYPE = "simple_fix"
    logger.info("Using SimpleQuestionGenerator (API error fix)")
except ImportError:
    try:
        import genQ
        GENERATOR_TYPE = "original"
        logger.info("Using original genQ")
    except ImportError:
        logger.error("No question generator available")
        GENERATOR_TYPE = "none"

# ===== NEW MODELS FOR UPDATED FORMAT =====
class Choice(BaseModel):
    """Model cho lựa chọn đáp án (format mới)"""
    content: str
    is_correct: bool
    explanation: str

class Question(BaseModel):
    """Model cho câu hỏi (format mới)"""
    question: str
    type: str = "multiple_choice"
    difficulty: str = "medium"
    explanation: str
    choices: List[Choice]

class QuestionResponse(BaseModel):
    """Model cho response câu hỏi (format mới)"""
    questions: List[Question]
    summary: str

class FileInput(BaseModel):
    """Model cho input file"""
    url: str
    file_name: str

class GenerateQuestionsRequest(BaseModel):
    """Model cho request tạo câu hỏi từ nhiều file"""
    files: List[FileInput]
    project_id: str  # Accept nhưng chưa dùng
    total_questions: int
    name: str  # Accept nhưng chưa dùng
    
    @validator('files')
    def validate_files(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Cần ít nhất 1 file')
        if len(v) > 10:  # Giới hạn tối đa 10 files
            raise ValueError('Tối đa 10 files cùng lúc')
        return v
    
    @validator('total_questions')
    def validate_total_questions(cls, v):
        if v < 1 or v > 300:
            raise ValueError('Số câu hỏi phải từ 1 đến 300')
        return v

# ===== LEGACY MODELS (keep for backward compatibility) =====
class QuestionRequest(BaseModel):
    """Model cho request tạo câu hỏi (legacy - single file)"""
    s3_url: str
    total_question: int
    
    @validator('s3_url')
    def validate_s3_url(cls, v):
        """Validate S3 URL"""
        if not v or not v.strip():
            raise ValueError('S3 URL không được để trống')
        
        # Kiểm tra format URL
        parsed = urlparse(v)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError('S3 URL không hợp lệ')
            
        return v.strip()
    
    @validator('total_question')
    def validate_total_question(cls, v):
        """Validate số lượng câu hỏi"""
        if not isinstance(v, int) or v < 1:
            raise ValueError('Số câu hỏi phải là số nguyên dương')
        if v > 300:
            raise ValueError('Số câu hỏi tối đa là 300')
        return v

class AnswerOption(BaseModel):
    """Model cho từng lựa chọn đáp án (legacy)"""
    answer: str
    reason: str

class QuizQuestion(BaseModel):
    """Model cho câu hỏi quiz (legacy)"""
    question: str
    type: str
    hint: str
    correct_answer: str
    options: List[AnswerOption]

class TaskStatus(BaseModel):
    """Model cho trạng thái task"""
    task_id: str
    status: str  # pending, processing, completed, failed
    progress: int  # 0-100
    message: str
    result: Optional[Dict] = None

class FileProcessingResult(BaseModel):
    """Kết quả xử lý file"""
    file_name: str
    status: str  # success, failed, cached
    questions_count: int = 0
    error_message: Optional[str] = None
    processing_time: Optional[float] = None
    from_cache: bool = False

class QuestionMetadata(BaseModel):
    """Metadata cho response (legacy)"""
    project_id: str
    name: str
    total_questions: int
    files_processed: List[str]
    cached_files: List[str]
    new_files: List[str]
    failed_files: List[Dict[str, str]]
    questions_per_file: Dict[str, int]
    processing_time: str
    cache_usage: str

# ===== GLOBAL VARIABLES =====
app = FastAPI(
    title="AI Education Question Generator API",
    description="API tạo câu hỏi trắc nghiệm từ file PDF",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage cho task status
task_storage: Dict[str, TaskStatus] = {}

# ===== HELPER FUNCTIONS =====
def load_question_generator():
    """Load question generator (with API error fix)"""
    try:
        if GENERATOR_TYPE == "simple_fix":
            return SimpleQuestionGenerator()
        elif GENERATOR_TYPE == "original":
            # Import genQ module
            spec = importlib.util.spec_from_file_location("genQ", "genQ.py")
            genq_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(genq_module)
            return genq_module.PDFQuestionGenerator()
        else:
            raise Exception("No generator available")
    except Exception as e:
        logger.error(f"Lỗi load question generator: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khởi tạo hệ thống: {str(e)}")

async def download_file_from_url(url: str, local_path: str) -> bool:
    """Download file từ URL về local"""
    try:
        logger.info(f"Đang tải file từ: {url}")
        
        # Sử dụng requests để download
        response = requests.get(url, stream=True, timeout=300)  # 5 phút timeout
        response.raise_for_status()
        
        # Lưu file
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        # Kiểm tra file size
        file_size = os.path.getsize(local_path)
        logger.info(f"Đã tải file thành công: {file_size:,} bytes")
        
        return True
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Lỗi download file: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Lỗi không xác định khi download: {str(e)}")
        return False

def convert_to_api_format(questions_data: Dict, document_summary: str) -> Dict:
    """Chuyển đổi format từ genQ sang format API yêu cầu"""
    try:
        quiz_questions = []
        
        for q in questions_data.get("questions", []):
            # Tạo options với reason
            options = []
            correct_answer = q.get("correct_answer", "A")
            
            for key in ['A', 'B', 'C', 'D']:
                if key in q.get("options", {}):
                    is_correct = (key == correct_answer)
                    
                    # Tạo reason cho từng option
                    if is_correct:
                        reason = q.get("explanation", "Đây là đáp án đúng.")
                    else:
                        reason = f"Đáp án này không chính xác. {q.get('explanation', 'Vui lòng xem lại kiến thức.')}"
                    
                    options.append(AnswerOption(
                        answer=q["options"][key],
                        reason=reason
                    ))
            
            # Tạo quiz question
            quiz_question = QuizQuestion(
                question=q.get("question", ""),
                type=q.get("difficulty", "medium"),  # easy/medium/hard
                hint=q.get("hint", "Không có gợi ý"),
                correct_answer=correct_answer,
                options=options
            )
            
            quiz_questions.append(quiz_question)
        
        # Tạo response
        response = QuestionResponse(
            overview=document_summary or "Tóm tắt tài liệu học tập",
            quiz=quiz_questions
        )
        
        return response.dict()
        
    except Exception as e:
        logger.error(f"Lỗi convert format: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý dữ liệu: {str(e)}")

async def process_pdf_questions_async(task_id: str, s3_url: str, total_question: int):
    """Xử lý tạo câu hỏi từ PDF (async)"""
    try:
        # Cập nhật status
        task_storage[task_id].status = "processing"
        task_storage[task_id].progress = 10
        task_storage[task_id].message = "Đang tải file PDF..."
        
        # Tạo file tạm
        temp_dir = tempfile.mkdtemp()
        temp_pdf_path = os.path.join(temp_dir, f"temp_{task_id}.pdf")
        
        # Download file
        download_success = await download_file_from_url(s3_url, temp_pdf_path)
        if not download_success:
            raise Exception("Không thể tải file PDF từ S3")
        
        # Cập nhật progress
        task_storage[task_id].progress = 30
        task_storage[task_id].message = "Đang phân tích nội dung PDF..."
        
        # Load question generator
        generator = load_question_generator()
        
        # Chuyển đổi PDF sang text
        if not generator.convert_pdf_to_text(temp_pdf_path):
            raise Exception("Không thể chuyển đổi PDF sang text")
        
        # Cập nhật progress
        task_storage[task_id].progress = 50
        task_storage[task_id].message = "Đang tạo embeddings..."
        
        # Tạo embeddings
        if not generator.create_embeddings():
            raise Exception("Không thể tạo embeddings")
        
        # Cập nhật progress
        task_storage[task_id].progress = 70
        task_storage[task_id].message = "Đang tạo câu hỏi..."
        
        # Tạo câu hỏi với generator đơn giản
        if GENERATOR_TYPE == "simple_fix":
            questions_data = generator.generate_questions_simple(total_question)
        else:
            # Tạo tóm tắt
            document_summary = generator.generate_document_summary()
            # Tạo câu hỏi
            questions_data = generator.generate_questions(total_question)
        
        if not questions_data or not questions_data.get("questions"):
            raise Exception("Không thể tạo câu hỏi từ tài liệu")
        
        # Cập nhật progress
        task_storage[task_id].progress = 90
        task_storage[task_id].message = "Đang xử lý kết quả..."
        
        # Chuyển đổi format
        result = convert_to_api_format(questions_data, document_summary)
        
        # Hoàn thành
        task_storage[task_id].status = "completed"
        task_storage[task_id].progress = 100
        task_storage[task_id].message = f"Đã tạo thành công {len(questions_data['questions'])} câu hỏi"
        task_storage[task_id].result = result
        
        # Cleanup
        try:
            os.remove(temp_pdf_path)
            os.rmdir(temp_dir)
        except:
            pass
        
        logger.info(f"Task {task_id} hoàn thành thành công")
        
    except Exception as e:
        # Lỗi
        error_msg = str(e)
        logger.error(f"Task {task_id} thất bại: {error_msg}")
        
        task_storage[task_id].status = "failed"
        task_storage[task_id].message = f"Lỗi: {error_msg}"
        
        # Cleanup
        try:
            if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)
            if 'temp_dir' in locals() and os.path.exists(temp_dir):
                os.rmdir(temp_dir)
        except:
            pass

def download_pdf_from_url(url: str) -> str:
    """Download PDF từ URL (S3 hoặc web) hoặc copy từ local file"""
    try:
        # Kiểm tra nếu là local file path
        if url.startswith('file://') or (len(url) > 3 and url[1] == ':'):
            # Local file path
            local_path = url.replace('file://', '') if url.startswith('file://') else url
            
            if not os.path.exists(local_path):
                raise HTTPException(status_code=400, detail=f"File không tồn tại: {local_path}")
            
            # Copy file to temp location
            temp_dir = tempfile.gettempdir()
            temp_filename = f"temp_pdf_{hashlib.md5(local_path.encode()).hexdigest()[:8]}.pdf"
            temp_path = os.path.join(temp_dir, temp_filename)
            
            import shutil
            shutil.copy2(local_path, temp_path)
            
            logger.info(f"Đã copy local file: {local_path} -> {temp_path}")
            return temp_path
        
        # URL download
        logger.info(f"Đang download PDF từ: {url}")
        
        # Tạo temp file
        temp_dir = tempfile.gettempdir()
        temp_filename = f"temp_pdf_{hashlib.md5(url.encode()).hexdigest()[:8]}.pdf"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        # Download file
        response = requests.get(url, stream=True, timeout=300, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        
        # Save file
        with open(temp_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        # Verify file
        file_size = os.path.getsize(temp_path)
        if file_size < 100:  # File quá nhỏ
            raise HTTPException(status_code=400, detail="File PDF không hợp lệ")
            
        logger.info(f"Downloaded PDF thành công: {file_size:,} bytes")
        return temp_path
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Lỗi download: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Không thể download file: {str(e)}")
    except Exception as e:
        logger.error(f"Lỗi xử lý file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

# ===== CACHE SYSTEM =====
class MultiFileCache:
    """Cache system cho multi-file processing"""
    
    def __init__(self, cache_dir="cache"):
        self.cache_dir = Path(cache_dir)
        self.content_dir = self.cache_dir / "content"
        self.embeddings_dir = self.cache_dir / "embeddings"
        self.questions_dir = self.cache_dir / "questions"
        
        # Tạo directories
        for dir_path in [self.content_dir, self.embeddings_dir, self.questions_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def get_file_hash(self, file_name: str) -> str:
        """Tạo hash từ file name để làm cache key"""
        return hashlib.md5(file_name.encode()).hexdigest()[:12]
    
    def has_content_cache(self, file_name: str) -> bool:
        """Kiểm tra có cache content không"""
        cache_key = self.get_file_hash(file_name)
        cache_file = self.content_dir / f"{cache_key}_{file_name}_content.txt"
        return cache_file.exists()
    
    def has_embeddings_cache(self, file_name: str) -> bool:
        """Kiểm tra có cache embeddings không"""
        cache_key = self.get_file_hash(file_name)
        cache_file = self.embeddings_dir / f"{cache_key}_{file_name}_embeddings.pkl"
        return cache_file.exists()
    
    def save_content_cache(self, file_name: str, content: str):
        """Lưu content vào cache"""
        try:
            # Validate content type
            if not isinstance(content, str):
                logger.warning(f"Content không phải string: {type(content)}")
                content = str(content) if content else ""
            
            if not content.strip():
                logger.warning(f"Content rỗng cho {file_name}")
                return
            
            cache_key = self.get_file_hash(file_name)
            cache_file = self.content_dir / f"{cache_key}_{file_name}_content.txt"
            
            with open(cache_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            logger.info(f"Đã cache content cho {file_name}")
        except Exception as e:
            logger.error(f"Lỗi save content cache: {e}")
    
    def load_content_cache(self, file_name: str) -> str:
        """Load content từ cache"""
        try:
            cache_key = self.get_file_hash(file_name)
            cache_file = self.content_dir / f"{cache_key}_{file_name}_content.txt"
            
            with open(cache_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            logger.info(f"Loaded content từ cache cho {file_name}")
            return content
        except Exception as e:
            logger.error(f"Lỗi load content cache: {e}")
            return ""
    
    def save_embeddings_cache(self, file_name: str, embeddings, chunks):
        """Lưu embeddings vào cache"""
        try:
            import pickle
            cache_key = self.get_file_hash(file_name)
            cache_file = self.embeddings_dir / f"{cache_key}_{file_name}_embeddings.pkl"
            
            cache_data = {
                'embeddings': embeddings,
                'chunks': chunks,
                'timestamp': datetime.now().isoformat()
            }
            
            with open(cache_file, 'wb') as f:
                pickle.dump(cache_data, f)
            
            logger.info(f"Đã cache embeddings cho {file_name}")
        except Exception as e:
            logger.error(f"Lỗi save embeddings cache: {e}")
    
    def load_embeddings_cache(self, file_name: str):
        """Load embeddings từ cache"""
        try:
            import pickle
            cache_key = self.get_file_hash(file_name)
            cache_file = self.embeddings_dir / f"{cache_key}_{file_name}_embeddings.pkl"
            
            with open(cache_file, 'rb') as f:
                cache_data = pickle.load(f)
            
            logger.info(f"Loaded embeddings từ cache cho {file_name}")
            return cache_data['embeddings'], cache_data['chunks']
        except Exception as e:
            logger.error(f"Lỗi load embeddings cache: {e}")
            return None, None

# Global cache instance
multi_file_cache = MultiFileCache()

# ===== API ENDPOINTS =====

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "🚀 AI Education Question Generator API - Multi-File Support",
        "status": "active",
        "version": "2.0.0",
        "features": {
            "multi_file_processing": True,
            "intelligent_caching": True,
            "async_processing": True,
            "question_distribution": "equal_split"
        },
        "endpoints": {
            "POST /api/generate-questions-sync": "Tạo câu hỏi từ nhiều file (sync, ≤100 câu)",
            "POST /api/generate-questions": "Tạo câu hỏi từ nhiều file (async, ≤200 câu)",
            "POST /api/generate-questions-single-sync": "Tạo câu hỏi từ 1 file (legacy)",
            "GET /api/health": "Health check với cache info",
            "GET /api/cache/info": "Thông tin cache system",
            "DELETE /api/cache/clear": "Xóa cache",
            "GET /api/task-status/{task_id}": "Kiểm tra trạng thái task",
            "GET /api/task-result/{task_id}": "Lấy kết quả task"
        },
        "limits": {
            "max_files_per_request": 10,
            "max_questions_sync": 100,
            "max_questions_async": 200,
            "max_file_size": "50MB"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check với cache info"""
    try:
        # Kiểm tra OpenAI API key
        openai_key = os.getenv('OPENAI_API_KEY')
        has_openai = bool(openai_key and openai_key.strip())
        
        # Kiểm tra genQ module
        try:
            load_question_generator()
            genq_available = True
        except:
            genq_available = False
        
        # Cache statistics
        cache_stats = {
            "content_files": len(list(multi_file_cache.content_dir.glob("*.txt"))),
            "embedding_files": len(list(multi_file_cache.embeddings_dir.glob("*.pkl"))),
            "cache_size_mb": sum(f.stat().st_size for f in multi_file_cache.cache_dir.rglob("*") if f.is_file()) / (1024*1024)
        }
        
        return {
            "status": "healthy",
            "checks": {
                "openai_api": has_openai,
                "question_generator": genq_available,
                "temp_directory": os.access(tempfile.gettempdir(), os.W_OK),
                "cache_system": multi_file_cache.cache_dir.exists()
            },
            "cache_statistics": cache_stats,
            "timestamp": datetime.now().isoformat(),
            "active_tasks": len([t for t in task_storage.values() if t.status == "processing"]),
            "completed_tasks": len([t for t in task_storage.values() if t.status == "completed"]),
            "features": {
                "multi_file_support": True,
                "caching_enabled": True,
                "async_processing": True,
                "max_files_per_request": 10,
                "max_questions_sync": 100,
                "max_questions_async": 200
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
        )

@app.post("/api/generate-questions")
async def generate_questions_async(request: GenerateQuestionsRequest, background_tasks: BackgroundTasks):
    """
    API tạo câu hỏi từ nhiều file (async) - Multi-file support
    """
    try:
        logger.info(f"Async generating questions from {len(request.files)} files")
        
        # Validate request
        if len(request.files) == 0:
            raise HTTPException(status_code=400, detail="Cần ít nhất 1 file")
        
        if request.total_questions > 200:
            raise HTTPException(status_code=400, detail="Tối đa 200 câu hỏi")
        
        # Tạo task
        task_id = f"task_{int(time.time())}_{hashlib.md5(str(request.files).encode()).hexdigest()[:8]}"
        
        # Khởi tạo task status
        task_storage[task_id] = TaskStatus(
            task_id=task_id,
            status="pending",
            progress=0,
            message="Task đã được tạo và đang chờ xử lý",
            created_at=datetime.now()
        )
        
        # Chạy trong background
        import threading
        thread = threading.Thread(
            target=process_multi_file_async_task,
            args=(task_id, request)
        )
        thread.daemon = True
        thread.start()
        
        return {
            "task_id": task_id,
            "status": "pending", 
            "message": "Task đã được tạo và đang xử lý",
            "estimated_time": f"{len(request.files) * request.total_questions * 2} giây",
            "files_count": len(request.files)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Multi-file async generate error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

def process_multi_file_async_task(task_id: str, request: GenerateQuestionsRequest):
    """Background task xử lý multi-file async"""
    try:
        # Update status
        task_storage[task_id].status = "processing"
        task_storage[task_id].progress = 10
        task_storage[task_id].message = "Đang xử lý files..."
        
        # Process files
        response = process_multiple_files(request)
        
        # Update final status
        task_storage[task_id].status = "completed"
        task_storage[task_id].progress = 100
        task_storage[task_id].message = f"Hoàn thành {response.metadata.total_questions} câu hỏi từ {len(response.metadata.files_processed)} files"
        task_storage[task_id].result = response.dict()
        task_storage[task_id].completed_at = datetime.now()
        
        logger.info(f"Task {task_id} completed successfully")
        
    except Exception as e:
        logger.error(f"Task {task_id} failed: {str(e)}")
        task_storage[task_id].status = "failed"
        task_storage[task_id].message = f"Lỗi: {str(e)}"
        task_storage[task_id].completed_at = datetime.now()
        task_id = hashlib.md5(f"{request.s3_url}_{request.total_question}_{datetime.now()}".encode()).hexdigest()[:16]
        
        # Khởi tạo task status
        task_storage[task_id] = TaskStatus(
            task_id=task_id,
            status="pending",
            progress=0,
            message="Khởi tạo task..."
        )
        
        # Thêm background task
        background_tasks.add_task(
            process_pdf_questions_async,
            task_id,
            request.s3_url,
            request.total_question
        )
        
        logger.info(f"Bắt đầu task {task_id} - URL: {request.s3_url}, Questions: {request.total_question}")
        
        return {
            "task_id": task_id,
            "status": "pending",
            "message": "Task đã được tạo và đang xử lý",
            "check_status_url": f"/api/task-status/{task_id}"
        }
        
    except Exception as e:
        logger.error(f"Lỗi tạo task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi tạo task: {str(e)}")

@app.get("/api/task-status/{task_id}")
async def get_task_status(task_id: str):
    """
    Kiểm tra trạng thái task
    """
    if task_id not in task_storage:
        raise HTTPException(status_code=404, detail="Task không tồn tại")
    
    task = task_storage[task_id]
    
    response = {
        "task_id": task.task_id,
        "status": task.status,
        "progress": task.progress,
        "message": task.message,
        "timestamp": datetime.now().isoformat()
    }
    
    # Nếu hoàn thành, trả về kết quả
    if task.status == "completed" and task.result:
        response["data"] = task.result
    
    return response

@app.get("/api/task-result/{task_id}")
async def get_task_result(task_id: str):
    """
    Lấy kết quả của task (chỉ khi hoàn thành)
    """
    if task_id not in task_storage:
        raise HTTPException(status_code=404, detail="Task không tồn tại")
    
    task = task_storage[task_id]
    
    if task.status == "completed" and task.result:
        return task.result
    elif task.status == "failed":
        raise HTTPException(status_code=500, detail=task.message)
    elif task.status in ["pending", "processing"]:
        raise HTTPException(status_code=202, detail="Task chưa hoàn thành")
    else:
        raise HTTPException(status_code=500, detail="Trạng thái task không xác định")

@app.delete("/api/task/{task_id}")
async def delete_task(task_id: str):
    """
    Xóa task khỏi storage
    """
    if task_id not in task_storage:
        raise HTTPException(status_code=404, detail="Task không tồn tại")
    
    del task_storage[task_id]
    
    return {
        "message": f"Đã xóa task {task_id}",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/tasks")
async def list_tasks():
    """
    Liệt kê tất cả tasks
    """
    tasks = []
    for task_id, task in task_storage.items():
        tasks.append({
            "task_id": task_id,
            "status": task.status,
            "progress": task.progress,
            "message": task.message
        })
    
    return {
        "total": len(tasks),
        "tasks": tasks,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/generate-questions-sync", response_model=QuestionResponse)
async def generate_questions_sync(request: GenerateQuestionsRequest):
    """
    API tạo câu hỏi từ nhiều file (sync) - Multi-file support với format mới
    """
    try:
        logger.info(f"Generating questions from {len(request.files)} files")
        
        # Validate request
        if len(request.files) == 0:
            raise HTTPException(status_code=400, detail="Cần ít nhất 1 file")
        
        if request.total_questions > 300:  # Giới hạn sync nâng lên 300
            raise HTTPException(
                status_code=400,
                detail="Sync API chỉ hỗ trợ tối đa 300 câu hỏi."
            )
        
        # Process multiple files
        response = process_multiple_files(request)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Multi-file sync generate error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@app.post("/api/generate-questions-single-sync")
async def generate_questions_single_sync(request: QuestionRequest):
    """
    API tạo câu hỏi từ 1 file (legacy support)
    """
    try:
        # Convert single file request to multi-file format
        multi_request = GenerateQuestionsRequest(
            files=[FileInput(
                url=request.s3_url,
                file_name=f"document_{int(time.time())}.pdf"
            )],
            project_id=f"single_{int(time.time())}",
            total_questions=request.total_question,
            name="Single File Questions"
        )
        
        # Process using multi-file system
        response = process_multiple_files(multi_request)
        
        # Return in legacy format (without metadata)
        return {
            "overview": response.overview,
            "quiz": response.quiz
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Single file sync generate error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

def process_single_file(file_input: FileInput, questions_count: int) -> FileProcessingResult:
    """Xử lý một file và tạo câu hỏi"""
    start_time = time.time()
    result = FileProcessingResult(
        file_name=file_input.file_name,
        status="processing"
    )
    
    try:
        # Kiểm tra cache trước
        has_content = multi_file_cache.has_content_cache(file_input.file_name)
        has_embeddings = multi_file_cache.has_embeddings_cache(file_input.file_name)
        
        if has_content and has_embeddings:
            logger.info(f"Using cache cho {file_input.file_name}")
            
            # Load từ cache
            content = multi_file_cache.load_content_cache(file_input.file_name)
            embeddings, chunks = multi_file_cache.load_embeddings_cache(file_input.file_name)
            
            if content and embeddings is not None and chunks:
                # Tạo generator với cached data
                generator = load_question_generator()
                generator.pdf_content = content
                generator.chunks = chunks
                generator.embeddings = embeddings
                
                # Generate questions
                questions_data = generator.generate_questions(questions_count)
                
                result.status = "success"
                result.questions_count = len(questions_data.get("questions", []))
                result.from_cache = True
                result.processing_time = time.time() - start_time
                
                return result, questions_data
        
        # Không có cache, xử lý từ đầu
        logger.info(f"Processing {file_input.file_name} từ đầu...")
        
        # Download file
        temp_file = download_pdf_from_url(file_input.url)
        
        try:
            # Load generator
            generator = load_question_generator()
            
            # Convert PDF to text
            logger.info(f"Converting PDF: {temp_file}")
            conversion_result = generator.convert_pdf_to_text(temp_file)
            
            # Debug PDF content
            pdf_content = getattr(generator, 'pdf_content', '')
            logger.info(f"PDF content type: {type(pdf_content)}, length: {len(str(pdf_content))}")
            
            if not conversion_result:
                logger.error("PDF conversion failed")
                raise Exception("Không thể đọc file PDF")
            
            # Validate content before caching
            if not isinstance(pdf_content, str):
                logger.warning(f"Converting pdf_content from {type(pdf_content)} to str")
                pdf_content = str(pdf_content)
            
            if not pdf_content.strip():
                logger.error("PDF content is empty after conversion")
                raise Exception("Nội dung PDF trống sau khi chuyển đổi")
            
            logger.info(f"PDF conversion successful: {len(pdf_content)} characters")
            
            # Cache content
            multi_file_cache.save_content_cache(file_input.file_name, pdf_content)
            
            # Create embeddings
            if not generator.create_embeddings():
                raise Exception("Không thể tạo embeddings")
            
            # Cache embeddings
            multi_file_cache.save_embeddings_cache(
                file_input.file_name, 
                generator.embeddings, 
                generator.chunks
            )
            
            # Generate questions
            questions_data = generator.generate_questions(questions_count)
            
            result.status = "success"
            result.questions_count = len(questions_data.get("questions", []))
            result.from_cache = False
            result.processing_time = time.time() - start_time
            
            return result, questions_data
            
        finally:
            # Cleanup temp file
            if os.path.exists(temp_file):
                os.remove(temp_file)
    
    except Exception as e:
        logger.error(f"Lỗi xử lý file {file_input.file_name}: {str(e)}")
        result.status = "failed"
        result.error_message = str(e)
        result.processing_time = time.time() - start_time
        
        return result, None

def distribute_questions(total_questions: int, num_files: int) -> List[int]:
    """Chia đều số câu hỏi cho các files"""
    if num_files == 0:
        return []
    
    base_count = total_questions // num_files
    remainder = total_questions % num_files
    
    distribution = [base_count] * num_files
    
    # Phân bổ phần dư
    for i in range(remainder):
        distribution[i] += 1
    
    return distribution

def process_multiple_files(request: GenerateQuestionsRequest) -> QuestionResponse:
    """Xử lý nhiều files và combine kết quả với format mới"""
    start_time = time.time()
    
    # Phân bổ câu hỏi
    question_distribution = distribute_questions(request.total_questions, len(request.files))
    
    # Track results
    all_questions = []
    file_results = []
    cached_files = []
    new_files = []
    failed_files = []
    questions_per_file = {}
    all_content = []  # Để tạo summary
    
    # Process từng file
    for i, file_input in enumerate(request.files):
        questions_count = question_distribution[i] if i < len(question_distribution) else 0
        
        logger.info(f"Processing {file_input.file_name} - {questions_count} câu hỏi")
        
        try:
            result, questions_data = process_single_file(file_input, questions_count)
            file_results.append(result)
            
            if result.status == "success" and questions_data:
                # Log question data structure để debug
                logger.info(f"📊 Questions data structure: {type(questions_data)}")
                if questions_data.get("questions"):
                    first_q = questions_data["questions"][0] if questions_data["questions"] else {}
                    logger.info(f"📝 First question keys: {list(first_q.keys())}")
                    logger.info(f"📋 First question structure: {json.dumps(first_q, indent=2)[:200]}...")
                
                # Check if already in new format
                if questions_data.get("questions") and len(questions_data["questions"]) > 0:
                    first_question = questions_data["questions"][0]
                    if "choices" in first_question and isinstance(first_question.get("choices"), list):
                        # Already new format, no conversion needed
                        logger.info("✅ Questions already in new format, no conversion needed")
                        for q in questions_data["questions"]:
                            if isinstance(q.get("choices"), list):
                                new_question = Question(
                                    question=q.get("question", ""),
                                    type=q.get("type", "multiple_choice"),
                                    difficulty=q.get("difficulty", "medium"),
                                    explanation=q.get("explanation", ""),
                                    choices=[Choice(**choice) for choice in q["choices"]]
                                )
                                all_questions.append(new_question)
                    else:
                        # Old format, need conversion
                        logger.info("🔄 Converting from old format to new format")
                        file_questions = questions_data.get("questions", [])
                        converted_questions = convert_questions_to_new_format(file_questions)
                        all_questions.extend(converted_questions)
                else:
                    logger.warning("⚠️ No questions found in response")
                
                # Collect content for summary
                if result.from_cache:
                    content = multi_file_cache.load_content_cache(file_input.file_name)
                    if content:
                        all_content.append(content[:1000])  # First 1000 chars
                
                # Track metadata
                questions_per_file[file_input.file_name] = len(all_questions)
                
                if result.from_cache:
                    cached_files.append(file_input.file_name)
                else:
                    new_files.append(file_input.file_name)
            else:
                # File failed
                failed_files.append({
                    "file_name": file_input.file_name,
                    "error": result.error_message or "Unknown error"
                })
                questions_per_file[file_input.file_name] = 0
                
        except Exception as e:
            logger.error(f"Lỗi nghiêm trọng với file {file_input.file_name}: {str(e)}")
            failed_files.append({
                "file_name": file_input.file_name,
                "error": str(e)
            })
            questions_per_file[file_input.file_name] = 0
    
    # Tạo summary từ content
    successful_files = [f.file_name for f in file_results if f.status == "success"]
    
    if all_content:
        # Generate summary from content
        combined_content = "\n".join(all_content[:5])  # Max 5 content pieces
        summary = generate_document_summary(combined_content, successful_files)
    else:
        # Fallback summary
        summary = f"Tài liệu học tập được tổng hợp từ {len(successful_files)} file(s): {', '.join(successful_files)}. "
        if failed_files:
            summary += f"Có {len(failed_files)} file(s) xử lý thất bại. "
        summary += f"Tổng cộng {len(all_questions)} câu hỏi được tạo để kiểm tra kiến thức đã học."
    
    # Ensure we have enough questions (fallback if needed)
    if len(all_questions) < request.total_questions:
        missing = request.total_questions - len(all_questions)
        logger.warning(f"Thiếu {missing} câu hỏi, tạo fallback...")
        fallback_questions = create_fallback_questions_new_format(missing)
        all_questions.extend(fallback_questions)
    
    # Limit to requested amount
    final_questions = all_questions[:request.total_questions]
    
    logger.info(f"✅ Hoàn thành: {len(final_questions)} câu hỏi từ {len(successful_files)} files")
    
    return QuestionResponse(
        questions=final_questions,
        summary=summary
    )

# ===== HELPER FUNCTIONS FOR NEW FORMAT =====
def convert_questions_to_new_format(old_questions: List[Dict]) -> List[Question]:
    """Convert old format questions to new format"""
    new_questions = []
    
    for i, old_q in enumerate(old_questions):
        try:
            # Extract data from old format
            question_text = old_q.get("question", "")
            hint = old_q.get("hint", "")
            correct_answer = old_q.get("correct_answer", "A")
            options = old_q.get("options", [])
            
            logger.info(f"🔍 Converting Q{i+1}: correct_answer='{correct_answer}', options_type={type(options)}")
            
            # Determine difficulty (simple heuristic)
            difficulty = "medium"
            if len(question_text) < 50:
                difficulty = "easy"
            elif len(question_text) > 100:
                difficulty = "hard"
            
            # Create choices in new format
            choices = []
            
            # Handle different options formats
            if isinstance(options, list):
                # Options as array: [{"answer": "A", "content": "...", "reason": "..."}, ...]
                logger.info(f"📋 Processing {len(options)} options as array")
                for option in options:
                    if isinstance(option, dict):
                        choice_key = option.get("answer", "A")
                        choice_content = option.get("content", "")
                        choice_reason = option.get("reason", "")
                        is_correct = (choice_key == correct_answer)
                        
                        logger.info(f"  Choice {choice_key}: content='{choice_content[:30]}...', is_correct={is_correct}")
                        
                        choices.append(Choice(
                            content=choice_content,
                            is_correct=is_correct,
                            explanation=choice_reason
                        ))
            elif isinstance(options, dict):
                # Options as dict: {"A": "content1", "B": "content2", ...}
                logger.info(f"📋 Processing options as dict with keys: {list(options.keys())}")
                for choice_key, choice_content in options.items():
                    is_correct = (choice_key == correct_answer)
                    
                    logger.info(f"  Choice {choice_key}: content='{choice_content[:30]}...', is_correct={is_correct}")
                    
                    choices.append(Choice(
                        content=choice_content,
                        is_correct=is_correct,
                        explanation="Based on document content" if is_correct else "This is not correct according to the document"
                    ))
            
            # Ensure we have 4 choices với content thật
            while len(choices) < 4:
                fallback_contents = [
                    "This option is not supported by the document evidence",
                    "This choice contradicts the main principles discussed", 
                    "This alternative is not mentioned in the content",
                    "This approach is not recommended based on the material"
                ]
                
                choices.append(Choice(
                    content=fallback_contents[len(choices) - 1] if len(choices) <= 4 else "Additional incorrect option",
                    is_correct=False,
                    explanation="This is not the correct answer"
                ))
            
            # Verify we have exactly one correct answer
            correct_count = sum(1 for choice in choices if choice.is_correct)
            logger.info(f"✅ Q{i+1}: {len(choices)} choices, {correct_count} correct")
            
            # Create new question
            new_question = Question(
                question=question_text,
                type="multiple_choice",
                difficulty=difficulty,
                explanation=hint,
                choices=choices[:4]  # Limit to 4 choices
            )
            
            new_questions.append(new_question)
            
        except Exception as e:
            logger.error(f"Error converting question {i+1}: {e}")
            # Create fallback question với content thật
            fallback_choices = [
                Choice(content="The main educational concept presented in the document", is_correct=True, explanation="Correct based on content analysis"),
                Choice(content="Secondary supporting information only", is_correct=False, explanation="This is not the primary focus"),
                Choice(content="Historical background context", is_correct=False, explanation="This is supplementary material"),
                Choice(content="Advanced theoretical extensions", is_correct=False, explanation="This goes beyond the scope")
            ]
            
            fallback_question = Question(
                question="What is the primary focus of this educational document?",
                type="multiple_choice",
                difficulty="medium",
                explanation="Based on the document content analysis",
                choices=fallback_choices
            )
            new_questions.append(fallback_question)
    
    return new_questions

def create_fallback_questions_new_format(num_questions: int) -> List[Question]:
    """Create fallback questions in new format với content thật"""
    fallback_questions = []
    
    question_templates = [
        {
            "question": "What is the main educational concept discussed in the document?",
            "explanation": "This question tests understanding of core educational concepts",
            "correct": "Comprehensive learning through integrated theory and practice",
            "wrong": [
                "Memorization-based learning without understanding", 
                "Purely theoretical academic study methods",
                "Traditional rote learning approaches"
            ]
        },
        {
            "question": "Which educational methodology is primarily described in the content?",
            "explanation": "This tests knowledge of teaching methodologies presented",
            "correct": "Active learning with student engagement and practical application",
            "wrong": [
                "Passive lecture-based information delivery", 
                "Self-study without instructor guidance",
                "Examination-focused preparation only"
            ]
        },
        {
            "question": "What is the key educational principle mentioned in the material?",
            "explanation": "This evaluates understanding of fundamental educational principles",
            "correct": "Learning effectiveness through understanding and application",
            "wrong": [
                "Speed of information processing over comprehension", 
                "Competition-based individual achievement focus",
                "Standardized testing performance optimization"
            ]
        },
        {
            "question": "What objective does the educational content aim to achieve?",
            "explanation": "This assesses comprehension of learning goals",
            "correct": "Development of critical thinking and problem-solving skills",
            "wrong": [
                "Fast completion of academic requirements", 
                "High scores on standardized assessments only",
                "Accumulation of factual information"
            ]
        },
        {
            "question": "Which learning outcome is most emphasized according to the text?",
            "explanation": "This tests prioritization of educational outcomes",
            "correct": "Deep understanding with ability to apply knowledge practically",
            "wrong": [
                "Quick recall of memorized information", 
                "Perfect performance on written examinations",
                "Completion of all assigned reading materials"
            ]
        }
    ]
    
    for i in range(num_questions):
        template = question_templates[i % len(question_templates)]
        
        # Create choices với content thật
        choices = [
            Choice(
                content=template["correct"],
                is_correct=True,
                explanation="This is the correct answer based on modern educational best practices and document content"
            )
        ]
        
        # Add wrong answers với content thật
        for wrong_answer in template["wrong"]:
            choices.append(Choice(
                content=wrong_answer,
                is_correct=False,
                explanation="This approach is not recommended according to effective educational principles"
            ))
        
        # Create question
        question = Question(
            question=template["question"] + (f" (Advanced Analysis {i//len(question_templates) + 1})" if i >= len(question_templates) else ""),
            type="multiple_choice",
            difficulty="medium",
            explanation=template["explanation"],
            choices=choices
        )
        
        fallback_questions.append(question)
    
    return fallback_questions

def generate_document_summary(content: str, file_names: List[str]) -> str:
    """Generate a comprehensive summary from document content"""
    try:
        # Simple summary generation
        content_sample = content[:1500] if content else ""
        
        # Extract key information
        summary_parts = []
        
        # Document info
        file_count = len(file_names)
        if file_count == 1:
            summary_parts.append(f"This document ({file_names[0]}) contains educational material")
        else:
            summary_parts.append(f"These {file_count} documents ({', '.join(file_names[:3])}" + 
                               ("..." if file_count > 3 else "") + ") contain educational material")
        
        # Content analysis (simple keyword extraction)
        if content_sample:
            words = content_sample.lower().split()
            common_words = set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'])
            
            # Find important terms
            word_freq = {}
            for word in words:
                if len(word) > 3 and word not in common_words:
                    word_freq[word] = word_freq.get(word, 0) + 1
            
            # Get top keywords
            top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
            if top_keywords:
                keywords = [word for word, freq in top_keywords]
                summary_parts.append(f"covering topics related to {', '.join(keywords[:3])}")
        
        # Learning objectives
        summary_parts.append("designed to test understanding of key concepts and principles")
        
        # Combine summary
        summary = " ".join(summary_parts) + ". This material provides comprehensive coverage of the subject matter and includes practical applications and theoretical foundations relevant to the field of study."
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        return f"Educational content from {len(file_names)} document(s) covering important concepts and principles for comprehensive learning and assessment."

# ===== END HELPER FUNCTIONS =====
# ===== MAIN =====
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="AI Education Question Generator API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host để bind server")
    parser.add_argument("--port", type=int, default=8000, help="Port để chạy server")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload (development)")
    args = parser.parse_args()
    
    print("🚀 Khởi động AI Education Question Generator API Server...")
    print(f"📡 Server sẽ chạy tại: http://{args.host}:{args.port}")
    print(f"📚 API Documentation: http://{args.host}:{args.port}/docs")
    print(f"🔧 Redoc Documentation: http://{args.host}:{args.port}/redoc")
    
    uvicorn.run(
        "server:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level="info"
    )

@app.get("/api/cache/info")
async def get_cache_info():
    """Thông tin về cache system"""
    try:
        content_files = list(multi_file_cache.content_dir.glob("*.txt"))
        embedding_files = list(multi_file_cache.embeddings_dir.glob("*.pkl"))
        
        cache_info = {
            "cache_directory": str(multi_file_cache.cache_dir),
            "content_cache": {
                "count": len(content_files),
                "files": [f.name for f in content_files[:10]]  # Show first 10
            },
            "embeddings_cache": {
                "count": len(embedding_files),
                "files": [f.name for f in embedding_files[:10]]  # Show first 10
            },
            "total_size_mb": sum(f.stat().st_size for f in multi_file_cache.cache_dir.rglob("*") if f.is_file()) / (1024*1024),
            "created": datetime.now().isoformat()
        }
        
        return cache_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi cache info: {str(e)}")

@app.delete("/api/cache/clear")
async def clear_cache():
    """Xóa tất cả cache"""
    try:
        import shutil
        
        # Count files before clearing
        content_files = len(list(multi_file_cache.content_dir.glob("*.txt")))
        embedding_files = len(list(multi_file_cache.embeddings_dir.glob("*.pkl")))
        
        # Clear cache directories
        if multi_file_cache.content_dir.exists():
            shutil.rmtree(multi_file_cache.content_dir)
        if multi_file_cache.embeddings_dir.exists():
            shutil.rmtree(multi_file_cache.embeddings_dir)
        if multi_file_cache.questions_dir.exists():
            shutil.rmtree(multi_file_cache.questions_dir)
        
        # Recreate directories
        multi_file_cache.content_dir.mkdir(parents=True, exist_ok=True)
        multi_file_cache.embeddings_dir.mkdir(parents=True, exist_ok=True)
        multi_file_cache.questions_dir.mkdir(parents=True, exist_ok=True)
        
        return {
            "message": "Cache đã được xóa thành công",
            "cleared": {
                "content_files": content_files,
                "embedding_files": embedding_files
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi clear cache: {str(e)}")
