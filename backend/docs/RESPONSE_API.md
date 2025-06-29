# Response API Documentation

## Submit Exam

### Endpoint

```
POST /api/v1/response/submit
```

### Description

Submit bài thi của người dùng với điểm số, thời gian làm bài và các câu trả lời.

### Request

- **Content-Type**: `application/json`

#### Request Body

```json
{
  "project_id": "uuid-here",
  "user_id": "user123",
  "score": 85,
  "time_taken": 3600,
  "answers": [
    {
      "question_id": "question-uuid-1",
      "choice_id": "choice-uuid-3"
    },
    {
      "question_id": "question-uuid-2",
      "choice_id": "choice-uuid-1"
    }
  ]
}
```

#### Fields

- `project_id` (string, required): ID của project
- `user_id` (string, required): ID của user
- `score` (number, required): Điểm số (>= 0)
- `time_taken` (number, required): Thời gian làm bài tính bằng giây (>= 0)
- `answers` (array, required): Mảng các câu trả lời
  - `question_id` (string): ID của câu hỏi
  - `choice_id` (string): ID của lựa chọn được chọn

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/response/submit \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid-here",
    "user_id": "user123",
    "score": 85,
    "time_taken": 3600,
    "answers": [
      {
        "question_id": "question-uuid-1",
        "choice_id": "choice-uuid-3"
      },
      {
        "question_id": "question-uuid-2",
        "choice_id": "choice-uuid-1"
      }
    ]
  }'
```

### Response

```json
{
  "status": "success",
  "data": {
    "id": "response-uuid-here",
    "project_id": "uuid-here",
    "user_id": "user123",
    "score": 85,
    "time_taken": 3600,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Responses

- `400 Bad Request`: Missing required fields, invalid score/time, or no answers provided
- `500 Internal Server Error`: Database error

## Get Response by ID

### Endpoint

```
GET /api/v1/response/:id
```

### Description

Lấy thông tin chi tiết của một response bao gồm tất cả các câu trả lời.

### Request

- **Method**: GET
- **Path Parameter**: `id` - Response ID

### Example Request

```bash
curl -X GET http://localhost:3000/api/v1/response/response-uuid-here
```

### Response

```json
{
  "status": "success",
  "data": {
    "id": "response-uuid-here",
    "project_id": "uuid-here",
    "user_id": "user123",
    "score": 85,
    "time_taken": 3600,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "answers": [
      {
        "id": "answer-uuid-1",
        "response_id": "response-uuid-here",
        "question_id": "question-uuid-1",
        "choice_id": "choice-uuid-3",
        "created_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "answer-uuid-2",
        "response_id": "response-uuid-here",
        "question_id": "question-uuid-2",
        "choice_id": "choice-uuid-1",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Error Responses

- `400 Bad Request`: Missing response ID
- `404 Not Found`: Response not found
- `500 Internal Server Error`: Database error

## Get All Responses

### Endpoint

```
GET /api/v1/response/
```

### Description

Lấy danh sách tất cả responses.

### Example Request

```bash
curl -X GET http://localhost:3000/api/v1/response/
```

### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "response-uuid-1",
      "project_id": "uuid-here",
      "user_id": "user123",
      "score": 85,
      "time_taken": 3600,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "response-uuid-2",
      "project_id": "uuid-here",
      "user_id": "user456",
      "score": 92,
      "time_taken": 2800,
      "created_at": "2024-01-01T01:00:00Z",
      "updated_at": "2024-01-01T01:00:00Z"
    }
  ]
}
```

## Get Responses by Project ID

### Endpoint

```
GET /api/v1/response/project/:projectId
```

### Description

Lấy danh sách responses theo project ID.

### Example Request

```bash
curl -X GET http://localhost:3000/api/v1/response/project/uuid-here
```

## Get Responses by User ID

### Endpoint

```
GET /api/v1/response/user/:userId
```

### Description

Lấy danh sách responses theo user ID.

### Example Request

```bash
curl -X GET http://localhost:3000/api/v1/response/user/user123
```

## Update Response

### Endpoint

```
PUT /api/v1/response/:id
```

### Description

Cập nhật thông tin response.

### Request

- **Content-Type**: `application/json`
- **Path Parameter**: `id` - Response ID

### Example Request

```bash
curl -X PUT http://localhost:3000/api/v1/response/response-uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid-here",
    "user_id": "user123",
    "score": 90,
    "time_taken": 3500,
    "answers": [
      {
        "question_id": "question-uuid-1",
        "choice_id": "choice-uuid-3"
      }
    ]
  }'
```

## Delete Response

### Endpoint

```
DELETE /api/v1/response/:id
```

### Description

Xóa response theo ID.

### Example Request

```bash
curl -X DELETE http://localhost:3000/api/v1/response/response-uuid-here
```

### Response

```json
{
  "status": "success",
  "data": "Response deleted successfully"
}
```

## Database Schema

### Response Table

- `id`: UUID primary key
- `project_id`: UUID foreign key to projects table
- `user_id`: String user identifier
- `score`: Integer score
- `time_taken`: Integer time in seconds
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `deleted_at`: Soft delete timestamp

### Answer Table

- `id`: UUID primary key
- `response_id`: UUID foreign key to responses table
- `question_id`: UUID foreign key to questions table
- `choice_id`: UUID foreign key to question_choices table
- `created_at`: Timestamp
- `deleted_at`: Soft delete timestamp

## Business Logic

### Submit Exam Flow

1. Validate request data (project_id, user_id, score, time_taken, answers)
2. Create response record in database
3. Create answer records for each submitted answer
4. Return response with generated ID

### Get Response by ID Flow

1. Get response record by ID
2. Get all answers for this response
3. Return response with answers included

### Data Validation

- Score must be non-negative
- Time taken must be non-negative
- At least one answer is required
- All required fields must be provided
