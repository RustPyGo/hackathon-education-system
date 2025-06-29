#!/bin/bash

# Test Project API with multiple PDF uploads
echo "Testing Project API with multiple files..."

# Test the API endpoint with multiple files
# Note: Replace test1.pdf, test2.pdf, test3.pdf with actual PDF files you have
curl -X POST http://localhost:3000/api/v1/project/ \
  -F "pdf=@test1.pdf" \
  -F "pdf=@test2.pdf" \
  -F "pdf=@test3.pdf" \
  -F "account_id=test_user_123" \
  -F "exam_duration=45" \
  -H "Content-Type: multipart/form-data"

echo ""
echo "Multiple files test completed!"

echo ""
echo "Testing with single file..."

# Test with single file
curl -X POST http://localhost:3000/api/v1/project/ \
  -F "pdf=@test1.pdf" \
  -F "account_id=test_user_123" \
  -F "exam_duration=45" \
  -H "Content-Type: multipart/form-data"

echo ""
echo "Single file test completed!" 