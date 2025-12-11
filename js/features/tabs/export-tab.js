// Export Tab - Data export in multiple formats
// Features: JSON, CSV export, data preview, clear data option

window.ExportTab = class ExportTab {
    constructor(emotionStorage) {
        this.storage = emotionStorage;
        this.container = null;
    }

    init() {
        console.log('📥 Initializing Export tab');
        this.container = document.getElementById('tab-export');
        this.render();
        this.setupButtons();
    }

    render() {
        const entries = this.storage.getAllEntries();
        const stats = this.storage.getStats();
        const disabled = entries.length === 0;

        this.container.innerHTML = `
            <div class="export-view">
                <h2>Export Your Data</h2>
                <p class="export-subtitle">Download your emotional journey for backup or analysis</p>

                <div class="export-stats">
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalEntries}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.formatDate(stats.oldestEntry)}</div>
                        <div class="stat-label">First Entry</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.formatBytes(stats.storageUsed)}</div>
                        <div class="stat-label">Storage Used</div>
                    </div>
                </div>

                <div class="export-options">
                    <h3>Export Formats</h3>

                    <div class="export-card">
                        <div>
                            <h4>📄 JSON Export</h4>
                            <p>Complete data with metadata. Best for backup.</p>
                        </div>
                        <button class="export-button" id="btnJSON" ${disabled ? 'disabled' : ''}>Download JSON</button>
                    </div>

                    <div class="export-card">
                        <div>
                            <h4>📊 CSV Export</h4>
                            <p>Spreadsheet format for Excel/Sheets.</p>
                        </div>
                        <button class="export-button" id="btnCSV" ${disabled ? 'disabled' : ''}>Download CSV</button>
                    </div>
                </div>

                <div class="danger-zone">
                    <h3>Danger Zone</h3>
                    <div class="danger-card">
                        <div>
                            <h4>Clear All Data</h4>
                            <p>Permanently delete all entries. Cannot be undone.</p>
                        </div>
                        <button class="danger-button" id="btnClear" ${disabled ? 'disabled' : ''}>Clear All</button>
                    </div>
                </div>

                ${disabled ? '<div class="empty-state"><div class="empty-icon">📦</div><h3>No Data Yet</h3><p>Start tracking emotions to build data.</p></div>' : ''}
            </div>
        `;
    }

    setupButtons() {
        const btnJSON = document.getElementById('btnJSON');
        const btnCSV = document.getElementById('btnCSV');
        const btnClear = document.getElementById('btnClear');

        if (btnJSON) btnJSON.onclick = () => this.exportJSON();
        if (btnCSV) btnCSV.onclick = () => this.exportCSV();
        if (btnClear) btnClear.onclick = () => this.clearData();
    }

    exportJSON() {
        this.storage.exportData();
        this.toast('JSON downloaded!');
    }

    exportCSV() {
        const entries = this.storage.getAllEntries();
        let csv = 'Date,Time,Primary,Secondary,Tertiary,Notes\n';

        entries.forEach(e => {
            const d = new Date(e.timestamp);
            const [l1, l2, l3] = e.path;
            const n = (e.notes || '').replace(/"/g, '""');
            csv += `"${d.toLocaleDateString()}","${d.toLocaleTimeString()}","${l1}","${l2||''}","${l3||''}","${n}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `balance-mate-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        this.toast('CSV downloaded!');
    }

    clearData() {
        if (confirm('⚠️ Delete ALL entries? This cannot be undone!')) {
            if (confirm('Final confirmation - Click OK to delete.')) {
                this.storage.clearAll();
                this.toast('Data cleared');
                this.render();
            }
        }
    }

    formatDate(date) {
        return date ? new Date(date).toLocaleDateString() : 'N/A';
    }

    formatBytes(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + ['B', 'KB', 'MB'][i];
    }

    toast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('show'), 100);
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => document.body.removeChild(t), 300);
        }, 3000);
    }
}
