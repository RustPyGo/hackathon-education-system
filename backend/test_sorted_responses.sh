#!/bin/bash

echo "Testing Sorted Response APIs..."
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    
    echo -e "\n${YELLOW}Testing: $name${NC}"
    
    response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "$url" \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:5173")
    
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -eq 200 ]; then
        echo -e "${GREEN}✓ $name - Status: $http_status${NC}"
        echo "Response preview:"
        echo "$body" | jq '.data | length' 2>/dev/null || echo "Response length: $(echo "$body" | jq '.data | length' 2>/dev/null || echo 'N/A')"
        echo "$body" | jq '.data[0:3] | .[] | {id, score, time_taken, user_id}' 2>/dev/null || echo "First 3 responses: $(echo "$body" | head -c 200)..."
    else
        echo -e "${RED}✗ $name - Status: $http_status${NC}"
        echo "Response: $body"
    fi
}

# Test all sorted response endpoints
test_endpoint "Get All Responses Sorted by Score" "http://localhost:3000/api/v1/response/sorted/score"

test_endpoint "Get Responses by Project ID Sorted by Score" "http://localhost:3000/api/v1/response/project/test-project-id/sorted/score"

test_endpoint "Get Responses by User ID Sorted by Score" "http://localhost:3000/api/v1/response/user/test-user-id/sorted/score"

# Test regular endpoints for comparison
echo -e "\n${YELLOW}Testing Regular Endpoints for Comparison${NC}"
test_endpoint "Get All Responses (Regular)" "http://localhost:3000/api/v1/response/"

test_endpoint "Get Responses by Project ID (Regular)" "http://localhost:3000/api/v1/response/project/test-project-id"

test_endpoint "Get Responses by User ID (Regular)" "http://localhost:3000/api/v1/response/user/test-user-id"

echo -e "\n${GREEN}Sorted Response API test completed!${NC}"
echo -e "\n${YELLOW}Expected behavior:${NC}"
echo "✓ Sorted endpoints should return responses ordered by:"
echo "  1. Score (highest first)"
echo "  2. Time taken (fastest first for same score)"
echo "✓ Regular endpoints should return responses in default order"
echo "✓ All endpoints should return HTTP 200 status" 