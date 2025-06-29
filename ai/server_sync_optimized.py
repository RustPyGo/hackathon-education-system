#!/usr/bin/env python3
"""
🚀 AI Education Question Generator API Server - SYNC OPTIMIZED
Tạo câu hỏi trắc nghiệm từ PDF thông qua API - Tối ưu cho xử lý đồng bộ
Author: AI Assistant
Created: 2025-06-29
Optimized: 2025-06-29 - Sync only, 300 questions max
"""

import os
import json
import tempfile
import hashlib
import logging
import shutil
import time
import threading
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

# FastAPI và dependencies
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import requests
import uvicorn

# Import module genQ
import importlib.util
import sys

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== MODELS =====
class FileInput(BaseModel):
    """Model cho input file"""
    url: str
    file_name: str

class GenerateQuestionsRequest(BaseModel):
    """Model cho request tạo câu hỏi từ nhiều file - SYNC ONLY"""
    files: List[FileInput]
    project_id: str
    total_questions: int
    name: str
    
    @validator('files')
    def validate_files(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Cần ít nhất 1 file')
        if len(v) > 15:  # Tăng từ 10 lên 15 files
            raise ValueError('Tối đa 15 files cùng lúc')
        return v
    
    @validator('total_questions')
    def validate_total_questions(cls, v):
        if v < 1 or v > 300:  # Tăng từ 200 lên 300
            raise ValueError('Số câu hỏi phải từ 1 đến 300')
        return v

class FileProcessingResult(BaseModel):
    """Kết quả xử lý file"""
    file_name: str
    status: str  # success, failed, cached
    questions_count: int = 0
    error_message: Optional[str] = None
    processing_time: Optional[float] = None
    from_cache: bool = False

class QuestionMetadata(BaseModel):
    """Metadata cho response"""
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

class QuestionResponse(BaseModel):
    """Response cho API tạo câu hỏi"""
    overview: str
    quiz: List[Dict]
    metadata: QuestionMetadata

# ===== OPTIMIZED CACHE SYSTEM =====
class OptimizedMultiFileCache:
    """Cache system tối ưu cho multi-file processing"""
    
    def __init__(self, cache_dir: str = "cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.memory_cache = {}  # In-memory cache cho tốc độ
        self.cache_lock = threading.Lock()
        
    def _get_file_hash(self, file_name: str) -> str:
        """Tạo hash cho file name"""
        return hashlib.md5(file_name.encode()).hexdigest()
    
    def get_cached_content(self, file_name: str) -> Optional[str]:
        """Lấy cached content"""
        with self.cache_lock:
            # Check memory cache first
            if file_name in self.memory_cache and 'content' in self.memory_cache[file_name]:
                return self.memory_cache[file_name]['content']
            
            # Check disk cache
            file_hash = self._get_file_hash(file_name)
            content_path = self.cache_dir / f"{file_hash}_content.txt"
            
            if content_path.exists():
                try:
                    content = content_path.read_text(encoding='utf-8')
                    # Cache in memory
                    if file_name not in self.memory_cache:
                        self.memory_cache[file_name] = {}
                    self.memory_cache[file_name]['content'] = content
                    return content
                except Exception as e:
                    logger.error(f"Lỗi đọc cached content: {e}")
            
            return None
    
    def cache_content(self, file_name: str, content: str):
        """Cache content"""
        with self.cache_lock:
            try:
                # Cache in memory
                if file_name not in self.memory_cache:
                    self.memory_cache[file_name] = {}
                self.memory_cache[file_name]['content'] = content
                
                # Cache on disk
                file_hash = self._get_file_hash(file_name)
                content_path = self.cache_dir / f"{file_hash}_content.txt"
                content_path.write_text(content, encoding='utf-8')
                
                logger.info(f"Đã cache content cho file: {file_name}")
            except Exception as e:
                logger.error(f"Lỗi cache content: {e}")
    
    def get_cached_questions(self, file_name: str, num_questions: int) -> Optional[List]:
        """Lấy cached questions"""
        with self.cache_lock:
            # Check memory cache first
            if (file_name in self.memory_cache and 
                'questions' in self.memory_cache[file_name] and
                len(self.memory_cache[file_name]['questions']) >= num_questions):
                return self.memory_cache[file_name]['questions'][:num_questions]
            
            # Check disk cache
            file_hash = self._get_file_hash(file_name)
            questions_path = self.cache_dir / f"{file_hash}_questions.json"
            
            if questions_path.exists():
                try:
                    with open(questions_path, 'r', encoding='utf-8') as f:
                        questions = json.load(f)
                    
                    if len(questions) >= num_questions:
                        # Cache in memory
                        if file_name not in self.memory_cache:
                            self.memory_cache[file_name] = {}
                        self.memory_cache[file_name]['questions'] = questions
                        return questions[:num_questions]
                except Exception as e:
                    logger.error(f"Lỗi đọc cached questions: {e}")
            
            return None
    
    def cache_questions(self, file_name: str, questions: List):
        """Cache questions"""
        with self.cache_lock:
            try:
                # Cache in memory
                if file_name not in self.memory_cache:
                    self.memory_cache[file_name] = {}
                self.memory_cache[file_name]['questions'] = questions
                
                # Cache on disk
                file_hash = self._get_file_hash(file_name)
                questions_path = self.cache_dir / f"{file_hash}_questions.json"
                
                with open(questions_path, 'w', encoding='utf-8') as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                
                logger.info(f"Đã cache {len(questions)} câu hỏi cho file: {file_name}")
            except Exception as e:
                logger.error(f"Lỗi cache questions: {e}")
    
    def clear_cache(self):
        """Xóa toàn bộ cache"""
        with self.cache_lock:
            try:
                # Clear memory cache
                self.memory_cache.clear()
                
                # Clear disk cache
                for cache_file in self.cache_dir.glob("*"):
                    if cache_file.is_file():
                        cache_file.unlink()
                
                logger.info("Đã xóa toàn bộ cache")
                return True
            except Exception as e:
                logger.error(f"Lỗi xóa cache: {e}")
                return False

# ===== GLOBAL VARIABLES =====
app = FastAPI(
    title="AI Education Question Generator API - SYNC OPTIMIZED",
    description="API tạo câu hỏi trắc nghiệm từ file PDF - Tối ưu đồng bộ",
    version="2.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global cache instance
cache = OptimizedMultiFileCache()

# ===== HELPER FUNCTIONS =====
def load_question_generator():
    """Load PDFQuestionGenerator từ genQ.py"""
    try:
        spec = importlib.util.spec_from_file_location("genQ", "genQ.py")
        genq_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(genq_module)
        
        return genq_module.PDFQuestionGenerator()
    except Exception as e:
        logger.error(f"Lỗi load question generator: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khởi tạo hệ thống: {str(e)}")

def download_file_parallel(url: str, local_path: str) -> bool:
    """Download file với timeout tối ưu"""
    try:
        logger.info(f"Tải file: {url}")
        
        # Sử dụng session để tối ưu connection
        session = requests.Session()
        response = session.get(url, stream=True, timeout=120)  # Giảm timeout
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=32768):  # Tăng chunk size
                if chunk:
                    f.write(chunk)
        
        file_size = os.path.getsize(local_path)
        logger.info(f"Đã tải: {file_size:,} bytes")
        
        return True
    except Exception as e:
        logger.error(f"Lỗi tải file {url}: {str(e)}")
        return False

def process_single_file_optimized(file_input: FileInput, questions_needed: int, generator) -> FileProcessingResult:
    """Xử lý một file với tối ưu hóa"""
    start_time = time.time()
    file_name = file_input.file_name
    
    try:
        # 1. Kiểm tra cache trước
        cached_questions = cache.get_cached_questions(file_name, questions_needed)
        if cached_questions:
            logger.info(f"✅ Sử dụng cache cho {file_name}: {len(cached_questions)} câu")
            return FileProcessingResult(
                file_name=file_name,
                status="cached",
                questions_count=len(cached_questions),
                processing_time=time.time() - start_time,
                from_cache=True
            )
        
        # 2. Download file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
            temp_path = temp_file.name
        
        if not download_file_parallel(file_input.url, temp_path):
            raise Exception("Không thể tải file")
        
        # 3. Kiểm tra cached content
        cached_content = cache.get_cached_content(file_name)
        
        if cached_content:
            logger.info(f"Sử dụng cached content cho {file_name}")
            generator.pdf_content = cached_content
        else:
            # Convert PDF to text
            generator.convert_pdf_to_text(temp_path)
            # Cache content
            cache.cache_content(file_name, generator.pdf_content)
        
        # 4. Tạo câu hỏi với batch processing
        questions = generator.generate_questions_batch_optimized(questions_needed)
        
        # 5. Cache questions
        cache.cache_questions(file_name, questions)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        
        processing_time = time.time() - start_time
        logger.info(f"✅ Xử lý {file_name}: {len(questions)} câu trong {processing_time:.2f}s")
        
        return FileProcessingResult(
            file_name=file_name,
            status="success",
            questions_count=len(questions),
            processing_time=processing_time,
            from_cache=False
        )
        
    except Exception as e:
        # Cleanup
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        
        logger.error(f"❌ Lỗi xử lý {file_name}: {str(e)}")
        return FileProcessingResult(
            file_name=file_name,
            status="failed",
            error_message=str(e),
            processing_time=time.time() - start_time
        )

def process_multiple_files_parallel(request: GenerateQuestionsRequest) -> Dict:
    """Xử lý nhiều file song song với tối ưu hóa"""
    start_time = time.time()
    
    # Phân bổ câu hỏi
    questions_per_file = distribute_questions_optimized(len(request.files), request.total_questions)
    
    # Xử lý song song với ThreadPoolExecutor
    results = []
    all_questions = []
    failed_files = []
    cached_files = []
    new_files = []
    questions_distribution = {}
    
    # Tối ưu số thread dựa trên số file và CPU
    max_workers = min(len(request.files), os.cpu_count() or 4, 8)  # Tối đa 8 threads
    
    logger.info(f"Xử lý {len(request.files)} files với {max_workers} threads")
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit tasks
        future_to_file = {}
        for i, file_input in enumerate(request.files):
            questions_needed = questions_per_file[i]
            generator = load_question_generator()  # Mỗi thread có generator riêng
            
            future = executor.submit(
                process_single_file_optimized, 
                file_input, 
                questions_needed, 
                generator
            )
            future_to_file[future] = (file_input, questions_needed)
        
        # Collect results
        for future in as_completed(future_to_file):
            file_input, questions_needed = future_to_file[future]
            try:
                result = future.result()
                results.append(result)
                
                # Collect questions từ cache hoặc result
                if result.status == "success" or result.status == "cached":
                    if result.from_cache:
                        file_questions = cache.get_cached_questions(file_input.file_name, questions_needed)
                        cached_files.append(file_input.file_name)
                    else:
                        file_questions = cache.get_cached_questions(file_input.file_name, questions_needed)
                        new_files.append(file_input.file_name)
                    
                    if file_questions:
                        all_questions.extend(file_questions)
                        questions_distribution[file_input.file_name] = len(file_questions)
                else:
                    failed_files.append({
                        "file_name": file_input.file_name,
                        "error": result.error_message or "Unknown error"
                    })
                    
            except Exception as e:
                logger.error(f"Lỗi future cho {file_input.file_name}: {str(e)}")
                failed_files.append({
                    "file_name": file_input.file_name,
                    "error": str(e)
                })
    
    # Tạo overview
    overview = create_overview_optimized(all_questions, request.total_questions)
    
    # Metadata
    processing_time = time.time() - start_time
    cache_hits = len(cached_files)
    total_files = len(request.files)
    cache_rate = (cache_hits / total_files * 100) if total_files > 0 else 0
    
    metadata = QuestionMetadata(
        project_id=request.project_id,
        name=request.name,
        total_questions=len(all_questions),
        files_processed=[r.file_name for r in results if r.status in ["success", "cached"]],
        cached_files=cached_files,
        new_files=new_files,
        failed_files=failed_files,
        questions_per_file=questions_distribution,
        processing_time=f"{processing_time:.2f}s",
        cache_usage=f"{cache_rate:.1f}% cache hit rate"
    )
    
    logger.info(f"✅ Hoàn thành: {len(all_questions)} câu hỏi trong {processing_time:.2f}s")
    
    return {
        "overview": overview,
        "quiz": all_questions,
        "metadata": metadata
    }

def distribute_questions_optimized(num_files: int, total_questions: int) -> List[int]:
    """Phân bổ câu hỏi tối ưu"""
    if num_files == 0:
        return []
    
    base_questions = total_questions // num_files
    remainder = total_questions % num_files
    
    distribution = [base_questions] * num_files
    
    # Phân bổ phần dư
    for i in range(remainder):
        distribution[i] += 1
    
    return distribution

def create_overview_optimized(questions: List, total_requested: int) -> str:
    """Tạo overview tối ưu"""
    actual_count = len(questions)
    
    if actual_count == 0:
        return "Không thể tạo câu hỏi từ các file đã cung cấp."
    
    if actual_count >= total_requested * 0.9:  # >= 90%
        quality = "xuất sắc"
    elif actual_count >= total_requested * 0.7:  # >= 70%
        quality = "tốt"
    else:
        quality = "cần cải thiện"
    
    return f"Đã tạo thành công {actual_count}/{total_requested} câu hỏi trắc nghiệm với chất lượng {quality}. Các câu hỏi được tạo từ nội dung đã phân tích và tối ưu hóa để đánh giá kiến thức một cách toàn diện."

# ===== API ENDPOINTS =====

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Question Generator - SYNC OPTIMIZED",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "mode": "sync_only",
        "max_questions": 300,
        "max_files": 15,
        "features": [
            "Multi-file processing",
            "Optimized caching",
            "Parallel processing",
            "Sync only (optimized)"
        ]
    }

@app.get("/api/cache/info")
def get_cache_info():
    """Thông tin cache"""
    try:
        cache_files = list(cache.cache_dir.glob("*"))
        total_size = sum(f.stat().st_size for f in cache_files if f.is_file())
        
        return {
            "cache_directory": str(cache.cache_dir),
            "total_files": len(cache_files),
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "memory_cache_entries": len(cache.memory_cache),
            "cache_types": ["content", "questions"],
            "status": "active"
        }
    except Exception as e:
        return {"error": str(e)}

@app.delete("/api/cache/clear")
def clear_cache():
    """Xóa cache"""
    try:
        success = cache.clear_cache()
        if success:
            return {"message": "Cache đã được xóa thành công"}
        else:
            return {"error": "Không thể xóa cache"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/generate-questions-sync", response_model=QuestionResponse)
def generate_questions_sync_optimized(request: GenerateQuestionsRequest):
    """
    🚀 ENDPOINT CHÍNH - Tạo câu hỏi đồng bộ từ nhiều file (OPTIMIZED)
    - Tối đa 300 câu hỏi
    - Tối đa 15 files
    - Xử lý song song
    - Cache tối ưu
    - Chỉ sync, không async
    """
    try:
        logger.info(f"🎯 Bắt đầu xử lý {len(request.files)} files, {request.total_questions} câu hỏi")
        
        # Validate requests
        if not request.files:
            raise HTTPException(status_code=400, detail="Không có file nào được cung cấp")
        
        # Xử lý
        result = process_multiple_files_parallel(request)
        
        return QuestionResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Lỗi xử lý request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý: {str(e)}")

# ===== MAIN =====
if __name__ == "__main__":
    print("🚀 Starting AI Question Generator Server - SYNC OPTIMIZED")
    print("📝 Mode: Sync Only")
    print("🎯 Max Questions: 300")
    print("📁 Max Files: 15")
    print("⚡ Features: Parallel processing, Optimized caching")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        workers=1  # Single worker để tránh xung đột cache
    )
