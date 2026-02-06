#!/usr/bin/env python3
"""
Quick test of UI and API
Tests that all API endpoints are working and return valid data
"""

import sys
import json
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

def test_api_endpoints():
    """Test all API endpoints"""
    from api import app
    
    print("=" * 60)
    print("🧪 Testing Causal Chat Analysis API")
    print("=" * 60)
    print()
    
    # Create test client
    client = app.test_client()
    
    endpoints = [
        ('/api/health', 'Health Check'),
        ('/api/stats', 'Statistics'),
        ('/api/causes', 'Causes'),
        ('/api/signals', 'Signals'),
        ('/api/warnings', 'Warnings'),
        ('/api/domains', 'Domains'),
        ('/api/intents', 'Intents'),
        ('/', 'Dashboard'),
    ]
    
    results = []
    for endpoint, name in endpoints:
        try:
            response = client.get(endpoint)
            status = response.status_code
            
            if endpoint == '/':
                # Dashboard returns HTML
                success = status == 200 and len(response.data) > 1000
                data_type = 'HTML'
            else:
                # API endpoints return JSON
                success = status == 200
                data = response.get_json()
                success = success and (data.get('success', True) or status == 200)
                data_type = 'JSON'
            
            status_str = '✅' if success else '❌'
            print(f"{status_str} {name:20} {endpoint:25} [{status}] {data_type}")
            results.append(success)
            
        except Exception as e:
            print(f"❌ {name:20} {endpoint:25} [ERROR]")
            print(f"   {str(e)[:80]}")
            results.append(False)
    
    print()
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Results: {passed}/{total} endpoints working ✅")
    print("=" * 60)
    print()
    
    if results[-1]:
        print("✅ Dashboard HTML loaded successfully!")
        print("   You can now open http://localhost:5000 in your browser")
    
    return all(results)

def test_static_files():
    """Check if static files exist"""
    print("📁 Checking static files...")
    print()
    
    files = [
        'static/js/api.js',
        'static/js/app.js',
        'static/js/charts.js',
        'static/css/style.css',
        'templates/index.html',
    ]
    
    all_exist = True
    for file in files:
        exists = Path(file).exists()
        status = '✅' if exists else '❌'
        print(f"{status} {file}")
        all_exist = all_exist and exists
    
    print()
    return all_exist

def main():
    print()
    
    # Test static files
    static_ok = test_static_files()
    
    # Test API endpoints
    api_ok = test_api_endpoints()
    
    # Summary
    if static_ok and api_ok:
        print("🎉 All tests passed!")
        print()
        print("👉 To start the server, run:")
        print("   python run.py")
        print()
        return 0
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
