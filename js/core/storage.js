// Emotion Storage - localStorage wrapper for persisting emotion entries
// Handles: saving entries, retrieving history, data export, auto-pruning old entries

window.EmotionStorage = class EmotionStorage {
    constructor() {
        this.STORAGE_KEY = 'balanceMate_entries';
        this.MAX_ENTRIES = 100;
        this.storageAvailable = this.checkStorageAvailability();
    }

    // Check if localStorage is available (may be disabled in private/incognito mode)
    checkStorageAvailability() {
        try {
            const testKey = '__balance_mate_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('⚠️ localStorage not available:', error.message);
            console.warn('Data will not persist between sessions (private/incognito mode?)');
            return false;
        }
    }

    // Save emotion entry to localStorage
    saveEntry(emotionPath, notes = '', voiceTranscript = null) {
        // Create entry object (always return it even if storage fails)
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            path: emotionPath,
            notes: notes.trim(),
            voiceTranscript: voiceTranscript ? voiceTranscript.trim() : null,
            metadata: {
                userAgent: navigator.userAgent,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        // If storage not available, just return entry without persisting
        if (!this.storageAvailable) {
            console.warn('⚠️ Entry created but not persisted (storage unavailable)');
            return entry;
        }

        try {
            // Get existing entries
            const entries = this.getAllEntries();

            // Add to beginning of array (most recent first)
            entries.unshift(entry);

            // Auto-prune if exceeds max entries
            if (entries.length > this.MAX_ENTRIES) {
                entries.splice(this.MAX_ENTRIES);
                console.log(`📦 Auto-pruned entries to ${this.MAX_ENTRIES}`);
            }

            // Save to localStorage
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));

            console.log('✅ Entry saved:', entry);
            return entry;

        } catch (error) {
            console.error('❌ Failed to save entry:', error);

            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded. Entry not persisted.');
                alert('Storage full. Your entry was recorded but not saved. Consider exporting data.');
            } else {
                console.warn('Storage error. Entry not persisted:', error.message);
            }

            // Return entry even if save failed - at least the session recorded it
            return entry;
        }
    }

    // Get all entries from localStorage
    getAllEntries() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Failed to retrieve entries:', error);
            return [];
        }
    }

    // Get entry count
    getEntryCount() {
        return this.getAllEntries().length;
    }

    // Export all data as JSON file
    exportData() {
        try {
            const entries = this.getAllEntries();

            if (entries.length === 0) {
                alert('No data to export.');
                return;
            }

            // Create JSON blob
            const exportData = {
                exportDate: new Date().toISOString(),
                entryCount: entries.length,
                entries: entries
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `balance-mate-data-${this.getFormattedDate()}.json`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up blob URL
            URL.revokeObjectURL(url);

            console.log(`📥 Exported ${entries.length} entries`);
            return exportData;

        } catch (error) {
            console.error('❌ Export failed:', error);
            alert('Failed to export data. Please try again.');
            throw error;
        }
    }

    // Clear all entries with confirmation
    clearAll() {
        const count = this.getEntryCount();

        if (count === 0) {
            alert('No data to clear.');
            return false;
        }

        const confirmed = confirm(
            `⚠️ Are you sure you want to delete all ${count} entries?\n\n` +
            `This action cannot be undone.\n\n` +
            `Tip: Consider exporting your data first.`
        );

        if (confirmed) {
            try {
                localStorage.removeItem(this.STORAGE_KEY);
                console.log(`🗑️ Cleared ${count} entries`);
                return true;
            } catch (error) {
                console.error('❌ Failed to clear entries:', error);
                alert('Failed to clear data. Please try again.');
                return false;
            }
        }

        return false;
    }

    // Get formatted date for filenames (YYYY-MM-DD)
    getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Get entries within date range
    getEntriesByDateRange(startDate, endDate) {
        const entries = this.getAllEntries();
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    // Get entries by emotion (any level in path)
    getEntriesByEmotion(emotionName) {
        const entries = this.getAllEntries();
        return entries.filter(entry =>
            entry.path.some(emotion =>
                emotion.toLowerCase().includes(emotionName.toLowerCase())
            )
        );
    }

    // Get storage statistics
    getStats() {
        const entries = this.getAllEntries();

        if (entries.length === 0) {
            return {
                totalEntries: 0,
                oldestEntry: null,
                newestEntry: null,
                storageUsed: 0
            };
        }

        return {
            totalEntries: entries.length,
            oldestEntry: new Date(entries[entries.length - 1].timestamp),
            newestEntry: new Date(entries[0].timestamp),
            storageUsed: new Blob([JSON.stringify(entries)]).size
        };
    }
}
