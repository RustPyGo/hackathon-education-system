#!/bin/bash

echo "Testing CORS Configuration..."
echo "============================="

# Test CORS preflight request
echo "1. Testing CORS preflight (OPTIONS) request..."
curl -X OPTIONS http://localhost:3000/api/v1/project \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

echo -e "\n\n2. Testing actual GET request with CORS headers..."
curl -X GET http://localhost:3000/api/v1/project \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -v

echo -e "\n\n3. Testing POST request with CORS headers..."
curl -X POST http://localhost:3000/api/v1/project \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","user_id":"test-123","exam_duration":30}' \
  -v

echo -e "\n\n4. Testing from different origin (should be blocked in production)..."
curl -X GET http://localhost:3000/api/v1/project \
  -H "Origin: http://malicious-site.com" \
  -H "Content-Type: application/json" \
  -v

echo -e "\n\n5. Testing server status endpoint..."
curl -X GET http://localhost:3000/api/v1/CheckStatus \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -v

echo -e "\n\nCORS test completed!"
echo "Check the response headers for:"
echo "- Access-Control-Allow-Origin"
echo "- Access-Control-Allow-Methods" 
echo "- Access-Control-Allow-Headers"
echo "- Access-Control-Allow-Credentials" 