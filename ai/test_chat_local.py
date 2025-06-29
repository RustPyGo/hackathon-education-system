#!/usr/bin/env python3
"""
🎯 Simple Chat Test - Test chat system locally
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server import ChatSystem

def test_chat_local():
    """Test chat system locally without server"""
    print("🧪 Testing Chat System Locally...")
    
    # Khởi tạo chat system
    chat_system = ChatSystem()
    
    # Test 1: Check cached content
    print("\n1️⃣ Checking cached content...")
    file_name = "biology-chapter1.pdf"  # Example file name
    
    cached_content = chat_system.get_cached_content(file_name)
    if cached_content:
        print(f"✅ Found cached content: {len(cached_content)} chars")
        print(f"📄 Preview: {cached_content[:200]}...")
    else:
        print("❌ No cached content found")
        # Try to find any cached files
        from pathlib import Path
        cache_dir = Path("cache")
        if cache_dir.exists():
            cache_files = list(cache_dir.glob("*_content.txt"))
            print(f"📦 Available cache files: {[f.name for f in cache_files]}")
            
            if cache_files:
                # Use first available cache file for testing
                test_file = cache_files[0]
                print(f"🧪 Testing with: {test_file.name}")
                
                with open(test_file, 'r', encoding='utf-8') as f:
                    test_content = f.read()
                
                # Mock the system to use this content
                chat_system._test_content = test_content
                
                # Test chat response
                print("\n2️⃣ Testing chat response...")
                user_message = "What is the main topic of this document?"
                
                # Override get_cached_content for testing
                original_method = chat_system.get_cached_content
                chat_system.get_cached_content = lambda x: test_content
                
                response = chat_system.generate_chat_response("test.pdf", user_message)
                print(f"🤖 Chat response: {response}")
                
                # Restore original method
                chat_system.get_cached_content = original_method
                
        else:
            print("❌ No cache directory found")

if __name__ == "__main__":
    test_chat_local()
