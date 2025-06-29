import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
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
        
        print("✅ Hệ thống RAG đã sẵn sàng!")
    
    def convert_pdf_to_text(self, pdf_path):
        """Chuyển đổi PDF sang text bằng pdfToText.py"""
        try:
            print(f"📄 Đang chuyển đổi PDF: {pdf_path}")
            
            # Import và sử dụng function từ pdfToText.py
            import importlib.util
            spec = importlib.util.spec_from_file_location("pdfToText", "pdfToText.py")
            pdf_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(pdf_module)
            
            # Chuyển đổi PDF
            success = pdf_module.pdf_to_text(pdf_path, "temp_pdf_content.txt")
            
            if success and os.path.exists("temp_pdf_content.txt"):
                with open("temp_pdf_content.txt", 'r', encoding='utf-8') as f:
                    self.pdf_content = f.read()
                
                # Xóa file tạm
                os.remove("temp_pdf_content.txt")
                print("✅ Chuyển đổi PDF thành công!")
                return True
            else:
                print("❌ Lỗi chuyển đổi PDF")
                return False
                
        except Exception as e:
            print(f"❌ Lỗi: {str(e)}")
            return False
    
    def create_chunks(self, text, chunk_size=500, overlap=50):
        """Chia text thành các chunks nhỏ với overlap"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if len(chunk.strip()) > 0:
                chunks.append(chunk.strip())
        
        print(f"📚 Đã tạo {len(chunks)} chunks từ tài liệu")
        return chunks
    
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
        
        # Lưu cache
        cache_data = {
            'chunks': self.chunks,
            'embeddings': self.embeddings.tolist(),
            'pdf_content': self.pdf_content
        }
        
        with open('rag_cache.pkl', 'wb') as f:
            pickle.dump(cache_data, f)
        
        return True
    
    def load_cache(self):
        """Tải cache nếu có"""
        try:
            if os.path.exists('rag_cache.pkl'):
                with open('rag_cache.pkl', 'rb') as f:
                    cache_data = pickle.load(f)
                
                self.chunks = cache_data['chunks']
                self.embeddings = np.array(cache_data['embeddings'])
                self.pdf_content = cache_data['pdf_content']
                
                print("✅ Đã tải cache thành công!")
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
        """Tạo câu trả lời dựa trên RAG"""
        print(f"🔍 Đang tìm kiếm thông tin liên quan...")
        
        # Retrieve relevant chunks
        relevant_chunks = self.retrieve_relevant_chunks(question, top_k=3)
        
        if not relevant_chunks:
            return "❌ Không tìm thấy thông tin liên quan trong tài liệu"
        
        # Tạo context từ relevant chunks
        context = "\n\n".join([chunk['text'] for chunk in relevant_chunks])
        
        # Tạo prompt
        prompt = f"""
Dựa trên thông tin sau đây từ tài liệu:

THÔNG TIN TÀI LIỆU:
{context}

CÂU HỎI: {question}

Hãy trả lời câu hỏi dựa trên thông tin trong tài liệu. Nếu thông tin không đủ để trả lời, hãy nói rõ điều đó.

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
    
    def chat(self):
        """Bắt đầu chat loop"""
        print("\n" + "="*60)
        print("🤖 PDF CHAT BOT với RAG")
        print("="*60)
        print("💡 Nhập 'quit' để thoát")
        print("💡 Nhập 'info' để xem thông tin tài liệu")
        print("-"*60)
        
        while True:
            try:
                question = input("\n❓ Câu hỏi của bạn: ").strip()
                
                if question.lower() in ['quit', 'exit', 'q']:
                    print("👋 Tạm biệt!")
                    break
                
                if question.lower() == 'info':
                    print(f"📊 Thông tin tài liệu:")
                    print(f"   - Số chunks: {len(self.chunks)}")
                    print(f"   - Độ dài nội dung: {len(self.pdf_content):,} ký tự")
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
                
            except KeyboardInterrupt:
                print("\n👋 Tạm biệt!")
                break
            except Exception as e:
                print(f"❌ Lỗi: {str(e)}")

def main():
    """Hàm chính"""
    rag_system = PDFChatRAG()
    
    # Kiểm tra xem có cache không
    if rag_system.load_cache():
        print("📚 Đã tải dữ liệu từ cache. Có thể bắt đầu chat ngay!")
        choice = input("🔄 Có muốn tải PDF mới không? (y/N): ").strip().lower()
        if choice != 'y':
            rag_system.chat()
            return
    
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
                pdf_path = choice
                
        except ValueError:
            pdf_path = choice
    else:
        pdf_path = input("📁 Nhập đường dẫn đến file PDF: ").strip()
    
    if not pdf_path:
        print("❌ Không có file PDF được chọn!")
        return
    
    # Xử lý PDF
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