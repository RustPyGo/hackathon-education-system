#!/usr/bin/env python3
"""
🧪 Test script cho AI Education Question Generator API
Kiểm tra các endpoints và functionality
"""

import requests
import json
import time
import sys
from typing import Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"
TEST_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"  # Sample PDF

def print_header(text: str):
    """In header đẹp"""
    print(f"\n{'='*50}")
    print(f"🧪 {text}")
    print('='*50)

def print_success(text: str):
    """In thông báo thành công"""
    print(f"✅ {text}")

def print_error(text: str):
    """In thông báo lỗi"""
    print(f"❌ {text}")

def print_info(text: str):
    """In thông tin"""
    print(f"ℹ️  {text}")

def test_health_check():
    """Test health check endpoint"""
    print_header("Test Health Check")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Health check passed")
            print_info(f"Status: {data.get('status')}")
            print_info(f"Active tasks: {data.get('active_tasks')}")
            print_info(f"Completed tasks: {data.get('completed_tasks')}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False

def test_root_endpoint():
    """Test root endpoint"""
    print_header("Test Root Endpoint")
    
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Root endpoint OK")
            print_info(f"API: {data.get('message')}")
            print_info(f"Version: {data.get('version')}")
            return True
        else:
            print_error(f"Root endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Root endpoint error: {str(e)}")
        return False

def test_async_question_generation():
    """Test async question generation"""
    print_header("Test Async Question Generation")
    
    try:
        # Submit request
        payload = {
            "s3_url": TEST_PDF_URL,
            "total_question": 5
        }
        
        print_info(f"Submitting request with {payload['total_question']} questions...")
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions",
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            print_error(f"Request failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
        
        data = response.json()
        task_id = data.get("task_id")
        
        if not task_id:
            print_error("No task_id returned")
            return False
        
        print_success(f"Task submitted: {task_id}")
        print_info(f"Status: {data.get('status')}")
        print_info(f"Estimated time: {data.get('estimated_time')}")
        
        # Poll for completion
        print_info("Polling for completion...")
        max_attempts = 60  # 5 minutes
        
        for attempt in range(max_attempts):
            time.sleep(5)
            
            status_response = requests.get(
                f"{API_BASE_URL}/api/task-status/{task_id}",
                timeout=10
            )
            
            if status_response.status_code != 200:
                print_error(f"Status check failed: {status_response.status_code}")
                continue
            
            status_data = status_response.json()
            current_status = status_data.get("status")
            
            print_info(f"Attempt {attempt + 1}: Status = {current_status}")
            
            if current_status == "completed":
                print_success("Task completed!")
                
                # Get result
                result_response = requests.get(
                    f"{API_BASE_URL}/api/task-result/{task_id}",
                    timeout=10
                )
                
                if result_response.status_code == 200:
                    result_data = result_response.json()
                    print_success("Result retrieved successfully")
                    print_info(f"Overview length: {len(result_data.get('overview', ''))}")
                    print_info(f"Questions count: {len(result_data.get('quiz', []))}")
                    
                    # Print first question as sample
                    if result_data.get('quiz'):
                        first_q = result_data['quiz'][0]
                        print_info("Sample question:")
                        print(f"   Q: {first_q.get('question', '')[:100]}...")
                        print(f"   Options: {len(first_q.get('options', []))}")
                        print(f"   Correct: {first_q.get('correct_answer')}")
                    
                    return True
                else:
                    print_error(f"Failed to get result: {result_response.status_code}")
                    return False
                    
            elif current_status == "failed":
                error_msg = status_data.get("error", "Unknown error")
                print_error(f"Task failed: {error_msg}")
                return False
        
        print_error("Task did not complete within timeout")
        return False
        
    except Exception as e:
        print_error(f"Async test error: {str(e)}")
        return False

def test_sync_question_generation():
    """Test sync question generation (smaller request)"""
    print_header("Test Sync Question Generation")
    
    try:
        payload = {
            "s3_url": TEST_PDF_URL,
            "total_question": 3
        }
        
        print_info(f"Submitting sync request with {payload['total_question']} questions...")
        
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions-sync",
            json=payload,
            timeout=120  # 2 minutes for sync
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Sync request completed")
            print_info(f"Overview length: {len(data.get('overview', ''))}")
            print_info(f"Questions count: {len(data.get('quiz', []))}")
            
            # Validate format
            quiz = data.get('quiz', [])
            if quiz:
                sample_q = quiz[0]
                required_fields = ['question', 'type', 'hint', 'correct_answer', 'options']
                
                for field in required_fields:
                    if field not in sample_q:
                        print_error(f"Missing field: {field}")
                        return False
                
                options = sample_q.get('options', [])
                if len(options) != 4:
                    print_error(f"Expected 4 options, got {len(options)}")
                    return False
                
                for option in options:
                    if 'answer' not in option or 'reason' not in option:
                        print_error("Option missing answer or reason")
                        return False
                
                print_success("Format validation passed")
                
            return True
        else:
            print_error(f"Sync request failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Sync test error: {str(e)}")
        return False

def test_invalid_requests():
    """Test invalid requests"""
    print_header("Test Invalid Requests")
    
    tests = [
        {
            "name": "Empty S3 URL",
            "payload": {"s3_url": "", "total_question": 5},
            "expected_status": 400
        },
        {
            "name": "Invalid question count (too high)",
            "payload": {"s3_url": TEST_PDF_URL, "total_question": 300},
            "expected_status": 400
        },
        {
            "name": "Invalid question count (too low)",
            "payload": {"s3_url": TEST_PDF_URL, "total_question": 0},
            "expected_status": 400
        },
        {
            "name": "Missing fields",
            "payload": {"s3_url": TEST_PDF_URL},
            "expected_status": 422
        }
    ]
    
    success_count = 0
    
    for test in tests:
        try:
            print_info(f"Testing: {test['name']}")
            
            response = requests.post(
                f"{API_BASE_URL}/api/generate-questions",
                json=test["payload"],
                timeout=10
            )
            
            if response.status_code == test["expected_status"]:
                print_success(f"✓ {test['name']} - correctly rejected")
                success_count += 1
            else:
                print_error(f"✗ {test['name']} - expected {test['expected_status']}, got {response.status_code}")
                
        except Exception as e:
            print_error(f"✗ {test['name']} - error: {str(e)}")
    
    print_info(f"Invalid request tests: {success_count}/{len(tests)} passed")
    return success_count == len(tests)

def run_all_tests():
    """Chạy tất cả tests"""
    print_header("AI Education Question Generator API Tests")
    
    tests = [
        ("Health Check", test_health_check),
        ("Root Endpoint", test_root_endpoint),
        ("Invalid Requests", test_invalid_requests),
        ("Sync Question Generation", test_sync_question_generation),
        ("Async Question Generation", test_async_question_generation),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except KeyboardInterrupt:
            print_error("Tests interrupted by user")
            break
        except Exception as e:
            print_error(f"Test {test_name} crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print_header("Test Results Summary")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        emoji = "✅" if result else "❌"
        print(f"{emoji} {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print_success("🎉 All tests passed!")
        return True
    else:
        print_error(f"💔 {total - passed} tests failed")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "health":
            test_health_check()
        elif sys.argv[1] == "sync":
            test_sync_question_generation()
        elif sys.argv[1] == "async":
            test_async_question_generation()
        elif sys.argv[1] == "invalid":
            test_invalid_requests()
        else:
            print("Usage: python test_api.py [health|sync|async|invalid]")
    else:
        success = run_all_tests()
        sys.exit(0 if success else 1)
