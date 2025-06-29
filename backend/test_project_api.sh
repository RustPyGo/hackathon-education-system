#!/bin/bash

# Test Project API with PDF upload
echo "Testing Project API..."

# Create a test PDF file (if you have a real PDF, replace this path)
# For testing, you can use any PDF file you have

# Test the API endpoint
curl -X POST http://localhost:3000/api/v1/project/ \
  -F "pdf=@test.pdf" \
  -F "account_id=test_user_123" \
  -F "exam_duration=45" \
  -H "Content-Type: multipart/form-data"

echo ""
echo "Test completed!" 