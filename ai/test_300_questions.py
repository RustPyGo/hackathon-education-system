#!/usr/bin/env python3
"""
🧪 Test 300 Questions - Performance Test
Test khả năng tạo 300 câu hỏi của hệ thống
"""

import requests
import json
import time
from datetime import datetime

# Cấu hình
API_URL = "http://localhost:8000/api/generate-questions-sync"
HEALTH_URL = "http://localhost:8000/api/health"

def test_health():
    """Kiểm tra server trước khi test"""
    try:
        response = requests.get(HEALTH_URL, timeout=10)
        if response.status_code == 200:
            print("✅ Server healthy")
            return True
        else:
            print(f"❌ Server unhealthy: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False

def test_300_questions():
    """Test tạo 300 câu hỏi"""
    print("🎯 TESTING 300 QUESTIONS")
    print("=" * 50)
    
    # Request data
    request_data = {
        "files": [
            {
                "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf",
                "file_name": "test_300_questions.pdf"
            }
        ],
        "project_id": "test-300-questions",
        "total_questions": 300,
        "name": "Performance Test 300 Questions"
    }
    
    print(f"📝 Request: {request_data['total_questions']} questions")
    print(f"📁 Files: {len(request_data['files'])}")
    print(f"🕐 Started at: {datetime.now().strftime('%H:%M:%S')}")
    
    start_time = time.time()
    
    try:
        # Send request
        response = requests.post(
            API_URL,
            json=request_data,
            timeout=600  # 10 minutes timeout
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        print(f"⏱️  Total time: {processing_time:.1f}s ({processing_time/60:.1f} minutes)")
        
        if response.status_code == 200:
            data = response.json()
            
            # Analyze response
            quiz = data.get('quiz', [])
            metadata = data.get('metadata', {})
            
            print("\n📊 RESULTS:")
            print(f"✅ Status: SUCCESS")
            print(f"📊 Questions received: {len(quiz)}")
            print(f"🎯 Target: 300")
            print(f"📈 Success rate: {len(quiz)/300*100:.1f}%")
            print(f"⚡ Speed: {len(quiz)/processing_time:.2f} questions/second")
            
            # Performance analysis
            print(f"\n🏆 PERFORMANCE ANALYSIS:")
            if processing_time <= 300:  # 5 minutes
                print(f"🚀 EXCELLENT: Under 5 minutes")
            elif processing_time <= 600:  # 10 minutes
                print(f"✅ GOOD: Under 10 minutes")
            else:
                print(f"⚠️ SLOW: Over 10 minutes")
            
            # Quality check
            print(f"\n🔍 QUALITY CHECK:")
            sample_questions = quiz[:3]  # Check first 3 questions
            for i, q in enumerate(sample_questions):
                print(f"Question {i+1}: {q.get('question', 'N/A')[:50]}...")
                print(f"  Options: {len(q.get('options', []))}")
                print(f"  Correct: {q.get('correct_answer', 'N/A')}")
            
            # Metadata
            print(f"\n📋 METADATA:")
            for key, value in metadata.items():
                print(f"  {key}: {value}")
            
            return True
            
        else:
            print(f"\n❌ FAILED:")
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        end_time = time.time()
        processing_time = end_time - start_time
        print(f"\n⏰ TIMEOUT after {processing_time:.1f}s")
        print("💡 Server might need more time for 300 questions")
        return False
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return False

def test_smaller_batches():
    """Test với số lượng nhỏ hơn để so sánh"""
    print("\n🔄 TESTING SMALLER BATCHES FOR COMPARISON")
    print("-" * 50)
    
    test_cases = [
        {"questions": 10, "name": "Small"},
        {"questions": 50, "name": "Medium"},
        {"questions": 100, "name": "Large"}
    ]
    
    results = []
    
    for test_case in test_cases:
        num_q = test_case["questions"]
        name = test_case["name"]
        
        print(f"\n📝 Testing {name} ({num_q} questions)...")
        
        request_data = {
            "files": [
                {
                    "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf",
                    "file_name": f"test_{num_q}.pdf"
                }
            ],
            "project_id": f"test-{num_q}",
            "total_questions": num_q,
            "name": f"Test {num_q} Questions"
        }
        
        start_time = time.time()
        
        try:
            response = requests.post(API_URL, json=request_data, timeout=120)
            
            end_time = time.time()
            processing_time = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                questions_received = len(data.get('quiz', []))
                qps = questions_received / processing_time
                
                result = {
                    "name": name,
                    "target": num_q,
                    "received": questions_received,
                    "time": processing_time,
                    "qps": qps
                }
                results.append(result)
                
                print(f"✅ {name}: {questions_received}/{num_q} in {processing_time:.1f}s ({qps:.2f} Q/s)")
            else:
                print(f"❌ {name}: Failed {response.status_code}")
                
        except Exception as e:
            print(f"❌ {name}: Error {str(e)}")
    
    # Summary
    if results:
        print(f"\n📊 COMPARISON SUMMARY:")
        print(f"{'Test':<10} {'Target':<8} {'Got':<8} {'Time':<8} {'Q/s':<8}")
        print("-" * 50)
        for r in results:
            print(f"{r['name']:<10} {r['target']:<8} {r['received']:<8} {r['time']:<8.1f} {r['qps']:<8.2f}")

def main():
    """Main test function"""
    print("🧪 AI QUESTION GENERATOR - 300 QUESTIONS PERFORMANCE TEST")
    print("=" * 60)
    print(f"🕐 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Health check
    if not test_health():
        print("❌ Server not ready. Start server first:")
        print("   cd c:\\An\\education-system\\ai")
        print("   python server.py")
        return
    
    # Test 300 questions
    success = test_300_questions()
    
    # Test smaller batches for comparison
    test_smaller_batches()
    
    # Final verdict
    print(f"\n" + "=" * 60)
    print("🏁 TEST COMPLETED")
    print(f"🕐 Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if success:
        print("🎉 300 QUESTIONS TEST: PASSED ✅")
        print("💡 System ready for production with 300 questions!")
    else:
        print("⚠️ 300 QUESTIONS TEST: NEEDS OPTIMIZATION")
        print("💡 Consider optimizing batch size or timeout settings")
    
    print("\n📞 Next steps:")
    print("1. Deploy server to production")
    print("2. Update frontend to support 300 questions")
    print("3. Monitor performance in production")
    print("4. Set up alerts for API timeouts")

if __name__ == "__main__":
    main()
