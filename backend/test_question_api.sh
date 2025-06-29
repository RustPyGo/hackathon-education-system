#!/bin/bash

# Test Question Creation API
echo "Testing Question Creation API..."

# Test 1: Valid question creation
echo "Test 1: Creating a valid question..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
    "content": "What is 2 + 2?",
    "type": "multiple_choice",
    "difficulty": "medium",
    "explanation": "Basic arithmetic question"
  }'

echo -e "\n\n"

# Test 2: Missing project_id
echo "Test 2: Missing project_id..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What is 2 + 2?",
    "type": "multiple_choice",
    "difficulty": "medium",
    "explanation": "Basic arithmetic question"
  }'

echo -e "\n\n"

# Test 3: Invalid type
echo "Test 3: Invalid type..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
    "content": "What is 2 + 2?",
    "type": "invalid_type",
    "difficulty": "medium",
    "explanation": "Basic arithmetic question"
  }'

echo -e "\n\n"

# Test 4: Invalid difficulty
echo "Test 4: Invalid difficulty..."
curl -X POST http://localhost:3000/api/v1/question/ \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "db3003a2-b916-4b28-8fe5-0c07e04391ce",
    "content": "What is 2 + 2?",
    "type": "multiple_choice",
    "difficulty": "invalid_difficulty",
    "explanation": "Basic arithmetic question"
  }'

echo -e "\n\n"

# Test 5: Get questions by project ID
echo "Test 5: Get questions by project ID..."
curl -X GET http://localhost:3000/api/v1/question/project/db3003a2-b916-4b28-8fe5-0c07e04391ce

echo -e "\n\n" 