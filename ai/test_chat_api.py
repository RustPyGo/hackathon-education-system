#!/usr/bin/env python3
"""
🧪 Test Chat API
Test chat functionality với cached documents
"""

import requests
import json
import time

# Cấu hình
API_BASE = "http://localhost:8000"
CHAT_ENDPOINT = f"{API_BASE}/api/chat"
HEALTH_ENDPOINT = f"{API_BASE}/api/health"

def test_chat_api():
    """Test chat API với cached document"""
    print("🧪 Testing Chat API...")
    
    # Test 1: Health check
    print("\n1️⃣ Testing health endpoint...")
    try:
        response = requests.get(HEALTH_ENDPOINT)
        if response.status_code == 200:
            print("✅ Server is healthy")
        else:
            print(f"❌ Server health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return
    
    # Test 2: Chat với document
    print("\n2️⃣ Testing chat with document...")
    
    # Test data - giả sử có file đã được cache
    test_requests = [
        {
            "data": {
                "file_name": "biology-chapter1.pdf",
                "message": "What is photosynthesis?"
            }
        },
        {
            "data": {
                "file_name": "biology-chapter1.pdf", 
                "message": "Explain the process of cellular respiration"
            }
        },
        {
            "data": {
                "file_name": "nonexistent-file.pdf",
                "message": "This should fail gracefully"
            }
        }
    ]
    
    for i, test_request in enumerate(test_requests, 1):
        print(f"\n📝 Test Chat {i}:")
        print(f"File: {test_request['data']['file_name']}")
        print(f"Message: {test_request['data']['message']}")
        
        try:
            response = requests.post(
                CHAT_ENDPOINT,
                json=test_request,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Response: {result['data']['message'][:100]}...")
            else:
                print(f"❌ Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Request failed: {e}")
    
    # Test 3: Invalid requests
    print("\n3️⃣ Testing invalid requests...")
    
    invalid_requests = [
        {"data": {"file_name": "", "message": "test"}},  # Empty file_name
        {"data": {"file_name": "test.pdf", "message": ""}},  # Empty message
        {"data": {"file_name": "test.pdf"}},  # Missing message
        {"invalid": "format"}  # Wrong format
    ]
    
    for i, invalid_request in enumerate(invalid_requests, 1):
        print(f"\n❌ Invalid Test {i}:")
        try:
            response = requests.post(
                CHAT_ENDPOINT,
                json=invalid_request,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            print(f"Status: {response.status_code}")
            if response.status_code != 200:
                print(f"✅ Correctly rejected: {response.status_code}")
            else:
                print(f"⚠️ Unexpected success: {response.json()}")
        except Exception as e:
            print(f"❌ Request error: {e}")

def test_with_real_cached_file():
    """Test với file thực sự đã được cache"""
    print("\n🎯 Testing with potentially cached files...")
    
    # Kiểm tra cache info trước
    try:
        response = requests.get(f"{API_BASE}/api/cache/info")
        if response.status_code == 200:
            cache_info = response.json()
            print(f"📦 Cache info: {json.dumps(cache_info, indent=2)}")
            
            # Nếu có cached files, test với file đó
            if cache_info.get("cached_files"):
                for cached_file in cache_info["cached_files"][:2]:  # Test 2 files đầu
                    file_name = cached_file.get("file_name", "unknown")
                    print(f"\n💬 Testing chat with cached file: {file_name}")
                    
                    test_request = {
                        "data": {
                            "file_name": file_name,
                            "message": "Can you summarize the main concepts in this document?"
                        }
                    }
                    
                    response = requests.post(
                        CHAT_ENDPOINT,
                        json=test_request,
                        headers={"Content-Type": "application/json"},
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Chat response: {result['data']['message'][:200]}...")
                    else:
                        print(f"❌ Chat failed: {response.status_code} - {response.text}")
            else:
                print("ℹ️ No cached files found. Upload some files first via /api/generate-questions-sync")
        
    except Exception as e:
        print(f"❌ Cache info check failed: {e}")

if __name__ == "__main__":
    print("🚀 Chat API Test Suite")
    print("=" * 50)
    
    test_chat_api()
    test_with_real_cached_file()
    
    print("\n✅ Test completed!")
    print("\n💡 To use chat API:")
    print("1. First upload documents via /api/generate-questions-sync")
    print("2. Then use /api/chat with the file_name from step 1")
    print("3. The system will use cached content for responses")
