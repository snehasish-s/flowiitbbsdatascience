#!/usr/bin/env python3
"""
Startup script for Causal Chat Analysis Dashboard
Starts the Flask API backend and automatically opens the dashboard in browser
Robust version with fallback handling
"""

import webbrowser
import time
import subprocess
import sys
import os
from pathlib import Path
import socket

# Fix Unicode encoding issues on Windows
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

def check_port_available(port=5000):
    """Check if a port is available"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        result = sock.connect_ex(('127.0.0.1', port))
        return result != 0
    except:
        return True
    finally:
        sock.close()

def wait_for_server(url='http://localhost:5000', timeout=15):
    """Wait for server to be ready"""
    import time
    start = time.time()
    while time.time() - start < timeout:
        try:
            import urllib.request
            urllib.request.urlopen(url + '/api/health', timeout=2)
            return True
        except:
            time.sleep(0.5)
    return False

def main():
    print("=" * 60)
    print("🎯 Causal Chat Analysis Dashboard")
    print("=" * 60)
    print()
    
    # Check if we're in the right directory
    if not Path('api.py').exists():
        print("❌ Error: api.py not found. Please run this script from the project root directory.")
        sys.exit(1)
    
    # Check dependencies
    print("📦 Checking dependencies...")
    required_modules = ['flask', 'flask_cors']
    optional_modules = ['pandas', 'nltk']
    missing_required = []
    missing_optional = []
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"  ✓ {module}")
        except ImportError:
            missing_required.append(module)
            print(f"  ✗ {module} (required - missing)")
    
    for module in optional_modules:
        try:
            __import__(module)
            print(f"  ✓ {module}")
        except ImportError:
            missing_optional.append(module)
            print(f"  ⚠ {module} (optional - missing)")
    
    if missing_required:
        print()
        print("⚠️  Missing required dependencies. Install with:")
        print(f"   pip install {' '.join(missing_required)}")
        print()
        print("Or install all dependencies with:")
        print("   pip install -r requirements.txt")
        print()
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    print()
    print("✅ Core dependencies satisfied!")
    print()
    
    # Check if port is available
    port = 5000
    if not check_port_available(port):
        print(f"⚠️  Port {port} is already in use")
        print("   This is OK if the server is already running")
        print()
    
    # Start Flask API
    print("🚀 Starting Flask API server...")
    print(f"   http://localhost:{port}")
    print()
    
    try:
        # Start Flask app with environment variables for better error handling
        env = os.environ.copy()
        env['FLASK_ENV'] = 'production'
        env['PYTHONUNBUFFERED'] = '1'
        
        api_process = subprocess.Popen(
            [sys.executable, 'api.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            universal_newlines=True
        )
        
        # Wait for server to start with timeout
        print("⏳ Waiting for server to start...")
        server_ready = wait_for_server(timeout=20)
        
        if server_ready:
            print("✅ Server is running!")
        else:
            print("⚠️  Server may not be responding, but opening dashboard anyway...")
        
        print()
        
        # Open dashboard in browser
        dashboard_url = f'http://localhost:{port}'
        print(f"🌐 Opening dashboard in browser...")
        print(f"   {dashboard_url}")
        print()
        
        try:
            webbrowser.open(dashboard_url)
        except:
            print("⚠️  Could not open browser automatically")
            print(f"   Please open {dashboard_url} manually")
            print()
        
        # Keep the process running
        print("=" * 60)
        print("📊 Dashboard is running!")
        print("   Press Ctrl+C to stop the server")
        print("=" * 60)
        print()
        
        # Monitor the process
        while api_process.poll() is None:
            time.sleep(1)
        
        # If we reach here, process exited unexpectedly
        print()
        print("⚠️  Server process exited unexpectedly")
        stdout, stderr = api_process.communicate()
        if stderr:
            print("Errors:")
            print(stderr[:500])
        sys.exit(1)
        
    except KeyboardInterrupt:
        print()
        print()
        print("🛑 Shutting down...")
        try:
            api_process.terminate()
            api_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print("   Force killing process...")
            api_process.kill()
            api_process.wait()
        except:
            pass
        print("✅ Server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        try:
            api_process.kill()
        except:
            pass
        sys.exit(1)

if __name__ == '__main__':
    main()
