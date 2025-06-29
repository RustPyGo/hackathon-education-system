#!/usr/bin/env python3
"""
🚀 Launch Script cho AI Question Generator - SYNC OPTIMIZED
Khởi động server với cấu hình tối ưu cho 300 câu hỏi/lần
Author: AI Assistant
Created: 2025-06-29
"""

import os
import sys
import subprocess
from pathlib import Path

def check_environment():
    """Kiểm tra môi trường trước khi chạy"""
    print("🔍 Checking environment...")
    
    # Kiểm tra Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")
    
    # Kiểm tra .env file
    if not Path(".env").exists():
        print("❌ .env file not found")
        print("📝 Create .env with OPENAI_API_KEY=your_key")
        return False
    
    print("✅ .env file found")
    
    # Kiểm tra OpenAI API key
    from dotenv import load_dotenv
    load_dotenv()
    
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ OPENAI_API_KEY not found in .env")
        return False
    
    print("✅ OpenAI API key configured")
    
    return True

def install_dependencies():
    """Cài đặt dependencies"""
    print("📦 Installing dependencies...")
    
    try:
        # Install từ requirements_optimized.txt nếu có
        if Path("requirements_optimized.txt").exists():
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "-r", "requirements_optimized.txt"
            ])
        else:
            # Fallback to regular requirements
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "-r", "requirement.txt"
            ])
        
        print("✅ Dependencies installed")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_required_files():
    """Kiểm tra files cần thiết"""
    required_files = [
        "server_sync_optimized.py",
        "genQ.py", 
        "pdfToText.py"
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    
    print("✅ All required files present")
    return True

def start_server(port=8000, workers=1):
    """Khởi động server với cấu hình tối ưu"""
    print(f"🚀 Starting SYNC OPTIMIZED server on port {port}...")
    print("⚡ Optimizations:")
    print("   - Max 300 questions per request")
    print("   - Max 15 files per request") 
    print("   - Parallel file processing")
    print("   - Optimized caching (memory + disk)")
    print("   - Batch processing for questions")
    print("   - Sync only (no async overhead)")
    print()
    
    try:
        # Sử dụng uvicorn với cấu hình tối ưu
        cmd = [
            sys.executable, "-m", "uvicorn",
            "server_sync_optimized:app",
            "--host", "0.0.0.0",
            "--port", str(port),
            "--workers", str(workers),
            "--access-log",
            "--log-level", "info"
        ]
        
        # Thêm uvloop nếu có (Linux/Mac only)
        try:
            import uvloop
            cmd.extend(["--loop", "uvloop"])
            print("✅ Using uvloop for better performance")
        except ImportError:
            print("ℹ️ uvloop not available (Windows), using default event loop")
        
        print(f"🎯 Command: {' '.join(cmd)}")
        print("🔥 Starting server... (Ctrl+C to stop)")
        print("=" * 60)
        
        subprocess.run(cmd)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

def main():
    """Main function"""
    print("🚀 AI Question Generator - SYNC OPTIMIZED Launcher")
    print("=" * 60)
    
    # Kiểm tra môi trường
    if not check_environment():
        print("\n❌ Environment check failed")
        sys.exit(1)
    
    # Kiểm tra files
    if not check_required_files():
        print("\n❌ Required files missing")
        sys.exit(1)
    
    # Hỏi có muốn cài dependencies không
    install_deps = input("\n📦 Install/update dependencies? (y/N): ").lower().strip()
    if install_deps in ['y', 'yes']:
        if not install_dependencies():
            print("\n❌ Dependencies installation failed")
            sys.exit(1)
    
    # Chọn port
    port_input = input("\n🌐 Server port (default 8000): ").strip()
    port = int(port_input) if port_input.isdigit() else 8000
    
    print(f"\n🎯 Configuration:")
    print(f"   Mode: SYNC ONLY (optimized)")
    print(f"   Port: {port}")
    print(f"   Max questions: 300")
    print(f"   Max files: 15")
    print(f"   Workers: 1 (to avoid cache conflicts)")
    
    # Xác nhận khởi động
    confirm = input("\n🚀 Start server? (Y/n): ").lower().strip()
    if confirm not in ['', 'y', 'yes']:
        print("🛑 Cancelled")
        sys.exit(0)
    
    # Khởi động server
    start_server(port=port)

if __name__ == "__main__":
    main()
