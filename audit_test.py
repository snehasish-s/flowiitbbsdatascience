#!/usr/bin/env python3
"""Quick audit test to verify what's actually working"""
import sys
sys.path.insert(0, '.')

def test_imports():
    """Test all imports work"""
    print("\n1. TESTING IMPORTS...")
    try:
        from src.load_data import load_transcripts
        from src.preprocess import preprocess_transcripts, label_outcome
        from src.signal_extraction import extract_signals, get_signal_confidence
        from src.config import SIGNAL_CONFIG
        from src.causal_model import Signal, CausalChain, CausalExplanation, TemporalSignalSequence, Outcome
        from src.causal_chains import CausalChainDetector
        from src.causal_query_engine import CausalQueryEngine
        from src.explanation_generator import ExplanationGenerator
        from src.query_context import QueryContext, SessionManager
        from src.cli_interface import CausalCLI
        print("   ✓ All imports successful")
        return True
    except Exception as e:
        print(f"   ✗ Import failed: {e}")
        return False

def test_data_loading():
    """Test data loading"""
    print("\n2. TESTING DATA LOADING...")
    try:
        from src.load_data import load_transcripts
        from src.preprocess import preprocess_transcripts
        
        transcripts = load_transcripts()
        print(f"   ✓ Loaded {len(transcripts)} transcripts")
        
        processed = preprocess_transcripts(transcripts)
        print(f"   ✓ Preprocessed {len(processed)} turns")
        
        return transcripts, processed
    except Exception as e:
        print(f"   ✗ Data loading failed: {e}")
        return None, None

def test_signal_extraction(transcripts, processed):
    """Test signal extraction"""
    print("\n3. TESTING SIGNAL EXTRACTION...")
    try:
        from src.signal_extraction import extract_signals, get_signal_confidence
        
        sample_turn = processed[0]
        signals = extract_signals(sample_turn)
        conf = get_signal_confidence(sample_turn, 'customer_frustration')
        
        print(f"   ✓ Sample turn ({sample_turn['speaker']}): {signals}")
        print(f"   ✓ Confidence score: {conf:.2f}")
        
        # Count signals across dataset
        total_signals = 0
        signal_types = {}
        for turn in processed[:1000]:  # Sample
            sigs = extract_signals(turn)
            for sig in sigs:
                total_signals += 1
                signal_types[sig] = signal_types.get(sig, 0) + 1
        
        print(f"   ✓ Sample of 1000 turns: {total_signals} signals")
        for sig_type, count in signal_types.items():
            print(f"      - {sig_type}: {count}")
        
        return True
    except Exception as e:
        print(f"   ✗ Signal extraction failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_causal_chains(transcripts, processed):
    """Test causal chain detection"""
    print("\n4. TESTING CAUSAL CHAIN DETECTION...")
    try:
        from src.causal_chains import CausalChainDetector
        
        detector = CausalChainDetector()
        detector.compute_chain_statistics(transcripts, processed)
        
        print(f"   ✓ Computed {len(detector.chain_stats)} causal chains")
        
        # Show top chains
        sorted_chains = sorted(
            detector.chain_stats.items(),
            key=lambda x: x[1].get('confidence', 0),
            reverse=True
        )
        
        for chain_key, stats in sorted_chains[:5]:
            conf = stats.get('confidence', 0)
            occ = stats.get('occurrences', 0)
            esc = stats.get('escalated_count', 0)
            print(f"      Chain {chain_key}: conf={conf:.2%}, occurrences={occ}, escalated={esc}")
        
        return detector, processed
    except Exception as e:
        print(f"   ✗ Causal chains failed: {e}")
        import traceback
        traceback.print_exc()
        return None, processed

def test_query_engine(detector, transcripts, processed):
    """Test query engine"""
    print("\n5. TESTING QUERY ENGINE...")
    try:
        from src.causal_query_engine import CausalQueryEngine
        
        transcripts_dict = {t['transcript_id']: t for t in transcripts}
        engine = CausalQueryEngine(detector, transcripts_dict, processed)
        
        print(f"   ✓ Query engine initialized")
        
        # Try to query
        sample_id = transcripts[0]['transcript_id']
        result = engine.explain_escalation(sample_id)
        
        if result:
            print(f"   ✓ Query successful for {sample_id}")
            print(f"      Chain: {result.causal_chain.signals}")
            print(f"      Confidence: {result.confidence:.2%}")
            print(f"      Evidence quotes: {len(result.evidence_quotes)}")
            return engine
        else:
            print(f"   ⚠ Query returned None")
            return engine
    except Exception as e:
        print(f"   ✗ Query engine failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_explanation_generator(engine):
    """Test explanation generation"""
    print("\n6. TESTING EXPLANATION GENERATOR...")
    try:
        from src.explanation_generator import ExplanationGenerator
        from src.load_data import load_transcripts
        
        transcripts = load_transcripts()
        sample_id = transcripts[0]['transcript_id']
        
        explanation = engine.explain_escalation(sample_id)
        if explanation:
            text = ExplanationGenerator.generate(explanation)
            print(f"   ✓ Generated explanation")
            print(f"      First 100 chars: {text[:100]}...")
            return True
        else:
            print(f"   ⚠ No explanation to generate")
            return False
    except Exception as e:
        print(f"   ✗ Explanation generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_session_context():
    """Test session/context"""
    print("\n7. TESTING SESSION CONTEXT...")
    try:
        from src.query_context import QueryContext, SessionManager
        
        # Test context
        ctx = QueryContext()
        ctx.add_query("Why did it escalate?", "explanation", {"test": "data"}, "tid_123")
        ctx_export = ctx.export_session()
        
        print(f"   ✓ QueryContext works")
        print(f"      Session ID: {ctx.session_id}")
        print(f"      Queries: {len(ctx_export.get('query_history', []))}")
        
        # Test session manager
        sm = SessionManager()
        session = sm.create_session()
        retrieved = sm.get_session(session.session_id)
        
        print(f"   ✓ SessionManager works")
        print(f"      Created and retrieved session: {session.session_id}")
        
        return True
    except Exception as e:
        print(f"   ✗ Session context failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_cli():
    """Test CLI"""
    print("\n8. TESTING CLI INTERFACE...")
    try:
        from src.cli_interface import CausalCLI
        print(f"   ✓ CausalCLI class exists and can be imported")
        # Don't instantiate - it would try to load full data in background
        return True
    except Exception as e:
        print(f"   ✗ CLI failed: {e}")
        return False

def main():
    print("="*70)
    print("SELF-AUDIT: CAUSAL CHAT ANALYSIS PROJECT")
    print("="*70)
    
    # Run tests
    if not test_imports():
        print("\n❌ FAILED: Cannot import core modules")
        return
    
    transcripts, processed = test_data_loading()
    if not transcripts:
        print("\n❌ FAILED: Cannot load data")
        return
    
    test_signal_extraction(transcripts, processed)
    
    detector, processed = test_causal_chains(transcripts, processed)
    if not detector:
        print("\n❌ FAILED: Cannot compute causal chains")
        return
    
    engine = test_query_engine(detector, transcripts, processed)
    if engine:
        test_explanation_generator(engine)
    
    test_session_context()
    test_cli()
    
    print("\n" + "="*70)
    print("AUDIT COMPLETE")
    print("="*70)

if __name__ == '__main__':
    main()
