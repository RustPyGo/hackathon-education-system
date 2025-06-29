#!/bin/bash

echo "Testing Chat Message API with AI Integration..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test data
PROJECT_ID="test-project-123"
USER_ID="test-user-456"

# Function to test chat message creation
test_chat_message() {
    local message="$1"
    local test_name="$2"
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    echo "Message: $message"
    
    response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST "http://localhost:3000/api/v1/chat-message/" \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:5173" \
        -d "{
            \"project_id\": \"$PROJECT_ID\",
            \"user_id\": \"$USER_ID\",
            \"message\": \"$message\"
        }")
    
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -eq 201 ]; then
        echo -e "${GREEN}✓ Chat message created successfully${NC}"
        echo "Response preview:"
        echo "$body" | jq '.data.user_message | {id, message, sender, project_id, user_id}' 2>/dev/null || echo "User message: $(echo "$body" | head -c 200)..."
        echo "$body" | jq '.data.ai_response | {id, message, sender, project_id, user_id}' 2>/dev/null || echo "AI response: $(echo "$body" | head -c 200)..."
    else
        echo -e "${RED}✗ Failed to create chat message - Status: $http_status${NC}"
        echo "Response: $body"
    fi
}

# Function to test getting chat messages
test_get_chat_messages() {
    local endpoint="$1"
    local test_name="$2"
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    
    response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "$endpoint" \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:5173")
    
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -eq 200 ]; then
        echo -e "${GREEN}✓ Retrieved chat messages successfully${NC}"
        echo "Response preview:"
        echo "$body" | jq '.data | length' 2>/dev/null || echo "Message count: $(echo "$body" | jq '.data | length' 2>/dev/null || echo 'N/A')"
        echo "$body" | jq '.data[0:3] | .[] | {id, message, sender, created_at}' 2>/dev/null || echo "First 3 messages: $(echo "$body" | head -c 200)..."
    else
        echo -e "${RED}✗ Failed to get chat messages - Status: $http_status${NC}"
        echo "Response: $body"
    fi
}

# Test creating chat messages
echo -e "\n${YELLOW}Creating Chat Messages${NC}"
test_chat_message "Hello, can you help me understand this project?" "First chat message"
sleep 2
test_chat_message "What are the main topics covered in the documents?" "Second chat message"
sleep 2
test_chat_message "Can you explain the key concepts?" "Third chat message"

# Test getting chat messages
echo -e "\n${YELLOW}Retrieving Chat Messages${NC}"
test_get_chat_messages "http://localhost:3000/api/v1/chat-message/project/$PROJECT_ID" "Get all chat messages for project"
test_get_chat_messages "http://localhost:3000/api/v1/chat-message/project/$PROJECT_ID/user/$USER_ID" "Get chat messages for project and user"

echo -e "\n${GREEN}Chat Message API test completed!${NC}"
echo -e "\n${YELLOW}Expected behavior:${NC}"
echo "✓ Chat messages should be created with user and AI responses"
echo "✓ AI should receive context from project documents and chat history"
echo "✓ Messages should be retrievable by project and user"
echo "✓ All endpoints should return appropriate HTTP status codes" 