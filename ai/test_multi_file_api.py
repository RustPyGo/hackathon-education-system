#!/usr/bin/env python3
"""
🧪 Test script cho Multi-File Question Generator API
Test các tính năng multi-file, caching và error handling
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"

def print_header(text: str):
    """In header đẹp"""
    print(f"\n{'='*60}")
    print(f"🧪 {text}")
    print('='*60)

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
    """Test health check với cache info"""
    print_header("Test Health Check - Multi-File Support")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Health check passed")
            print_info(f"Status: {data.get('status')}")
            print_info(f"Multi-file support: {data.get('features', {}).get('multi_file_support')}")
            print_info(f"Cache system: {data.get('checks', {}).get('cache_system')}")
            print_info(f"Cache files: {data.get('cache_statistics', {}).get('content_files')} content, {data.get('cache_statistics', {}).get('embedding_files')} embeddings")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False

def test_multi_file_sync():
    """Test multi-file sync generation"""
    print_header("Test Multi-File Sync Generation")
    
    try:
        # Multi-file request
        payload = {
            "files": [
                {
                    "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf",
                    "file_name": "document1.pdf"
                },
                {
                    "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "file_name": "document2.pdf"
                }
            ],
            "project_id": "test-project-123",
            "total_questions": 8,
            "name": "Multi-File Test"
        }
        
        print_info(f"Submitting multi-file request: {len(payload['files'])} files, {payload['total_questions']} questions")
        
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions-sync",
            json=payload,
            timeout=300  # 5 minutes
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Multi-file sync completed")
            
            # Validate response format
            print_info(f"Overview length: {len(data.get('overview', ''))}")
            print_info(f"Questions count: {len(data.get('quiz', []))}")
            
            # Check metadata
            metadata = data.get('metadata', {})
            print_info(f"Files processed: {metadata.get('files_processed', [])}")
            print_info(f"Cached files: {metadata.get('cached_files', [])}")
            print_info(f"New files: {metadata.get('new_files', [])}")
            print_info(f"Failed files: {metadata.get('failed_files', [])}")
            print_info(f"Questions per file: {metadata.get('questions_per_file', {})}")
            print_info(f"Processing time: {metadata.get('processing_time')}")
            print_info(f"Cache usage: {metadata.get('cache_usage')}")
            
            # Print sample question
            if data.get('quiz'):
                sample_q = data['quiz'][0]
                print_info("Sample question:")
                print(f"   Q: {sample_q.get('question', '')[:100]}...")
                print(f"   Type: {sample_q.get('type')}")
                print(f"   Options: {len(sample_q.get('options', []))}")
                print(f"   Correct: {sample_q.get('correct_answer')}")
            
            return True
        else:
            print_error(f"Multi-file sync failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Multi-file sync error: {str(e)}")
        return False

def test_cache_info():
    """Test cache information endpoint"""
    print_header("Test Cache Information")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/cache/info", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Cache info retrieved")
            print_info(f"Cache directory: {data.get('cache_directory')}")
            print_info(f"Content files: {data.get('content_cache', {}).get('count')}")
            print_info(f"Embedding files: {data.get('embeddings_cache', {}).get('count')}")
            print_info(f"Total size: {data.get('total_size_mb', 0):.2f} MB")
            return True
        else:
            print_error(f"Cache info failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Cache info error: {str(e)}")
        return False

def test_multi_file_async():
    """Test multi-file async generation"""
    print_header("Test Multi-File Async Generation")
    
    try:
        # Multi-file async request
        payload = {
            "files": [
                {
                    "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf",
                    "file_name": "async_doc1.pdf"
                },
                {
                    "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "file_name": "async_doc2.pdf"
                }
            ],
            "project_id": "async-test-456",
            "total_questions": 20,
            "name": "Async Multi-File Test"
        }
        
        print_info("Submitting async multi-file request...")
        
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            task_id = data.get("task_id")
            
            print_success(f"Async task submitted: {task_id}")
            print_info(f"Files count: {data.get('files_count')}")
            print_info(f"Estimated time: {data.get('estimated_time')}")
            
            # Poll for completion
            print_info("Polling for completion...")
            max_attempts = 40  # 10 minutes
            
            for attempt in range(max_attempts):
                time.sleep(15)  # Check every 15 seconds
                
                status_response = requests.get(
                    f"{API_BASE_URL}/api/task-status/{task_id}",
                    timeout=10
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    current_status = status_data.get("status")
                    progress = status_data.get("progress", 0)
                    
                    print_info(f"Attempt {attempt + 1}: Status = {current_status}, Progress = {progress}%")
                    
                    if current_status == "completed":
                        print_success("Async task completed!")
                        
                        # Get result
                        result_response = requests.get(
                            f"{API_BASE_URL}/api/task-result/{task_id}",
                            timeout=10
                        )
                        
                        if result_response.status_code == 200:
                            result_data = result_response.json()
                            print_success("Async result retrieved")
                            print_info(f"Questions generated: {len(result_data.get('quiz', []))}")
                            print_info(f"Files processed: {result_data.get('metadata', {}).get('files_processed', [])}")
                            return True
                        else:
                            print_error(f"Failed to get async result: {result_response.status_code}")
                            return False
                            
                    elif current_status == "failed":
                        error_msg = status_data.get("message", "Unknown error")
                        print_error(f"Async task failed: {error_msg}")
                        return False
            
            print_error("Async task did not complete within timeout")
            return False
        else:
            print_error(f"Async request failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Async test error: {str(e)}")
        return False

def test_error_handling():
    """Test error handling với invalid files"""
    print_header("Test Error Handling")
    
    try:
        # Request với mixed valid/invalid files
        payload = {
            "files": [
                {
                    "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf",
                    "file_name": "valid_doc.pdf"
                },
                {
                    "url": "https://invalid-url-that-does-not-exist.com/fake.pdf",
                    "file_name": "invalid_doc.pdf"
                }
            ],
            "project_id": "error-test-789",
            "total_questions": 6,
            "name": "Error Handling Test"
        }
        
        print_info("Testing with mixed valid/invalid files...")
        
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions-sync",
            json=payload,
            timeout=180
        )
        
        if response.status_code == 200:
            data = response.json()
            metadata = data.get('metadata', {})
            
            print_success("Error handling test completed")
            print_info(f"Successful files: {metadata.get('files_processed', [])}")
            print_info(f"Failed files: {metadata.get('failed_files', [])}")
            print_info(f"Questions generated: {len(data.get('quiz', []))}")
            
            # Should have some failed files
            if metadata.get('failed_files'):
                print_success("✓ Error handling working - failed files reported")
            else:
                print_error("✗ Error handling issue - no failed files reported")
            
            return True
        else:
            print_error(f"Error handling test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error handling test error: {str(e)}")
        return False

def run_all_tests():
    """Chạy tất cả multi-file tests"""
    print_header("Multi-File Question Generator API Tests")
    
    tests = [
        ("Health Check", test_health_check),
        ("Cache Info", test_cache_info),
        ("Multi-File Sync", test_multi_file_sync),
        ("Error Handling", test_error_handling),
        ("Multi-File Async", test_multi_file_async),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            print_info(f"Starting {test_name}...")
            result = test_func()
            results.append((test_name, result))
            
            if result:
                print_success(f"{test_name} completed successfully")
            else:
                print_error(f"{test_name} failed")
                
        except KeyboardInterrupt:
            print_error("Tests interrupted by user")
            break
        except Exception as e:
            print_error(f"Test {test_name} crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print_header("Multi-File Test Results Summary")
    
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
        print_success("🎉 All multi-file tests passed!")
        return True
    else:
        print_error(f"💔 {total - passed} tests failed")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "health":
            test_health_check()
        elif sys.argv[1] == "sync":
            test_multi_file_sync()
        elif sys.argv[1] == "async":
            test_multi_file_async()
        elif sys.argv[1] == "cache":
            test_cache_info()
        elif sys.argv[1] == "error":
            test_error_handling()
        else:
            print("Usage: python test_multi_file_api.py [health|sync|async|cache|error]")
    else:
        success = run_all_tests()
        sys.exit(0 if success else 1)
