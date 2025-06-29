#!/usr/bin/env python3
"""
📊 Performance Comparison Script
So sánh hiệu năng giữa server cũ và server tối ưu
Author: AI Assistant
Created: 2025-06-29
"""

import requests
import json
import time
from datetime import datetime

# Cấu hình
OLD_SERVER_URL = "http://localhost:8000"  # Server cũ
NEW_SERVER_URL = "http://localhost:8001"  # Server mới (chạy trên port khác)

TEST_FILES = [
    {
        "url": "https://example.com/sample1.pdf",
        "file_name": "test_doc1.pdf"
    },
    {
        "url": "https://example.com/sample2.pdf", 
        "file_name": "test_doc2.pdf"
    }
]

def test_server_performance(server_url, server_name, num_questions=100):
    """Test hiệu năng của một server"""
    print(f"\n🧪 Testing {server_name} ({server_url})")
    print(f"📊 Questions: {num_questions}")
    
    request_data = {
        "files": TEST_FILES,
        "project_id": f"perf_test_{server_name.lower()}",
        "total_questions": num_questions,
        "name": f"Performance Test {server_name}"
    }
    
    start_time = time.time()
    
    try:
        # Test health first
        health_response = requests.get(f"{server_url}/api/health", timeout=5)
        if health_response.status_code != 200:
            print(f"❌ {server_name} health check failed")
            return None
        
        # Test actual endpoint
        response = requests.post(
            f"{server_url}/api/generate-questions-sync",
            json=request_data,
            timeout=300  # 5 min timeout
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        if response.status_code == 200:
            data = response.json()
            metadata = data.get('metadata', {})
            
            result = {
                "server_name": server_name,
                "success": True,
                "processing_time": processing_time,
                "questions_generated": metadata.get('total_questions', 0),
                "questions_per_second": metadata.get('total_questions', 0) / processing_time,
                "cache_hits": len(metadata.get('cached_files', [])),
                "failed_files": len(metadata.get('failed_files', [])),
                "server_info": health_response.json()
            }
            
            print(f"✅ {server_name} SUCCESS")
            print(f"   ⏱️  Time: {processing_time:.2f}s")
            print(f"   📊 Questions: {result['questions_generated']}")
            print(f"   ⚡ Speed: {result['questions_per_second']:.2f} Q/s")
            print(f"   💾 Cache hits: {result['cache_hits']}")
            
            return result
        else:
            print(f"❌ {server_name} FAILED: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        end_time = time.time()
        processing_time = end_time - start_time
        print(f"⏰ {server_name} TIMEOUT after {processing_time:.2f}s")
        return None
        
    except Exception as e:
        print(f"❌ {server_name} ERROR: {str(e)}")
        return None

def compare_performance():
    """So sánh hiệu năng giữa 2 server"""
    print("📊 PERFORMANCE COMPARISON")
    print("=" * 60)
    print("🔍 Testing both servers with same workload...")
    
    test_cases = [
        {"questions": 50, "name": "Small batch"},
        {"questions": 100, "name": "Medium batch"},
        {"questions": 200, "name": "Large batch (old max)"},
        {"questions": 300, "name": "XL batch (new max)"}
    ]
    
    results = {}
    
    for test_case in test_cases:
        num_questions = test_case["questions"]
        test_name = test_case["name"]
        
        print(f"\n🎯 TEST CASE: {test_name} ({num_questions} questions)")
        print("-" * 40)
        
        # Test old server
        old_result = test_server_performance(
            OLD_SERVER_URL, 
            "Original Server", 
            num_questions
        )
        
        # Test new server
        new_result = test_server_performance(
            NEW_SERVER_URL, 
            "Optimized Server", 
            num_questions
        )
        
        # Store results
        results[test_name] = {
            "old": old_result,
            "new": new_result,
            "questions": num_questions
        }
        
        # Quick comparison
        if old_result and new_result:
            old_time = old_result["processing_time"]
            new_time = new_result["processing_time"]
            speedup = old_time / new_time if new_time > 0 else 0
            
            print(f"\n📈 Quick Comparison:")
            print(f"   Original: {old_time:.2f}s")
            print(f"   Optimized: {new_time:.2f}s")
            print(f"   Speedup: {speedup:.2f}x {'🚀' if speedup > 1 else '🐌'}")
    
    # Final analysis
    print("\n" + "=" * 60)
    print("📈 FINAL PERFORMANCE ANALYSIS")
    print("=" * 60)
    
    comparison_table = []
    
    for test_name, result in results.items():
        old_result = result["old"]
        new_result = result["new"]
        
        if old_result and new_result:
            old_time = old_result["processing_time"]
            new_time = new_result["processing_time"]
            old_qps = old_result["questions_per_second"]
            new_qps = new_result["questions_per_second"]
            speedup = old_time / new_time if new_time > 0 else 0
            qps_improvement = new_qps / old_qps if old_qps > 0 else 0
            
            comparison_table.append({
                "test": test_name,
                "questions": result["questions"],
                "old_time": old_time,
                "new_time": new_time,
                "speedup": speedup,
                "old_qps": old_qps,
                "new_qps": new_qps,
                "qps_improvement": qps_improvement
            })
    
    # Print comparison table
    if comparison_table:
        print("\n📊 DETAILED COMPARISON TABLE")
        print("-" * 80)
        print(f"{'Test':<20} {'Questions':<10} {'Old Time':<10} {'New Time':<10} {'Speedup':<10} {'QPS Gain':<10}")
        print("-" * 80)
        
        total_speedup = 0
        valid_tests = 0
        
        for row in comparison_table:
            print(f"{row['test']:<20} {row['questions']:<10} "
                  f"{row['old_time']:<10.2f} {row['new_time']:<10.2f} "
                  f"{row['speedup']:<10.2f} {row['qps_improvement']:<10.2f}")
            
            if row['speedup'] > 0:
                total_speedup += row['speedup']
                valid_tests += 1
        
        if valid_tests > 0:
            avg_speedup = total_speedup / valid_tests
            print("-" * 80)
            print(f"{'AVERAGE':<20} {'':<10} {'':<10} {'':<10} {avg_speedup:<10.2f} {'':<10}")
            
            # Final verdict
            print(f"\n🏆 PERFORMANCE VERDICT:")
            if avg_speedup > 2.0:
                print(f"   🚀 EXCELLENT: {avg_speedup:.2f}x faster on average")
            elif avg_speedup > 1.5:
                print(f"   ⚡ GOOD: {avg_speedup:.2f}x faster on average")
            elif avg_speedup > 1.1:
                print(f"   ✅ IMPROVED: {avg_speedup:.2f}x faster on average")
            else:
                print(f"   📊 SIMILAR: {avg_speedup:.2f}x difference")
    
    # Test 300 questions capability
    print(f"\n🎯 300 QUESTIONS CAPABILITY TEST")
    print("-" * 40)
    
    # Only test new server for 300 questions
    new_300_result = test_server_performance(
        NEW_SERVER_URL,
        "Optimized Server (300Q)",
        300
    )
    
    if new_300_result:
        time_300 = new_300_result["processing_time"]
        target_time = 300  # 5 minutes target
        
        if time_300 <= target_time:
            print(f"🎉 300 QUESTIONS TARGET MET!")
            print(f"   Target: ≤{target_time}s")
            print(f"   Actual: {time_300:.2f}s")
            print(f"   Status: PASS ✅")
        else:
            print(f"⚠️ 300 QUESTIONS TARGET MISSED")
            print(f"   Target: ≤{target_time}s")
            print(f"   Actual: {time_300:.2f}s")
            print(f"   Status: NEEDS MORE OPTIMIZATION 🔧")
    else:
        print("❌ Could not test 300 questions capability")

def main():
    """Main function"""
    print("📊 AI Question Generator - Performance Comparison")
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    print("ℹ️ Instructions:")
    print("1. Start original server on port 8000:")
    print("   python server.py")
    print("2. Start optimized server on port 8001:")
    print("   python -m uvicorn server_sync_optimized:app --port 8001")
    print("3. Update TEST_FILES with real PDF URLs")
    print("4. Run this script")
    print()
    
    # Check if we should proceed
    proceed = input("🚀 Proceed with comparison? (y/N): ").lower().strip()
    if proceed not in ['y', 'yes']:
        print("🛑 Cancelled")
        return
    
    compare_performance()
    
    print("\n🏁 Performance comparison completed!")
    print("💡 Tips for optimization:")
    print("   - Use SSD storage for better I/O")
    print("   - Increase available memory")
    print("   - Use faster internet connection")
    print("   - Optimize PDF file sizes")

if __name__ == "__main__":
    main()
