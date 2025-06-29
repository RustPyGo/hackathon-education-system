#!/usr/bin/env python3
"""
Test script cho new format API
"""

import requests
import json
import time

def test_new_format():
    """Test API với format mới"""
    
    # Test data
    test_request = {
        "files": [
            {
                "url": "https://prj301.hcm.ss.bfcplatform.vn/pdfs/745b0242-e629-407a-b452-bdde4044adb0/1751095113.pdf?fbclid=IwY2xjawLNT3tleHRuA2FlbQIxMABicmlkETFpVTZ6aDJ5RzhTZDRaWG9QAR6YSb2wTJjO1Jw5JUOj5bpx7dU_3RZbuqjJUzH-Q3sxsXgGusTTt-pEn6NxdQ_aem_k00nKMLGkM97tlYRioP8Ug",
                "file_name": "test_document.pdf"
            }
        ],
        "project_id": "new-format-test",
        "total_questions": 5,
        "name": "New Format Test"
    }
    
    # API endpoint
    url = "http://localhost:8000/api/generate-questions-sync"
    
    print("🚀 Testing new format API...")
    print(f"📤 Request: {json.dumps(test_request, indent=2)}")
    
    try:
        # Send request
        response = requests.post(url, json=test_request, timeout=120)
        
        print(f"📥 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! New format response:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Validate new format
            validate_new_format(data)
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

def validate_new_format(data):
    """Validate response format"""
    print("\n🔍 Validating new format...")
    
    # Check top level structure
    if "questions" not in data:
        print("❌ Missing 'questions' field")
        return False
        
    if "summary" not in data:
        print("❌ Missing 'summary' field")
        return False
    
    questions = data["questions"]
    summary = data["summary"]
    
    print(f"✅ Found {len(questions)} questions")
    print(f"✅ Summary: {summary[:100]}...")
    
    # Check each question
    for i, q in enumerate(questions):
        print(f"\n📝 Question {i+1}:")
        
        # Required fields
        required_fields = ["question", "type", "difficulty", "explanation", "choices"]
        for field in required_fields:
            if field not in q:
                print(f"❌ Missing field: {field}")
                return False
        
        print(f"  📋 Question: {q['question'][:50]}...")
        print(f"  🎯 Type: {q['type']}")
        print(f"  📊 Difficulty: {q['difficulty']}")
        print(f"  💡 Explanation: {q['explanation'][:50]}...")
        
        # Check choices
        choices = q["choices"]
        if len(choices) != 4:
            print(f"❌ Expected 4 choices, got {len(choices)}")
            return False
        
        correct_count = sum(1 for choice in choices if choice.get("is_correct", False))
        if correct_count != 1:
            print(f"❌ Expected 1 correct answer, got {correct_count}")
            return False
        
        print(f"  ✅ Choices: {len(choices)} (1 correct)")
        
        # Check choice structure
        for j, choice in enumerate(choices):
            choice_fields = ["content", "is_correct", "explanation"]
            for field in choice_fields:
                if field not in choice:
                    print(f"❌ Choice {j+1} missing field: {field}")
                    return False
    
    print("\n🎉 All validations passed! New format is correct.")
    return True

if __name__ == "__main__":
    test_new_format()
