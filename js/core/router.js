// Router - Hash-based routing for tab navigation
// Handles: URL hash changes, browser back/forward, initial route

window.Router = class Router {
    constructor(navigationManager) {
        // Store navigation manager reference
        this.navigationManager = navigationManager;

        // Valid tabs
        this.validTabs = ['main', 'calendar', 'streak', 'story', 'feedback', 'export'];

        // Setup hash change listener
        this.setupHashListener();

        // Handle initial route
        this.handleInitialRoute();
    }

    setupHashListener() {
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    handleInitialRoute() {
        // Read current hash
        let hash = window.location.hash;

        // Remove '#/' prefix if present
        if (hash.startsWith('#/')) {
            hash = hash.substring(2);
        } else if (hash.startsWith('#')) {
            hash = hash.substring(1);
        }

        // If valid tab, switch to it
        if (hash && this.validTabs.includes(hash)) {
            console.log(`🗺️ Initial route: ${hash}`);
            this.navigationManager.switchTab(hash);
        } else {
            // Default to main tab
            console.log('🗺️ Initial route: main (default)');
            this.navigate('main');
        }
    }

    handleHashChange() {
        // Read current hash
        let hash = window.location.hash;

        // Remove '#/' prefix if present
        if (hash.startsWith('#/')) {
            hash = hash.substring(2);
        } else if (hash.startsWith('#')) {
            hash = hash.substring(1);
        }

        // Validate tab
        if (hash && this.validTabs.includes(hash)) {
            console.log(`🗺️ Hash changed to: ${hash}`);
            this.navigationManager.switchTab(hash);
        } else {
            // Invalid hash - ignore or redirect to main
            console.warn(`⚠️ Invalid hash: ${hash}`);
            // Optionally redirect to main
            // this.navigate('main');
        }
    }

    navigate(tabName) {
        // Set window hash
        window.location.hash = `/${tabName}`;
        console.log(`🗺️ Navigated to: ${tabName}`);
    }
}
