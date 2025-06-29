#!/bin/bash

echo "Testing Circular Reference Fix..."
echo "================================"

# Test server status first
echo "1. Testing server status..."
curl -X GET http://localhost:3000/api/v1/CheckStatus \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n"

echo -e "\n2. Testing get all projects (this was causing circular reference)..."
curl -X GET http://localhost:3000/api/v1/project \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (not JSON or jq not available)"

echo -e "\n3. Testing get project by ID..."
curl -X GET http://localhost:3000/api/v1/project/test-id \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (not JSON or jq not available)"

echo -e "\n4. Testing get questions..."
curl -X GET http://localhost:3000/api/v1/question \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (not JSON or jq not available)"

echo -e "\n5. Testing get chat messages..."
curl -X GET http://localhost:3000/api/v1/chat-messages \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (not JSON or jq not available)"

echo -e "\nCircular reference test completed!"
echo "If all requests return status 200/404/500 (not 500 with circular reference error), the fix is working." 