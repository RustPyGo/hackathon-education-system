# Chat Message API Documentation

## Create Chat Message with AI Response

### Endpoint

```
POST /api/v1/chat-message/
```

### Description

Tạo chat message mới với AI response tự động. Flow như sau:

1. Nhận message và project_id từ user
2. Lưu user message vào database với sender='user'
3. Gọi AI API với message và project_id
4. Nhận AI response và lưu vào database với sender='bot'
5. Trả về cả user message và AI response

### Request

- **Content-Type**: `application/json`

#### Request Body

```json
{
  "project_id": "uuid-here",
  "message": "What is the main topic of this document?"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/chat-message/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
    "message": "What is the main topic of this document?"
  }'
```

### Response

```json
{
  "status": "success",
  "data": {
    "user_message": {
      "id": "user-msg-uuid",
      "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
      "sender": "user",
      "message": "What is the main topic of this document?",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "ai_response": {
      "id": "ai-msg-uuid",
      "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
      "sender": "bot",
      "message": "Based on the document, the main topic is mathematics fundamentals, specifically covering basic arithmetic operations, algebra, and calculus concepts.",
      "created_at": "2024-01-01T00:00:01Z"
    }
  }
}
```

### Error Responses

- `400 Bad Request`: Missing required fields or invalid request body
- `500 Internal Server Error`: Database error or AI API failed

### AI API Integration

- **External API Call**: Gọi AI API để tạo response
- **Request Format**:
  ```json
  {
    "message": "What is the main topic of this document?",
    "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5"
  }
  ```
- **Response Format**:
  ```json
  {
    "message": "Based on the document, the main topic is mathematics fundamentals..."
  }
  ```

## Get Chat Message by ID

### Endpoint

```
GET /api/v1/chat-message/:id
```

### Description

Lấy thông tin chi tiết của một chat message theo ID.

### Response

```json
{
  "status": "success",
  "data": {
    "id": "msg-uuid",
    "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
    "sender": "user",
    "message": "What is the main topic of this document?",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Get Chat Messages by Project ID

### Endpoint

```
GET /api/v1/chat-message/project/:projectId
```

### Description

Lấy tất cả chat messages của một project, được sắp xếp theo thời gian tạo.

### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "msg-1-uuid",
      "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
      "sender": "user",
      "message": "What is the main topic?",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg-2-uuid",
      "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
      "sender": "bot",
      "message": "The main topic is mathematics...",
      "created_at": "2024-01-01T00:00:01Z"
    }
  ]
}
```

## Update Chat Message

### Endpoint

```
PUT /api/v1/chat-message/:id
```

### Description

Cập nhật thông tin của một chat message.

### Request Body

```json
{
  "project_id": "844d4654-8f5f-4aeb-87ad-0a00c1f40bf5",
  "sender": "user",
  "message": "Updated message content"
}
```

## Delete Chat Message

### Endpoint

```
DELETE /api/v1/chat-message/:id
```

### Description

Xóa một chat message theo ID.

### Response

```json
{
  "status": "success",
  "data": "Chat message deleted successfully"
}
```

## Configuration

### AI API Configuration

Cập nhật `backend/internal/services/ai.service.go` với AI API credentials:

```go
func NewAIService() IAIService {
    apiURL := "https://your-ai-api.com" // Change to your AI API base URL
    apiKey := "your-api-key"            // Change to your API key
    // ...
}
```

### Message Types

- **User Messages**: `sender: "user"` - Messages từ người dùng
- **AI Messages**: `sender: "bot"` - Responses từ AI

### Features

- **Automatic AI Response**: Mỗi user message sẽ tự động nhận AI response
- **Message History**: Lưu trữ đầy đủ conversation history
- **Project-based**: Messages được tổ chức theo project
- **Real-time**: AI response được tạo ngay lập tức
