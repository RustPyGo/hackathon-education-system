#!/usr/bin/env python3
"""
Test script cho chat API mới với multi-file và history support
Kiểm tra API /api/chat với request format mới
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
CHAT_ENDPOINT = f"{BASE_URL}/api/chat"

def test_chat_multifile_basic():
    """Test basic chat với multiple files"""
    print("=== Test Chat Multi-File Basic ===")
    
    # Chuẩn bị data
    request_data = {
        "data": {
            "files": [
                {
                    "file_name": "document1.pdf",
                    "file_url": "https://example.com/doc1.pdf"
                },
                {
                    "file_name": "document2.pdf", 
                    "file_url": "https://example.com/doc2.pdf"
                }
            ],
            "history_chat": [],
            "message": "Tóm tắt nội dung chính của các tài liệu này"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

def test_chat_with_history():
    """Test chat với history"""
    print("\n=== Test Chat With History ===")
    
    # Chuẩn bị data với history
    request_data = {
        "data": {
            "files": [
                {
                    "file_name": "document1.pdf",
                    "file_url": "https://example.com/doc1.pdf"
                }
            ],
            "history_chat": [
                {
                    "message": "Chào bạn, tôi muốn tìm hiểu về tài liệu này",
                    "sender": "user"
                },
                {
                    "message": "Xin chào! Tôi sẽ giúp bạn tìm hiểu về tài liệu. Bạn có câu hỏi gì cụ thể không?",
                    "sender": "assistant"
                }
            ],
            "message": "Dựa vào cuộc trò chuyện trước, bạn có thể giải thích chi tiết hơn về phần đầu của tài liệu không?"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

def test_chat_validation_errors():
    """Test validation errors"""
    print("\n=== Test Validation Errors ===")
    
    # Test 1: Không có files
    print("Test 1: Không có files")
    request_data = {
        "data": {
            "files": [],
            "history_chat": [],
            "message": "Test message"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Quá nhiều files
    print("\nTest 2: Quá nhiều files (> 5)")
    request_data = {
        "data": {
            "files": [
                {"file_name": f"doc{i}.pdf", "file_url": f"https://example.com/doc{i}.pdf"}
                for i in range(1, 7)  # 6 files
            ],
            "history_chat": [],
            "message": "Test message"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Quá nhiều history messages
    print("\nTest 3: Quá nhiều history messages (> 20)")
    request_data = {
        "data": {
            "files": [
                {"file_name": "doc1.pdf", "file_url": "https://example.com/doc1.pdf"}
            ],
            "history_chat": [
                {"message": f"Message {i}", "sender": "user" if i % 2 == 0 else "assistant"}
                for i in range(1, 22)  # 21 messages
            ],
            "message": "Test message"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_chat_with_cached_content():
    """Test chat với cached content từ question generation"""
    print("\n=== Test Chat With Cached Content ===")
    
    # Sử dụng file đã được cache từ question generation trước đó
    request_data = {
        "data": {
            "files": [
                {
                    "file_name": "sample_document.pdf",  # File đã cache từ test trước
                    "file_url": "https://example.com/sample.pdf"
                }
            ],
            "history_chat": [],
            "message": "Nội dung chính của tài liệu này là gì?"
        }
    }
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=request_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

def test_health_endpoint():
    """Test health endpoint để đảm bảo server running"""
    print("=== Test Health Endpoint ===")
    
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"Health Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print("❌ Server health check failed")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False

def main():
    """Chạy tất cả tests"""
    print("🚀 Starting Chat API Multi-File Tests")
    print("="*50)
    
    # Kiểm tra server trước
    if not test_health_endpoint():
        print("\nServer không chạy. Vui lòng start server trước:")
        print("python server.py")
        return
    
    print("\n" + "="*50)
    
    # Chạy các tests
    test_chat_multifile_basic()
    
    time.sleep(1)
    test_chat_with_history()
    
    time.sleep(1)
    test_chat_validation_errors()
    
    time.sleep(1)
    test_chat_with_cached_content()
    
    print("\n" + "="*50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    main()
