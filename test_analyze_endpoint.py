#!/usr/bin/env python3
"""Test the analyze endpoint"""
import requests
import json

url = 'http://localhost:5000/api/analyze'
data = {
    'transcript': [
        {'speaker': 'CUSTOMER', 'text': 'Hi, I ordered something 3 days ago'},
        {'speaker': 'AGENT', 'text': 'I can help check your order.'},
        {'speaker': 'CUSTOMER', 'text': 'I am very frustrated with the long delays! This is slow and unacceptable'},
        {'speaker': 'AGENT', 'text': 'Unfortunately, I cannot resolve this issue. It is impossible.'},
        {'speaker': 'CUSTOMER', 'text': 'I am angry and disappointed with this service!'}
    ]
}

try:
    response = requests.post(url, json=data, timeout=5)
    print(f'Status Code: {response.status_code}')
    
    result = response.json()
    print(f'Success: {result.get("success")}')
    
    analysis = result.get('data', {})
    print(f'Risk Score: {analysis.get("risk_score"):.2f}')
    print(f'Escalated: {analysis.get("escalated")}')
    print(f'Detected Signals: {analysis.get("detected_signals")}')
    print(f'Signal Count: {analysis.get("signal_count")}')
    print(f'Turn Count: {analysis.get("turn_count")}')
    print(f'Explanation: {analysis.get("causal_explanation")}')
    print(f'\nFull Response: {json.dumps(result, indent=2)}')
except requests.exceptions.RequestException as e:
    print(f'Request Error: {e}')
except Exception as e:
    print(f'Error: {e}')
