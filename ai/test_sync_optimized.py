#!/usr/bin/env python3
"""
🧪 Test Script cho AI Question Generator - SYNC OPTIMIZED
Test tốc độ và khả năng xử lý 300 câu hỏi/lần
Author: AI Assistant
Created: 2025-06-29
"""

import requests
import json
import time
from datetime import datetime

# Cấu hình
API_BASE_URL = "http://localhost:8000"
TEST_FILES = [
    {
        "url": "https://example.com/sample1.pdf",  # Thay bằng URL thật
        "file_name": "document1.pdf"
    },
    {
        "url": "https://example.com/sample2.pdf",  # Thay bằng URL thật
        "file_name": "document2.pdf"
    },
    {
        "url": "https://example.com/sample3.pdf",  # Thay bằng URL thật
        "file_name": "document3.pdf"
    }
]

def test_health_check():
    """Test health endpoint"""
    print("🩺 Testing health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed")
            print(f"   Service: {data.get('service')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Mode: {data.get('mode')}")
            print(f"   Max Questions: {data.get('max_questions')}")
            print(f"   Max Files: {data.get('max_files')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_cache_info():
    """Test cache info"""
    print("\n💾 Testing cache info...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/cache/info")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cache info retrieved")
            print(f"   Total files: {data.get('total_files', 0)}")
            print(f"   Total size: {data.get('total_size_mb', 0)} MB")
            print(f"   Memory entries: {data.get('memory_cache_entries', 0)}")
            return True
        else:
            print(f"❌ Cache info failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cache info error: {str(e)}")
        return False

def test_small_batch(num_questions=50):
    """Test với số lượng câu hỏi nhỏ"""
    print(f"\n🎯 Testing small batch: {num_questions} questions...")
    
    request_data = {
        "files": TEST_FILES[:2],  # Chỉ dùng 2 files
        "project_id": "test_small_batch",
        "total_questions": num_questions,
        "name": f"Test Small Batch {num_questions}Q"
    }
    
    return run_test_request(request_data, f"Small Batch ({num_questions}Q)")

def test_medium_batch(num_questions=150):
    """Test với số lượng câu hỏi trung bình"""
    print(f"\n🎯 Testing medium batch: {num_questions} questions...")
    
    request_data = {
        "files": TEST_FILES,  # Dùng tất cả files
        "project_id": "test_medium_batch",
        "total_questions": num_questions,
        "name": f"Test Medium Batch {num_questions}Q"
    }
    
    return run_test_request(request_data, f"Medium Batch ({num_questions}Q)")

def test_large_batch(num_questions=300):
    """Test với số lượng câu hỏi lớn (300 câu)"""
    print(f"\n🎯 Testing LARGE batch: {num_questions} questions...")
    
    request_data = {
        "files": TEST_FILES * 2,  # Nhân đôi files để có nhiều nguồn
        "project_id": "test_large_batch",
        "total_questions": num_questions,
        "name": f"Test Large Batch {num_questions}Q"
    }
    
    return run_test_request(request_data, f"Large Batch ({num_questions}Q)")

def run_test_request(request_data, test_name):
    """Chạy test request và đo thời gian"""
    print(f"📤 Sending request: {test_name}")
    print(f"   Files: {len(request_data['files'])}")
    print(f"   Questions: {request_data['total_questions']}")
    
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/generate-questions-sync",
            json=request_data,
            timeout=600  # 10 phút timeout
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        if response.status_code == 200:
            data = response.json()
            metadata = data.get('metadata', {})
            
            print(f"✅ {test_name} SUCCESSFUL")
            print(f"   ⏱️  Processing time: {processing_time:.2f}s")
            print(f"   📊 Questions generated: {metadata.get('total_questions', 0)}")
            print(f"   📁 Files processed: {len(metadata.get('files_processed', []))}")
            print(f"   💾 Cache hits: {len(metadata.get('cached_files', []))}")
            print(f"   🆕 New files: {len(metadata.get('new_files', []))}")
            print(f"   ❌ Failed files: {len(metadata.get('failed_files', []))}")
            print(f"   🏆 Cache usage: {metadata.get('cache_usage', 'N/A')}")
            
            # Tính toán hiệu suất
            questions_per_second = metadata.get('total_questions', 0) / processing_time
            print(f"   ⚡ Performance: {questions_per_second:.2f} questions/second")
            
            return {
                "success": True,
                "processing_time": processing_time,
                "questions_generated": metadata.get('total_questions', 0),
                "questions_per_second": questions_per_second,
                "cache_hits": len(metadata.get('cached_files', [])),
                "failed_files": len(metadata.get('failed_files', []))
            }
        else:
            print(f"❌ {test_name} FAILED")
            print(f"   Status: {response.status_code}")
            print(f"   Error: {response.text}")
            return {"success": False, "error": response.text}
            
    except requests.exceptions.Timeout:
        end_time = time.time()
        processing_time = end_time - start_time
        print(f"⏰ {test_name} TIMEOUT after {processing_time:.2f}s")
        return {"success": False, "error": "timeout"}
        
    except Exception as e:
        end_time = time.time()
        processing_time = end_time - start_time
        print(f"❌ {test_name} ERROR: {str(e)}")
        return {"success": False, "error": str(e)}

def test_cache_performance():
    """Test hiệu suất cache bằng cách chạy lại request"""
    print("\n🔄 Testing cache performance...")
    
    # Chạy lần đầu (tạo cache)
    print("📝 First run (creating cache)...")
    first_result = test_small_batch(30)
    
    if not first_result.get("success"):
        print("❌ Cannot test cache - first run failed")
        return
    
    # Chạy lần thứ hai (sử dụng cache)
    print("\n🚀 Second run (using cache)...")
    second_result = test_small_batch(30)
    
    if second_result.get("success"):
        first_time = first_result.get("processing_time", 0)
        second_time = second_result.get("processing_time", 0)
        
        if second_time > 0:
            speedup = first_time / second_time
            print(f"\n📈 Cache Performance Analysis:")
            print(f"   First run: {first_time:.2f}s")
            print(f"   Second run: {second_time:.2f}s")
            print(f"   Speedup: {speedup:.2f}x faster")
            print(f"   Cache hits: {second_result.get('cache_hits', 0)}")

def clear_cache_and_test():
    """Xóa cache và test"""
    print("\n🗑️ Clearing cache...")
    try:
        response = requests.delete(f"{API_BASE_URL}/api/cache/clear")
        if response.status_code == 200:
            print("✅ Cache cleared successfully")
        else:
            print(f"⚠️ Cache clear failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Cache clear error: {str(e)}")

def run_performance_suite():
    """Chạy bộ test hiệu suất đầy đủ"""
    print("🚀 RUNNING PERFORMANCE TEST SUITE")
    print("=" * 50)
    
    results = {}
    
    # Health check
    if not test_health_check():
        print("❌ Health check failed - aborting tests")
        return
    
    # Cache info
    test_cache_info()
    
    # Clear cache để test từ đầu
    clear_cache_and_test()
    
    # Test small batch
    results["small"] = test_small_batch(50)
    
    # Test medium batch
    results["medium"] = test_medium_batch(150)
    
    # Test large batch (mục tiêu 300 câu)
    results["large"] = test_large_batch(300)
    
    # Test cache performance
    test_cache_performance()
    
    # Tổng kết
    print("\n" + "=" * 50)
    print("📊 PERFORMANCE SUMMARY")
    print("=" * 50)
    
    for test_name, result in results.items():
        if result.get("success"):
            time_taken = result.get("processing_time", 0)
            questions = result.get("questions_generated", 0)
            qps = result.get("questions_per_second", 0)
            print(f"✅ {test_name.upper()}: {questions}Q in {time_taken:.2f}s ({qps:.2f} Q/s)")
        else:
            print(f"❌ {test_name.upper()}: FAILED - {result.get('error', 'Unknown error')}")
    
    # Đánh giá tổng thể
    large_result = results.get("large", {})
    if large_result.get("success"):
        target_time = 300  # Mục tiêu: tối đa 5 phút cho 300 câu
        actual_time = large_result.get("processing_time", 0)
        
        if actual_time <= target_time:
            print(f"\n🎉 PERFORMANCE TARGET MET!")
            print(f"   Target: ≤{target_time}s for 300 questions")
            print(f"   Actual: {actual_time:.2f}s")
            print(f"   Status: PASS ✅")
        else:
            print(f"\n⚠️ PERFORMANCE TARGET MISSED")
            print(f"   Target: ≤{target_time}s for 300 questions")
            print(f"   Actual: {actual_time:.2f}s")
            print(f"   Status: NEEDS OPTIMIZATION ⚡")
    
    print("\n🏁 Test suite completed!")

if __name__ == "__main__":
    print("🧪 AI Question Generator - SYNC OPTIMIZED Performance Tests")
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("📝 NOTE: Update TEST_FILES with real PDF URLs before running")
    print()
    
    # Uncomment dòng dưới để chạy full test suite
    # run_performance_suite()
    
    # Chạy từng test riêng lẻ để debug
    if test_health_check():
        print("\n✅ Server is ready for testing!")
        print("🔧 Update TEST_FILES URLs and uncomment run_performance_suite() to start")
    else:
        print("\n❌ Server not ready - check if server is running on port 8000")
