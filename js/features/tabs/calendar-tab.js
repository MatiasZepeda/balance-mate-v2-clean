// Calendar Tab - GitHub-style heatmap visualization of emotion entries
// Shows: stats cards, 12-week heatmap, empty state

window.CalendarTab = class CalendarTab {
    constructor(emotionStorage) {
        this.storage = emotionStorage;
        this.container = null;
    }

    // Initialize calendar tab
    init() {
        console.log('📅 Initializing Calendar tab');
        this.container = document.getElementById('tab-calendar');
        if (this.container) {
            this.render();
        } else {
            console.error('❌ Calendar tab container not found');
        }
    }

    // Main render method
    render() {
        const entries = this.storage.getAllEntries();

        if (entries.length === 0) {
            this.container.innerHTML = this.renderEmptyState();
            return;
        }

        const stats = this.calculateStats(entries);

        const html = `
            <div class="calendar-view">
                <h2>Your Emotional Journey</h2>

                <div class="calendar-stats">
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalEntries}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.currentStreak}</div>
                        <div class="stat-label">Current Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.mostFrequent}</div>
                        <div class="stat-label">Most Frequent</div>
                    </div>
                </div>

                <div class="heatmap-container">
                    ${this.renderHeatmap(entries)}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    // Calculate statistics from entries
    calculateStats(entries) {
        const totalEntries = entries.length;
        const currentStreak = this.calculateStreak(entries);
        const mostFrequent = this.getMostFrequentEmotion(entries);

        return {
            totalEntries,
            currentStreak,
            mostFrequent
        };
    }

    // Calculate current streak
    calculateStreak(entries) {
        if (entries.length === 0) return 0;

        // Get unique dates (sorted newest first)
        const dates = [...new Set(entries.map(e =>
            new Date(e.timestamp).toDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        const today = new Date().toDateString();

        // Check if today has entry
        if (!dates.includes(today)) {
            return 0;
        }

        // Count consecutive days backwards from today
        let currentStreak = 1;
        let checkDate = new Date();

        for (let i = 1; i < dates.length; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            const expectedDate = checkDate.toDateString();

            if (dates[i] === expectedDate) {
                currentStreak++;
            } else {
                break;
            }
        }

        return currentStreak;
    }

    // Get most frequent Level 1 emotion
    getMostFrequentEmotion(entries) {
        if (entries.length === 0) return 'N/A';

        const emotionCounts = {};

        entries.forEach(entry => {
            if (entry.path && entry.path.length > 0) {
                const emotion = entry.path[0]; // Level 1 emotion
                emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            }
        });

        // Find emotion with highest count
        let maxCount = 0;
        let mostFrequent = 'N/A';

        for (const [emotion, count] of Object.entries(emotionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = emotion;
            }
        }

        return mostFrequent;
    }

    // Render GitHub-style heatmap
    renderHeatmap(entries) {
        // Group entries by date
        const entriesByDate = {};
        entries.forEach(entry => {
            const date = new Date(entry.timestamp).toISOString().split('T')[0];
            if (!entriesByDate[date]) {
                entriesByDate[date] = [];
            }
            entriesByDate[date].push(entry);
        });

        // Generate last 12 weeks (84 days)
        const weeks = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 83); // Go back 12 weeks

        for (let week = 0; week < 12; week++) {
            const days = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + (week * 7) + day);
                const dateStr = date.toISOString().split('T')[0];
                const count = entriesByDate[dateStr]?.length || 0;

                days.push({
                    date: dateStr,
                    count: count,
                    level: this.getHeatmapLevel(count)
                });
            }
            weeks.push(days);
        }

        // Render HTML
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        let html = `
            <div class="heatmap-grid">
                <div class="heatmap-labels">
                    ${dayLabels.map(label => `<div class="day-label">${label}</div>`).join('')}
                </div>
        `;

        // Render weeks
        weeks.forEach(week => {
            html += '<div class="heatmap-week">';
            week.forEach(day => {
                html += `
                    <div class="heatmap-day level-${day.level}"
                         data-date="${day.date}"
                         data-count="${day.count}"
                         title="${day.date}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}">
                    </div>
                `;
            });
            html += '</div>';
        });

        html += `
            </div>

            <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-box level-0"></div>
                <div class="legend-box level-1"></div>
                <div class="legend-box level-2"></div>
                <div class="legend-box level-3"></div>
                <div class="legend-box level-4"></div>
                <span>More</span>
            </div>
        `;

        return html;
    }

    // Get heatmap level based on entry count
    getHeatmapLevel(count) {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count === 3) return 3;
        return 4; // 4+ entries
    }

    // Render empty state
    renderEmptyState() {
        return `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <h3>No entries yet</h3>
                <p>Start tracking your emotions to see your journey visualized here.</p>
            </div>
        `;
    }
}
