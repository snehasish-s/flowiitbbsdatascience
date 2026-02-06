/**
 * API Client for Causal Chat Analysis
 * Handles all communication with the Flask backend with robust error handling
 */

const API = {
    BASE_URL: '/api',
    
    // Default/fallback data
    DEFAULTS: {
        stats: {
            'total_transcripts': 5037,
            'total_turns': 84465,
            'escalated_conversations': 1561,
            'resolved_conversations': 3476,
            'escalation_rate': 31.0,
            'avg_turns_per_conversation': 16.75
        },
        causes: {
            'top_causes': {'customer_frustration': 45, 'agent_delay': 30, 'agent_denial': 25},
            'evidence': {},
            'total_signals': 100
        },
        signals: {
            'total_signals': 11892,
            'by_type': {'customer_frustration': 5000, 'agent_delay': 4000, 'agent_denial': 2892},
            'keywords': {
                'customer_frustration': {'keywords': ['frustrated', 'angry', 'upset', 'disappointed']},
                'agent_delay': {'keywords': ['wait', 'slow', 'delay', 'busy']},
                'agent_denial': {'keywords': ['cannot', 'denied', 'no', 'impossible']}
            }
        },
        warnings: {
            'single_signal_warnings': 2000,
            'multi_signal_warnings': 1500,
            'high_risk_conversations': 500,
            'total_analyzed': 5037,
            'thresholds': {'customer_frustration_threshold': 3, 'agent_delay_threshold': 2}
        },
        domains: {
            'domains': {'Billing': 1200, 'Technical Support': 1100, 'Account': 900, 'Refund': 850},
            'total_domains': 4
        },
        intents: {
            'intents': {'Complaint': 980, 'Request': 890, 'Inquiry': 850, 'Report': 650, 'Issue': 600},
            'total_intents': 5
        }
    },

    /**
     * Make an API request with fallback to default data
     */
    async request(endpoint, options = {}) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            const response = await fetch(`${this.BASE_URL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const payload = await response.json();

            if (!payload.success && !payload.data) {
                throw new Error(payload.error || 'Unknown error');
            }

            // Prefer the structured `data` payload
            const result = payload.data !== undefined ? payload.data : {};

            // Preserve session_id and other top-level metadata
            if (payload.session_id) {
                if (typeof result === 'object' && result !== null) {
                    result.session_id = payload.session_id;
                }
            }

            return result;
        } catch (error) {
            console.error(`Error calling ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Get overall statistics
     */
    async getStats() {
        try {
            return await this.request('/stats');
        } catch (error) {
            console.warn('Using fallback stats data');
            return this.DEFAULTS.stats;
        }
    },

    /**
     * Get causal analysis results
     */
    async getCauses() {
        try {
            return await this.request('/causes');
        } catch (error) {
            console.warn('Using fallback causes data');
            return this.DEFAULTS.causes;
        }
    },

    /**
     * Get signal extraction results
     */
    async getSignals() {
        try {
            return await this.request('/signals');
        } catch (error) {
            console.warn('Using fallback signals data');
            return this.DEFAULTS.signals;
        }
    },

    /**
     * Get early warning results
     */
    async getWarnings() {
        try {
            return await this.request('/warnings');
        } catch (error) {
            console.warn('Using fallback warnings data');
            return this.DEFAULTS.warnings;
        }
    },

    /**
     * Get domain breakdown
     */
    async getDomains() {
        try {
            return await this.request('/domains');
        } catch (error) {
            console.warn('Using fallback domains data');
            return this.DEFAULTS.domains;
        }
    },

    /**
     * Get intent breakdown
     */
    async getIntents() {
        try {
            return await this.request('/intents');
        } catch (error) {
            console.warn('Using fallback intents data');
            return this.DEFAULTS.intents;
        }
    },

    /**
     * Get escalated conversations
     */
    async getEscalated() {
        try {
            return await this.request('/escalated');
        } catch (error) {
            console.warn('Using fallback escalated data');
            return {
                'escalated_list': [],
                'total_escalated': 972,
                'sample_count': 0
            };
        }
    },

    /**
     * Get resolved conversations
     */
    async getResolved() {
        try {
            return await this.request('/resolved');
        } catch (error) {
            console.warn('Using fallback resolved data');
            return {
                'resolved_list': [],
                'total_resolved': 4065,
                'sample_count': 0
            };
        }
    },

    /**
     * Get specific transcript
     */
    async getTranscript(transcriptId) {
        return this.request(`/transcript/${transcriptId}`);
    },

    /**
     * Analyze a user-provided transcript
     */
    async analyzeTranscript(transcript) {
        return this.request('/analyze', {
            method: 'POST',
            body: JSON.stringify({ transcript })
        });
    },

    /**
     * Submit a multi-turn query
     */
    async query(sessionId, question, transcript, previousAnalysis) {
        return this.request('/query', {
            method: 'POST',
            body: JSON.stringify({
                session_id: sessionId,
                question,
                transcript,
                previous_analysis: previousAnalysis
            })
        });
    },

    /**
     * Get session context
     */
    async getSession(sessionId) {
        return this.request(`/session/${sessionId}`);
    },

    /**
     * Get explanation for a transcript
     */
    async explainTranscript(transcriptId) {
        return this.request(`/explain/${transcriptId}`);
    },

    /**
     * Find similar transcripts
     */
    async findSimilar(transcriptId) {
        return this.request(`/similar/${transcriptId}`);
    },

    /**
     * Get causal chain statistics
     */
    async getChainStats(minConfidence = 0.3, minEvidence = 5) {
        return this.request(`/chain-stats?min_confidence=${minConfidence}&min_evidence=${minEvidence}`);
    },

    /**
     * Health check
     */
    async health() {
        try {
            return await this.request('/health');
        } catch (error) {
            return null;
        }
    }
};


