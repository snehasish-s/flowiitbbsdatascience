# QUICK START - Causal Chat Analysis Dashboard

## ⚡ fastest way to start (2 seconds)

**Windows:**
```bash
# Double-click this file:
start.bat
```

**Mac/Linux/Windows:**
```bash
python run.py
```

---

## 📊 what you'll see

A beautiful dashboard with:
- **Overview Tab** - Key metrics & charts
- **Causes Tab** - Root cause breakdown  
- **Signals Tab** - Escalation signals detected
- **Warnings Tab** - Early warning system
- **Insights Tab** - Actionable recommendations

---

## 🔍 Key Features

### Overview
- 4 main metrics (conversations, turns, escalation rate)
- Escalation breakdown (pie chart)
- Domain distribution (horizontal bar chart)
- Intent analysis (bar chart)

### Causes
- Customer Frustration tracking
- Agent Delay monitoring
- Agent Denial detection
- Cause distribution pie chart
- Real evidence & examples

### Signals
- Total signal counter
- Signal types breakdown
- Keywords organized by type
- Extraction metrics

### Early Warnings
- High-risk conversation count
- Multi-signal warnings
- Single-signal warnings
- Distribution chart
- Detection thresholds

### Insights
- Priority-based recommendations
- Impact & effort ratings
- Actionable next steps

---

## 🛠️ System Requirements

- **Python**: 3.7 or higher
- **Dependencies**: Flask, Flask-CORS (installed via requirements.txt)
- **Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)
- **Port**: 5000 (must be available)

---

## 📦 install dependencies (if needed)

```bash
pip install -r requirements.txt
```

---

## 🧪 Test Before Running

```bash
python test_ui_api.py
```

This will verify everything is set up correctly.

---

## 🚀 troubleshooting

### Port 5000 already in use
- Kill existing process OR
- Change port in `api.py` line: `app.run(..., port=5001)`

### Python not found
- Install from python.org
- Or use: `py run.py` (Windows)

### Dependencies missing
```bash
pip install flask flask_cors
```

### Browser won't open
- Manually visit: http://localhost:5000

### Charts not showing
- Wait 5 seconds for data to load
- Check browser console (F12) for errors
- Refresh page (F5)

---

## 📈 using the dashboard

1. **Start Server**: `python run.py`
2. **Open Browser**: http://localhost:5000
3. **Click Tabs**: Navigate through different analysis sections
4. **Read Metrics**: Review the metrics and charts
5. **Check Insights**: See recommendations for improvement

---

## 📞 support

If you experience issues:

1. Check terminal/console output for error messages
2. Run `python test_ui_api.py` to diagnose
3. Ensure Python 3.7+ is installed
4. Make sure port 5000 is available

---

**Version**: 2.0 - Enhanced Edition  
**Date**: February 2026  
**Status**: Production Ready ✅
