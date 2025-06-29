# 🚀 AI Education Question Generator

Hệ thống AI tự động sinh câu hỏi trắc nghiệm từ tài liệu PDF, sử dụng RAG (Retrieval-Augmented Generation) và OpenAI API.

## ✨ Tính năng

- 📚 **Phân tích PDF**: Chuyển đổi PDF thành text, làm sạch và phân tích nội dung
- 🧠 **RAG Pipeline**: Sử dụng embeddings và vector search để tìm thông tin liên quan
- 🎯 **Sinh câu hỏi thông minh**: Tạo câu hỏi kiểm tra kiến thức đã học (không chỉ hỏi về tài liệu)
- 🔄 **Batch Processing**: Xử lý nhiều câu hỏi cùng lúc
- 🌐 **REST API**: Tích hợp dễ dàng với backend
- 📊 **Format chuẩn**: Trả về câu hỏi, đáp án, giải thích và gợi ý

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
cd ai
pip install -r requirement.txt
```

### 2. Cấu hình API Keys

Tạo file `.env` trong thư mục `ai`:

```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. Chạy API Server

```bash
python server.py
```

Server sẽ chạy tại: http://localhost:8000

## 📖 API Documentation

### Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/generate-questions` | Tạo câu hỏi async (khuyên dùng) |
| POST | `/api/generate-questions-sync` | Tạo câu hỏi sync (≤50 câu) |
| GET | `/api/task-status/{task_id}` | Kiểm tra trạng thái task |
| GET | `/api/task-result/{task_id}` | Lấy kết quả task |
| DELETE | `/api/task/{task_id}` | Xóa task |
| GET | `/api/health` | Health check |

### Request Format

```json
{
  "s3_url": "https://bucket.s3.amazonaws.com/file.pdf",
  "total_question": 20
}
```

### Response Format

```json
{
  "overview": "Tóm tắt nội dung tài liệu học tập",
  "quiz": [
    {
      "question": "Câu hỏi về kiến thức đã học",
      "type": "multiple_choice",
      "hint": "Gợi ý để trả lời câu hỏi",
      "correct_answer": "A",
      "options": [
        {
          "answer": "Đáp án A",
          "reason": "Lý do tại sao đây là đáp án đúng"
        },
        {
          "answer": "Đáp án B", 
          "reason": "Lý do tại sao đáp án này sai"
        },
        {
          "answer": "Đáp án C",
          "reason": "Lý do tại sao đáp án này sai"
        },
        {
          "answer": "Đáp án D",
          "reason": "Lý do tại sao đáp án này sai"
        }
      ]
    }
  ]
}
```

## 🔄 Quy trình xử lý

### 1. Pipeline xử lý PDF

```
PDF File → Text Extraction → Text Cleaning → Chunking → Embeddings → Vector Store
```

### 2. Sinh câu hỏi

```
Document Summary → Knowledge Extraction → Question Generation → Format Conversion → API Response
```

### 3. Async Processing

- POST request → Task ID returned
- Background processing 
- Check status với task ID
- Lấy kết quả khi completed

## 🎯 Các loại câu hỏi

Hệ thống sinh câu hỏi theo các mức độ:

- **Nhớ**: Kiểm tra ghi nhớ khái niệm cơ bản
- **Hiểu**: Kiểm tra hiểu biết về ý nghĩa
- **Vận dụng**: Kiểm tra khả năng áp dụng kiến thức
- **Phân tích**: Kiểm tra khả năng phân tích và so sánh

## 📝 Ví dụ sử dụng

### 1. Tạo câu hỏi async

```bash
curl -X POST "http://localhost:8000/api/generate-questions" \
  -H "Content-Type: application/json" \
  -d '{
    "s3_url": "https://example.s3.amazonaws.com/document.pdf",
    "total_question": 20
  }'
```

Response:
```json
{
  "message": "Yêu cầu đã được tiếp nhận",
  "task_id": "abc123-def456-ghi789",
  "status": "pending",
  "estimated_time": "40 giây"
}
```

### 2. Kiểm tra trạng thái

```bash
curl "http://localhost:8000/api/task-status/abc123-def456-ghi789"
```

### 3. Lấy kết quả

```bash
curl "http://localhost:8000/api/task-result/abc123-def456-ghi789"
```

## 🧪 Test Scripts

### Test chuyển đổi PDF

```bash
python pdfToText.py document.pdf
```

### Test chat với PDF

```bash
python chat.py document.pdf
```

### Test sinh câu hỏi

```bash
python genQ.py document.pdf 20
```

## ⚙️ Cấu hình

### Giới hạn

- **Async API**: Tối đa 200 câu hỏi
- **Sync API**: Tối đa 50 câu hỏi  
- **File size**: Tối đa 50MB
- **Timeout**: 300 giây cho download PDF

### Tối ưu hiệu năng

- Batch size: 8 câu hỏi/batch
- Chunk size: 1000 tokens
- Chunk overlap: 200 tokens
- Max retries: 3 lần

## 🐛 Xử lý lỗi

### Lỗi thường gặp

1. **PDF không đọc được**: Kiểm tra file có bị corrupt không
2. **API key không hợp lệ**: Kiểm tra `.env` file
3. **S3 URL không truy cập được**: Kiểm tra quyền access
4. **Timeout**: File quá lớn, giảm số câu hỏi

### Debug

Kiểm tra logs trong terminal khi chạy server:

```bash
python server.py --reload
```

## 🚀 Triển khai Production

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirement.txt .
RUN pip install -r requirement.txt

COPY . .
EXPOSE 8000

CMD ["python", "server.py", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```env
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
MAX_CONCURRENT_TASKS=10
LOG_LEVEL=INFO
```

## 📊 Monitoring

### Health Check

```bash
curl "http://localhost:8000/api/health"
```

### Metrics

- Active tasks
- Completed tasks  
- Success rate
- Average processing time

## 🤝 Tích hợp Backend

Backend có thể gọi API như sau:

```python
import requests

response = requests.post(
    "http://ai-server:8000/api/generate-questions",
    json={
        "s3_url": s3_url,
        "total_question": question_count
    }
)

task_id = response.json()["task_id"]

# Poll for result
while True:
    status = requests.get(f"http://ai-server:8000/api/task-status/{task_id}")
    if status.json()["status"] == "completed":
        result = requests.get(f"http://ai-server:8000/api/task-result/{task_id}")
        break
    time.sleep(5)
```

## 📚 Tài liệu tham khảo

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API](https://platform.openai.com/docs)
- [LangChain](https://python.langchain.com/docs/)
- [ChromaDB](https://docs.trychroma.com/)

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
