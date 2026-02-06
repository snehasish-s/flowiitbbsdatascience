/**
 * Causal Chat Analysis - Analyze Page JavaScript
 * Handles form input, API calls, result display, and follow-up questions
 */

class AnalyzeApp {
    constructor() {
        this.currentTranscript = null;
        this.currentAnalysis = null;
        this.currentSessionId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        console.log('Analyze app initialized');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Input tabs
        document.querySelectorAll('.input-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchInputTab(e.target.closest('.input-tab')));
        });

        // Analyze button
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeFromText());
        
        // File handling
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.onFileSelected(e));
            
            // Drag and drop
            const uploadBox = document.querySelector('.upload-box');
            if (uploadBox) {
                uploadBox.addEventListener('dragover', (e) => this.onDragOver(e));
                uploadBox.addEventListener('drop', (e) => this.onDrop(e));
            }
        }

        // Follow-up question button
        document.getElementById('askBtn')?.addEventListener('click', () => this.askFollowupQuestion());

        // Load transcript by ID button (follow-up section)
        document.getElementById('loadTranscriptBtn')?.addEventListener('click', () => this.loadTranscriptById());

        // Enter key in transcript id input to trigger load
        document.getElementById('transcriptIdInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.loadTranscriptById();
            }
        });

        // New analysis button
        document.getElementById('newAnalysisBtn')?.addEventListener('click', () => this.newAnalysis());

        // Enter key in follow-up textarea
        document.getElementById('followupQuestion')?.addEventListener('keydown', (e) => {
            if (e.keyCode === 13 && e.ctrlKey) {
                this.askFollowupQuestion();
            }
        });
    }

    /**
     * Switch between input tabs (paste, upload, example)
     */
    switchInputTab(tab) {
        const tabName = tab.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        document.querySelectorAll('.input-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    /**
     * Load example transcript
     */
    async analyzeFromText() {
        const text = document.getElementById('transcriptText').value.trim();
        
        if (!text) {
            this.showError('Please paste a conversation transcript');
            return;
        }

        // Parse the transcript
        const transcript = this.parseTranscript(text);
        
        if (!transcript || transcript.length === 0) {
            this.showError('Could not parse transcript. Please check the format.');
            return;
        }

        // Analyze it
        await this.analyzeTranscript(transcript);
    }

    /**
     * Handle file selection
     */
    async onFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const transcript = this.parseTranscript(text);
            
            if (!transcript || transcript.length === 0) {
                this.showError('Could not parse file. Please check the format.');
                return;
            }

            // Pre-fill text area and show analyze button
            document.getElementById('transcriptText').value = text;
            this.switchInputTab(document.querySelector('[data-tab="paste"]'));
            
            // Analyze it
            await this.analyzeTranscript(transcript);
        } catch (error) {
            this.showError(`Error reading file: ${error.message}`);
        }
    }

    /**
     * Handle drag over
     */
    onDragOver(e) {
        e.preventDefault();
        e.target.closest('.upload-box').style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
    }

    /**
     * Handle drop
     */
    onDrop(e) {
        e.preventDefault();
        e.target.closest('.upload-box').style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('fileInput').files = files;
            this.onFileSelected({ target: { files } });
        }
    }

    /**
     * Parse transcript from various formats
     * Supports: plain text (CUSTOMER: / AGENT:), JSON, CSV
     */
    parseTranscript(text) {
        const turns = [];

        // Try JSON first
        try {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item.speaker && item.text) {
                        turns.push({
                            speaker: item.speaker,
                            text: item.text
                        });
                    }
                }
                return turns;
            }
        } catch (e) {
            // Not JSON, continue
        }

        // Try plain text format (CUSTOMER: / AGENT:)
        const lines = text.split('\n');
        for (const line of lines) {
            const match = line.match(/^(CUSTOMER|AGENT|Customer|Agent|CUSTOMER:|AGENT:):\s*(.+)$/i);
            if (match) {
                const speaker = match[1].replace(/:$/, '').toUpperCase();
                const text = match[2].trim();
                
                if (text) {
                    turns.push({ speaker, text });
                }
            }
        }

        // Try CSV format (speaker,text)
        if (turns.length === 0) {
            for (const line of lines) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const speaker = parts[0].trim().toUpperCase();
                    const text = parts.slice(1).join(',').trim();
                    
                    if (text && (speaker === 'CUSTOMER' || speaker === 'AGENT')) {
                        turns.push({ speaker, text });
                    }
                }
            }
        }

        return turns.length > 0 ? turns : null;
    }

    /**
     * Analyze a transcript by sending to backend
     */
    async analyzeTranscript(transcript) {
        this.showLoading(true);
        
        try {
            // Use API client to call the analyze endpoint
            const baseUrl = 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript: transcript,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            // Store results
            this.currentTranscript = transcript;
            this.currentAnalysis = data.data;
            this.currentSessionId = data.session_id; // Store session for follow-up questions

            // Display results
            this.displayResults(data.data);
            this.scrollToResults();

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(`Analysis failed: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Display analysis results
     */
    displayResults(analysis) {
        const resultsSection = document.getElementById('results');
        if (!resultsSection) return;

        // Update risk level
        const riskScore = analysis.risk_score || 0;
        const riskLevel = this.getRiskLevel(riskScore);
        
        document.getElementById('riskScore').textContent = Math.round(riskScore * 100) + '%';
        document.getElementById('riskBar').style.width = (riskScore * 100) + '%';
        
        const badge = document.getElementById('riskBadge');
        badge.textContent = riskLevel.label.toUpperCase();
        badge.className = `risk-badge ${riskLevel.class}`;

        // Update escalation status
        const isEscalated = analysis.escalated || riskScore > 0.6;
        document.getElementById('escalationStatus').textContent = isEscalated ? 'ESCALATED' : 'RESOLVED';
        document.getElementById('escalationDetail').textContent = 
            isEscalated ? 'This conversation showed escalation patterns' : 'This conversation resolved successfully';

        // Update detected signals
        const signalsList = document.getElementById('signalsList');
        signalsList.innerHTML = '';
        
        if (analysis.detected_signals && analysis.detected_signals.length > 0) {
            for (const signal of analysis.detected_signals) {
                const item = document.createElement('div');
                item.className = 'signal-item';
                item.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${this.formatSignalName(signal)}</span>
                `;
                signalsList.appendChild(item);
            }
        } else {
            signalsList.innerHTML = '<p>No escalation signals detected</p>';
        }

        // Update causal explanation
        const explanation = analysis.causal_explanation || 'No causal explanation available';
        document.getElementById('explanationText').textContent = explanation;

        // Update confidence
        const confidence = analysis.confidence || 0;
        const confidenceText = this.getConfidenceText(confidence);
        document.getElementById('confidenceLabel').textContent = `Confidence: ${Math.round(confidence * 100)}% - ${confidenceText}`;

        // Display evidence
        this.displayEvidence(analysis);

        // Display causal chain
        this.displayCausalChain(analysis);

        // Display annotated transcript
        this.displayAnnotatedTranscript(analysis);

        // Clear follow-up messages and show results
        document.getElementById('followupMessages').innerHTML = '';
        document.getElementById('sessionContext').setAttribute('data-session-id', this.currentSessionId);

        // Show results section
        resultsSection.style.display = 'block';
    }

    /**
     * Display evidence panel with highlighted turns
     */
    displayEvidence(analysis) {
        const panel = document.getElementById('evidencePanel');
        panel.innerHTML = '';

        const evidence = analysis.evidence || [];
        
        if (evidence.length === 0) {
            panel.innerHTML = '<p>No specific evidence available</p>';
            return;
        }

        for (const item of evidence) {
            const div = document.createElement('div');
            div.className = 'evidence-item';
            
            let html = `<div class="evidence-turn">Turn ${item.turn_number || '?'}</div>`;
            html += `<span class="evidence-speaker">${item.speaker || 'Unknown'}:</span>`;
            html += `<div class="evidence-text">"${item.text || ''}"</div>`;
            
            if (item.signals && item.signals.length > 0) {
                for (const signal of item.signals) {
                    html += `<span class="evidence-signal">${this.formatSignalName(signal)}</span>`;
                }
            }
            
            div.innerHTML = html;
            panel.appendChild(div);
        }
    }

    /**
     * Display causal chain as a flow diagram
     */
    displayCausalChain(analysis) {
        const chain = document.getElementById('chainDiagram');
        chain.innerHTML = '';

        const signals = analysis.causal_chain || [];
        
        if (signals.length === 0) {
            chain.innerHTML = '<p>No causal chain detected</p>';
            return;
        }

        for (let i = 0; i < signals.length; i++) {
            const step = document.createElement('div');
            step.className = 'chain-step';
            step.textContent = this.formatSignalName(signals[i]);
            chain.appendChild(step);

            if (i < signals.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'chain-arrow';
                arrow.textContent = '→';
                chain.appendChild(arrow);
            }
        }

        if (signals.length === 0) {
            const finalStep = document.createElement('div');
            finalStep.className = 'chain-step';
            finalStep.textContent = 'Escalation';
            chain.appendChild(finalStep);
        }
    }

    /**
     * Display full transcript with annotations
     */
    displayAnnotatedTranscript(analysis) {
        const container = document.getElementById('annotatedTranscript');
        container.innerHTML = '';

        const transcript = this.currentTranscript || [];
        const turnSignals = analysis.turn_signals || {};

        for (let i = 0; i < transcript.length; i++) {
            const turn = transcript[i];
            const turnNum = i + 1;
            const signals = turnSignals[turnNum] || [];

            const div = document.createElement('div');
            div.className = 'transcript-turn ' + turn.speaker.toLowerCase();
            if (signals.length > 0) {
                div.classList.add('signal');
            }

            let html = `<div class="turn-number">Turn ${turnNum}</div>`;
            html += `<span class="turn-speaker">${turn.speaker}:</span>`;
            html += `<span class="turn-text">${turn.text}</span>`;

            if (signals.length > 0) {
                html += '<div class="turn-signals">';
                for (const signal of signals) {
                    html += `<span class="turn-signal-badge">${this.formatSignalName(signal)}</span>`;
                }
                html += '</div>';
            }

            div.innerHTML = html;
            container.appendChild(div);
        }
    }

    /**
     * Ask a follow-up question about the analysis
     */
    async askFollowupQuestion() {
        const question = document.getElementById('followupQuestion').value.trim();
        
        if (!question) {
            this.showError('Please enter a question');
            return;
        }

        // Add user message to chat
        this.addMessage('user', question);
        document.getElementById('followupQuestion').value = '';

        // Show loading in chat
        this.showLoadingInChat();

        try {
            // Call follow-up endpoint
            const baseUrl = 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.currentSessionId,
                    question: question,
                    transcript: this.currentTranscript,
                    previous_analysis: this.currentAnalysis
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Query failed');
            }

            // Remove loading message
            const loadingMsg = document.getElementById('loadingMessage');
            if (loadingMsg) {
                loadingMsg.remove();
            }

            // Update session ID if needed
            if (data.session_id) {
                this.currentSessionId = data.session_id;
                document.getElementById('sessionContext').setAttribute('data-session-id', this.currentSessionId);
            }

            // Add assistant response
            const responseText = data.data.response || data.data.answer || JSON.stringify(data.data);
            this.addMessage('assistant', responseText);

        } catch (error) {
            console.error('Follow-up error:', error);
            
            // Remove loading message
            const loadingMsg = document.getElementById('loadingMessage');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            this.addMessage('assistant', `Error: ${error.message}`);
        }
    }

    /**
     * Load a transcript by its ID and show availability/details
     */
    async loadTranscriptById() {
        const transcriptId = document.getElementById('transcriptIdInput').value.trim();
        if (!transcriptId) {
            this.showError('Please enter a transcript ID');
            return;
        }

        // Add user message to chat
        this.addMessage('user', `Lookup transcript: ${transcriptId}`);
        this.showLoadingInChat();

        try {
            const baseUrl = 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/transcript/${encodeURIComponent(transcriptId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            // Remove loading message placeholder
            const loadingMsg = document.getElementById('loadingMessage');
            if (loadingMsg) loadingMsg.remove();

            if (!response.ok) {
                if (response.status === 404) {
                    this.addMessage('assistant', `Transcript '${transcriptId}' not found.`);
                    return;
                }
                throw new Error(`API error ${response.status}`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Could not retrieve transcript');
            }

            const t = data.data.transcript || {};
            const proc = data.data.processed || null;

            // Show availability and key details
            const details = [];
            details.push(`Transcript ID: ${t.transcript_id || transcriptId}`);
            if (t.time_of_interaction) details.push(`Time: ${t.time_of_interaction}`);
            if (t.domain) details.push(`Domain: ${t.domain}`);
            if (t.intent) details.push(`Intent: ${t.intent}`);
            if (t.reason_for_call) details.push(`Reason: ${t.reason_for_call}`);
            details.push(`Conversation length: ${ (t.conversation && t.conversation.length) || 'N/A' } turns`);

            this.addMessage('assistant', details.join('\n'));

            // Update current transcript to the loaded one (conversation array)
            if (t.conversation && Array.isArray(t.conversation)) {
                this.currentTranscript = t.conversation.map((turn) => ({ speaker: turn.speaker, text: turn.text }));
            }

            // Optionally set currentAnalysis from processed data signals
            if (proc) {
                this.currentAnalysis = proc;
            }

        } catch (error) {
            console.error('Load transcript error:', error);
            const loadingMsg = document.getElementById('loadingMessage');
            if (loadingMsg) loadingMsg.remove();
            this.addMessage('assistant', `Error loading transcript: ${error.message}`);
        }
    }

    /**
     * Add message to follow-up chat
     */
    addMessage(role, text) {
        const container = document.getElementById('followupMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        container.appendChild(messageDiv);
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Show loading indicator in chat
     */
    showLoadingInChat() {
        const container = document.getElementById('followupMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>';
        
        messageDiv.appendChild(bubble);
        messageDiv.id = 'loadingMessage';
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Start a new analysis
     */
    newAnalysis() {
        // Reset form
        document.getElementById('transcriptText').value = '';
        document.getElementById('fileInput').value = '';
        
        // Hide results
        document.getElementById('results').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Focus input
        document.getElementById('transcriptText').focus();
    }

    /**
     * Scroll to results
     */
    scrollToResults() {
        const results = document.getElementById('results');
        if (results) {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Show loading indicator
     */
    showLoading(show) {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Format signal name for display
     */
    formatSignalName(signal) {
        return signal
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get risk level from score
     */
    getRiskLevel(score) {
        if (score >= 0.7) {
            return { label: 'High', class: 'high' };
        } else if (score >= 0.4) {
            return { label: 'Medium', class: 'medium' };
        } else {
            return { label: 'Low', class: 'low' };
        }
    }

    /**
     * Get confidence text
     */
    getConfidenceText(confidence) {
        if (confidence >= 0.8) return 'Very High';
        if (confidence >= 0.6) return 'High';
        if (confidence >= 0.4) return 'Moderate';
        if (confidence >= 0.2) return 'Low';
        return 'Very Low';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyzeApp = new AnalyzeApp();
});

/**
 * Load example transcript into textarea
 */
function loadExample() {
    const example = `CUSTOMER: Hi, I've been trying to get my refund for 2 weeks
AGENT: I understand your frustration. Let me check your account.
AGENT: I'm looking into it... just a moment please.
CUSTOMER: This is taking forever! Why is it taking so long?
AGENT: I apologize for the wait. I see the issue now.
AGENT: Unfortunately, your order is outside the return window.
CUSTOMER: What?! This is ridiculous! I want to speak to a manager!
AGENT: I understand you're upset. Let me transfer you to supervision.
CUSTOMER: No, I'm done. You people are useless.`;

    document.getElementById('transcriptText').value = example;
    document.querySelector('[data-tab="paste"]').click();
    document.getElementById('transcriptText').focus();
}
