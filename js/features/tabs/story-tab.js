// Story Tab - AI-powered insights and narratives about emotional journey
// Uses local pattern analysis to generate personalized insights without requiring API

window.StoryTab = class StoryTab {
    constructor(emotionStorage) {
        this.storage = emotionStorage;
        this.container = null;
    }

    // Initialize story tab
    init() {
        console.log('📖 Initializing Story tab');
        this.container = document.getElementById('tab-story');
        if (this.container) {
            this.render();
        } else {
            console.error('❌ Story tab container not found');
        }
    }

    // Main render method
    render() {
        const entries = this.storage.getAllEntries();
        const insights = this.generateInsights(entries);

        this.container.innerHTML = `
            <div class="story-view">
                <h2>Your Emotional Story</h2>
                <p class="story-subtitle">AI-powered insights from your journey</p>

                ${insights.narrative ? this.renderNarrative(insights.narrative) : ''}
                ${this.renderPatterns(insights.patterns)}
                ${this.renderTimeline(insights.timeline)}
                ${this.renderEmptyState(entries)}
            </div>
        `;
    }

    // Generate insights from entries using local AI pattern analysis
    generateInsights(entries) {
        if (entries.length === 0) {
            return {
                narrative: null,
                patterns: [],
                timeline: []
            };
        }

        // 1. Emotion Frequency Analysis
        const emotionCounts = {};  // Level 1 emotions
        const level2Counts = {};   // Level 2 emotions
        const level3Counts = {};   // Level 3 emotions

        entries.forEach(entry => {
            const [l1, l2, l3] = entry.path;
            emotionCounts[l1] = (emotionCounts[l1] || 0) + 1;
            if (l2) level2Counts[l2] = (level2Counts[l2] || 0) + 1;
            if (l3) level3Counts[l3] = (level3Counts[l3] || 0) + 1;
        });

        // 2. Dominant Emotion
        const dominant = Object.keys(emotionCounts).reduce((a, b) =>
            emotionCounts[a] > emotionCounts[b] ? a : b
        );
        const dominantPercent = Math.round((emotionCounts[dominant] / entries.length) * 100);

        // 3. Secondary emotion
        const secondaryEmotion = Object.keys(level2Counts).length > 0
            ? Object.keys(level2Counts).reduce((a, b) => level2Counts[a] > level2Counts[b] ? a : b)
            : null;

        // 4. Trend Analysis (Recent vs Older)
        const trend = this.analyzeTrend(entries);

        // 5. Generate Narrative
        const narrative = this.generateNarrative(entries, emotionCounts, dominant, dominantPercent, trend);

        // 6. Detect Patterns
        const patterns = this.detectPatterns(entries, emotionCounts, level2Counts, level3Counts, dominant, secondaryEmotion);

        // 7. Create Timeline
        const timeline = this.createTimeline(entries);

        return {
            narrative,
            patterns,
            timeline
        };
    }

    // Analyze trend (improving, declining, stable)
    analyzeTrend(entries) {
        if (entries.length < 4) return 'stable'; // Need at least 4 entries for trend

        const midpoint = Math.floor(entries.length / 2);
        const recent = entries.slice(0, midpoint);
        const older = entries.slice(midpoint);

        const recentPositive = this.countPositiveEmotions(recent);
        const olderPositive = this.countPositiveEmotions(older);

        const recentRate = recentPositive / recent.length;
        const olderRate = olderPositive / older.length;

        if (recentRate > olderRate * 1.2) return 'improving';
        if (recentRate < olderRate * 0.8) return 'declining';
        return 'stable';
    }

    // Count positive emotions in entries
    countPositiveEmotions(entries) {
        const positiveEmotions = ['Happy', 'Surprised', 'Peaceful', 'Optimistic', 'Playful', 'Content', 'Joyful', 'Excited'];
        return entries.filter(e => positiveEmotions.some(pos =>
            e.path.some(emotion => emotion.includes(pos))
        )).length;
    }

    // Generate narrative text
    generateNarrative(entries, emotionCounts, dominant, dominantPercent, trend) {
        const totalEntries = entries.length;
        const uniqueDays = new Set(entries.map(e =>
            new Date(e.timestamp).toDateString()
        )).size;

        let narrative = `Over the past **${uniqueDays}** ${uniqueDays === 1 ? 'day' : 'days'}, you've tracked **${totalEntries}** emotional ${totalEntries === 1 ? 'moment' : 'moments'}. `;

        narrative += `Your emotional landscape has been predominantly **${dominant}** (${dominantPercent}% of entries). `;

        if (trend === 'improving') {
            narrative += `There's a **positive trend** in your recent entries, suggesting your emotional well-being is improving. `;
        } else if (trend === 'declining') {
            narrative += `Recent entries suggest you may be experiencing more challenging emotions. Remember, it's normal for emotions to fluctuate. `;
        } else {
            narrative += `Your emotional state has been relatively **consistent**. `;
        }

        // Add diversity insight
        const uniqueEmotions = Object.keys(emotionCounts).length;
        if (uniqueEmotions >= 5) {
            narrative += `You've experienced a **wide range** of emotions (${uniqueEmotions} different primary feelings), showing emotional depth and awareness.`;
        } else if (uniqueEmotions <= 2) {
            narrative += `Your emotional focus has been quite **concentrated** on ${uniqueEmotions} primary ${uniqueEmotions === 1 ? 'emotion' : 'emotions'}.`;
        }

        return narrative;
    }

    // Detect patterns in the data
    detectPatterns(entries, emotionCounts, level2Counts, level3Counts, dominant, secondaryEmotion) {
        const patterns = [];

        // Pattern 1: Most Common Emotion (always include)
        patterns.push({
            title: 'Most Common Emotion',
            description: `You most frequently experience **${dominant}** emotions (${emotionCounts[dominant]} ${emotionCounts[dominant] === 1 ? 'time' : 'times'}).`,
            type: 'frequency'
        });

        // Pattern 2: Emotional Nuance (if L2 data exists)
        if (secondaryEmotion && Object.keys(level2Counts).length > 0) {
            patterns.push({
                title: 'Emotional Nuance',
                description: `When you drill deeper, **${secondaryEmotion}** appears most often (${level2Counts[secondaryEmotion]} ${level2Counts[secondaryEmotion] === 1 ? 'time' : 'times'}), revealing specific emotional patterns.`,
                type: 'nuance'
            });
        }

        // Pattern 3: Emotional Diversity
        const uniqueEmotions = Object.keys(emotionCounts).length;
        if (uniqueEmotions >= 5) {
            patterns.push({
                title: 'Emotional Diversity',
                description: `You experience a **wide range** of emotions (${uniqueEmotions} different primary emotions), indicating high emotional awareness and complexity.`,
                type: 'insight'
            });
        } else if (uniqueEmotions <= 2) {
            patterns.push({
                title: 'Focused Emotions',
                description: `Your emotional experience is **focused** on ${uniqueEmotions} primary ${uniqueEmotions === 1 ? 'emotion' : 'emotions'}, showing consistency in your emotional patterns.`,
                type: 'insight'
            });
        }

        // Pattern 4: Voice Usage
        const voiceEntries = entries.filter(e => e.voiceTranscript && e.voiceTranscript.length > 0).length;
        const voicePercent = Math.round((voiceEntries / entries.length) * 100);
        if (voicePercent > 30) {
            patterns.push({
                title: 'Verbal Expression',
                description: `You use **voice input** frequently (${voicePercent}% of entries), suggesting you find verbal expression helpful for processing emotions.`,
                type: 'behavior'
            });
        }

        // Pattern 5: Note-taking Behavior
        const noteEntries = entries.filter(e => e.notes && e.notes.length > 0).length;
        const notePercent = Math.round((noteEntries / entries.length) * 100);
        if (notePercent > 50) {
            patterns.push({
                title: 'Analytical Approach',
                description: `You add **notes** to most entries (${notePercent}%), showing you're reflective and like to analyze what triggers your emotions.`,
                type: 'behavior'
            });
        } else if (notePercent < 20) {
            patterns.push({
                title: 'Quick Tracker',
                description: `You prefer **brief tracking** (${notePercent}% with notes), keeping your emotional check-ins fast and simple.`,
                type: 'behavior'
            });
        }

        // Pattern 6: Time of Day Patterns (optional)
        const timePatterns = this.analyzeTimePatterns(entries);
        if (timePatterns) {
            patterns.push(timePatterns);
        }

        return patterns;
    }

    // Analyze time of day patterns
    analyzeTimePatterns(entries) {
        const morning = entries.filter(e => {
            const hour = new Date(e.timestamp).getHours();
            return hour >= 6 && hour < 12;
        }).length;

        const afternoon = entries.filter(e => {
            const hour = new Date(e.timestamp).getHours();
            return hour >= 12 && hour < 18;
        }).length;

        const evening = entries.filter(e => {
            const hour = new Date(e.timestamp).getHours();
            return hour >= 18 && hour < 24;
        }).length;

        const night = entries.filter(e => {
            const hour = new Date(e.timestamp).getHours();
            return hour >= 0 && hour < 6;
        }).length;

        const max = Math.max(morning, afternoon, evening, night);
        const total = entries.length;

        // Only show pattern if one time period is clearly dominant (>40%)
        if (max / total < 0.4) return null;

        let timeOfDay = '';
        if (max === morning) timeOfDay = 'mornings';
        else if (max === afternoon) timeOfDay = 'afternoons';
        else if (max === evening) timeOfDay = 'evenings';
        else timeOfDay = 'late nights';

        const percent = Math.round((max / total) * 100);

        return {
            title: 'Time Pattern',
            description: `You track emotions most often in the **${timeOfDay}** (${percent}% of entries), suggesting this is when you're most reflective.`,
            type: 'insight'
        };
    }

    // Create timeline for last 7 days
    createTimeline(entries) {
        const timeline = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0); // Reset to start of day
            const dateStr = date.toDateString();

            const dayEntries = entries.filter(e =>
                new Date(e.timestamp).toDateString() === dateStr
            );

            if (dayEntries.length > 0) {
                // Get unique emotions for this day
                const emotionsSet = new Set();
                dayEntries.forEach(e => {
                    if (e.path[0]) emotionsSet.add(e.path[0]);
                });
                const emotions = Array.from(emotionsSet).join(', ');

                timeline.push({
                    date: dateStr,
                    count: dayEntries.length,
                    emotions: emotions,
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    dayNum: date.getDate()
                });
            }
        }

        return timeline;
    }

    // Render narrative section
    renderNarrative(narrative) {
        return `
            <div class="story-narrative">
                <div class="narrative-icon">✨</div>
                <div class="narrative-text">${this.parseMarkdown(narrative)}</div>
            </div>
        `;
    }

    // Render patterns section
    renderPatterns(patterns) {
        if (patterns.length === 0) return '';

        let html = '<div class="story-patterns">';
        html += '<h3>Patterns & Insights</h3>';
        html += '<div class="pattern-grid">';

        patterns.forEach(pattern => {
            html += `
                <div class="pattern-card">
                    <div class="pattern-title">${pattern.title}</div>
                    <div class="pattern-description">${this.parseMarkdown(pattern.description)}</div>
                </div>
            `;
        });

        html += '</div></div>';
        return html;
    }

    // Render timeline section
    renderTimeline(timeline) {
        if (timeline.length === 0) return '';

        let html = '<div class="story-timeline">';
        html += '<h3>Recent Journey</h3>';
        html += '<div class="timeline-items">';

        timeline.forEach(item => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-date">
                        <div class="timeline-day">${item.dayName}</div>
                        <div class="timeline-num">${item.dayNum}</div>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-count">${item.count} ${item.count === 1 ? 'entry' : 'entries'}</div>
                        <div class="timeline-emotions">${item.emotions}</div>
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
        return html;
    }

    // Parse simple markdown (bold with **)
    parseMarkdown(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    // Render empty state
    renderEmptyState(entries) {
        if (entries.length > 0) return '';

        return `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <h3>Your Story Awaits</h3>
                <p>Track your emotions for a few days, and AI will analyze patterns to tell your unique emotional story.</p>
            </div>
        `;
    }
}
