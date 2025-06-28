import PyPDF2
import os
import sys
from pathlib import Path

def pdf_to_text(pdf_path, output_path="pdfToText.txt"):
    """
    Chuyển đổi file PDF sang text và lưu vào file với xử lý lỗi robust
    
    Args:
        pdf_path (str): Đường dẫn đến file PDF
        output_path (str): Đường dẫn file output (mặc định: pdfToText.txt)
    """
    try:
        # Kiểm tra file PDF có tồn tại không
        if not os.path.exists(pdf_path):
            print(f"❌ Lỗi: Không tìm thấy file PDF: {pdf_path}")
            return False
        
        # Mở file PDF với nhiều cách xử lý lỗi
        print(f"📄 Đang mở PDF: {pdf_path}")
        
        with open(pdf_path, 'rb') as file:
            try:
                pdf_reader = PyPDF2.PdfReader(file)
            except Exception as e:
                print(f"❌ Lỗi đọc PDF: {str(e)}")
                print("💡 Thử với strict=False...")
                try:
                    pdf_reader = PyPDF2.PdfReader(file, strict=False)
                except Exception as e2:
                    print(f"❌ Vẫn lỗi: {str(e2)}")
                    return False
            
            # Kiểm tra số trang
            try:
                num_pages = len(pdf_reader.pages)
                print(f"� PDF có {num_pages} trang")
            except Exception as e:
                print(f"❌ Không thể xác định số trang: {str(e)}")
                return False
            
            # Trích xuất text từ tất cả các trang với xử lý lỗi từng trang
            text_content = ""
            successful_pages = 0
            failed_pages = []
            
            for page_num in range(num_pages):
                try:
                    print(f"🔄 Đang xử lý trang {page_num + 1}/{num_pages}...", end="")
                    
                    page = pdf_reader.pages[page_num]
                    
                    # Thử nhiều cách extract text
                    page_text = ""
                    try:
                        page_text = page.extract_text()
                    except Exception as e1:
                        print(f" [Lỗi method 1: {str(e1)[:50]}]", end="")
                        try:
                            # Thử cách khác
                            page_text = page.extractText()  # Phương thức cũ
                        except Exception as e2:
                            print(f" [Lỗi method 2: {str(e2)[:50]}]", end="")
                            page_text = f"[TRANG {page_num + 1}: KHÔNG THỂ TRÍCH XUẤT TEXT]"
                    
                    # Thêm header cho mỗi trang
                    text_content += f"\n{'='*50}\n"
                    text_content += f"TRANG {page_num + 1}\n"
                    text_content += f"{'='*50}\n"
                    
                    if page_text.strip():
                        text_content += page_text + "\n"
                        successful_pages += 1
                        print(" ✅")
                    else:
                        text_content += f"[TRANG TRỐNG HOẶC KHÔNG CÓ TEXT]\n"
                        print(" ⚠️ (trống)")
                    
                except Exception as e:
                    failed_pages.append(page_num + 1)
                    print(f" ❌ Lỗi: {str(e)[:50]}")
                    
                    # Thêm thông báo lỗi vào nội dung
                    text_content += f"\n{'='*50}\n"
                    text_content += f"TRANG {page_num + 1} - LỖI\n"
                    text_content += f"{'='*50}\n"
                    text_content += f"[LỖI TRÍCH XUẤT: {str(e)}]\n"
                    
                    # Thử tiếp trang tiếp theo thay vì dừng
                    continue
            
            # Lưu text vào file
            try:
                with open(output_path, 'w', encoding='utf-8') as output_file:
                    output_file.write(text_content)
                print(f"💾 Đã lưu text vào: {output_path}")
            except Exception as e:
                print(f"❌ Lỗi lưu file: {str(e)}")
                return False
            
            # Thống kê chi tiết
            char_count = len(text_content)
            word_count = len(text_content.split())
            
            print(f"\n🎉 HOÀN THÀNH!")
            print(f"📊 Thống kê:")
            print(f"   - Tổng số trang: {num_pages}")
            print(f"   - Trang xử lý thành công: {successful_pages}")
            print(f"   - Trang bị lỗi: {len(failed_pages)}")
            if failed_pages:
                print(f"   - Các trang lỗi: {failed_pages}")
            print(f"   - Số ký tự: {char_count:,}")
            print(f"   - Số từ: {word_count:,}")
            print(f"   - File đầu ra: {output_path}")
            print(f"   - Kích thước: {os.path.getsize(output_path):,} bytes")
            
            # Cảnh báo nếu có trang lỗi
            if failed_pages:
                print(f"\n⚠️ CẢNH BÁO: {len(failed_pages)} trang không thể xử lý!")
                print("💡 Gợi ý:")
                print("   - PDF có thể bị hỏng hoặc mã hóa")
                print("   - Thử với PDF reader khác")
                print("   - Kiểm tra quyền truy cập file")
            
            return True
            
    except MemoryError:
        print("❌ Lỗi: Không đủ bộ nhớ để xử lý PDF")
        print("💡 Gợi ý: Thử với file PDF nhỏ hơn hoặc tăng RAM")
        return False
    except FileNotFoundError:
        print(f"❌ Lỗi: Không tìm thấy file: {pdf_path}")
        return False
    except PermissionError:
        print(f"❌ Lỗi: Không có quyền truy cập file: {pdf_path}")
        return False
    except Exception as e:
        print(f"❌ Lỗi không xác định: {str(e)}")
        print(f"❌ Type: {type(e).__name__}")
        return False

def main():
    """
    Hàm chính với xử lý lỗi cải tiến
    """
    print("🔄 PDF TO TEXT CONVERTER (Enhanced)")
    print("=" * 40)
    
    # Tìm file PDF trong thư mục hiện tại
    pdf_files = list(Path(".").glob("*.pdf"))
    
    if pdf_files:
        print("📋 File PDF tìm thấy:")
        for i, pdf_file in enumerate(pdf_files, 1):
            try:
                file_size = os.path.getsize(pdf_file) / 1024  # KB
                print(f"   {i}. {pdf_file.name} ({file_size:.1f} KB)")
            except Exception:
                print(f"   {i}. {pdf_file.name} (Không thể đọc kích thước)")
        
        try:
            choice = input(f"\n🔢 Chọn file (1-{len(pdf_files)}) hoặc nhập đường dẫn khác: ")
            
            if choice.isdigit() and 1 <= int(choice) <= len(pdf_files):
                pdf_path = str(pdf_files[int(choice) - 1])
            else:
                pdf_path = choice.strip('"').strip("'")  # Loại bỏ dấu ngoặc kép
                
        except (ValueError, KeyboardInterrupt):
            print("\n👋 Đã hủy!")
            return
    else:
        print("📝 Không tìm thấy file PDF trong thư mục hiện tại")
        pdf_path = input("📁 Nhập đường dẫn đến file PDF: ").strip('"').strip("'")
    
    if not pdf_path:
        print("❌ Không có đường dẫn file!")
        return
    
    # Xử lý PDF
    print(f"\n🚀 Bắt đầu xử lý: {pdf_path}")
    success = pdf_to_text(pdf_path)
    
    if success:
        print("\n✅ Chuyển đổi thành công!")
    else:
        print("\n❌ Chuyển đổi thất bại!")
        print("\n💡 Troubleshooting:")
        print("   1. Kiểm tra file PDF có hợp lệ không")
        print("   2. Thử cài đặt lại PyPDF2: pip install --upgrade PyPDF2")
        print("   3. Thử với file PDF khác để test")
        print("   4. Kiểm tra dung lượng RAM còn lại")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Đã dừng bởi người dùng!")
    except Exception as e:
        print(f"\n❌ Lỗi nghiêm trọng: {str(e)}")
        sys.exit(1)