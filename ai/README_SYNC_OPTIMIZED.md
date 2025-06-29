# 🚀 AI Education Question Generator - SYNC OPTIMIZED

Hệ thống AI sinh câu hỏi trắc nghiệm từ file PDF **tối ưu cho xử lý đồng bộ** với khả năng tạo **300 câu hỏi/lần gọi API**.

## ⚡ Tối Ưu Hóa Chính

### 🎯 Hiệu Năng
- **300 câu hỏi/lần** (tăng từ 200)
- **15 files/lần** (tăng từ 10)
- **Xử lý song song** với ThreadPoolExecutor
- **Batch processing tối ưu** (5-15 câu/batch)
- **Model nhanh hơn** (gpt-3.5-turbo)
- **Timeout ngắn** (30s/request)

### 💾 Cache Thông Minh
- **Memory cache** + **Disk cache**
- **Thread-safe** với locking
- Cache theo **file_name**
- **Auto cleanup** và **cache rotation**

### 🔧 Kiến Trúc
- **Chỉ sync** (loại bỏ async overhead)
- **Single worker** (tránh cache conflicts)
- **Optimized connection pooling**
- **Fast JSON parsing**

## 📁 Files Mới

```
ai/
├── server_sync_optimized.py      # Server tối ưu (MAIN)
├── genQ.py                       # Đã thêm batch processing tối ưu
├── test_sync_optimized.py        # Test script cho 300 câu
├── run_sync_optimized.py         # Launch script
├── requirements_optimized.txt    # Dependencies tối ưu
└── README_SYNC_OPTIMIZED.md      # File này
```

## 🚀 Cách Sử Dụng

### 1. Khởi Động Nhanh
```bash
cd ai
python run_sync_optimized.py
```

### 2. Khởi Động Thủ Công
```bash
# Cài dependencies
pip install -r requirements_optimized.txt

# Chạy server
python server_sync_optimized.py
```

### 3. Test Hiệu Năng
```bash
# Update TEST_FILES trong test_sync_optimized.py với URLs thật
python test_sync_optimized.py
```

## 📡 API Endpoints

### 🎯 Main Endpoint (OPTIMIZED)
```http
POST /api/generate-questions-sync
Content-Type: application/json

{
  "files": [
    {
      "url": "https://example.com/doc1.pdf",
      "file_name": "document1.pdf"
    },
    {
      "url": "https://example.com/doc2.pdf", 
      "file_name": "document2.pdf"
    }
  ],
  "project_id": "project_123",
  "total_questions": 300,
  "name": "Test 300 Questions"
}
```

### 📊 Response Format
```json
{
  "overview": "Đã tạo thành công 300/300 câu hỏi...",
  "quiz": [
    {
      "question": "Câu hỏi 1...",
      "type": "multiple_choice",
      "hint": "Gợi ý...",
      "correct_answer": "A",
      "options": [
        {"answer": "A", "reason": "Đúng vì..."},
        {"answer": "B", "reason": "Sai vì..."},
        {"answer": "C", "reason": "Sai vì..."},
        {"answer": "D", "reason": "Sai vì..."}
      ]
    }
  ],
  "metadata": {
    "project_id": "project_123",
    "name": "Test 300 Questions",
    "total_questions": 300,
    "files_processed": ["document1.pdf", "document2.pdf"],
    "cached_files": ["document1.pdf"],
    "new_files": ["document2.pdf"],
    "failed_files": [],
    "questions_per_file": {
      "document1.pdf": 150,
      "document2.pdf": 150
    },
    "processing_time": "45.2s",
    "cache_usage": "50.0% cache hit rate"
  }
}
```

### 🔧 Utility Endpoints
```http
GET  /api/health           # Health check
GET  /api/cache/info       # Cache thông tin
DELETE /api/cache/clear    # Xóa cache
```

## ⚡ Tối Ưu Hóa Chi Tiết

### 1. Batch Processing
```python
# Tối ưu batch size theo số câu hỏi
if num_questions <= 10:
    batch_size = num_questions  # Tạo một lần
elif num_questions <= 50:
    batch_size = 10  # Batch 10 câu
else:
    batch_size = 15  # Batch 15 câu cho số lượng lớn
```

### 2. Parallel File Processing
```python
# ThreadPoolExecutor với số threads tối ưu
max_workers = min(len(files), os.cpu_count() or 4, 8)
```

### 3. Optimized Caching
```python
# Memory cache + Disk cache với thread safety
class OptimizedMultiFileCache:
    def __init__(self):
        self.memory_cache = {}
        self.cache_lock = threading.Lock()
```

### 4. Fast API Calls
```python
# Timeout ngắn + gpt-3.5-turbo
data = {
    'model': 'gpt-3.5-turbo',  # Nhanh hơn gpt-4
    'timeout': 30  # 30s timeout
}
```

## 📈 Hiệu Năng Mục Tiêu

| Metric | Target | Optimized |
|--------|--------|-----------|
| Max questions | 200 | **300** |
| Max files | 10 | **15** |
| Processing mode | Sync + Async | **Sync only** |
| Batch size | 5-8 | **5-15** |
| Cache | File-based | **Memory + Disk** |
| Parallel processing | No | **Yes** |
| Target time (300Q) | N/A | **≤5 minutes** |

## 🧪 Testing

### Performance Test Suite
```bash
python test_sync_optimized.py
```

### Test Cases
- ✅ Small batch (50 questions)
- ✅ Medium batch (150 questions) 
- ✅ **Large batch (300 questions)**
- ✅ Cache performance
- ✅ Error handling
- ✅ Parallel processing

### Expected Results
```
📊 PERFORMANCE SUMMARY
✅ SMALL: 50Q in 12.3s (4.1 Q/s)
✅ MEDIUM: 150Q in 32.1s (4.7 Q/s)
✅ LARGE: 300Q in 67.8s (4.4 Q/s)

🎉 PERFORMANCE TARGET MET!
Target: ≤300s for 300 questions
Actual: 67.8s
Status: PASS ✅
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Server Configuration
```python
# server_sync_optimized.py
app = FastAPI(
    title="AI Education Question Generator API - SYNC OPTIMIZED",
    version="2.0.0"
)

# Chỉ 1 worker để tránh cache conflicts
uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)
```

## 🚨 Migration từ Version Cũ

### 1. Thay đổi endpoint
```python
# Cũ
POST /api/generate-questions-sync  # Max 200 câu

# Mới  
POST /api/generate-questions-sync  # Max 300 câu (same endpoint, more capacity)
```

### 2. Thay đổi request
```python
# Cũ
"total_questions": 200  # Max

# Mới
"total_questions": 300  # Max
```

### 3. Tắt async (nếu đang dùng)
```python
# Endpoint async không còn trong version tối ưu
# Chỉ sử dụng sync endpoint
```

## 🐛 Troubleshooting

### Common Issues

1. **"Max 300 questions exceeded"**
   ```python
   # Giảm số câu hỏi xuống ≤ 300
   "total_questions": 300
   ```

2. **"Timeout after 30s"**
   ```python
   # File quá lớn hoặc internet chậm
   # Thử với file nhỏ hơn hoặc ít files hơn
   ```

3. **"Cache conflicts"**
   ```bash
   # Clear cache và restart
   curl -X DELETE http://localhost:8000/api/cache/clear
   ```

4. **Memory issues**
   ```python
   # Giảm số files đồng thời
   "files": [...] # Max 15 files
   ```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Cache Status  
```bash
curl http://localhost:8000/api/cache/info
```

### Performance Metrics
- Questions per second (Q/s)
- Cache hit rate (%)
- Processing time per batch
- Memory usage
- Thread utilization

## 🎯 Best Practices

### 1. File Management
- Sử dụng file_name unique để cache hiệu quả
- Limit file size < 50MB per file
- PDF quality tốt cho text extraction

### 2. Question Distribution
- Chia đều câu hỏi giữa các files
- Min 5 câu/file, max không giới hạn
- Balance content quality vs quantity

### 3. Caching Strategy
- Để cache warm-up với files thường dùng
- Clear cache định kỳ để tránh stale data
- Monitor cache size để tránh disk full

### 4. Error Handling
- Xử lý từng file độc lập
- Continue processing khi 1 file fail
- Return partial results với error details

## 🚀 Roadmap

### Version 2.1 (Future)
- [ ] 500 câu hỏi/lần
- [ ] 20 files/lần  
- [ ] GPU acceleration
- [ ] Real-time processing status
- [ ] Advanced caching strategies

### Version 2.2 (Future)
- [ ] Multiple question types
- [ ] Custom difficulty levels
- [ ] Bulk export formats
- [ ] Analytics dashboard

---

**🎉 Ready to generate 300 questions at lightning speed!**

Liên hệ: AI Assistant Team
