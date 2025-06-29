# Project API Documentation

## Create Project with PDF Upload and AI Processing

### Endpoint

```
POST /api/v1/project/
```

### Description

Tạo project mới với PDF upload và AI processing. Flow như sau:

1. Nhận PDF file(s) + user_id + exam_duration + name + total_questions từ form data
2. Upload PDF(s) lên S3 AWS (hoặc custom S3-compatible storage) với quyền public-read
3. Lưu S3 key(s) và tên file(s) vào Document model
4. Gọi AI API với URL, project_id, total_questions, và name
5. Lưu questions và answers từ AI response vào database
6. Cập nhật project với summary từ AI response
7. Trả về project info, files (URL + tên file), questions, và summary

### Request

- **Content-Type**: `multipart/form-data`

#### Form Fields

- `pdf` (file[]): PDF file(s) - có thể upload 1 hoặc nhiều file (required)
- `user_id` (string): User ID (required)
- `exam_duration` (number): Exam duration in minutes (required)
- `name` (string): Project name (required)
- `total_questions` (number): Number of questions to generate (required)

### Example Request - Single File

```bash
curl -X POST http://localhost:3000/api/v1/project/ \
  -F "pdf=@/path/to/document.pdf" \
  -F "user_id=user123" \
  -F "exam_duration=60" \
  -F "name=Math Exam" \
  -F "total_questions=10"
```

### Example Request - Multiple Files

```bash
curl -X POST http://localhost:3000/api/v1/project/ \
  -F "pdf=@/path/to/document1.pdf" \
  -F "pdf=@/path/to/document2.pdf" \
  -F "user_id=user123" \
  -F "exam_duration=60" \
  -F "name=Math Exam" \
  -F "total_questions=15"
```

### Response - Single File

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": "uuid-here",
      "user_id": "user123",
      "summary": "This document covers basic mathematics concepts...",
      "exam_duration": 60,
      "name": "Math Exam",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "files": [
      {
        "url": "https://hcm.ss.bfcplatform.vn/prj301/pdfs/uuid-here/1234567890.pdf",
        "file_name": "document.pdf"
      }
    ],
    "file_count": 1,
    "questions": [
      {
        "id": "question-uuid-1",
        "project_id": "uuid-here",
        "question": "What is 2 + 2?",
        "answer_correct": "4",
        "difficulty_level": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": "This document covers basic mathematics concepts..."
  }
}
```

### Response - Multiple Files

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": "uuid-here",
      "user_id": "user123",
      "summary": "This document covers advanced mathematics concepts...",
      "exam_duration": 60,
      "name": "Math Exam",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "files": [
      {
        "url": "https://hcm.ss.bfcplatform.vn/prj301/pdfs/uuid-here/1234567890.pdf",
        "file_name": "document1.pdf"
      },
      {
        "url": "https://hcm.ss.bfcplatform.vn/prj301/pdfs/uuid-here/1234567891.pdf",
        "file_name": "document2.pdf"
      }
    ],
    "file_count": 2,
    "questions": [
      {
        "id": "question-uuid-1",
        "project_id": "uuid-here",
        "question": "What is the derivative of x²?",
        "answer_correct": "2x",
        "difficulty_level": 3,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": "This document covers advanced mathematics concepts..."
  }
}
```

### Error Responses

- `400 Bad Request`: Missing required fields, invalid file type, or no files provided
- `500 Internal Server Error`: S3 upload failed or AI API failed

### AI API Integration

- **External API Call**: Gọi AI API để tạo questions và summary
- **Request Format**:
  ```json
  {
    "files": [
      {
        "url": "https://hcm.ss.bfcplatform.vn/prj301/pdfs/uuid-here/1234567890.pdf",
        "file_name": "document1.pdf"
      },
      {
        "url": "https://hcm.ss.bfcplatform.vn/prj301/pdfs/uuid-here/1234567891.pdf",
        "file_name": "document2.pdf"
      }
    ],
    "project_id": "uuid-here",
    "total_questions": 10,
    "name": "Math Exam"
  }
  ```
- **Response Format**:
  ```json
  {
    "questions": [
      {
        "question": "What is 2 + 2?",
        "type": "multiple_choice",
        "difficulty": "easy",
        "explanation": "Basic arithmetic question",
        "choices": [
          {
            "content": "2",
            "is_correct": false,
            "explanation": "This is too low"
          },
          {
            "content": "3",
            "is_correct": false,
            "explanation": "This is still too low"
          },
          {
            "content": "4",
            "is_correct": true,
            "explanation": "Correct answer"
          },
          {
            "content": "5",
            "is_correct": false,
            "explanation": "This is too high"
          }
        ]
      }
    ],
    "summary": "This document covers basic mathematics concepts..."
  }
  ```

### Multiple File Upload Features

- **Parallel Processing**: Files được upload song song
- **AI Processing**: Tất cả files được gửi cho AI để xử lý và tạo questions
- **Partial Success**: Nếu một số file upload thành công, API vẫn trả về kết quả cho các file thành công
- **Error Handling**: Chi tiết lỗi cho từng file nếu có
- **File Validation**: Tất cả files phải là PDF
- **File Information**: Mỗi file trả về cả URL và tên file gốc
- **AI Integration**: AI nhận được mảng chứa URL và tên file của tất cả PDFs đã upload

## Configuration

### AWS/S3 Configuration

Cập nhật file `configs/local.yaml` với credentials:

```yaml
aws:
  region: hcm
  bucket: prj301
  access_key: your-access-key
  secret_key: your-secret-key
  endpoint: https://hcm.ss.bfcplatform.vn # Custom S3 endpoint
```

### AI API Configuration

Cập nhật `backend/internal/services/ai.service.go` với AI API credentials:

```go
func NewAIService() IAIService {
    apiURL := "https://your-ai-api.com" // Change to your AI API base URL
    apiKey := "your-api-key"            // Change to your API key
    // ...
}
```

### Supported Storage Types

- **AWS S3**: Không cần endpoint (sử dụng AWS default)
- **Custom S3-compatible storage**: Cần cung cấp endpoint

### File Access Control

- **Upload Permission**: Files được upload với ACL `public-read`
- **Access**: Files có thể truy cập công khai mà không cần authentication
- **Security**: Chỉ có quyền đọc, không có quyền ghi/xóa

### Required Permissions

- S3:PutObject for the specified bucket
- S3:PutObjectAcl for setting public-read permission
- S3:GetObject for reading uploaded files (if needed)

## Other Project Endpoints

### Get All Projects

```
GET /api/v1/project/
```

### Get Project by ID

```
GET /api/v1/project/:id
```

### Get Projects by Account ID

```
GET /api/v1/project/account/:accountId
```

### Update Project

```
PUT /api/v1/project/:id
```

### Delete Project

```
DELETE /api/v1/project/:id
```
