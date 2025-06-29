# Question API Documentation

## Create Questions (Batch)

### Endpoint

```
POST /api/v1/question/
```

### Description

Tạo nhiều câu hỏi cùng lúc cho một project, bao gồm cả choices cho câu hỏi trắc nghiệm.

### Request

- **Content-Type**: `application/json`

#### Request Body

```json
{
  "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
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
    },
    {
      "question": "What is the capital of France?",
      "type": "multiple_choice",
      "difficulty": "medium",
      "explanation": "Geography question",
      "choices": [
        {
          "content": "London",
          "is_correct": false,
          "explanation": "This is the capital of UK"
        },
        {
          "content": "Paris",
          "is_correct": true,
          "explanation": "Correct answer"
        },
        {
          "content": "Berlin",
          "is_correct": false,
          "explanation": "This is the capital of Germany"
        },
        {
          "content": "Madrid",
          "is_correct": false,
          "explanation": "This is the capital of Spain"
        }
      ]
    }
  ]
}
```

#### Fields

- `project_id` (string, required): ID của project
- `questions` (array, required): Mảng các câu hỏi
  - `question` (string, required): Nội dung câu hỏi
  - `type` (string, required): Loại câu hỏi - phải là một trong: `multiple_choice`, `true_false`, `essay`
  - `difficulty` (string, required): Độ khó - phải là một trong: `easy`, `medium`, `hard`
  - `explanation` (string, optional): Giải thích cho câu hỏi
  - `choices` (array, required for multiple_choice): Mảng các lựa chọn
    - `content` (string, required): Nội dung lựa chọn
    - `is_correct` (boolean, required): Có phải đáp án đúng không
    - `explanation` (string, optional): Giải thích cho lựa chọn

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
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
            "content": "4",
            "is_correct": true,
            "explanation": "Correct answer"
          }
        ]
      }
    ]
  }'
```

### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "question-uuid-1",
      "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
      "content": "What is 2 + 2?",
      "type": "multiple_choice",
      "difficulty": "easy",
      "explanation": "Basic arithmetic question",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "question-uuid-2",
      "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
      "content": "What is the capital of France?",
      "type": "multiple_choice",
      "difficulty": "medium",
      "explanation": "Geography question",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Error Responses

- `400 Bad Request`: Missing required fields, invalid type/difficulty values, missing choices for multiple_choice, no correct choice
- `500 Internal Server Error`: Database error

## Validation Rules

### Required Fields

- `project_id`: Must be a valid UUID
- `questions`: Must not be empty array
- For each question:
  - `question`: Must not be empty
  - `type`: Must be one of: `multiple_choice`, `true_false`, `essay`
  - `difficulty`: Must be one of: `easy`, `medium`, `hard`

### Multiple Choice Validation

- `choices`: Required for `multiple_choice` type
- At least one choice must have `is_correct: true`
- Each choice must have `content` field

### Type Values

- `multiple_choice`: Câu hỏi trắc nghiệm với nhiều lựa chọn
- `true_false`: Câu hỏi đúng/sai
- `essay`: Câu hỏi tự luận

### Difficulty Values

- `easy`: Dễ
- `medium`: Trung bình
- `hard`: Khó

## Database Schema

### Question Table

- `id`: UUID primary key
- `project_id`: UUID foreign key to projects table
- `content`: Text content of the question
- `type`: Question type (multiple_choice, true_false, essay)
- `difficulty`: Question difficulty (easy, medium, hard)
- `explanation`: Optional explanation text
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `deleted_at`: Soft delete timestamp

### QuestionChoice Table

- `id`: UUID primary key
- `question_id`: UUID foreign key to questions table
- `content`: Text content of the choice
- `is_correct`: Boolean indicating if this is the correct answer
- `explanation`: Optional explanation for the choice
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `deleted_at`: Soft delete timestamp

## Business Logic

### Create Questions Flow

1. Validate request data (project_id, questions array)
2. Validate each question (content, type, difficulty)
3. For multiple_choice questions, validate choices and ensure at least one is correct
4. Create question records in database
5. For multiple_choice questions, create choice records
6. Return array of created questions

## Test Script

Sử dụng file `test_question_batch_api.sh` để test các trường hợp:

```bash
./test_question_batch_api.sh
```

Script này sẽ test:

1. Tạo nhiều câu hỏi hợp lệ với choices
2. Thiếu project_id
3. Không có câu hỏi nào
4. Multiple choice không có choices
5. Không có đáp án đúng
6. Lấy câu hỏi theo project ID

## Other Endpoints

### Get Question by ID

```
GET /api/v1/question/:id
```

### Get Questions by Project ID

```
GET /api/v1/question/project/:projectId
```

### Update Question

```
PUT /api/v1/question/:id
```

### Delete Question

```
DELETE /api/v1/question/:id
```
