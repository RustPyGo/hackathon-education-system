#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script cho GenQ - kiểm tra việc sinh câu hỏi kiểm tra kiến thức
"""

import os
from genQ import QuestionGenerator

def main():
    print("🧪 Test Generation của Câu Hỏi Kiểm Tra Kiến Thức")
    print("=" * 60)
    
    # Lấy danh sách file PDF trong thư mục hiện tại
    pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]
    
    if not pdf_files:
        print("❌ Không tìm thấy file PDF nào trong thư mục hiện tại")
        print("💡 Hãy copy một file PDF vào thư mục ai/ để test")
        return
    
    print(f"📚 Tìm thấy {len(pdf_files)} file PDF:")
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"  {i}. {pdf_file}")
    
    # Chọn file PDF
    if len(pdf_files) == 1:
        selected_pdf = pdf_files[0]
        print(f"\n✅ Tự động chọn: {selected_pdf}")
    else:
        try:
            choice = int(input(f"\nChọn file PDF (1-{len(pdf_files)}): ")) - 1
            if 0 <= choice < len(pdf_files):
                selected_pdf = pdf_files[choice]
            else:
                print("❌ Lựa chọn không hợp lệ")
                return
        except ValueError:
            print("❌ Vui lòng nhập số")
            return
    
    print(f"\n🎯 Đang test với file: {selected_pdf}")
    print("-" * 60)
    
    # Khởi tạo generator
    generator = QuestionGenerator()
    
    # Test với số câu hỏi nhỏ
    test_cases = [
        {"num_questions": 3, "description": "Test cơ bản (3 câu)"},
        {"num_questions": 5, "description": "Test vừa (5 câu)"},
        {"num_questions": 10, "description": "Test batch (10 câu)"}
    ]
    
    for test_case in test_cases:
        print(f"\n🔬 {test_case['description']}")
        print("-" * 40)
        
        try:
            result = generator.generate_questions_from_pdf(
                selected_pdf, 
                test_case["num_questions"]
            )
            
            if result and "questions" in result:
                num_generated = len(result["questions"])
                print(f"✅ Thành công: {num_generated}/{test_case['num_questions']} câu")
                
                # Hiển thị 1-2 câu mẫu
                print("\n📋 Câu hỏi mẫu:")
                for i, q in enumerate(result["questions"][:2], 1):
                    print(f"\nCâu {q.get('id', i)}: {q.get('question', 'N/A')}")
                    print(f"Đáp án đúng: {q.get('correct_answer', 'N/A')}")
                    print(f"Gợi ý: {q.get('hint', 'N/A')}")
                
                # Lưu kết quả test
                output_file = f"test_result_{test_case['num_questions']}q.json"
                generator.save_questions_to_file(result, output_file)
                print(f"💾 Đã lưu: {output_file}")
                
            else:
                print("❌ Thất bại: Không sinh được câu hỏi")
                
        except Exception as e:
            print(f"❌ Lỗi: {str(e)}")
        
        print("-" * 40)
    
    print("\n🎉 Hoàn thành test!")
    print("📂 Kiểm tra các file kết quả: test_result_*.json")

if __name__ == "__main__":
    main()
