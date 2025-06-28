import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables từ file .env
load_dotenv()

# Lấy API key từ environment variable
api_key = os.getenv('OPENAI_API_KEY')
if not api_key or api_key == 'your_openai_api_key_here':
    print("❌ Lỗi: Chưa cấu hình OPENAI_API_KEY")
    print("💡 Hướng dẫn:")
    print("   1. Mở file .env trong thư mục này")
    print("   2. Thay 'your_openai_api_key_here' bằng API key thực của bạn")
    print("   3. Lưu file và chạy lại script")
    print("   4. Nếu chưa có python-dotenv: pip install python-dotenv")
    exit(1)

url = "https://api.openai.com/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}
data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "tạo 1 json mẫu cho một câu hỏi về AI, 4 câu, mỗi câu có 4 lựa chọn, trong đó có 1 câu đúng"
        }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
}

# Gửi request
response = requests.post(url, headers=headers, json=data)
result = response.json()

# Lưu dữ liệu gốc vào show.json
with open('show.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print("=== THÔNG TIN ĐẦY ĐỦ ===")
print(f"Status Code: {response.status_code}")

print(f"Response ID: {result.get('id', 'N/A')}")

# Hiển thị câu trả lời AI
if 'choices' in result and len(result['choices']) > 0:
    choice = result['choices'][0]
    ai_response = choice['message']['content']
    
    print("\n=== CÂU TRẢ LỜI AI ===")
    print(f"Nội dung: {ai_response.strip()}")
    print(f"Role: {choice['message']['role']}")
    print(f"Finish Reason: {choice['finish_reason']}")
    
    # Hiển thị thông tin token
    if 'usage' in result:
        usage = result['usage']
        print("\n=== THÔNG TIN TOKEN ===")
        print(f"Tổng tokens: {usage.get('total_tokens', 'N/A')}")
        print(f"Prompt tokens: {usage.get('prompt_tokens', 'N/A')}")
        print(f"Completion tokens: {usage.get('completion_tokens', 'N/A')}")
else:
    print("❌ Không có phản hồi từ AI")

print(f"\n✅ Dữ liệu gốc đã được lưu vào: show.json")
print(f"✅ Kích thước file: {len(json.dumps(result))} bytes")