#!/usr/bin/env python3
"""
🚀 Run script cho AI Education Question Generator
Khởi động server với các tùy chọn khác nhau
"""

import os
import sys
import argparse
import subprocess
import signal
import time
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

def check_env():
    """Kiểm tra môi trường trước khi chạy"""
    print_info("Kiểm tra môi trường...")
    
    # Check .env file
    env_file = Path(".env")
    if not env_file.exists():
        print_error(".env file không tồn tại!")
        print_info("Chạy: python setup.py để tạo file .env")
        return False
    
    # Check API keys
    from dotenv import load_dotenv
    load_dotenv()
    
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key or openai_key == "your_openai_api_key_here":
        print_error("OPENAI_API_KEY chưa được cấu hình!")
        print_info("Cập nhật API key trong file .env")
        return False
    
    # Check modules
    required_files = ["server.py", "genQ.py", "pdfToText.py", "chat.py"]
    for file_name in required_files:
        if not Path(file_name).exists():
            print_error(f"Không tìm thấy file: {file_name}")
            return False
    
    print_success("Môi trường OK")
    return True

def run_server(host="0.0.0.0", port=8000, reload=False, log_level="info"):
    """Chạy server"""
    print_header(f"Khởi động AI Server tại {host}:{port}")
    
    # Build command
    cmd = [
        sys.executable, "server.py",
        "--host", host,
        "--port", str(port)
    ]
    
    if reload:
        cmd.append("--reload")
    
    # Set environment
    env = os.environ.copy()
    env["LOG_LEVEL"] = log_level.upper()
    
    try:
        print_info(f"Command: {' '.join(cmd)}")
        print_info("Nhấn Ctrl+C để dừng server")
        print_info("Có thể truy cập:")
        print(f"   🌐 API: http://{host}:{port}")
        print(f"   📚 Docs: http://{host}:{port}/docs")
        print(f"   🔧 Redoc: http://{host}:{port}/redoc")
        
        # Start server
        process = subprocess.Popen(cmd, env=env)
        
        # Wait for interrupt
        try:
            process.wait()
        except KeyboardInterrupt:
            print_info("Đang dừng server...")
            process.send_signal(signal.SIGTERM)
            process.wait()
            print_success("Server đã dừng")
            
    except Exception as e:
        print_error(f"Lỗi chạy server: {e}")
        return False
    
    return True

def run_tests():
    """Chạy tests"""
    print_header("Chạy API Tests")
    
    try:
        cmd = [sys.executable, "test_api.py"]
        result = subprocess.run(cmd, check=True)
        print_success("Tests hoàn thành")
        return True
    except subprocess.CalledProcessError:
        print_error("Tests thất bại")
        return False
    except FileNotFoundError:
        print_error("Không tìm thấy test_api.py")
        return False

def run_docker():
    """Chạy với Docker"""
    print_header("Chạy với Docker")
    
    try:
        # Check if Docker is available
        subprocess.run(["docker", "--version"], check=True, capture_output=True)
        
        print_info("Building Docker image...")
        subprocess.run(["docker", "build", "-t", "ai-question-generator", "."], check=True)
        
        print_info("Starting Docker container...")
        cmd = [
            "docker", "run", "-it", "--rm",
            "-p", "8000:8000",
            "--env-file", ".env",
            "ai-question-generator"
        ]
        
        subprocess.run(cmd, check=True)
        
    except subprocess.CalledProcessError as e:
        print_error(f"Docker command failed: {e}")
        return False
    except FileNotFoundError:
        print_error("Docker không được cài đặt!")
        return False

def run_docker_compose():
    """Chạy với Docker Compose"""
    print_header("Chạy với Docker Compose")
    
    try:
        # Check if docker-compose is available
        subprocess.run(["docker-compose", "--version"], check=True, capture_output=True)
        
        print_info("Starting services with docker-compose...")
        cmd = ["docker-compose", "up", "--build"]
        
        subprocess.run(cmd, check=True)
        
    except subprocess.CalledProcessError as e:
        print_error(f"Docker Compose command failed: {e}")
        return False
    except FileNotFoundError:
        print_error("Docker Compose không được cài đặt!")
        return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="🚀 AI Education Question Generator Runner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run.py                          # Chạy server mặc định
  python run.py --port 8080              # Chạy trên port 8080  
  python run.py --reload                 # Chạy với auto-reload
  python run.py --test                   # Chạy tests
  python run.py --docker                 # Chạy với Docker
  python run.py --docker-compose         # Chạy với Docker Compose
        """
    )
    
    parser.add_argument("--host", default="0.0.0.0", help="Host để bind server")
    parser.add_argument("--port", type=int, default=8000, help="Port để chạy server")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    parser.add_argument("--log-level", default="info", choices=["debug", "info", "warning", "error"])
    parser.add_argument("--test", action="store_true", help="Chạy tests thay vì server")
    parser.add_argument("--docker", action="store_true", help="Chạy với Docker")
    parser.add_argument("--docker-compose", action="store_true", help="Chạy với Docker Compose")
    parser.add_argument("--skip-check", action="store_true", help="Bỏ qua kiểm tra môi trường")
    
    args = parser.parse_args()
    
    # Check environment (unless skipped)
    if not args.skip_check and not args.docker and not args.docker_compose:
        if not check_env():
            print_error("Kiểm tra môi trường thất bại!")
            return False
    
    # Route to appropriate function
    if args.test:
        return run_tests()
    elif args.docker:
        return run_docker()
    elif args.docker_compose:
        return run_docker_compose()
    else:
        return run_server(
            host=args.host,
            port=args.port,
            reload=args.reload,
            log_level=args.log_level
        )

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print_info("Bị ngắt bởi người dùng")
        sys.exit(0)
    except Exception as e:
        print_error(f"Lỗi không xác định: {e}")
        sys.exit(1)
