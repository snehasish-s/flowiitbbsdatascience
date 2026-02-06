# Streamlit Web Interface Build Guide

## Pre-Build Checklist

Before starting, verify:
```bash
python -c "import streamlit; print('✓ Streamlit installed')"
python -c "from src.causal_query_engine import CausalQueryEngine; print('✓ Backend ready')"
```

If Streamlit is not installed:
```bash
pip install streamlit
```

---

## Step 1: UI Architecture Plan

### Goal
Design the web interface structure without coding yet.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  STREAMLIT APP                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. SIDEBAR (Session Setup)                            │
│     ├─ Load Backend                                   │
│     ├─ Session ID display                            │
│     └─ Clear Session button                          │
│                                                         │
│  2. MAIN (Query Interface)                            │
│     ├─ Transcript ID input                           │
│     ├─ Natural language question                     │
│     ├─ Query button                                  │
│     └─ Query history                                 │
│                                                         │
│  3. EXPLANATION PANEL (Results)                       │
│     ├─ Causal chain visualization                    │
│     ├─ Confidence + CI                               │
│     ├─ English explanation                           │
│     └─ Evidence quotes (expandable)                  │
│                                                         │
│  4. FOLLOW-UP PANEL (Multi-turn)                      │
│     ├─ Alternative explanations                      │
│     ├─ Similar cases                                 │
│     └─ Browse all known chains                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input (transcript ID + question)
    ↓
Streamlit Session State (remember context)
    ↓
Query Engine (call explain_escalation)
    ↓
Explanation Engine (format text)
    ↓
Display in Streamlit
    ↓
Store in session for follow-ups
```

---

## Step 2: Create streamlit_app.py

### Goal
Create a minimal Streamlit app that loads the backend and initializes the UI.

### File to Create
`streamlit_app.py` (in root directory)

### Code

```python
#!/usr/bin/env python3
"""
Causal Chat Analysis - Interactive Web Interface
Streamlit-based UI for causal reasoning over conversational data
"""

import streamlit as st
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="Causal Chat Analysis",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============================================================
# TITLE & HEADER
# ============================================================

st.markdown("""
<style>
    .main-header {
        font-size: 2.5em;
        color: #1f77b4;
        margin-bottom: 0.5em;
    }
    .sub-header {
        font-size: 1.2em;
        color: #555;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="main-header">🎯 Causal Chat Analysis</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">Understand why conversations escalate</p>', unsafe_allow_html=True)
st.markdown("---")

# ============================================================
# INITIALIZE SESSION STATE
# ============================================================

if 'backend_loaded' not in st.session_state:
    st.session_state.backend_loaded = False
    st.session_state.detector = None
    st.session_state.engine = None
    st.session_state.query_context = None
    st.session_state.current_transcript = None
    st.session_state.current_explanation = None
    st.session_state.query_history = []

# ============================================================
# SIDEBAR - BACKEND INITIALIZATION
# ============================================================

with st.sidebar:
    st.title("⚙️ System Setup")
    
    if not st.session_state.backend_loaded:
        st.info("Loading backend system...")
        
        try:
            from src.load_data import load_transcripts
            from src.preprocess import preprocess_transcripts
            from src.causal_chains import CausalChainDetector
            from src.causal_query_engine import CausalQueryEngine
            from src.query_context import SessionManager
            
            # Load data
            transcripts = load_transcripts()
            processed = preprocess_transcripts(transcripts)
            transcripts_dict = {t["transcript_id"]: t for t in transcripts}
            
            # Initialize detector
            detector = CausalChainDetector()
            detector.compute_chain_statistics(transcripts, processed)
            
            # Initialize query engine
            engine = CausalQueryEngine(detector, transcripts_dict, processed)
            
            # Initialize session manager
            session_manager = SessionManager()
            context = session_manager.create_session()
            
            # Store in session state
            st.session_state.detector = detector
            st.session_state.engine = engine
            st.session_state.query_context = context
            st.session_state.backend_loaded = True
            
            st.success("✅ Backend loaded!")
            st.write(f"**System ready:**")
            st.write(f"- {len(transcripts)} transcripts")
            st.write(f"- {len(processed)} turns")
            st.write(f"- {len(detector.chain_stats)} causal chains")
            
        except Exception as e:
            st.error(f"Failed to load backend: {str(e)}")
            st.stop()
    
    else:
        st.success("✅ Backend loaded")
        
        # Session info
        st.subheader("Session Info")
        st.write(f"**Session ID:** `{st.session_state.query_context.session_id}`")
        st.write(f"**Queries:** {len(st.session_state.query_history)}")
        
        # Current context
        if st.session_state.current_transcript:
            st.write(f"**Current Transcript:** `{st.session_state.current_transcript}`")
        
        # Clear session button
        if st.button("🔄 Clear Session"):
            st.session_state.current_transcript = None
            st.session_state.current_explanation = None
            st.session_state.query_history = []
            st.rerun()
    
    st.markdown("---")
    st.caption("Built with Causal Analysis Engine")

# ============================================================
# MAIN CONTENT - QUERY INTERFACE
# ============================================================

if not st.session_state.backend_loaded:
    st.error("Backend not loaded. Check sidebar.")
    st.stop()

# Create two columns for input
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📝 Select Transcript")
    transcript_id = st.text_input(
        "Enter transcript ID or select from list:",
        value=st.session_state.current_transcript or "",
        placeholder="e.g., 6794-8660-4606-3216",
        key="transcript_input"
    )

with col2:
    st.subheader("📊 Quick Stats")
    st.metric("Available Transcripts", "5,037")
    st.metric("Causal Chains", len(st.session_state.detector.chain_stats))

st.markdown("---")

# Question input
st.subheader("❓ Ask Your Question")
question = st.text_area(
    "What would you like to know?",
    value="",
    placeholder="e.g., Why did this conversation escalate? / Tell me about the causal chain / Find similar cases",
    height=80,
    key="question_input"
)

# Query button
col1, col2, col3 = st.columns([1, 1, 2])

with col1:
    query_button = st.button("🔍 Analyze", use_container_width=True)

with col2:
    if st.button("📋 Top Chains", use_container_width=True):
        st.session_state.show_top_chains = True

# ============================================================
# PLACEHOLDER FOR RESULTS
# ============================================================

st.markdown("---")

# Results will be displayed here (see Step 3+)
result_placeholder = st.container()

