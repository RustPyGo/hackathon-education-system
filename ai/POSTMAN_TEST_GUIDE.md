# 🧪 Hướng Dẫn Test API với Postman - SYNC OPTIMIZED

## 📝 Chuẩn Bị

### 1. Import Postman Collection
1. Mở Postman
2. Click **Import** 
3. Chọn file `postman_sync_optimized_collection.json`
4. Collection sẽ xuất hiện với 8 requests

### 2. Cấu Hình Variables
Trong Postman, click vào collection → **Variables** tab:

```
base_url = http://localhost:8000
test_pdf_url_1 = [URL PDF thật của bạn]
test_pdf_url_2 = [URL PDF thật của bạn]  
test_pdf_url_3 = [URL PDF thật của bạn]
test_pdf_url_4 = [URL PDF thật của bạn]
```

**⚠️ QUAN TRỌNG**: Thay đổi các `test_pdf_url_*` thành URLs PDF thật để test được chính xác!

## 🚀 Quy Trình Test

### Bước 1: Kiểm Tra Server
```
1. Health Check → Verify server đang chạy mode tối ưu
2. Cache Info → Xem trạng thái cache ban đầu
3. Clear Cache → Xóa cache để test từ đầu
```

### Bước 2: Test Tăng Dần
```
4. Small Batch (50Q) → Test cơ bản
5. Medium Batch (150Q) → Test trung bình 
6. Large Batch (300Q) 🎯 → TEST CHÍNH
```

### Bước 3: Test Nâng Cao
```
7. Multi-File (10 files) → Test xử lý song song
8. Cache Performance → Test tốc độ cache
```

## 📊 Kết Quả Mong Đợi

### ✅ Request 6: Large Batch (300Q) - TEST CHÍNH

**Thành công nếu:**
- ✅ Status: `200 OK`
- ✅ Response time: `< 300 seconds` (5 phút)
- ✅ `metadata.total_questions`: `300`
- ✅ `quiz` array có 300 phần tử
- ✅ Có thông tin cache, processing time

**Response mẫu:**
```json
{
  "overview": "Đã tạo thành công 300/300 câu hỏi trắc nghiệm với chất lượng xuất sắc...",
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
    // ... 299 câu nữa
  ],
  "metadata": {
    "project_id": "test_large_batch_300",
    "total_questions": 300,
    "processing_time": "67.8s",
    "cache_usage": "25.0% cache hit rate",
    "files_processed": ["document_1.pdf", "document_2.pdf", "document_3.pdf", "document_4.pdf"],
    "questions_per_file": {
      "document_1.pdf": 75,
      "document_2.pdf": 75, 
      "document_3.pdf": 75,
      "document_4.pdf": 75
    }
  }
}
```

## 🎯 Benchmark Performance

### Target Metrics
| Metric | Target | Status |
|--------|--------|--------|
| Max Questions | 300 | ✅ |
| Max Files | 15 | ✅ |
| Processing Time (300Q) | ≤ 5 minutes | 🧪 Test |
| Questions/Second | ≥ 1.0 Q/s | 🧪 Test |
| Cache Hit Rate | ≥ 50% (2nd run) | 🧪 Test |

### Performance Analysis
Sau khi chạy test, kiểm tra:

1. **Processing Time**: Thời gian xử lý trong response
2. **Questions/Second**: `total_questions / processing_time`
3. **Cache Efficiency**: Chạy lại request 8 để so sánh
4. **Error Rate**: Số file failed vs thành công

## 🔧 Troubleshooting

### Lỗi Thường Gặp

#### 1. "Connection refused"
```bash
# Server chưa chạy, khởi động lại:
cd c:\An\education-system\ai
python run_sync_optimized.py
```

#### 2. "File download failed"
```json
// Thay URL PDF thật trong Variables
"test_pdf_url_1": "https://your-real-pdf-url.com/doc.pdf"
```

#### 3. "Timeout" 
```
// Tăng timeout trong Postman:
Settings → General → Request timeout in ms: 600000 (10 phút)
```

#### 4. "Max questions exceeded"
```json
// Giảm số câu hỏi
"total_questions": 250  // thay vì 300
```

## 📈 So Sánh với Version Cũ

### Chạy So Sánh Performance
```bash
# Terminal 1: Server cũ
python server.py

# Terminal 2: Server mới  
python -m uvicorn server_sync_optimized:app --port 8001

# Terminal 3: So sánh
python compare_performance.py
```

### Expected Improvements
- 🚀 **1.5-3x faster** processing
- ⚡ **300 questions** instead of 200
- 💾 **Better caching** (memory + disk)
- 🔄 **Parallel processing** 
- 📊 **Higher Q/s rate**

## 🎉 Test Cases Checklist

### Basic Tests
- [ ] ✅ Health check passes
- [ ] ✅ Cache info shows optimized config
- [ ] ✅ Cache clear works

### Performance Tests  
- [ ] ✅ 50 questions < 30s
- [ ] ✅ 150 questions < 90s
- [ ] ✅ **300 questions < 300s** 🎯
- [ ] ✅ Multi-file processing works
- [ ] ✅ Cache improves 2nd run speed

### Quality Tests
- [ ] ✅ All questions have 4 options
- [ ] ✅ Correct answers are valid
- [ ] ✅ Reasons are provided
- [ ] ✅ Questions are diverse
- [ ] ✅ Vietnamese language correct

## 🏆 Success Criteria

**🎯 Test THÀNH CÔNG nếu:**
1. Request 6 (300Q) trả về 200 OK trong ≤ 5 phút
2. Có đủ 300 câu hỏi chất lượng
3. Cache hoạt động (request lần 2 nhanh hơn)
4. Không có errors trong processing
5. Metadata đầy đủ và chính xác

**🚀 READY FOR PRODUCTION!**

---

## 💡 Tips

1. **PDF Quality**: Sử dụng PDF có text rõ ràng, không scan
2. **File Size**: PDF < 50MB mỗi file
3. **Internet**: Kết nối ổn định cho download
4. **OpenAI API**: Đảm bảo có credit đủ
5. **Memory**: Server cần ít nhất 4GB RAM

## 📞 Support

Nếu gặp vấn đề:
1. Check server logs trong terminal
2. Kiểm tra `.env` file có `OPENAI_API_KEY`
3. Verify PDF URLs accessible
4. Test với số câu hỏi nhỏ hơn trước

**🎊 Chúc bạn test thành công 300 câu hỏi!**
