import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
import subprocess
import sys
import hashlib
from datetime import datetime

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

class PDFChatRAG:
    def __init__(self):
        """Khởi tạo hệ thống RAG cho PDF chat"""
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            print("❌ Lỗi: Không tìm thấy OPENAI_API_KEY trong file .env")
            sys.exit(1)
        
        # Khởi tạo model embedding
        print("🔄 Đang tải mô hình embedding...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Biến lưu trữ
        self.chunks = []
        self.embeddings = []
        self.pdf_content = ""
        
        # THÊM: Quản lý cache và lịch sử
        self.current_pdf_path = None
        self.conversation_history = []
        self.max_history = 10
        
        print("✅ Hệ thống RAG đã sẵn sàng!")
    
    def convert_pdf_to_text(self, pdf_path):
        """Chuyển đổi PDF sang text bằng pdfToText.py cải tiến"""
        try:
            print(f"📄 Đang chuyển đổi PDF: {pdf_path}")
            
            # Import và sử dụng function từ pdfToText.py
            import importlib.util
            spec = importlib.util.spec_from_file_location("pdfToText", "pdfToText.py")
            pdf_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(pdf_module)
            
            # Chuyển đổi PDF với error handling nâng cao
            temp_output = f"temp_pdf_content_{hashlib.md5(pdf_path.encode()).hexdigest()[:8]}.txt"
            
            print("🔧 Sử dụng PDF converter cải tiến...")
            success = pdf_module.pdf_to_text(pdf_path, temp_output)
            
            if success and os.path.exists(temp_output):
                with open(temp_output, 'r', encoding='utf-8') as f:
                    self.pdf_content = f.read()
                
                # Xóa file tạm
                os.remove(temp_output)
                
                # Kiểm tra chất lượng nội dung
                if len(self.pdf_content.strip()) == 0:
                    print("⚠️ Cảnh báo: PDF không chứa text có thể đọc được")
                    return False
                
                # Đếm các trang lỗi
                error_pages = self.pdf_content.count("[LỖI TRÍCH XUẤT:")
                empty_pages = self.pdf_content.count("[TRANG TRỐNG HOẶC KHÔNG CÓ TEXT]")
                
                if error_pages > 0:
                    print(f"⚠️ Có {error_pages} trang bị lỗi khi trích xuất")
                if empty_pages > 0:
                    print(f"ℹ️ Có {empty_pages} trang trống")
                
                print("✅ Chuyển đổi PDF thành công!")
                return True
            else:
                print("❌ Lỗi chuyển đổi PDF")
                return False
                
        except ImportError as e:
            print(f"❌ Lỗi import pdfToText.py: {str(e)}")
            print("💡 Đảm bảo file pdfToText.py có trong thư mục này")
            return False
        except Exception as e:
            print(f"❌ Lỗi: {str(e)}")
            return False
    
    def create_chunks(self, text, chunk_size=500, overlap=50):
        """Chia text thành các chunks nhỏ với overlap và làm sạch dữ liệu"""
        # Làm sạch text trước khi chia chunks
        cleaned_text = self.clean_text(text)
        
        words = cleaned_text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            
            # Chỉ thêm chunk nếu có nội dung hữu ích
            if len(chunk.strip()) > 50 and not self.is_error_chunk(chunk):
                chunks.append(chunk.strip())
        
        print(f"📚 Đã tạo {len(chunks)} chunks hữu ích từ tài liệu")
        return chunks
    
    def clean_text(self, text):
        """Làm sạch text và loại bỏ các phần không cần thiết"""
        import re
        
        # Loại bỏ header trang
        text = re.sub(r'={50}\nTRANG \d+\n={50}', '', text)
        
        # Loại bỏ các dòng trống liên tiếp
        text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
        
        # Loại bỏ khoảng trắng thừa
        text = re.sub(r' +', ' ', text)
        
        return text.strip()
    
    def is_error_chunk(self, chunk):
        """Kiểm tra xem chunk có phải là lỗi không"""
        error_indicators = [
            "[LỖI TRÍCH XUẤT:",
            "[TRANG TRỐNG HOẶC KHÔNG CÓ TEXT]",
            "[TRANG", ": KHÔNG THỂ TRÍCH XUẤT TEXT]"
        ]
        
        return any(indicator in chunk for indicator in error_indicators)
    
    def create_embeddings(self):
        """Tạo embeddings cho các chunks"""
        if not self.pdf_content:
            print("❌ Chưa có nội dung PDF để xử lý")
            return False
        
        print("🔄 Đang tạo chunks và embeddings...")
        
        # Tạo chunks
        self.chunks = self.create_chunks(self.pdf_content)
        
        # Tạo embeddings
        self.embeddings = self.embedding_model.encode(self.chunks)
        
        print(f"✅ Đã tạo embeddings cho {len(self.chunks)} chunks")
        
        # Lưu cache với tên file riêng
        if self.current_pdf_path:
            self.save_cache()
        
        return True
    
    def save_cache(self):
        """Lưu cache với tên file riêng"""
        try:
            cache_filename = self.get_cache_filename(self.current_pdf_path)
            
            cache_data = {
                'pdf_path': self.current_pdf_path,
                'pdf_modified_time': os.path.getmtime(self.current_pdf_path),
                'chunks': self.chunks,
                'embeddings': self.embeddings.tolist(),
                'pdf_content': self.pdf_content
            }
            
            with open(cache_filename, 'wb') as f:
                pickle.dump(cache_data, f)
            
            print(f"💾 Đã lưu cache: {cache_filename}")
            return True
            
        except Exception as e:
            print(f"❌ Lỗi lưu cache: {str(e)}")
            return False
    
    def load_cache(self, pdf_path):
        """Tải cache cho PDF cụ thể"""
        try:
            cache_filename = self.get_cache_filename(pdf_path)
            
            if not os.path.exists(cache_filename):
                print(f"ℹ️ Chưa có cache cho PDF: {Path(pdf_path).name}")
                return False
            
            with open(cache_filename, 'rb') as f:
                cache_data = pickle.load(f)
            
            # Kiểm tra PDF có thay đổi không
            if os.path.exists(pdf_path):
                current_modified_time = os.path.getmtime(pdf_path)
                cached_modified_time = cache_data.get('pdf_modified_time', 0)
                
                if abs(current_modified_time - cached_modified_time) > 1:
                    print("⚠️ PDF đã thay đổi, cache không còn hợp lệ")
                    return False
            
            # Tải dữ liệu từ cache
            self.chunks = cache_data['chunks']
            self.embeddings = np.array(cache_data['embeddings'])
            self.pdf_content = cache_data['pdf_content']
            self.current_pdf_path = pdf_path
            
            print(f"✅ Đã tải cache: {cache_filename}")
            return True
            
        except Exception as e:
            print(f"⚠️ Không thể tải cache: {str(e)}")
            return False
    
    def retrieve_relevant_chunks(self, query, top_k=3):
        """Tìm kiếm chunks liên quan nhất với câu hỏi"""
        if not self.chunks:
            return []
        
        # Tạo embedding cho query
        query_embedding = self.embedding_model.encode([query])
        
        # Tính cosine similarity
        similarities = cosine_similarity(query_embedding, self.embeddings)[0]
        
        # Lấy top_k chunks có similarity cao nhất
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        relevant_chunks = []
        for idx in top_indices:
            relevant_chunks.append({
                'text': self.chunks[idx],
                'similarity': similarities[idx]
            })
        
        return relevant_chunks
    
    def call_openai_api(self, prompt):
        """Gọi OpenAI API"""
        try:
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
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            response = requests.post(url, headers=headers, json=data)
            result = response.json()
            
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content']
            else:
                return "❌ Lỗi: Không nhận được phản hồi từ OpenAI"
                
        except Exception as e:
            return f"❌ Lỗi gọi API: {str(e)}"
    
    def generate_answer(self, question):
        """Tạo câu trả lời dựa trên RAG với context từ lịch sử"""
        print(f"🔍 Đang tìm kiếm thông tin liên quan...")
        
        # Retrieve relevant chunks
        relevant_chunks = self.retrieve_relevant_chunks(question, top_k=3)
        
        if not relevant_chunks:
            return "❌ Không tìm thấy thông tin liên quan trong tài liệu", []
        
        # Tạo context từ relevant chunks
        document_context = "\n\n".join([chunk['text'] for chunk in relevant_chunks])
        
        # Lấy context từ lịch sử trò chuyện
        conversation_context = self.get_conversation_context(question)
        
        # Tạo prompt với context đầy đủ
        prompt = f"""
{conversation_context}

THÔNG TIN TÀI LIỆU LIÊN QUAN:
{document_context}

Hãy trả lời câu hỏi hiện tại dựa trên:
1. Thông tin trong tài liệu
2. Bối cảnh từ cuộc trò chuyện trước đó (nếu có)

Nếu câu hỏi liên quan đến cuộc trò chuyện trước, hãy tham chiếu đến nó một cách tự nhiên.

TRẢ LỜI:
"""
        
        print("🤖 Đang tạo câu trả lời...")
        answer = self.call_openai_api(prompt)
        
        return answer, relevant_chunks
    
    def generate_extended_knowledge(self, question, answer):
        """Tạo kiến thức mở rộng từ nguồn bên ngoài"""
        prompt = f"""
Câu hỏi gốc: {question}
Câu trả lời từ tài liệu: {answer}

Hãy cung cấp thêm kiến thức mở rộng, thông tin bổ sung, hoặc các khía cạnh liên quan khác về chủ đề này từ kiến thức tổng quát của bạn. Đừng lặp lại thông tin đã có trong câu trả lời gốc.

KIẾN THỨC MỞ RỘNG:
"""
        
        print("🌐 Đang tạo kiến thức mở rộng...")
        extended_knowledge = self.call_openai_api(prompt)
        
        return extended_knowledge
    
    def get_cache_filename(self, pdf_path):
        """Tạo tên cache riêng cho từng PDF"""
        # Lấy tên file PDF
        pdf_name = Path(pdf_path).stem
        
        # Tạo hash từ đường dẫn để tránh trùng tên
        path_hash = hashlib.md5(pdf_path.encode()).hexdigest()[:8]
        
        return f"cache_{pdf_name}_{path_hash}.pkl"
    
    def add_to_history(self, question, answer, extended_knowledge=None):
        """Thêm câu hỏi và trả lời vào lịch sử"""
        conversation_item = {
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'question': question,
            'answer': answer,
            'extended_knowledge': extended_knowledge
        }
        
        self.conversation_history.append(conversation_item)
        
        # Giới hạn độ dài lịch sử
        if len(self.conversation_history) > self.max_history:
            self.conversation_history.pop(0)
    
    def get_conversation_context(self, current_question):
        """Lấy context từ lịch sử trò chuyện"""
        if not self.conversation_history:
            return ""
        
        context = "\n=== LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY ===\n"
        
        # Lấy 3 cuộc trò chuyện gần nhất
        recent_conversations = self.conversation_history[-3:]
        
        for i, conv in enumerate(recent_conversations, 1):
            context += f"\nCâu hỏi {i}: {conv['question']}\n"
            context += f"Trả lời {i}: {conv['answer'][:200]}...\n"  # Cắt ngắn để tiết kiệm token
        
        context += f"\n=== CÂU HỎI HIỆN TẠI ===\n{current_question}\n"
        
        return context
    
    def save_conversation_history(self, filename="conversation_history.json"):
        """Lưu lịch sử trò chuyện ra file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.conversation_history, f, indent=2, ensure_ascii=False)
            print(f"💾 Đã lưu lịch sử trò chuyện vào {filename}")
        except Exception as e:
            print(f"❌ Lỗi lưu lịch sử: {str(e)}")
    
    def load_conversation_history(self, filename="conversation_history.json"):
        """Tải lịch sử trò chuyện từ file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r', encoding='utf-8') as f:
                    self.conversation_history = json.load(f)
                print(f"📚 Đã tải {len(self.conversation_history)} cuộc trò chuyện từ lịch sử")
                return True
        except Exception as e:
            print(f"⚠️ Lỗi tải lịch sử: {str(e)}")
        return False
    
    def show_conversation_history(self):
        """Hiển thị lịch sử trò chuyện"""
        if not self.conversation_history:
            print("📝 Chưa có lịch sử trò chuyện")
            return
        
        print(f"\n📚 LỊCH SỬ TRÒ CHUYỆN ({len(self.conversation_history)} cuộc trò chuyện):")
        print("="*60)
        
        for i, conv in enumerate(self.conversation_history, 1):
            print(f"\n🕐 {conv['timestamp']}")
            print(f"❓ Câu hỏi {i}: {conv['question']}")
            print(f"💬 Trả lời: {conv['answer'][:150]}...")
            if conv.get('extended_knowledge'):
                print(f"🌐 Mở rộng: {conv['extended_knowledge'][:100]}...")
            print("-" * 40)
    
    def list_cache_files(self):
        """Liệt kê các file cache có sẵn"""
        cache_files = list(Path(".").glob("cache_*.pkl"))
        
        if not cache_files:
            print("📝 Chưa có cache nào")
            return []
        
        print("📚 Cache có sẵn:")
        cache_info = []
        
        for cache_file in cache_files:
            try:
                with open(cache_file, 'rb') as f:
                    cache_data = pickle.load(f)
                
                pdf_name = Path(cache_data.get('pdf_path', 'Unknown')).name
                modified_time = cache_data.get('pdf_modified_time', 0)
                
                cache_info.append({
                    'file': cache_file,
                    'pdf_path': cache_data.get('pdf_path', ''),
                    'pdf_name': pdf_name
                })
                
                print(f"   📄 {pdf_name}")
                print(f"      Cache: {cache_file.name}")
                print(f"      Size: {cache_file.stat().st_size / 1024:.1f} KB")
                if modified_time:
                    print(f"      Thời gian: {datetime.fromtimestamp(modified_time)}")
                
            except Exception:
                print(f"   ❌ Cache lỗi: {cache_file.name}")
        
        return cache_info
    
    def chat(self):
        """Bắt đầu chat loop với lịch sử trò chuyện"""
        # Tải lịch sử trò chuyện nếu có
        self.load_conversation_history()
        
        print("\n" + "="*60)
        print("🤖 PDF CHAT BOT với RAG & LỊCH SỬ TRÒ CHUYỆN")
        print("="*60)
        print("💡 Nhập 'quit' để thoát")
        print("💡 Nhập 'info' để xem thông tin tài liệu")
        print("💡 Nhập 'history' để xem lịch sử trò chuyện")
        print("💡 Nhập 'clear' để xóa lịch sử trò chuyện")
        print("💡 Nhập 'cache' để xem các file cache có sẵn")
        print("-"*60)
        
        while True:
            try:
                question = input("\n❓ Câu hỏi của bạn: ").strip()
                
                if question.lower() in ['quit', 'exit', 'q']:
                    # Lưu lịch sử trước khi thoát
                    self.save_conversation_history()
                    print("👋 Tạm biệt!")
                    break
                
                if question.lower() == 'info':
                    print(f"📊 Thông tin tài liệu:")
                    print(f"   - Số chunks: {len(self.chunks)}")
                    print(f"   - Độ dài nội dung: {len(self.pdf_content):,} ký tự")
                    print(f"   - Số cuộc trò chuyện: {len(self.conversation_history)}")
                    if self.current_pdf_path:
                        print(f"   - File PDF: {Path(self.current_pdf_path).name}")
                        
                        # Thêm thống kê chất lượng
                        error_pages = self.pdf_content.count("[LỖI TRÍCH XUẤT:")
                        empty_pages = self.pdf_content.count("[TRANG TRỐNG HOẶC KHÔNG CÓ TEXT]")
                        if error_pages > 0:
                            print(f"   - ⚠️ Trang lỗi: {error_pages}")
                        if empty_pages > 0:
                            print(f"   - 📝 Trang trống: {empty_pages}")
                    continue
                
                if question.lower() == 'history':
                    self.show_conversation_history()
                    continue
                
                if question.lower() == 'clear':
                    self.conversation_history.clear()
                    print("🗑️ Đã xóa lịch sử trò chuyện")
                    continue
                
                if question.lower() == 'cache':
                    self.list_cache_files()
                    continue
                
                if not question:
                    print("⚠️ Vui lòng nhập câu hỏi!")
                    continue
                
                # Tạo câu trả lời
                answer, relevant_chunks = self.generate_answer(question)
                
                # Hiển thị kết quả
                print("\n" + "="*50)
                print("📋 CÂU TRẢ LỜI TỪ TÀI LIỆU:")
                print("="*50)
                print(answer)
                
                # Hiển thị thông tin chunks được sử dụng
                print(f"\n📚 Đã sử dụng {len(relevant_chunks)} phần thông tin liên quan")
                for i, chunk in enumerate(relevant_chunks, 1):
                    print(f"   {i}. Độ liên quan: {chunk['similarity']:.2f}")
                
                # Tạo kiến thức mở rộng
                extended = self.generate_extended_knowledge(question, answer)
                
                print("\n" + "="*50)
                print("🌐 KIẾN THỨC MỞ RỘNG:")
                print("="*50)
                print(extended)
                
                # Thêm vào lịch sử trò chuyện
                self.add_to_history(question, answer, extended)
                
                # Auto-save sau mỗi 3 câu hỏi
                if len(self.conversation_history) % 3 == 0:
                    self.save_conversation_history()
                
            except KeyboardInterrupt:
                self.save_conversation_history()
                print("\n👋 Tạm biệt!")
                break
            except Exception as e:
                print(f"❌ Lỗi: {str(e)}")

def main():
    """Hàm chính với cache management cải tiến"""
    rag_system = PDFChatRAG()
    
    # Hiển thị cache có sẵn
    available_caches = rag_system.list_cache_files()
    
    # Tìm file PDF
    pdf_files = list(Path(".").glob("*.pdf"))
    
    if pdf_files:
        print("\n📋 File PDF tìm thấy:")
        for i, pdf_file in enumerate(pdf_files, 1):
            file_size = os.path.getsize(pdf_file) / 1024
            
            # Kiểm tra có cache không
            cache_filename = rag_system.get_cache_filename(str(pdf_file))
            has_cache = os.path.exists(cache_filename)
            status = "💾" if has_cache else "🆕"
            
            print(f"   {i}. {status} {pdf_file.name} ({file_size:.1f} KB)")
        
        try:
            choice = input(f"\n🔢 Chọn file (1-{len(pdf_files)}) hoặc nhập đường dẫn: ").strip()
            
            if choice.isdigit() and 1 <= int(choice) <= len(pdf_files):
                pdf_path = str(pdf_files[int(choice) - 1])
            else:
                pdf_path = choice
                
        except ValueError:
            pdf_path = choice
    else:
        pdf_path = input("📁 Nhập đường dẫn đến file PDF: ").strip()
    
    if not pdf_path or not os.path.exists(pdf_path):
        print("❌ File PDF không tồn tại!")
        return
    
    rag_system.current_pdf_path = pdf_path
    
    # Thử tải cache cho PDF này
    if rag_system.load_cache(pdf_path):
        print("🚀 Đã sẵn sàng chat với cache!")
        rag_system.chat()
        return
    
    # Nếu không có cache, xử lý PDF mới
    print("🔄 Đang xử lý PDF mới...")
    if rag_system.convert_pdf_to_text(pdf_path):
        if rag_system.create_embeddings():
            print("🎉 Hệ thống đã sẵn sàng!")
            rag_system.chat()
        else:
            print("❌ Lỗi tạo embeddings")
    else:
        print("❌ Lỗi xử lý PDF")

if __name__ == "__main__":
    main()