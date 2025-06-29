#!/bin/bash

echo "Creating test response data for sorted response APIs..."
echo "====================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create test response
create_test_response() {
    local project_id="$1"
    local user_id="$2"
    local score="$3"
    local time_taken="$4"
    
    echo -e "${YELLOW}Creating response: Project=$project_id, User=$user_id, Score=$score, Time=$time_taken${NC}"
    
    response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST "http://localhost:3000/api/v1/response/submit" \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:5173" \
        -d "{
            \"project_id\": \"$project_id\",
            \"user_id\": \"$user_id\",
            \"score\": $score,
            \"time_taken\": $time_taken,
            \"answers\": [
                {
                    \"question_id\": \"test-question-1\",
                    \"choice_id\": \"test-choice-1\"
                },
                {
                    \"question_id\": \"test-question-2\",
                    \"choice_id\": \"test-choice-2\"
                }
            ]
        }")
    
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -eq 201 ]; then
        echo -e "${GREEN}✓ Created response successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create response - Status: $http_status${NC}"
        echo "Response: $body"
    fi
}

# Create test data with different scores and times
# This will help verify the sorting logic

# Project 1 responses
create_test_response "project-1" "user-1" 95 1200  # High score, fast time
create_test_response "project-1" "user-2" 95 1500  # High score, slower time
create_test_response "project-1" "user-3" 88 1100  # Medium score, fast time
create_test_response "project-1" "user-4" 88 1800  # Medium score, slow time
create_test_response "project-1" "user-5" 75 900   # Lower score, very fast time

# Project 2 responses
create_test_response "project-2" "user-1" 92 1300
create_test_response "project-2" "user-2" 92 1400
create_test_response "project-2" "user-3" 85 1000
create_test_response "project-2" "user-4" 85 1600

# User 1 responses across different projects
create_test_response "project-3" "user-1" 98 800   # Best performance
create_test_response "project-4" "user-1" 90 1200
create_test_response "project-5" "user-1" 82 1500

# User 2 responses across different projects
create_test_response "project-3" "user-2" 96 1100
create_test_response "project-4" "user-2" 88 1300
create_test_response "project-5" "user-2" 80 1400

echo -e "\n${GREEN}Test response data creation completed!${NC}"
echo -e "\n${YELLOW}Expected sorting order for project-1:${NC}"
echo "1. user-1: 95 points, 1200ms (highest score, fastest time)"
echo "2. user-2: 95 points, 1500ms (highest score, slower time)"
echo "3. user-3: 88 points, 1100ms (medium score, fast time)"
echo "4. user-4: 88 points, 1800ms (medium score, slow time)"
echo "5. user-5: 75 points, 900ms (lower score, very fast time)"

echo -e "\n${YELLOW}You can now test the sorted response APIs:${NC}"
echo "curl -X GET 'http://localhost:3000/api/v1/response/project/project-1/sorted/score'"
echo "curl -X GET 'http://localhost:3000/api/v1/response/user/user-1/sorted/score'"
echo "curl -X GET 'http://localhost:3000/api/v1/response/sorted/score'" 