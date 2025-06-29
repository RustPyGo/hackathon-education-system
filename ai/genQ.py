import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
import hashlib
from datetime import datetime
import subprocess
import sys

# Import cho RAG
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    import pickle
except ImportError:
    print("❌ Thiếu một số thư viện cần thiết. Đang cài đặt...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "sentence-transformers", "scikit-learn", "numpy"])
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    import pickle

# Load environment variables
load_dotenv()

class PDFQuestionGenerator:
    def __init__(self):
        """Khởi tạo hệ thống tạo câu hỏi từ PDF"""
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            print("❌ Lỗi: Không tìm thấy OPENAI_API_KEY trong file .env")
            sys.exit(1)
        
        # Khởi tạo model embedding
        print("🔄 Đang tải mô hình embedding...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Biến lưu trữ
        self.pdf_content = ""
        self.chunks = []
        self.embeddings = []
        self.document_summary = ""
        
        print("✅ Hệ thống tạo câu hỏi đã sẵn sàng!")
    
    def convert_pdf_to_text(self, pdf_path):
        """Chuyển đổi PDF sang text sử dụng pdfToText.py"""
        try:
            print(f"📄 Đang chuyển đổi PDF: {pdf_path}")
            
            # Import pdfToText module
            import importlib.util
            spec = importlib.util.spec_from_file_location("pdfToText", "pdfToText.py")
            pdf_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(pdf_module)
            
            # Tạo file output tạm thời
            temp_output = f"temp_gen_pdf_{hashlib.md5(pdf_path.encode()).hexdigest()[:8]}.txt"
            
            # Chuyển đổi PDF
            success = pdf_module.pdf_to_text(pdf_path, temp_output)
            
            if success and os.path.exists(temp_output):
                with open(temp_output, 'r', encoding='utf-8') as f:
                    self.pdf_content = f.read()
                
                # Xóa file tạm
                os.remove(temp_output)
                
                # Kiểm tra nội dung
                if len(self.pdf_content.strip()) == 0:
                    print("❌ PDF không chứa text có thể đọc được")
                    return False
                
                # Thống kê
                error_pages = self.pdf_content.count("[LỖI TRÍCH XUẤT:")
                empty_pages = self.pdf_content.count("[TRANG TRỐNG")
                
                print(f"✅ Chuyển đổi PDF thành công!")
                print(f"📊 Thống kê nội dung:")
                print(f"   - Độ dài: {len(self.pdf_content):,} ký tự")
                if error_pages > 0:
                    print(f"   - ⚠️ Trang lỗi: {error_pages}")
                if empty_pages > 0:
                    print(f"   - 📝 Trang trống: {empty_pages}")
                
                return True
            else:
                print("❌ Lỗi chuyển đổi PDF")
                return False
                
        except Exception as e:
            print(f"❌ Lỗi: {str(e)}")
            return False
    
    def clean_text(self, text):
        """Làm sạch text và loại bỏ phần không cần thiết"""
        import re
        
        # Loại bỏ header trang
        text = re.sub(r'={50}\nTRANG \d+\n={50}', '', text)
        
        # Loại bỏ thông báo lỗi
        text = re.sub(r'\[LỖI TRÍCH XUẤT:.*?\]', '', text)
        text = re.sub(r'\[TRANG TRỐNG.*?\]', '', text)
        
        # Loại bỏ dòng trống liên tiếp
        text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
        
        # Loại bỏ khoảng trắng thừa
        text = re.sub(r' +', ' ', text)
        
        return text.strip()
    
    def create_chunks(self, text, chunk_size=1000, overlap=100):
        """Chia text thành chunks lớn hơn để phân tích toàn diện"""
        cleaned_text = self.clean_text(text)
        words = cleaned_text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if len(chunk.strip()) > 100:  # Chunk tối thiểu 100 ký tự
                chunks.append(chunk.strip())
        
        print(f"📚 Đã tạo {len(chunks)} chunks để phân tích")
        return chunks
    
    def create_embeddings(self):
        """Tạo embeddings cho các chunks"""
        print("🔄 Đang tạo chunks và embeddings...")
        
        # Tạo chunks
        self.chunks = self.create_chunks(self.pdf_content)
        
        if not self.chunks:
            print("❌ Không có chunks hợp lệ")
            return False
        
        # Tạo embeddings
        self.embeddings = self.embedding_model.encode(self.chunks)
        
        print(f"✅ Đã tạo embeddings cho {len(self.chunks)} chunks")
        return True
    
    def call_openai_api(self, prompt, max_tokens=2000):
        """Gọi OpenAI API với error handling tốt hơn"""
        try:
            # Kiểm tra độ dài prompt
            if len(prompt) > 12000:  # Giới hạn an toàn
                print(f"⚠️ Prompt quá dài ({len(prompt)} chars), cắt ngắn...")
                prompt = prompt[:12000] + "..."
            
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.openai_api_key}"
            }
            
            data = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": min(max_tokens, 2000),  # Giới hạn max_tokens
                "temperature": 0.7
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            # Kiểm tra status code
            if response.status_code != 200:
                print(f"❌ OpenAI API error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
            result = response.json()
            
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content']
            else:
                print(f"❌ Lỗi API response: {result}")
                return None
                
        except Exception as e:
            print(f"❌ Lỗi gọi API: {str(e)}")
            return None
    
    def generate_document_summary(self):
        """Tạo tóm tắt tổng quan tài liệu"""
        print("📝 Đang tạo tóm tắt tài liệu...")
        
        # Lấy nội dung quan trọng (giới hạn độ dài)
        important_content = ""
        if len(self.chunks) >= 2:
            important_content = self.chunks[0][:1500] + "\n\n" + self.chunks[1][:1500]
        elif len(self.chunks) == 1:
            important_content = self.chunks[0][:2000]
        else:
            important_content = "Nội dung tài liệu ngắn"
        
        prompt = f"""Tóm tắt ngắn gọn nội dung sau trong 100 từ:

{important_content}

Tóm tắt chủ đề chính và khái niệm quan trọng:"""
        
        summary = self.call_openai_api(prompt, max_tokens=300)
        if summary:
            self.document_summary = summary
            print("✅ Đã tạo tóm tắt tài liệu")
        else:
            self.document_summary = "Tài liệu học tập với các khái niệm và kiến thức cần thiết."
            print("⚠️ Sử dụng tóm tắt mặc định")
        
        return self.document_summary
    
    def get_relevant_content_for_topic(self, topic, num_chunks=3):
        """Lấy nội dung liên quan cho một chủ đề cụ thể"""
        if not self.chunks or len(self.embeddings) == 0:
            return ""
        
        # Tạo embedding cho topic
        topic_embedding = self.embedding_model.encode([topic])
        
        # Tính similarity
        similarities = cosine_similarity(topic_embedding, self.embeddings)[0]
        
        # Lấy top chunks
        top_indices = np.argsort(similarities)[::-1][:num_chunks]
        
        relevant_content = []
        for idx in top_indices:
            relevant_content.append(self.chunks[idx])
        
        return "\n\n".join(relevant_content)
    
    def generate_questions(self, num_questions=5):
        """Tạo câu hỏi trắc nghiệm từ tài liệu với batch processing"""
        print(f"🤖 Đang tạo {num_questions} câu hỏi trắc nghiệm...")
        
        # Tạo tóm tắt nếu chưa có
        if not self.document_summary:
            self.generate_document_summary()
        
        # Chia thành batch để tránh giới hạn token
        batch_size = 8  # Số câu hỏi tối đa mỗi batch
        all_questions = {"questions": []}
        
        if num_questions <= batch_size:
            # Nếu số câu hỏi nhỏ, tạo một lần
            return self.generate_questions_batch(num_questions, 1)
        
        # Chia thành nhiều batch
        total_batches = (num_questions + batch_size - 1) // batch_size
        print(f"📦 Chia thành {total_batches} batch (tối đa {batch_size} câu/batch)")
        
        question_id = 1
        for batch_num in range(total_batches):
            remaining_questions = num_questions - len(all_questions["questions"])
            current_batch_size = min(batch_size, remaining_questions)
            
            if current_batch_size <= 0:
                break
                
            print(f"🔄 Đang xử lý batch {batch_num + 1}/{total_batches} ({current_batch_size} câu)...")
            
            # Tạo câu hỏi cho batch này
            batch_questions = self.generate_questions_batch(current_batch_size, question_id)
            
            if batch_questions and batch_questions.get("questions"):
                # Cập nhật ID cho câu hỏi
                for q in batch_questions["questions"]:
                    q["id"] = question_id
                    question_id += 1
                    all_questions["questions"].append(q)
                
                print(f"✅ Hoàn thành batch {batch_num + 1} - {len(batch_questions['questions'])} câu")
            else:
                print(f"⚠️ Batch {batch_num + 1} thất bại, thử lại...")
                # Thử lại với format đơn giản
                batch_questions = self.generate_questions_simple_format_batch(current_batch_size, question_id)
                if batch_questions and batch_questions.get("questions"):
                    for q in batch_questions["questions"]:
                        all_questions["questions"].append(q)
                        question_id += 1
        
        print(f"🎯 Tổng cộng đã tạo {len(all_questions['questions'])}/{num_questions} câu hỏi")
        return all_questions
    
    def get_concise_content(self, num_questions):
        """Lấy nội dung ngắn gọn cho tạo câu hỏi"""
        if not self.chunks:
            return "Nội dung tài liệu cần thiết cho câu hỏi."
        
        # Lấy chunks đầu và giữa, giới hạn độ dài
        content_parts = []
        
        if len(self.chunks) >= 2:
            # Chunk đầu
            content_parts.append(self.chunks[0][:800])
            # Chunk giữa
            mid_idx = len(self.chunks) // 2
            content_parts.append(self.chunks[mid_idx][:800])
        else:
            content_parts.append(self.chunks[0][:1200])
        
        return "\n\n".join(content_parts)

    def generate_questions_batch(self, batch_size, start_id):
        """Tạo một batch câu hỏi với prompt tối ưu"""
        # Lấy nội dung ngắn gọn
        content_summary = self.get_concise_content(batch_size)
        
        prompt = f"""Tạo {batch_size} câu hỏi trắc nghiệm từ nội dung sau:

KIẾN THỨC:
{content_summary}

YÊU CẦU:
- {batch_size} câu hỏi, mỗi câu 4 đáp án A,B,C,D
- Kiểm tra hiểu biết, không hỏi "tài liệu nói gì"
- Đáp án đúng duy nhất, sai hợp lý

FORMAT JSON:
{{
  "questions": [
    {{
      "question": "Câu hỏi...",
      "type": "multiple_choice",
      "hint": "Gợi ý ngắn",
      "correct_answer": "A",
      "options": [
        {{"answer": "A", "content": "Đáp án A", "reason": "Đúng vì..."}},
        {{"answer": "B", "content": "Đáp án B", "reason": "Sai vì..."}},
        {{"answer": "C", "content": "Đáp án C", "reason": "Sai vì..."}},
        {{"answer": "D", "content": "Đáp án D", "reason": "Sai vì..."}}
      ]
    }}
  ]
}}

Chỉ trả về JSON, không giải thích thêm:"""
        {{"answer": "B", "content": "Đáp án B", "reason": "Sai vì..."}},
        {{"answer": "C", "content": "Đáp án C", "reason": "Sai vì..."}},
        {{"answer": "D", "content": "Đáp án D", "reason": "Sai vì..."}}
      ]
    }}
  ]
}}

Chỉ trả về JSON, không giải thích thêm:"""

🎨 MẪU CÂU HỎI TỐT:
"Khi áp dụng phương pháp X để giải quyết vấn đề Y, bước đầu tiên quan trọng nhất là gì?"
A) Phân tích nguyên nhân gốc rễ
B) Thu thập thông tin ban đầu  
C) Đề xuất giải pháp ngay lập tức
D) Đánh giá tác động có thể xảy ra

📋 FORMAT JSON TRẢ VỀ:
{{
  "questions": [
    {{
      "id": {start_id},
      "question": "Câu hỏi kiểm tra kiến thức (KHÔNG hỏi về tài liệu)?",
      "options": {{
        "A": "Lựa chọn A",
        "B": "Lựa chọn B", 
        "C": "Lựa chọn C",
        "D": "Lựa chọn D"
      }},
      "correct_answer": "B",
      "hint": "Gợi ý ngắn gọn giúp nhớ lại kiến thức",
      "explanation": "Giải thích chi tiết dựa trên kiến thức đã học",
      "difficulty": "easy|medium|hard",
      "topic": "Chủ đề kiến thức liên quan"
    }}
  ]
}}

🚀 BẮT ĐẦU TẠO {batch_size} CÂU HỎI ÔN TẬP:
"""
        
        result = self.call_openai_api(prompt, max_tokens=2500)
        
        try:
            questions_data = json.loads(result)
            return questions_data
        except json.JSONDecodeError:
            print("⚠️ Lỗi parse JSON trong batch")
            return None
    
    def generate_questions_simple_format_batch(self, batch_size, start_id):
        """Tạo batch câu hỏi với format đơn giản"""
        questions = {"questions": []}
        
        for i in range(batch_size):
            current_id = start_id + i
            
            # Lấy nội dung liên quan cho câu hỏi
            topics = ["khái niệm chính", "định nghĩa", "ứng dụng", "ví dụ", "phương pháp", "đặc điểm", "nguyên lý", "quy trình"]
            topic = topics[i % len(topics)]
            
            relevant_content = self.get_relevant_content_for_topic(topic, 2)
            
            prompt = f"""
Dựa trên nội dung sau, tạo 1 câu hỏi trắc nghiệm chất lượng cao:

NỘI DUNG:
{relevant_content[:1500]}

Trả về định dạng:
QUESTION: [câu hỏi rõ ràng và cụ thể]
A: [lựa chọn A]
B: [lựa chọn B]
C: [lựa chọn C] 
D: [lựa chọn D]
ANSWER: [A/B/C/D]
HINT: [gợi ý hữu ích]
EXPLANATION: [lý do tại sao đáp án này đúng]
"""
            
            result = self.call_openai_api(prompt, max_tokens=800)
            
            # Parse kết quả
            question_data = self.parse_simple_question(result, current_id)
            if question_data:
                questions["questions"].append(question_data)
            else:
                print(f"⚠️ Không thể parse câu hỏi {current_id}")
        
        return questions

    def get_diverse_content_for_questions(self, num_questions):
        """Lấy nội dung đa dạng từ các phần khác nhau của tài liệu"""
        if not self.chunks:
            return self.clean_text(self.pdf_content)[:3000]
        
        # Chia chunks thành các nhóm
        total_chunks = len(self.chunks)
        
        # Đảm bảo lấy đủ nội dung đa dạng
        if total_chunks <= num_questions:
            # Nếu ít chunks, lấy tất cả
            selected_content = self.chunks
        else:
            # Chia đều chunks để lấy nội dung từ các phần khác nhau
            step = total_chunks // num_questions
            selected_content = []
            for i in range(0, total_chunks, max(1, step)):
                if len(selected_content) < num_questions and i < total_chunks:
                    selected_content.append(self.chunks[i])
        
        return "\n\n".join(selected_content)
    
    def generate_questions_simple_format(self, num_questions=5):
        """Tạo câu hỏi với format đơn giản hơn"""
        questions = {"questions": []}
        
        for i in range(num_questions):
            # Lấy nội dung liên quan cho câu hỏi
            topics = ["khái niệm chính", "định nghĩa", "ứng dụng", "ví dụ", "phương pháp"]
            topic = topics[i % len(topics)]
            
            relevant_content = self.get_relevant_content_for_topic(topic, 2)
            
            prompt = f"""
Dựa trên nội dung sau, tạo 1 câu hỏi trắc nghiệm:

NỘI DUNG:
{relevant_content[:1500]}

Trả về định dạng:
QUESTION: [câu hỏi]
A: [lựa chọn A]
B: [lựa chọn B]
C: [lựa chọn C] 
D: [lựa chọn D]
ANSWER: [A/B/C/D]
HINT: [gợi ý]
EXPLANATION: [lý do]
"""
            
            result = self.call_openai_api(prompt, max_tokens=800)
            
            # Parse kết quả
            question_data = self.parse_simple_question(result, i + 1)
            if question_data:
                questions["questions"].append(question_data)
        
        return questions
    
    def parse_simple_question(self, text, question_id):
        """Parse câu hỏi từ format đơn giản"""
        try:
            lines = text.strip().split('\n')
            question_data = {"id": question_id, "options": {}}
            
            for line in lines:
                line = line.strip()
                if line.startswith('QUESTION:'):
                    question_data["question"] = line.replace('QUESTION:', '').strip()
                elif line.startswith('A:'):
                    question_data["options"]["A"] = line.replace('A:', '').strip()
                elif line.startswith('B:'):
                    question_data["options"]["B"] = line.replace('B:', '').strip()
                elif line.startswith('C:'):
                    question_data["options"]["C"] = line.replace('C:', '').strip()
                elif line.startswith('D:'):
                    question_data["options"]["D"] = line.replace('D:', '').strip()
                elif line.startswith('ANSWER:'):
                    question_data["correct_answer"] = line.replace('ANSWER:', '').strip()
                elif line.startswith('HINT:'):
                    question_data["hint"] = line.replace('HINT:', '').strip()
                elif line.startswith('EXPLANATION:'):
                    question_data["explanation"] = line.replace('EXPLANATION:', '').strip()
            
            return question_data
        except:
            return None
    
    def save_questions(self, questions_data, filename=None):
        """Lưu câu hỏi ra file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"questions_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(questions_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Đã lưu câu hỏi vào: {filename}")
            return filename
        except Exception as e:
            print(f"❌ Lỗi lưu file: {str(e)}")
            return None
    
    def display_questions(self, questions_data):
        """Hiển thị câu hỏi ra màn hình"""
        print("\n" + "="*80)
        print("📋 CÂU HỎI TRẮC NGHIỆM ĐÃ TẠO")
        print("="*80)
        
        for q in questions_data.get("questions", []):
            print(f"\n🔢 Câu {q.get('id', '?')}: {q.get('question', 'N/A')}")
            print("-" * 60)
            
            options = q.get('options', {})
            for key in ['A', 'B', 'C', 'D']:
                if key in options:
                    print(f"   {key}. {options[key]}")
            
            print(f"\n✅ Đáp án đúng: {q.get('correct_answer', 'N/A')}")
            print(f"💡 Gợi ý: {q.get('hint', 'Không có')}")
            print(f"📝 Giải thích: {q.get('explanation', 'Không có')}")
            print("-" * 60)
    
    def process_pdf(self, pdf_path, num_questions=5):
        """Quy trình hoàn chỉnh: PDF → Câu hỏi"""
        print(f"🚀 BẮT ĐẦU XỬ LÝ: {Path(pdf_path).name}")
        print("="*60)
        
        # Bước 1: Chuyển PDF sang text
        if not self.convert_pdf_to_text(pdf_path):
            return None
        
        # Bước 2: Tạo embeddings để hiểu tài liệu
        if not self.create_embeddings():
            return None
        
        # Bước 3: Tạo câu hỏi
        questions_data = self.generate_questions(num_questions)
        
        if questions_data and questions_data.get("questions"):
            # Bước 4: Hiển thị kết quả
            self.display_questions(questions_data)
            
            # Bước 5: Lưu file
            filename = self.save_questions(questions_data)
            
            print(f"\n🎉 HOÀN THÀNH!")
            print(f"📊 Đã tạo {len(questions_data['questions'])} câu hỏi")
            print(f"💾 File kết quả: {filename}")
            
            return questions_data
        else:
            print("❌ Không thể tạo câu hỏi")
            return None

    def generate_questions_batch_optimized(self, num_questions=5):
        """Tạo câu hỏi với batch processing tối ưu cho tốc độ"""
        print(f"🚀 Tạo {num_questions} câu hỏi (OPTIMIZED)...")
        
        # Tạo tóm tắt nếu chưa có
        if not self.document_summary:
            self.generate_document_summary()
        
        # Tối ưu batch size dựa trên số câu hỏi
        if num_questions <= 10:
            batch_size = num_questions  # Tạo một lần
        elif num_questions <= 50:
            batch_size = 10  # Batch 10 câu
        else:
            batch_size = 15  # Batch 15 câu cho số lượng lớn
        
        all_questions = []
        total_batches = (num_questions + batch_size - 1) // batch_size
        
        print(f"📦 Xử lý {total_batches} batch (tối đa {batch_size} câu/batch)")
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, num_questions)
            questions_in_batch = end_idx - start_idx
            
            print(f"⚡ Batch {batch_num + 1}/{total_batches}: {questions_in_batch} câu")
            
            # Tạo prompt tối ưu cho batch
            prompt = self.create_optimized_batch_prompt(questions_in_batch, batch_num)
            
            try:
                # Gọi API với timeout ngắn hơn
                response = self.call_openai_api_optimized(prompt, max_tokens=3000)
                
                # Parse response
                batch_questions = self.parse_questions_response_fast(response)
                
                if batch_questions:
                    all_questions.extend(batch_questions)
                    print(f"✅ Batch {batch_num + 1}: +{len(batch_questions)} câu")
                else:
                    print(f"⚠️ Batch {batch_num + 1}: Không có câu hỏi hợp lệ")
                    
            except Exception as e:
                print(f"❌ Lỗi batch {batch_num + 1}: {str(e)}")
                continue
        
        print(f"🎯 Hoàn thành: {len(all_questions)}/{num_questions} câu hỏi")
        return all_questions[:num_questions]  # Đảm bảo không vượt quá yêu cầu

    def create_optimized_batch_prompt(self, num_questions, batch_num):
        """Tạo prompt tối ưu cho batch processing"""
        # Lấy content relevant cho batch này
        relevant_content = self.get_diverse_content_for_batch(batch_num)
        
        prompt = f"""Dựa trên nội dung tài liệu sau, hãy tạo CHÍNH XÁC {num_questions} câu hỏi trắc nghiệm chất lượng cao.

NỘI DUNG THAM KHẢO:
{self.document_summary}

CHI TIẾT:
{relevant_content}

YÊU CẦU:
- Tạo ĐÚNG {num_questions} câu hỏi (không ít hơn, không nhiều hơn)
- Mỗi câu hỏi có 4 lựa chọn A, B, C, D
- Đáp án chính xác và giải thích rõ ràng
- Câu hỏi đa dạng về mức độ (dễ, trung bình, khó)
- Tập trung vào kiến thức cốt lõi

FORMAT JSON (QUAN TRỌNG):
[
    {{
        "question": "Câu hỏi 1...",
        "type": "multiple_choice",
        "hint": "Gợi ý...",
        "correct_answer": "A",
        "options": [
            {{"answer": "A", "reason": "Đáp án A vì..."}},
            {{"answer": "B", "reason": "Đáp án B sai vì..."}},
            {{"answer": "C", "reason": "Đáp án C sai vì..."}},
            {{"answer": "D", "reason": "Đáp án D sai vì..."}}
        ]
    }}
]

Chỉ trả về JSON array, không giải thích thêm."""
        
        return prompt

    def get_diverse_content_for_batch(self, batch_num):
        """Lấy nội dung đa dạng cho mỗi batch"""
        if not self.chunks:
            return ""
        
        # Tính offset để mỗi batch có nội dung khác nhau
        chunks_per_batch = max(3, len(self.chunks) // 4)
        start_idx = (batch_num * chunks_per_batch) % len(self.chunks)
        
        # Lấy chunks với rotation để đảm bảo đa dạng
        selected_chunks = []
        for i in range(chunks_per_batch):
            chunk_idx = (start_idx + i) % len(self.chunks)
            selected_chunks.append(self.chunks[chunk_idx])
        
        return "\n\n---\n\n".join(selected_chunks)

    def call_openai_api_optimized(self, prompt, max_tokens=3000):
        """Gọi OpenAI API với tối ưu hóa tốc độ"""
        try:
            import requests
            import json
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.openai_api_key}'
            }
            
            data = {
                'model': 'gpt-3.5-turbo',  # Sử dụng model nhanh hơn
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': max_tokens,
                'temperature': 0.7,
                'timeout': 30  # Timeout ngắn
            }
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30  # Request timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                print(f"❌ OpenAI API error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            print("⏰ OpenAI API timeout")
            return None
        except Exception as e:
            print(f"❌ Lỗi gọi OpenAI API: {str(e)}")
            return None

    def parse_questions_response_fast(self, response):
        """Parse response nhanh với error handling tốt"""
        if not response:
            return []
        
        try:
            # Tìm JSON trong response
            import re
            
            # Tìm JSON array pattern
            json_pattern = r'\[[\s\S]*\]'
            json_match = re.search(json_pattern, response)
            
            if json_match:
                json_str = json_match.group(0)
                questions = json.loads(json_str)
                
                # Validate questions format
                valid_questions = []
                for q in questions:
                    if self.validate_question_format_fast(q):
                        valid_questions.append(q)
                
                return valid_questions
            else:
                # Fallback: tìm cách parse khác
                return self.parse_questions_fallback(response)
                
        except json.JSONDecodeError as e:
            print(f"⚠️ Lỗi parse JSON: {str(e)}")
            return self.parse_questions_fallback(response)
        except Exception as e:
            print(f"⚠️ Lỗi parse response: {str(e)}")
            return []

    def validate_question_format_fast(self, question):
        """Validate format câu hỏi nhanh"""
        try:
            required_fields = ['question', 'type', 'hint', 'correct_answer', 'options']
            
            # Kiểm tra các field bắt buộc
            for field in required_fields:
                if field not in question:
                    return False
            
            # Kiểm tra options
            options = question.get('options', [])
            if len(options) != 4:
                return False
            
            # Kiểm tra format options
            for option in options:
                if not isinstance(option, dict):
                    return False
                if 'answer' not in option or 'reason' not in option:
                    return False
            
            return True
            
        except Exception:
            return False

    def parse_questions_fallback(self, response):
        """Fallback parsing cho trường hợp JSON không chuẩn"""
        try:
            # Implement simple parsing logic
            questions = []
            # Add simple regex-based parsing if needed
            print("🔄 Sử dụng fallback parsing...")
            return questions
        except Exception:
            return []
    
def main():
    """Hàm chính"""
    generator = PDFQuestionGenerator()
    
    # Tìm file PDF
    pdf_files = list(Path(".").glob("*.pdf"))
    
    if pdf_files:
        print("📋 File PDF tìm thấy:")
        for i, pdf_file in enumerate(pdf_files, 1):
            file_size = os.path.getsize(pdf_file) / 1024
            print(f"   {i}. {pdf_file.name} ({file_size:.1f} KB)")
        
        try:
            choice = input(f"\n🔢 Chọn file (1-{len(pdf_files)}) hoặc nhập đường dẫn: ").strip()
            
            if choice.isdigit() and 1 <= int(choice) <= len(pdf_files):
                pdf_path = str(pdf_files[int(choice) - 1])
            else:
                pdf_path = choice.strip('"').strip("'")
                
        except (ValueError, KeyboardInterrupt):
            print("\n👋 Đã hủy!")
            return
    else:
        pdf_path = input("📁 Nhập đường dẫn đến file PDF: ").strip('"').strip("'")
    
    if not pdf_path or not os.path.exists(pdf_path):
        print("❌ File PDF không tồn tại!")
        return
    
    # Nhập số câu hỏi
    try:
        num_questions = int(input("\n🔢 Số câu hỏi muốn tạo (mặc định 5): ") or "5")
        if num_questions < 1:
            print("⚠️ Số câu hỏi phải lớn hơn 0, đặt về mặc định")
            num_questions = 5
        elif num_questions > 200:
            print("⚠️ Số câu hỏi quá lớn, giới hạn tối đa 200 câu")
            num_questions = 200
    except ValueError:
        print("⚠️ Số không hợp lệ, sử dụng mặc định")
        num_questions = 5
    
    # Xử lý PDF và tạo câu hỏi
    result = generator.process_pdf(pdf_path, num_questions)
    
    if result:
        print("\n✅ Quá trình hoàn tất thành công!")
    else:
        print("\n❌ Quá trình thất bại!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Đã dừng bởi người dùng!")
    except Exception as e:
        print(f"\n❌ Lỗi nghiêm trọng: {str(e)}")
        sys.exit(1)