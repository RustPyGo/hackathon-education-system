#!/bin/bash

# Test Batch Question Creation API
echo "Testing Batch Question Creation API..."

# Test 1: Valid batch question creation
echo "Test 1: Creating multiple questions with choices..."
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
  }'

echo -e "\n\n"

# Test 2: Missing project_id
echo "Test 2: Missing project_id..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "question": "What is 2 + 2?",
        "type": "multiple_choice",
        "difficulty": "easy",
        "explanation": "Basic arithmetic question",
        "choices": [
          {
            "content": "4",
            "is_correct": true,
            "explanation": "Correct answer"
          }
        ]
      }
    ]
  }'

echo -e "\n\n"

# Test 3: No questions provided
echo "Test 3: No questions provided..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
    "questions": []
  }'

echo -e "\n\n"

# Test 4: Multiple choice without choices
echo "Test 4: Multiple choice without choices..."
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
        "choices": []
      }
    ]
  }'

echo -e "\n\n"

# Test 5: No correct choice
echo "Test 5: No correct choice..."
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
            "explanation": "Wrong"
          },
          {
            "content": "3",
            "is_correct": false,
            "explanation": "Wrong"
          }
        ]
      }
    ]
  }'

echo -e "\n\n"

# Test 6: Get questions by project ID
echo "Test 6: Get questions by project ID..."
curl -X GET http://localhost:3000/api/v1/question/project/db3003a2-b916-4b28-8fe5-0c07e04391ce

echo -e "\n\n" 