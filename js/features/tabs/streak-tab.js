// Streak Tab - Consecutive days tracker with milestones
// Shows: current streak, longest streak, milestones, motivational messages

window.StreakTab = class StreakTab {
    constructor(emotionStorage) {
        this.storage = emotionStorage;
        this.container = null;
        this.motivationalMessages = {
            0: "Start your journey today!",
            1: "Great start! Keep it going!",
            3: "Three days strong! You're building a habit!",
            7: "One week streak! You're doing amazing!",
            14: "Two weeks! This is becoming a routine!",
            30: "30 days! You're a consistency champion!",
            50: "50 days! Incredible dedication!",
            100: "100 days! You're a Balance Mate legend!",
            365: "One year! This is truly remarkable!"
        };
    }

    // Initialize streak tab
    init() {
        console.log('🔥 Initializing Streak tab');
        this.container = document.getElementById('tab-streak');
        if (this.container) {
            this.render();
        } else {
            console.error('❌ Streak tab container not found');
        }
    }

    // Main render method
    render() {
        const entries = this.storage.getAllEntries();

        if (entries.length === 0) {
            this.container.innerHTML = this.renderEmptyState();
            return;
        }

        const streakData = this.calculateStreaks(entries);
        const message = this.getMotivationalMessage(streakData.currentStreak);

        const html = `
            <div class="streak-view">
                <h2>Your Consistency Streak</h2>

                <div class="streak-hero">
                    <div class="streak-flame">🔥</div>
                    <div class="streak-number">${streakData.currentStreak}</div>
                    <div class="streak-label">${streakData.currentStreak === 1 ? 'Day' : 'Days'} Streak</div>
                    <div class="streak-message">${message}</div>
                </div>

                <div class="streak-stats">
                    <div class="streak-stat">
                        <div class="streak-stat-value">${streakData.currentStreak}</div>
                        <div class="streak-stat-label">Current Streak</div>
                    </div>
                    <div class="streak-stat">
                        <div class="streak-stat-value">${streakData.longestStreak}</div>
                        <div class="streak-stat-label">Longest Streak</div>
                    </div>
                    <div class="streak-stat">
                        <div class="streak-stat-value">${entries.length}</div>
                        <div class="streak-stat-label">Total Entries</div>
                    </div>
                    <div class="streak-stat">
                        <div class="streak-stat-value">${streakData.uniqueDays}</div>
                        <div class="streak-stat-label">Unique Days</div>
                    </div>
                </div>

                <div class="milestones">
                    <h3>Milestones</h3>
                    ${this.renderMilestones(streakData.currentStreak)}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    // Calculate current and longest streaks
    calculateStreaks(entries) {
        if (entries.length === 0) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                uniqueDays: 0
            };
        }

        // Get unique dates (sorted newest first)
        const dates = [...new Set(entries.map(e =>
            new Date(e.timestamp).toDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        const uniqueDays = dates.length;
        const today = new Date().toDateString();

        // Calculate current streak
        let currentStreak = 0;
        if (dates.includes(today)) {
            currentStreak = 1;
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
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 1;

        for (let i = 0; i < dates.length - 1; i++) {
            const current = new Date(dates[i]);
            const next = new Date(dates[i + 1]);
            const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return {
            currentStreak,
            longestStreak,
            uniqueDays
        };
    }

    // Get motivational message based on streak
    getMotivationalMessage(streak) {
        const milestones = [365, 100, 50, 30, 14, 7, 3, 1, 0];

        for (const milestone of milestones) {
            if (streak >= milestone) {
                return this.motivationalMessages[milestone];
            }
        }

        return this.motivationalMessages[0];
    }

    // Render milestone grid
    renderMilestones(currentStreak) {
        const milestones = [
            { days: 1, label: 'First Entry', icon: '✨' },
            { days: 3, label: 'Three Days', icon: '🌱' },
            { days: 7, label: 'One Week', icon: '🌟' },
            { days: 14, label: 'Two Weeks', icon: '💪' },
            { days: 30, label: 'One Month', icon: '🏆' },
            { days: 100, label: '100 Days', icon: '👑' }
        ];

        let html = '<div class="milestone-grid">';

        milestones.forEach(milestone => {
            const achieved = currentStreak >= milestone.days ? 'achieved' : '';
            html += `
                <div class="milestone ${achieved}">
                    <div class="milestone-icon">${milestone.icon}</div>
                    <div class="milestone-label">${milestone.label}</div>
                    <div class="milestone-days">${milestone.days} ${milestone.days === 1 ? 'day' : 'days'}</div>
                </div>
            `;
        });

        html += '</div>';
        return html;
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
                <p>Start tracking your emotions to build your streak!</p>
            </div>
        `;
    }
}
