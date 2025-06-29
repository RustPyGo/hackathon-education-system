#!/usr/bin/env python3
"""
🚀 Setup script cho AI Education Question Generator
Cài đặt dependencies và cấu hình môi trường
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_header(text: str):
    """In header đẹp"""
    print(f"\n{'='*60}")
    print(f"🚀 {text}")
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

def check_python_version():
    """Kiểm tra version Python"""
    print_header("Kiểm tra Python Version")
    
    version = sys.version_info
    print_info(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print_error("Cần Python 3.8 trở lên!")
        return False
    
    print_success("Python version OK")
    return True

def check_pip():
    """Kiểm tra pip"""
    print_header("Kiểm tra pip")
    
    try:
        import pip
        print_success("pip đã có sẵn")
        return True
    except ImportError:
        print_error("pip không tìm thấy!")
        return False

def install_dependencies():
    """Cài đặt dependencies"""
    print_header("Cài đặt Python Dependencies")
    
    requirements_file = Path("requirement.txt")
    if not requirements_file.exists():
        print_error("Không tìm thấy requirement.txt!")
        return False
    
    try:
        print_info("Đang cài đặt packages...")
        
        # Upgrade pip first
        subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], 
                      check=True, capture_output=True)
        
        # Install requirements
        result = subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirement.txt"], 
                               check=True, capture_output=True, text=True)
        
        print_success("Tất cả dependencies đã được cài đặt!")
        return True
        
    except subprocess.CalledProcessError as e:
        print_error(f"Lỗi cài đặt: {e}")
        print_error(f"Output: {e.stdout}")
        print_error(f"Error: {e.stderr}")
        return False

def setup_env_file():
    """Tạo file .env nếu chưa có"""
    print_header("Cấu hình Environment Variables")
    
    env_file = Path(".env")
    
    if env_file.exists():
        print_info(".env file đã tồn tại")
        return True
    
    print_info("Tạo .env file mẫu...")
    
    env_content = """# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Server Configuration  
MAX_CONCURRENT_TASKS=10
LOG_LEVEL=INFO
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
MAX_QUESTIONS_PER_BATCH=8

# Cache Configuration
ENABLE_CACHE=true
CACHE_DIR=./cache
TEMP_DIR=./temp
"""
    
    try:
        with open(env_file, "w", encoding="utf-8") as f:
            f.write(env_content)
        
        print_success("Đã tạo .env file!")
        print_info("Vui lòng cập nhật API keys trong file .env")
        return True
        
    except Exception as e:
        print_error(f"Lỗi tạo .env file: {e}")
        return False

def create_directories():
    """Tạo các thư mục cần thiết"""
    print_header("Tạo Thư mục")
    
    directories = ["cache", "temp", "logs", "output"]
    
    for dir_name in directories:
        dir_path = Path(dir_name)
        if not dir_path.exists():
            try:
                dir_path.mkdir(parents=True, exist_ok=True)
                print_success(f"Đã tạo thư mục: {dir_name}")
            except Exception as e:
                print_error(f"Lỗi tạo thư mục {dir_name}: {e}")
                return False
        else:
            print_info(f"Thư mục {dir_name} đã tồn tại")
    
    return True

def test_imports():
    """Test import các package chính"""
    print_header("Test Import Packages")
    
    packages = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("openai", "OpenAI"),
        ("langchain", "LangChain"),
        ("sentence_transformers", "SentenceTransformers"),
        ("chromadb", "ChromaDB"),
        ("PyPDF2", "PyPDF2"),
        ("requests", "Requests"),
        ("python-dotenv", "python-dotenv")
    ]
    
    success_count = 0
    
    for package, display_name in packages:
        try:
            __import__(package.replace("-", "_"))
            print_success(f"{display_name} OK")
            success_count += 1
        except ImportError as e:
            print_error(f"{display_name} FAILED: {e}")
    
    print_info(f"Import test: {success_count}/{len(packages)} packages OK")
    return success_count == len(packages)

def run_basic_test():
    """Chạy test cơ bản"""
    print_header("Test Cơ bản")
    
    try:
        # Test OpenAI import
        print_info("Testing OpenAI...")
        import openai
        print_success("OpenAI import OK")
        
        # Test FastAPI import
        print_info("Testing FastAPI...")
        from fastapi import FastAPI
        print_success("FastAPI import OK")
        
        # Test các modules tự viết
        print_info("Testing custom modules...")
        
        modules = ["pdfToText", "chat", "genQ"]
        for module in modules:
            module_file = Path(f"{module}.py")
            if module_file.exists():
                print_success(f"{module}.py tồn tại")
            else:
                print_error(f"{module}.py không tìm thấy!")
                return False
        
        return True
        
    except Exception as e:
        print_error(f"Basic test failed: {e}")
        return False

def main():
    """Main setup function"""
    print_header("AI Education Question Generator Setup")
    
    steps = [
        ("Kiểm tra Python Version", check_python_version),
        ("Kiểm tra pip", check_pip),
        ("Cài đặt Dependencies", install_dependencies),
        ("Cấu hình Environment", setup_env_file),
        ("Tạo Thư mục", create_directories),
        ("Test Import Packages", test_imports),
        ("Test Cơ bản", run_basic_test),
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        try:
            if step_func():
                success_count += 1
            else:
                print_error(f"Bước '{step_name}' thất bại!")
                break
        except KeyboardInterrupt:
            print_error("Setup bị ngắt bởi người dùng")
            break
        except Exception as e:
            print_error(f"Lỗi trong bước '{step_name}': {e}")
            break
    
    # Summary
    print_header("Kết quả Setup")
    
    if success_count == len(steps):
        print_success("🎉 Setup hoàn tất thành công!")
        print_info("Các bước tiếp theo:")
        print("   1. Cập nhật API keys trong file .env")
        print("   2. Chạy: python server.py")
        print("   3. Test API: python test_api.py")
        print("   4. Truy cập: http://localhost:8000/docs")
        return True
    else:
        print_error(f"💔 Setup thất bại! Hoàn thành {success_count}/{len(steps)} bước")
        print_info("Vui lòng kiểm tra lỗi và thử lại")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
