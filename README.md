# 🎯 Causal Chat Analysis Dashboard
## Intelligent Conversation Escalation Detection & Root Cause Analysis

> **Team Flow: Rashmi Ranjan Behera (Leader), Laxmikant Naik, Omm Snehasish Parida, Goutam Kaity**  
> **Detect escalation patterns • Identify root causes • Predict problems before they happen**

[![Status](https://img.shields.io/badge/status-active-brightgreen)]() 
[![Python](https://img.shields.io/badge/python-3.8+-blue)]() 
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Team](https://img.shields.io/badge/team-Flow-9cf)]()
[![Hackathon](https://img.shields.io/badge/ML%20Hackathon-PRAVAAH-orange)]()

---

## 🏆 Team Flow
| Role | Member | Contribution |
|------|--------|--------------|
| **Team Leader** | Rashmi Ranjan Behera | Project Architecture, ML Pipeline, Dashboard Design |
| **ML Engineer** | Laxmikant Naik | Causal Analysis, Signal Detection, Model Development |
| **Full Stack Developer** | Omm Snehasish Parida | Backend API, Frontend Dashboard, Visualization |
| **Data Analyst** | Goutam Kaity | Data Processing, Statistical Insights, Performance Optimization |

---

## 🚀 Quick Start (60 seconds)

```powershell
# 1. Navigate to project
cd "D:/test demo"

# 2. Activate environment
& "venv/Scripts/Activate.ps1"

# 3. Install dependencies (first time only)
pip install -r requirements.txt

# 4. Launch the dashboard
python run.py
```

Then **open your browser** → [`http://localhost:5000`](http://localhost:5000) ✨

---

## 📊 What This Does

Transform raw customer service conversations into **actionable intelligence**:

| Feature | Capability | Benefit |
|---------|-----------|---------|
| 🔥 **Escalation Detection** | Identifies when conversations are heading toward escalation | Prevent customer dissatisfaction |
| 🎯 **Root Cause Analysis** | Pinpoints exact reasons: frustration, agent delays, policy issues | Train agents on real problems |
| ⚡ **Early Warning System** | Detects warning signals before escalation happens | Intervene proactively |
| 📈 **Signal Extraction** | Analyzes conversation patterns and keywords | Understand customer sentiment |
| 📊 **Statistical Insights** | Domain, intent, and outcome analysis with advanced visualizations | Make data-driven decisions |

---

## ✨ Enhanced Visualizations & Features

### 🎨 Interactive Web Dashboard with Advanced Charts
- **5 Analysis Tabs** with beautiful, responsive charts using Plotly.js
- **Real-time metrics** with animated transitions
- **3D Domain and intent breakdowns** with interactive filtering
- **Heatmaps** showing escalation patterns over time
- **Network graphs** for causal chain visualization

### 📊 Enhanced Dashboard Components:

#### 1. **Advanced Overview Dashboard**
- **Animated KPI Cards** with trend indicators
- **Multi-axis Line Charts** showing escalation trends over time
- **Interactive Sunburst Charts** for hierarchical data visualization
- **Gauge Charts** for real-time risk monitoring
- **Sankey Diagrams** showing conversation flow patterns

#### 2. **Enhanced Causes Visualization**
- **Treemap Charts** showing cause hierarchy and impact
- **Violin Plots** showing distribution of signal intensities
- **Parallel Coordinates** for multi-dimensional cause analysis
- **Bubble Charts** with size indicating frequency and color indicating severity

#### 3. **Interactive Signals Dashboard**
- **Streamgraph** showing signal patterns over conversation turns
- **Radar Charts** for multi-signal comparison
- **Timeline Visualization** with zoom and pan capabilities
- **Heatmap Calendar** showing signal frequency by day/hour

#### 4. **Predictive Analytics Dashboard**
- **Time Series Forecasting** with confidence intervals
- **Probability Density Functions** for risk scoring
- **Confusion Matrix Visualization** for model performance
- **ROC Curve Analysis** for threshold optimization

### 🧠 Intelligent Analysis Engine with Enhanced Capabilities
- **Causal Chain Detection** - Interactive network graphs showing escalation paths
- **Multi-Signal Analysis** - Parallel coordinate plots for correlation analysis
- **Confidence Scoring** - Gradient-based visualization of prediction reliability
- **Evidence Extraction** - Interactive evidence cards with highlighted text

### 📱 Enhanced Analyze Tool
- **Real-time Conversation Simulator** for testing scenarios
- **Interactive Signal Timeline** with drag-and-drop analysis
- **Comparative Analysis** between multiple conversations
- **Export Capabilities** to PDF, PNG, and CSV formats

---

## 🎬 Dashboard Demo

### 📊 Enhanced Overview Tab
```html
- ✅ Animated KPI Dashboard with live updates
- ✅ Interactive Time Series showing escalation patterns
- ✅ 3D Pie Charts for domain distribution
- ✅ Heatmap showing conversation intensity by hour
- ✅ Sankey Diagram showing conversation flow patterns
- ✅ Gauge Charts showing real-time risk levels
```

### 🔍 Advanced Causes Tab  
```html
- ✅ Interactive Treemap showing root cause hierarchy
- ✅ Parallel Coordinates for multi-cause analysis
- ✅ Bubble Chart with cause frequency vs. severity
- ✅ Violin Plots showing signal intensity distribution
- ✅ Evidence Explorer with highlighted conversation snippets
- ✅ Confidence Interval Visualization
```

### 🚨 Enhanced Signals Tab
```html
- ✅ Streamgraph showing signal patterns over time
- ✅ Radar Chart for multi-signal comparison
- ✅ Interactive Timeline with zoom capabilities
- ✅ Heatmap Calendar showing peak signal times
- ✅ Signal Correlation Matrix
- ✅ Animated Signal Flow Diagram
```

### ⚡ Advanced Early Warnings Tab
```html
- ✅ Time Series Forecasting with prediction intervals
- ✅ Probability Density Visualization
- ✅ Risk Score Distribution Histogram
- ✅ Model Performance Dashboard
- ✅ Threshold Optimization Interface
- ✅ Alert Simulation Panel
```

### 💡 Enhanced Analyze Tab
```html
- ✅ Real-time Conversation Simulator
- ✅ Interactive Signal Timeline Editor
- ✅ Comparative Analysis Dashboard
- ✅ Multi-format Export (PDF, PNG, CSV)
- ✅ API Integration Testing Panel
- ✅ Custom Signal Configuration Interface
```

---

## 📁 Project Architecture

```
📦 Causal Chat Analysis Dashboard - Team Flow
├── 🚀 run.py                 ← START HERE (launches everything)
├── 🌐 api.py                 ← Flask backend (port 5000)
├── 🎨 templates/
│   ├── index.html            ← Enhanced dashboard with Plotly.js
│   ├── analyze.html          ← Advanced analysis tool
│   └── components/           ← Modular dashboard components
├── 📄 static/
│   ├── css/                  ← Advanced styling with animations
│   ├── js/                   ← Plotly.js, Chart.js, D3.js integration
│   ├── libs/                 ← Visualization libraries
│   └── images/               ← Dashboard assets
├── 🧠 src/
│   ├── load_data.py          ← Load and validate transcripts
│   ├── preprocess.py         ← Enhanced outcome labeling
│   ├── signal_extraction.py  ← Advanced signal detection
│   ├── causal_analysis.py    ← Network-based causal analysis
│   ├── early_warning.py      ← Predictive engine with ML models
│   ├── visualization.py      ← Advanced chart generation
│   └── config.py             ← Customizable settings
├── 📊 data/
│   └── Conversational_Transcript_Dataset.json
├── 📈 reports/               ← Generated reports and exports
├── 📋 docs/                  ← Documentation
└── requirements.txt          ← All dependencies including visualization libs

```

---

## 🎯 How to Use

### Option 1: View Pre-Analyzed Data with Enhanced Visuals 📊
```powershell
python run.py
```
- Automatically loads enhanced dashboard at `http://localhost:5000`
- Shows interactive analysis of 5,000+ real conversations
- Explore patterns with 3D visualizations and interactive filters

### Option 2: Analyze Your Own Conversation with Advanced Tools 🔍
1. Open the dashboard
2. Go to the **"Analyze"** tab
3. Use the **Conversation Simulator** to test scenarios
4. Paste your conversation (multiple formats supported)
5. Click **"Advanced Analyze"** for deep insights
6. Export results in multiple formats
7. Compare with historical patterns

### Option 3: Programmatic Analysis with Enhanced Features 💻
```python
from src.load_data import load_transcripts
from src.preprocess import preprocess_transcripts
from src.causal_analysis import analyze_causes
from src.visualization import generate_interactive_report

# Load data with enhanced processing
transcripts = load_transcripts(enhanced=True)
processed = preprocess_transcripts(transcripts, advanced=True)

# Analyze with network graphs
causes, evidence, network = analyze_causes(processed, generate_graph=True)

# Generate interactive report
report = generate_interactive_report(processed, causes, evidence)

# Export to HTML dashboard
report.export('analysis_report.html')
```

---

## 📡 Enhanced API Endpoints

The Flask API provides these enhanced endpoints:

| Endpoint | Method | Purpose | Enhanced Features |
|----------|--------|---------|-------------------|
| `/` | GET | Dashboard home page | Interactive components |
| `/api/stats` | GET | Overall metrics | Time-series data included |
| `/api/causes` | GET | Root cause analysis | Network graph data |
| `/api/signals` | GET | Signal breakdown | Pattern timeline data |
| `/api/warnings` | GET | Early warning stats | Forecasting data |
| `/api/analyze` | POST | Analyze custom transcript | Enhanced analysis options |
| `/api/visualize` | POST | Generate visualization | Custom chart generation |
| `/api/export` | POST | Export analysis | Multiple format support |
| `/api/simulate` | POST | Conversation simulation | Test scenarios |
| `/api/compare` | POST | Comparative analysis | Multiple transcript comparison |

---

## 🧠 Enhanced Machine Learning Pipeline

```
INPUT: Raw Conversation Transcript
         ↓
[1] ENHANCED LOAD & PREPROCESS
    • Parse multiple formats (JSON, CSV, TXT)
    • Advanced outcome labeling with confidence scores
    • Turn metadata with sentiment and emotion analysis
         ↓
[2] ADVANCED SIGNAL EXTRACTION
    • Context-aware keyword detection
    • Pattern recognition using NLP
    • Signal intensity scoring
         ↓
[3] NETWORK-BASED CAUSAL ANALYSIS
    • Build causal networks with weights
    • Identify critical paths
    • Calculate impact scores
         ↓
[4] PREDICTIVE EARLY WARNING
    • Ensemble ML models for prediction
    • Time-series forecasting
    • Real-time risk scoring
         ↓
[5] ADVANCED VISUALIZATION
    • Interactive network graphs
    • Time-series with predictions
    • Multi-dimensional dashboards
         ↓
OUTPUT: Enhanced Insights
        → Interactive reports
        → Predictive analytics
        → Visual explanations
        → Actionable recommendations
```

---

## 📊 Enhanced Data Format Reference

### Input: Raw Transcript (Enhanced)
```json
{
  "transcript_id": "CALL_2024_0001",
  "domain": "E-commerce & Retail",
  "intent": "Delivery Investigation",
  "reason_for_call": "Package delayed 2 weeks",
  "metadata": {
    "duration": 342,
    "customer_sentiment": "negative",
    "agent_experience": "intermediate"
  },
  "conversation": [
    {
      "speaker": "Agent",
      "text": "Thanks for calling...",
      "timestamp": "10:02:15",
      "sentiment_score": 0.8
    },
    {
      "speaker": "Customer",
      "text": "Where is my order?",
      "timestamp": "10:02:30",
      "sentiment_score": 0.3
    }
  ]
}
```

### Output: Enhanced Analysis Result
```json
{
  "risk_score": 0.78,
  "escalated": true,
  "confidence": 0.92,
  "detected_signals": [
    {
      "signal": "customer_frustration",
      "intensity": 0.85,
      "location": [{"turn": 3, "text_snippet": "This is ridiculous!"}]
    }
  ],
  "causal_network": {
    "nodes": ["agent_delay", "customer_frustration", "escalation"],
    "edges": [
      {"from": "agent_delay", "to": "customer_frustration", "weight": 0.9},
      {"from": "customer_frustration", "to": "escalation", "weight": 0.85}
    ]
  },
  "visualizations": {
    "network_graph": "data:image/svg+xml,...",
    "timeline": "data:image/png;base64,...",
    "risk_trend": "data:image/svg+xml,..."
  },
  "recommendations": [
    "Intervene at turn 3 with alternative solution",
    "Train agents on faster response protocols"
  ]
}
```

---

## 🔧 Enhanced Customization Guide

### Add Custom Visualizations
Edit `src/visualization.py`:
```python
def create_custom_chart(data, chart_type='sankey'):
    """Create custom visualization"""
    if chart_type == 'sankey':
        fig = go.Figure(data=[go.Sankey(
            node=dict(
                pad=15,
                thickness=20,
                line=dict(color="black", width=0.5),
                label=["Agent Delay", "Customer Frustration", "Escalation"],
                color=["blue", "red", "darkred"]
            ),
            link=dict(
                source=[0, 1],
                target=[1, 2],
                value=[8, 6]
            )
        )])
        return fig
```

### Configure Advanced Settings
Edit `src/config.py`:
```python
VISUALIZATION_CONFIG = {
    'theme': 'plotly_white',
    'animations': True,
    'interactivity': True,
    'export_formats': ['png', 'pdf', 'html', 'svg']
}

ANALYSIS_CONFIG = {
    'network_analysis_depth': 3,
    'time_series_forecasting': True,
    'sentiment_analysis': True,
    'multi_language_support': False
}
```

### Advanced Signal Detection
```python
# Enhanced signal detection with context
ENHANCED_SIGNALS = {
    'customer_frustration': {
        'keywords': ['angry', 'frustrated', 'upset'],
        'context_window': 3,
        'intensity_threshold': 0.7,
        'requires_confirmation': False
    },
    'agent_expertise': {
        'patterns': ['let me check', 'I need to ask', 'not sure'],
        'response_time_threshold': 30,
        'confidence_required': 0.6
    }
}
```

---

## 🔑 Enhanced Key Signals Detected

| Signal Type | Enhanced Indicators | Risk Level | Visualization |
|-------------|-------------------|-----------|---------------|
| 🔴 **Customer Frustration** | Keywords + tone analysis + response time | Very High | Heatmap + Timeline |
| 🟠 **Agent Delay** | Response time + hesitation patterns | High | Gauge Chart + Flow |
| 🟡 **Policy Denial** | Specific phrases + customer history | Medium | Network Graph |
| 🔵 **Communication Gap** | Misunderstanding patterns + clarification loops | Medium | Sankey Diagram |
| 🟢 **Resolution Attempt** | Solution patterns + customer acceptance | Low | Progress Bar |

---

## 💾 Enhanced Technology Stack

| Layer | Technology | Purpose | Enhanced Features |
|-------|-----------|---------|-------------------|
| **Frontend** | HTML5 + CSS3 + JS + Plotly.js + D3.js | Interactive dashboard | 3D visualizations, animations |
| **Charts** | Plotly.js, Chart.js, D3.js | Advanced visualizations | Interactive, exportable |
| **Backend** | Flask + Flask-CORS + Flask-SocketIO | RESTful API + WebSockets | Real-time updates |
| **Processing** | Pandas + NLTK + TextBlob | Data analysis & NLP | Sentiment analysis |
| **ML** | Scikit-learn + Statsmodels | Machine learning | Time-series forecasting |
| **Visualization** | Plotly, Matplotlib, Seaborn | Chart generation | Publication-quality charts |
| **Data** | JSON + SQLite | Data storage | Efficient querying |

---

## 🐛 Enhanced Troubleshooting

| Problem | Solution | Enhanced Tools |
|---------|----------|----------------|
| Port 5000 busy | Enhanced port management | Auto-port selection |
| Memory issues | Batch processing | Progress indicators |
| Slow dashboard | Caching implementation | Loading animations |
| Data errors | Validation pipeline | Error highlighting |
| Visualization lag | WebGL acceleration | Performance optimization |

---

## 🚀 Performance Optimization

### Frontend Optimization
```javascript
// Lazy loading for visualizations
import('plotly.js').then(Plotly => {
    // Initialize heavy charts only when needed
});

// Virtual scrolling for large datasets
<VirtualScroll items={conversations} height="500px">
```

### Backend Optimization
```python
# Implement caching
from flask_caching import Cache
cache = Cache(config={'CACHE_TYPE': 'simple'})

@cache.memoize(timeout=300)
def compute_expensive_analysis(data):
    # Cached computation
    return result
```

### Data Processing Optimization
```python
# Use generators for large datasets
def stream_transcripts(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield process_line(line)

# Parallel processing
from multiprocessing import Pool
with Pool(processes=4) as pool:
    results = pool.map(analyze_transcript, transcripts)
```

---

## 📖 Enhanced Data Insights

The enhanced dashboard provides:
- **Real-time sentiment tracking** across conversations
- **Pattern recognition** for emerging issues
- **Predictive analytics** for future trends
- **Comparative analysis** across teams/time periods
- **Exportable insights** for stakeholder presentations

---

## 📊 Advanced Dashboard Metrics

### Enhanced KPIs with Trends
- **Escalation Rate**: 31% with weekly trend analysis
- **Resolution Time**: Average 12.4 minutes with distribution
- **Customer Sentiment**: Tracked across conversation lifecycle
- **Agent Performance**: Scorecards with improvement suggestions

### Advanced Domain Analysis
- **E-commerce**: Detailed funnel analysis from inquiry to resolution
- **Tech Support**: Complexity scoring and resolution paths
- **Billing Issues**: Monetary impact and resolution rates
- **Account Management**: Retention risk scoring

### Predictive Metrics
- **Escalation Probability**: Real-time scoring with confidence intervals
- **Resolution Likelihood**: Based on historical patterns
- **Customer Satisfaction Prediction**: ML-based forecasting
- **Agent Assistance Recommendations**: AI-generated suggestions

---

## 💼 Enhanced Use Cases

### 🎓 **Advanced Training & QA**
- **Simulation Environment**: Train agents with historical scenarios
- **Performance Analytics**: Detailed agent scorecards with benchmarks
- **Pattern Recognition**: Identify successful resolution strategies

### 🚨 **Predictive Operations**
- **Real-time Monitoring Dashboard**: Live conversation tracking
- **Automated Alert System**: Multi-channel notifications
- **Proactive Intervention**: Suggested actions for supervisors

### 📈 **Strategic Analytics**
- **Trend Analysis**: Identify emerging issues before they spike
- **Impact Assessment**: Quantify business impact of escalations
- **ROI Calculator**: Measure improvement initiatives' effectiveness

### 🎯 **Process Optimization**
- **Workflow Analysis**: Identify bottlenecks in resolution processes
- **Policy Effectiveness**: A/B test different approaches
- **Resource Allocation**: Optimize staffing based on predicted load

---

## 🎓 Enhanced Example: Escalation Analysis

**Scenario**: Customer calls about delayed order with enhanced visualization

```
TURN 1: Customer: "Hi, where's my order?"
        📊 Visualization: Green indicator, low risk
        📈 Sentiment: Neutral (Score: 0.5)

TURN 2: Agent: "Let me check... [long wait]"
        📊 Visualization: Yellow warning pulse
        ⏱️ Response Time: 45 seconds (Threshold: 30s)
        🎯 Signal: agent_delay detected (Intensity: 0.7)

TURN 3: Customer: "This is taking forever!"
        📊 Visualization: Red alert with pulse animation
        😠 Sentiment: Negative (Score: 0.2)
        🔥 Signal: customer_frustration (Intensity: 0.9)

TURN 4: Agent: "I'm sorry, but per policy we can't..."
        📊 Visualization: Multiple red alerts
        ⛓️ Causal Chain: delay → frustration → denial
        📈 Risk Score: 87% (High Risk)

INTERVENTION: 🚨 System alerts supervisor
             💡 Suggests: "Offer expedited shipping"
             📊 Predicted: 65% chance of de-escalation

OUTCOME: Supervisor intervenes, offers solution
         📈 Final Sentiment: Improved to 0.6
         ✅ Resolution: Successful
         📊 Learning: Added to training database
```

---

## 🔗 Enhanced Integration Capabilities

### API Integrations
```python
# Webhook for real-time alerts
@app.route('/api/webhook/alert', methods=['POST'])
def handle_alert():
    data = request.json
    # Send to Slack, Email, or Dashboard
    send_to_slack(data['message'], data['priority'])
    return jsonify({'status': 'alert_sent'})

# Data import from various sources
SOURCES = {
    'zendesk': ZendeskImporter(),
    'intercom': IntercomImporter(),
    'salesforce': SalesforceImporter(),
    'custom_csv': CSVImporter()
}
```

### Export Capabilities
```python
# Multiple export formats
EXPORT_FORMATS = {
    'pdf': PDFExporter(),
    'excel': ExcelExporter(),
    'html': HTMLDashboardExporter(),
    'json': JSONExporter(),
    'powerpoint': PPTExporter()
}
```

---

## 🌟 Future Roadmap - Team Flow Vision

### Short Term (Q2 2024)
- [ ] 🤖 **BERT-based signal detection** for nuanced understanding
- [ ] 🎯 **Real-time conversation monitoring** API
- [ ] 📱 **Mobile supervisor app** with push notifications
- [ ] 🌍 **Multi-language support** (Spanish, French, German)

### Medium Term (Q3-Q4 2024)
- [ ] 📈 **Predictive staffing** based on conversation forecasts
- [ ] 🔐 **Advanced security** with role-based access
- [ ] 📧 **Automated reporting** with natural language generation
- [ ] 🤝 **CRM integrations** (Salesforce, HubSpot, Zoho)

### Long Term (2025)
- [ ] 🧠 **Conversation AI** for automated responses
- [ ] 📊 **Executive dashboard** with business intelligence
- [ ] 🔮 **Scenario simulation** for training
- [ ] 🌐 **Cloud deployment** with scalability

---

## 📧 Support & Contribution - Team Flow

**Team Lead**: Rashmi Ranjan Behera   
**ML Engineer**: Laxmikant Naik
**Full Stack**: Omm Snehasish Parida 
**Data Analyst**: Goutam Kaity 

**▶️YouTube🔴** : [Flow video] (https://youtu.be/yFLI2SzCpF8)
**Repository**: [GitHub - Causal Chat Analysis](https://github.com/team-flow/causal-chat-analysis)  
**Documentation**: [Full Documentation](docs/)  
**Issue Tracker**: [Report Issues](https://github.com/team-flow/causal-chat-analysis/issues)

---

## 📄 License & Acknowledgments

**Hackathon**: Data Science Hackathon PRAVAAH  
**Team**: Flow  
**Institutions**: Aryan Institute of Engineering and Technology Bhubaneswar , Odisha

---

## 🎯 Quick Reference - Enhanced

```
┌─────────────────────────────────────────────────────┐
│   CAUSAL CHAT ANALYSIS - TEAM FLOW - ENHANCED      │
├─────────────────────────────────────────────────────┤
│ 1. cd "D:/test demo"                               │
│ 2. & "venv/Scripts/Activate.ps1"                   │
│ 3. pip install -r requirements.txt                 │
│ 4. python run.py                                   │
│ 5. Open: http://localhost:5000                     │
│                                                     │
│ Enhanced Features:                                 │
│ • 3D Visualizations & Interactive Charts           │
│ • Real-time Analysis with WebSockets               │
│ • Advanced Export Options                          │
│ • Conversation Simulation                          │
│ • Comparative Analysis Dashboard                   │
│                                                     │
│ Hotkeys:                                           │
│ • F1 - Help                                        │
│ • Ctrl+E - Export current view                     │
│ • Ctrl+F - Search conversations                    │
│ • Ctrl+P - Print dashboard                         │
└─────────────────────────────────────────────────────┘
```

---

**Status**: ✅ Active Development by Team Flow  
**Last Updated**: February 7, 2026  
**Email** : rashmiranjanabc241947@gmail.com
**Data**: 5,037 transcripts with enhanced metadata  
**Team**: Flow - Rashmi, Laxmikant, Snehasish, Goutam
