#!/usr/bin/env python3
"""
Causal Chat Analysis - Interactive Web Interface
Streamlit-based UI for causal reasoning over conversational data

Run with: streamlit run streamlit_app.py
"""

import streamlit as st
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from src.load_data import load_transcripts
from src.preprocess import preprocess_transcripts
from src.causal_chains import CausalChainDetector
from src.causal_query_engine import CausalQueryEngine
from src.explanation_generator import ExplanationGenerator
from src.query_context import SessionManager

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
# CUSTOM CSS
# ============================================================

st.markdown("""
<style>
    .main-header {
        font-size: 2.5em;
        color: #1f77b4;
        margin-bottom: 0.3em;
    }
    .sub-header {
        font-size: 1.1em;
        color: #666;
        margin-bottom: 1.5em;
    }
    .chain-box {
        background-color: #f0f8ff;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #1f77b4;
        margin: 10px 0;
    }
    .evidence-box {
        background-color: #fffacd;
        padding: 10px;
        border-radius: 5px;
        margin: 8px 0;
        font-size: 0.95em;
    }
    .stats-box {
        background-color: #e8f5e9;
        padding: 10px;
        border-radius: 5px;
        margin: 5px 0;
    }
    .warning-box {
        background-color: #fff3cd;
        padding: 10px;
        border-radius: 5px;
        border-left: 4px solid #ffc107;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================
# TITLE & DESCRIPTION
# ============================================================

st.markdown('<h1 class="main-header">🎯 Causal Chat Analysis</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">Understand why conversations escalate with evidence-backed causal reasoning</p>', unsafe_allow_html=True)
st.markdown("---")

# ============================================================
# INITIALIZE SESSION STATE
# ============================================================

def initialize_session():
    """Initialize all session state variables"""
    if 'backend_loaded' not in st.session_state:
        st.session_state.backend_loaded = False
        st.session_state.detector = None
        st.session_state.engine = None
        st.session_state.transcripts_dict = None
        st.session_state.processed_turns = None
        st.session_state.query_context = None
        st.session_state.current_transcript = None
        st.session_state.current_explanation = None
        st.session_state.query_history = []
        st.session_state.show_top_chains = False

initialize_session()

# ============================================================
# LOAD BACKEND (Cached for performance)
# ============================================================

@st.cache_resource
def load_backend():
    """Load backend components once"""
    try:
        # Load data
        with st.spinner("Loading transcripts..."):
            transcripts = load_transcripts()
            processed = preprocess_transcripts(transcripts)
            transcripts_dict = {t["transcript_id"]: t for t in transcripts}
        
        # Initialize detector
        with st.spinner("Computing causal chains..."):
            detector = CausalChainDetector()
            detector.compute_chain_statistics(transcripts, processed)
        
        # Initialize query engine
        with st.spinner("Initializing query engine..."):
            engine = CausalQueryEngine(detector, transcripts_dict, processed)
        
        # Initialize session manager
        session_manager = SessionManager()
        context = session_manager.create_session()
        
        return {
            'detector': detector,
            'engine': engine,
            'context': context,
            'transcripts': transcripts,
            'processed': processed,
            'transcripts_dict': transcripts_dict
        }
    except Exception as e:
        raise Exception(f"Failed to load backend: {str(e)}")

# Load backend on first run
if not st.session_state.backend_loaded:
    try:
        backend = load_backend()
        st.session_state.detector = backend['detector']
        st.session_state.engine = backend['engine']
        st.session_state.query_context = backend['context']
        st.session_state.transcripts_dict = backend['transcripts_dict']
        st.session_state.processed_turns = backend['processed']
        st.session_state.backend_loaded = True
    except Exception as e:
        st.error(f"❌ {str(e)}")
        st.stop()

# ============================================================
# SIDEBAR - SESSION INFO & CONTROLS
# ============================================================

with st.sidebar:
    st.title("⚙️ System Status")
    
    # Backend status
    col1, col2 = st.columns(2)
    with col1:
        st.write("✅ **Backend Ready**")
    with col2:
        if st.button("🔄 Reset", key="sidebar_reset"):
            st.session_state.current_transcript = None
            st.session_state.current_explanation = None
            st.session_state.query_history = []
            st.rerun()
    
    # System stats
    st.markdown("---")
    st.subheader("📊 System Stats")
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Transcripts", "5,037")
        st.metric("Causal Chains", len(st.session_state.detector.chain_stats))
    with col2:
        st.metric("Turns", "84,465")
        st.metric("Avg Chain Conf.", 
                  f"{sum(s.get('confidence', 0) for s in st.session_state.detector.chain_stats.values()) / max(len(st.session_state.detector.chain_stats), 1):.1%}")
    
    # Session info
    st.markdown("---")
    st.subheader("🔗 Session")
    st.code(st.session_state.query_context.session_id, language="text")
    st.write(f"Queries: **{len(st.session_state.query_history)}**")
    
    if st.session_state.current_transcript:
        st.write(f"Current: `{st.session_state.current_transcript}`")
    
    # Documentation
    st.markdown("---")
    with st.expander("❓ How to Use"):
        st.write("""
        1. **Enter Transcript ID** — Paste a conversation ID
        2. **Ask a Question** — Use natural language
        3. **View Results** — See causal chain & evidence
        4. **Follow Up** — Ask related questions
        
        **Example questions:**
        - "Why did this escalate?"
        - "What are the main causes?"
        - "Find similar cases"
        - "Show me the evidence"
        """)

# ============================================================
# MAIN SECTION - QUERY INPUT
# ============================================================

st.markdown("### 📝 Step 1: Select Conversation")

col1, col2 = st.columns([3, 1])

with col1:
    transcript_id = st.text_input(
        "Transcript ID:",
        value=st.session_state.current_transcript or "",
        placeholder="e.g., 6794-8660-4606-3216",
        key="transcript_id_input"
    )

with col2:
    st.metric("Valid ID?", 
              "✅" if transcript_id and transcript_id in st.session_state.transcripts_dict else "❌")

st.markdown("### ❓ Step 2: Ask Your Question")

question = st.text_area(
    "Natural language question:",
    value="",
    placeholder="Why did this conversation escalate? / Tell me the causal chain / Find similar cases",
    height=80,
    key="question_input"
)

# ============================================================
# QUERY EXECUTION
# ============================================================

col1, col2, col3 = st.columns([1, 1, 2])

with col1:
    analyze_button = st.button("🔍 Analyze", use_container_width=True, key="analyze_btn")

with col2:
    if st.button("📋 Browse Chains", use_container_width=True, key="browse_chains_btn"):
        st.session_state.show_top_chains = not st.session_state.show_top_chains

with col3:
    st.empty()  # Spacing

# ============================================================
# RESULTS SECTION
# ============================================================

st.markdown("---")
st.markdown("### 📊 Results")

if analyze_button:
    # Validate input
    if not transcript_id.strip():
        st.warning("⚠️ Please enter a transcript ID")
    elif not question.strip():
        st.warning("⚠️ Please ask a question")
    else:
        # Check if transcript exists
        if transcript_id not in st.session_state.transcripts_dict:
            st.error(f"❌ Transcript ID '{transcript_id}' not found in dataset")
        else:
            # Set current transcript
            st.session_state.current_transcript = transcript_id
            
            # Get explanation
            with st.spinner("Analyzing conversation..."):
                explanation = st.session_state.engine.explain_escalation(transcript_id)
            
            if explanation:
                st.session_state.current_explanation = explanation
                
                # Store in query history
                st.session_state.query_history.append({
                    'question': question,
                    'transcript': transcript_id,
                    'timestamp': len(st.session_state.query_history)
                })
                
                # Display explanation
                st.success("✅ Analysis complete!")
                
                # Causal Chain
                st.markdown("#### 🔗 Causal Chain")
                chain_str = " → ".join(explanation.causal_chain.signals) + f" → {explanation.outcome.value}"
                st.markdown(f'<div class="chain-box"><strong>{chain_str}</strong></div>', unsafe_allow_html=True)
                
                # Confidence
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Confidence", f"{explanation.confidence:.1%}")
                with col2:
                    ci_lower, ci_upper = explanation.causal_chain.confidence_interval if hasattr(explanation.causal_chain, 'confidence_interval') else (0, 1)
                    st.metric("CI (95%)", f"[{ci_lower:.1%}, {ci_upper:.1%}]")
                with col3:
                    st.metric("Evidence Count", len(explanation.evidence_quotes))
                
                # Natural Language Explanation
                st.markdown("#### 📖 Explanation")
                explanation_text = ExplanationGenerator.generate(explanation)
                st.write(explanation_text)
                
                # Evidence
                st.markdown("#### 💬 Supporting Evidence")
                if explanation.evidence_quotes:
                    for i, quote in enumerate(explanation.evidence_quotes, 1):
                        with st.expander(
                            f"Turn {quote['turn_number']} ({quote['speaker'].upper()}) — {quote['signal'].replace('_', ' ').title()}",
                            expanded=(i==1)
                        ):
                            st.markdown(f'<div class="evidence-box">"{quote["text"]}"</div>', unsafe_allow_html=True)
                            col1, col2 = st.columns(2)
                            with col1:
                                st.caption(f"Signal: {quote['signal']}")
                            with col2:
                                st.caption(f"Confidence: {quote.get('confidence', 0):.1%}")
                else:
                    st.info("No direct evidence available")
                
                # Alternative explanations
                if explanation.alternative_chains:
                    st.markdown("#### 💭 Alternative Explanations")
                    for alt in explanation.alternative_chains[:3]:
                        alt_chain = " → ".join(alt.signals)
                        st.write(f"- {alt_chain}")
                
                # Similar cases
                st.markdown("#### 🔄 Similar Cases")
                with st.spinner("Finding similar conversations..."):
                    similar = st.session_state.engine.find_similar_cases(transcript_id, top_k=5)
                if similar:
                    st.write(f"Found {len(similar)} similar cases with the same pattern:")
                    for sim_id in similar[:5]:
                        st.code(sim_id, language="text")
                else:
                    st.info("No similar cases found")
            
            else:
                st.error(f"Could not generate explanation for {transcript_id}")

# ============================================================
# BROWSE TOP CHAINS
# ============================================================

if st.session_state.show_top_chains or (not analyze_button and st.session_state.get('show_top_chains', False)):
    st.markdown("#### 📋 Top Causal Chains")
    
    # Get sorted chains
    sorted_chains = sorted(
        st.session_state.detector.chain_stats.items(),
        key=lambda x: x[1].get('confidence', 0),
        reverse=True
    )
    
    # Display top 10
    for i, (chain_key, stats) in enumerate(sorted_chains[:10], 1):
        chain_str = " → ".join(chain_key)
        conf = stats.get('confidence', 0)
        occ = stats.get('occurrences', 0)
        
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write(f"{i}. **{chain_str}**")
        with col2:
            st.metric("Conf", f"{conf:.1%}", label_visibility="collapsed")
        with col3:
            st.metric("Count", occ, label_visibility="collapsed")

# ============================================================
# QUERY HISTORY
# ============================================================

if st.session_state.query_history:
    st.markdown("---")
    st.markdown("### 📜 Query History")
    
    with st.expander(f"View {len(st.session_state.query_history)} queries", expanded=False):
        for i, q in enumerate(st.session_state.query_history, 1):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.write(f"{i}. {q['question'][:60]}...")
            with col2:
                st.caption(f"ID: {q['transcript'][:12]}...")

# ============================================================
# FOOTER
# ============================================================

st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #999; font-size: 0.9em;">
    Built with Causal Analysis Engine | Streamlit | 2026
</div>
""", unsafe_allow_html=True)
