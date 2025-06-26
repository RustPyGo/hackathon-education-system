#!/bin/bash

# Test API endpoints
BASE_URL="http://localhost:3000/api/v1"

echo "🧪 Testing Education System API"
echo "=================================="

# Test 1: Register User
echo "📝 Test 1: Register User"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Test 2: Login User
echo "🔐 Test 2: Login User"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 3: Get Profile (assuming user ID is 1)
echo "👤 Test 3: Get User Profile"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/user/profile?user_id=1")

echo "Response: $PROFILE_RESPONSE"
echo ""

echo "✅ API Tests completed!" 