/**
 * Chart.js Chart Initialization and Management
 * Enhanced with better styling, tooltips, and responsiveness
 */

// Global Chart.js configuration
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
}

const Charts = {
    instances: {},

    /**
     * Create or update escalation chart
     */
    initEscalationChart(escalated, resolved) {
        try {
            const ctx = document.getElementById('escalationChart');
            if (!ctx) return;

            escalated = parseInt(escalated) || 0;
            resolved = parseInt(resolved) || 0;
            const total = escalated + resolved || 1;

            if (this.instances.escalation) {
                try {
                    this.instances.escalation.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            this.instances.escalation = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Escalated', 'Resolved'],
                    datasets: [{
                        label: 'Conversations',
                        data: [escalated, resolved],
                        backgroundColor: ['#dc2626', '#16a34a'],
                        borderColor: ['#991b1b', '#15803d'],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed || 0;
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing escalation chart:', error);
        }
    },

    /**
     * Create or update domains chart
     */
    initDomainsChart(domainData) {
        try {
            const ctx = document.getElementById('domainsChart');
            if (!ctx) return;

            domainData = domainData || {};
            const labels = Object.keys(domainData).slice(0, 6);
            const data = Object.values(domainData).slice(0, 6);

            if (labels.length === 0) {
                labels.push('No data');
                data.push(1);
            }

            if (this.instances.domains) {
                try {
                    this.instances.domains.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            this.instances.domains = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Conversations',
                        data: data,
                        backgroundColor: '#2563eb',
                        borderColor: '#1e40af',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.x} conversations`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: Math.ceil(Math.max(...data) / 5)
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing domains chart:', error);
        }
    },

    /**
     * Create or update intents chart
     */
    initIntentsChart(intentData) {
        try {
            const ctx = document.getElementById('intentsChart');
            if (!ctx) return;

            intentData = intentData || {};
            const labels = Object.keys(intentData);
            const data = Object.values(intentData);

            if (labels.length === 0) {
                labels.push('No data');
                data.push(1);
            }

            if (this.instances.intents) {
                try {
                    this.instances.intents.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            this.instances.intents = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Count',
                        data: data,
                        backgroundColor: [
                            '#2563eb', '#0ea5e9', '#10b981',
                            '#f59e0b', '#dc2626', '#8b5cf6',
                            '#ec4899', '#06b6d4'
                        ],
                        borderRadius: 4,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    indexAxis: 'x',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y} conversations`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: Math.ceil(Math.max(...data) / 5)
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 11
                                },
                                maxRotation: 45,
                                minRotation: 0
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing intents chart:', error);
        }
    },

    /**
     * Create or update causes chart
     */
    initCausesChart(causesData) {
        try {
            const ctx = document.getElementById('causesChart');
            if (!ctx) return;

            causesData = causesData || {};
            
            // Format labels and data
            let labels = [];
            let data = [];
            
            for (const [key, value] of Object.entries(causesData)) {
                // Format label
                const label = key
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');
                labels.push(label);
                
                // Format value
                const val = Array.isArray(value) ? value.length : (value || 0);
                data.push(val);
            }

            if (labels.length === 0) {
                labels = ['No data'];
                data = [1];
            }

            // Destroy existing chart
            if (this.instances.causes) {
                try {
                    this.instances.causes.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            // Create new chart
            this.instances.causes = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Count',
                        data: data,
                        backgroundColor: [
                            '#dc2626',
                            '#f59e0b',
                            '#6366f1'
                        ],
                        borderColor: [
                            '#991b1b',
                            '#d97706',
                            '#4f46e5'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing causes chart:', error);
        }
    },

    /**
     * Create or update signals chart
     */
    initSignalsChart(signalsData) {
        try {
            const ctx = document.getElementById('signalsChart');
            if (!ctx) return;

            signalsData = signalsData || {};
            
            // Format labels and data
            let labels = [];
            let data = [];
            
            for (const [key, value] of Object.entries(signalsData)) {
                // Format label
                const label = key
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');
                labels.push(label);
                data.push(value || 0);
            }

            if (labels.length === 0) {
                labels = ['No data'];
                data = [1];
            }

            // Destroy existing chart
            if (this.instances.signals) {
                try {
                    this.instances.signals.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            // Create new chart
            this.instances.signals = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Count',
                        data: data,
                        backgroundColor: [
                            '#dc2626',
                            '#f59e0b',
                            '#6366f1'
                        ],
                        borderColor: [
                            '#991b1b',
                            '#d97706',
                            '#4f46e5'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing signals chart:', error);
        }
    },

    /**
     * Create or update warnings chart
     */
    initWarningsChart(warningData) {
        try {
            const ctx = document.getElementById('warningsChart');
            if (!ctx) return;

            warningData = warningData || {};

            if (this.instances.warnings) {
                try {
                    this.instances.warnings.destroy();
                } catch (e) {
                    // Ignore destroy errors
                }
            }

            const warningValues = [
                warningData.single_signal_warnings || 0,
                warningData.multi_signal_warnings || 0,
                warningData.high_risk_conversations || 0
            ];
            const maxValue = Math.max(...warningValues) || 1;

            this.instances.warnings = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Single-Signal', 'Multi-Signal', 'High Risk'],
                    datasets: [{
                        label: 'Count',
                        data: warningValues,
                        backgroundColor: ['#0ea5e9', '#f59e0b', '#dc2626'],
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y} warnings`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: Math.ceil(maxValue / 5)
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing warnings chart:', error);
        }
    },

    /**
     * Destroy all charts
     */
    destroyAll() {
        try {
            Object.values(this.instances).forEach(chart => {
                if (chart) {
                    try {
                        chart.destroy();
                    } catch (e) {
                        // Ignore individual chart destruction errors
                    }
                }
            });
            this.instances = {};
        } catch (error) {
            console.error('Error destroying charts:', error);
        }
    },

    /**
     * Reset all chart instances
     */
    reset() {
        this.destroyAll();
    },

    /**
     * Check if Chart.js is available
     */
    isAvailable() {
        return typeof Chart !== 'undefined';
    }
};
