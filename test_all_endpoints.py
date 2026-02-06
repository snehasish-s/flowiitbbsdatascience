#!/usr/bin/env python3
"""
Complete test suite for all endpoints
"""
import requests
import json
import time

BASE_URL = 'http://localhost:5000'

def test_endpoint(name, method, url, data=None, expected_status=200):
    """Test a single endpoint"""
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        else:
            response = requests.post(url, json=data, timeout=10)
        
        success = response.status_code == expected_status
        status_str = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status_str} - {name}")
        print(f"  URL: {url}")
        print(f"  Status: {response.status_code} (expected {expected_status})")
        
        if response.status_code < 400:
            try:
                result = response.json()
                if isinstance(result, dict) and 'success' in result:
                    print(f"  Response: {result.get('success')}")
                elif isinstance(result, dict) and 'data' in result:
                    data_keys = list(result.get('data', {}).keys())[:3]
                    print(f"  Data fields: {data_keys}")
            except:
                print(f"  Response: {response.text[:100]}...")
        
        return success
    except requests.exceptions.Timeout:
        print(f"\n❌ TIMEOUT - {name}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR - {name}: {str(e)}")
        return False

# Run all tests
print("=" * 60)
print("DASHBOARD & API ENDPOINT TESTS")
print("=" * 60)
print(f"Testing {BASE_URL}")
print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")

results = []

# Page endpoints
results.append(test_endpoint("Dashboard Home", "GET", f"{BASE_URL}/"))
results.append(test_endpoint("Analyze Page", "GET", f"{BASE_URL}/analyze"))

# Health check
results.append(test_endpoint("Health Check", "GET", f"{BASE_URL}/api/health"))

# Data endpoints
results.append(test_endpoint("Stats Endpoint", "GET", f"{BASE_URL}/api/stats"))
results.append(test_endpoint("Causes Endpoint", "GET", f"{BASE_URL}/api/causes"))
results.append(test_endpoint("Signals Endpoint", "GET", f"{BASE_URL}/api/signals"))
results.append(test_endpoint("Warnings Endpoint", "GET", f"{BASE_URL}/api/warnings"))
results.append(test_endpoint("Domains Endpoint", "GET", f"{BASE_URL}/api/domains"))
results.append(test_endpoint("Intents Endpoint", "GET", f"{BASE_URL}/api/intents"))

# Analyze endpoint with simple transcript
simple_transcript = {
    'transcript': [
        {'speaker': 'CUSTOMER', 'text': 'Hi I need help'},
        {'speaker': 'AGENT', 'text': 'Sure I can help'}
    ]
}
results.append(test_endpoint("Analyze (Simple)", "POST", f"{BASE_URL}/api/analyze", simple_transcript))

# Analyze endpoint with escalation signals
escalation_transcript = {
    'transcript': [
        {'speaker': 'CUSTOMER', 'text': 'Hi, I ordered something'},
        {'speaker': 'AGENT', 'text': 'I can help check your order'},
        {'speaker': 'CUSTOMER', 'text': 'I am frustrated with the delays'},
        {'speaker': 'AGENT', 'text': 'Unfortunately, I cannot resolve this'},
        {'speaker': 'CUSTOMER', 'text': 'This is unacceptable!'}
    ]
}
results.append(test_endpoint("Analyze (Escalation)", "POST", f"{BASE_URL}/api/analyze", escalation_transcript))

# Summary
print("\n" + "=" * 60)
print("TEST SUMMARY")
print("=" * 60)
passed = sum(results)
total = len(results)
percentage = (passed / total * 100) if total > 0 else 0
print(f"Passed: {passed}/{total} ({percentage:.1f}%)")

if passed == total:
    print("✅ All tests passed! Dashboard is fully operational.")
elif passed >= total * 0.9:
    print("⚠️  Most tests passed. Dashboard is mostly operational.")
else:
    print("❌ Several tests failed. Dashboard may have issues.")
