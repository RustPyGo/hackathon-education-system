#!/bin/bash

echo "Testing API Logging..."
echo "======================"

# Test server status
echo "1. Testing server status endpoint..."
curl -X GET http://localhost:3000/api/v1/CheckStatus \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\n2. Testing project creation endpoint..."
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: multipart/form-data" \
  -F "name=Test Project with Logging" \
  -F "user_id=test-user-123" \
  -F "exam_duration=30" \
  -F "total_questions=5" \
  -F "pdf_file=@test_multiple_files.sh" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\n3. Testing chat message endpoint..."
curl -X POST http://localhost:3000/api/v1/chat-messages \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, this is a test message for logging",
    "project_id": "test-project-id",
    "user_id": "test-user-123"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\n4. Testing question creation endpoint..."
curl -X POST http://localhost:3000/api/v1/questions/batch \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "test-project-id",
    "questions": [
      {
        "content": "What is the capital of France?",
        "type": "multiple_choice",
        "difficulty": "easy",
        "explanation": "Paris is the capital of France",
        "choices": [
          {
            "content": "Paris",
            "is_correct": true,
            "explanation": "Correct! Paris is the capital of France"
          },
          {
            "content": "London",
            "is_correct": false,
            "explanation": "London is the capital of England"
          }
        ]
      }
    ]
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\nLogging test completed!"
echo "Check the server logs to see the detailed logging output." 