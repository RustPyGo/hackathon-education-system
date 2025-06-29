#!/bin/bash

echo "Testing Full Backend Setup..."
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    
    echo -e "\n${YELLOW}Testing: $name${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "Origin: http://localhost:5173" \
            -d "$data")
    else
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "Origin: http://localhost:5173")
    fi
    
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -eq 200 ] || [ "$http_status" -eq 201 ]; then
        echo -e "${GREEN}✓ $name - Status: $http_status${NC}"
        echo "Response: $body" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ $name - Status: $http_status${NC}"
        echo "Response: $body"
    fi
}

# Test server status
test_endpoint "Server Status" "GET" "http://localhost:3000/api/v1/CheckStatus"

# Test CORS preflight
echo -e "\n${YELLOW}Testing CORS Preflight${NC}"
cors_response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X OPTIONS "http://localhost:3000/api/v1/project" \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type")

cors_status=$(echo "$cors_response" | tail -n1 | sed 's/.*HTTPSTATUS://')
cors_headers=$(echo "$cors_response" | sed '$d')

if [ "$cors_status" -eq 200 ]; then
    echo -e "${GREEN}✓ CORS Preflight - Status: $cors_status${NC}"
    echo "CORS Headers: $cors_headers" | head -c 200
    echo "..."
else
    echo -e "${RED}✗ CORS Preflight - Status: $cors_status${NC}"
fi

# Test project endpoints
test_endpoint "Get All Projects" "GET" "http://localhost:3000/api/v1/project"

# Test project creation (without file for now)
test_endpoint "Create Project" "POST" "http://localhost:3000/api/v1/project" \
    '{"name":"Test Project","user_id":"test-user-123","exam_duration":30}'

# Test questions endpoint
test_endpoint "Get All Questions" "GET" "http://localhost:3000/api/v1/question"

# Test chat messages endpoint
test_endpoint "Get All Chat Messages" "GET" "http://localhost:3000/api/v1/chat-messages"

# Test unauthorized origin (should be blocked in production)
echo -e "\n${YELLOW}Testing Unauthorized Origin${NC}"
unauthorized_response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "http://localhost:3000/api/v1/project" \
    -H "Content-Type: application/json" \
    -H "Origin: http://malicious-site.com")

unauthorized_status=$(echo "$unauthorized_response" | tail -n1 | sed 's/.*HTTPSTATUS://')

if [ "$unauthorized_status" -eq 403 ] || [ "$unauthorized_status" -eq 0 ]; then
    echo -e "${GREEN}✓ Unauthorized Origin Blocked - Status: $unauthorized_status${NC}"
else
    echo -e "${YELLOW}⚠ Unauthorized Origin - Status: $unauthorized_status (may be allowed in dev mode)${NC}"
fi

echo -e "\n${GREEN}Full setup test completed!${NC}"
echo -e "\n${YELLOW}Check the server logs for detailed logging output.${NC}"
echo -e "\n${YELLOW}If all tests pass, your backend is properly configured with:${NC}"
echo "✓ CORS support"
echo "✓ Circular reference fix"
echo "✓ Comprehensive logging"
echo "✓ API endpoints working" 