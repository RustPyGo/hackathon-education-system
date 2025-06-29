# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy AI Education Question Generator

## 📋 Bước 1: Setup

```bash
cd ai
python setup.py
```

## 🔑 Bước 2: Cấu hình API Keys

Mở file `.env` và cập nhật:

```env
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_API_KEY=your-google-key-here
```

## 🚀 Bước 3: Chạy Server

### Option 1: Chạy trực tiếp
```bash
python run.py
```

### Option 2: Chạy với auto-reload (development)
```bash
python run.py --reload
```

### Option 3: Chạy với Docker
```bash
python run.py --docker
```

## 🧪 Bước 4: Test API

```bash
python run.py --test
```

## 📖 Bước 5: Sử dụng API

Server sẽ chạy tại: http://localhost:8000

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Test với curl

```bash
# Tạo câu hỏi async
curl -X POST "http://localhost:8000/api/generate-questions" \
  -H "Content-Type: application/json" \
  -d '{
    "s3_url": "https://example.com/document.pdf",
    "total_question": 10
  }'

# Kiểm tra trạng thái
curl "http://localhost:8000/api/task-status/TASK_ID"

# Lấy kết quả
curl "http://localhost:8000/api/task-result/TASK_ID"
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **ModuleNotFoundError**: Chạy `python setup.py` để cài đặt dependencies
2. **API Key Error**: Kiểm tra file `.env` 
3. **Port đã được sử dụng**: Chạy với port khác `python run.py --port 8080`

### Logs và Debug:

```bash
# Chạy với log level debug
python run.py --log-level debug

# Kiểm tra health
curl http://localhost:8000/api/health
```

## 📱 Tích hợp Backend

Backend có thể gọi API như sau:

```python
import requests

# Submit request
response = requests.post(
    "http://ai-server:8000/api/generate-questions",
    json={"s3_url": s3_url, "total_question": 20}
)
task_id = response.json()["task_id"]

# Poll for completion  
import time
while True:
    status = requests.get(f"http://ai-server:8000/api/task-status/{task_id}")
    if status.json()["status"] == "completed":
        result = requests.get(f"http://ai-server:8000/api/task-result/{task_id}")
        break
    time.sleep(5)
```

## 🐳 Docker Production

```bash
# Build image
docker build -t ai-question-generator .

# Run container
docker run -p 8000:8000 --env-file .env ai-question-generator

# Or use docker-compose
docker-compose up -d
```

Chúc bạn thành công! 🎉
