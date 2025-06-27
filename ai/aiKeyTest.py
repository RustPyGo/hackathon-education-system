import requests
import json

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
params = {"key": "AIzaSyBkwty3yhgfR3JE5YEaenQWZ0D7B8l1sdc"}
headers = {"Content-Type": "application/json"}
data = {
    "contents": [
        {
            "parts": [
                {"text": "tạo 1 json mẫu cho một câu hỏi về AI, 4 câu, mỗi câu có 4 lựa chọn, trong đó có 1 câu đúng"}
            ]
        }
    ]
}

# Gửi request
response = requests.post(url, params=params, headers=headers, json=data)
result = response.json()

# Lưu dữ liệu gốc vào show.json
with open('show.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print("=== THÔNG TIN ĐẦY ĐỦ ===")
print(f"Status Code: {response.status_code}")

print(f"Response ID: {result.get('responseId', 'N/A')}")

# Hiển thị câu trả lời AI
if 'candidates' in result and len(result['candidates']) > 0:
    candidate = result['candidates'][0]
    ai_response = candidate['content']['parts'][0]['text']
    
    print("\n=== CÂU TRẢ LỜI AI ===")
    print(f"Nội dung: {ai_response.strip()}")
    print(f"Role: {candidate['content']['role']}")
    print(f"Finish Reason: {candidate['finishReason']}")
    print(f"Avg Log Probs: {candidate.get('avgLogprobs', 'N/A')}")
    
    # Hiển thị thông tin token
    if 'usageMetadata' in result:
        usage = result['usageMetadata']
        print("\n=== THÔNG TIN TOKEN ===")
        print(f"Tổng tokens: {usage.get('totalTokenCount', 'N/A')}")
        print(f"Prompt tokens: {usage.get('promptTokenCount', 'N/A')}")
        print(f"Response tokens: {usage.get('candidatesTokenCount', 'N/A')}")
        
        # Chi tiết token theo modality
        if 'promptTokensDetails' in usage:
            prompt_details = usage['promptTokensDetails'][0]
            print(f"Prompt details: {prompt_details['modality']} - {prompt_details['tokenCount']} tokens")
        
        if 'candidatesTokensDetails' in usage:
            candidate_details = usage['candidatesTokensDetails'][0]
            print(f"Response details: {candidate_details['modality']} - {candidate_details['tokenCount']} tokens")
else:
    print("❌ Không có phản hồi từ AI")

print(f"\n✅ Dữ liệu gốc đã được lưu vào: show.json")
print(f"✅ Kích thước file: {len(json.dumps(result))} bytes")