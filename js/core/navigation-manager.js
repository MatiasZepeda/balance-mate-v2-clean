// Navigation Manager - Handles tab switching and sidebar state
// Manages: active tab, sidebar collapse, mobile menu, tab module lifecycle

window.NavigationManager = class NavigationManager {
    constructor() {
        // State
        this.activeTab = 'main';
        this.sidebarCollapsed = false;
        this.isMobile = false;

        // Storage
        this.storageKey = 'balanceMate_sidebarState';

        // References
        this.sidebar = null;
        this.tabs = new Map(); // Map of tab name -> {button, content}
        this.tabModules = new Map(); // Map of tab name -> {module, initialized}
    }

    initialize() {
        console.log('🚀 Initializing Navigation Manager...');

        // Query sidebar element
        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) {
            console.warn('⚠️ Sidebar element not found. Navigation may not work properly.');
            return;
        }

        // Load saved sidebar state
        this.loadSidebarState();

        // Setup sidebar toggle button
        const toggleButton = document.getElementById('sidebarToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Setup all tab button click handlers
        this.setupTabButtons();

        // Setup mobile menu
        this.setupMobileMenu();

        // Setup window resize listener for mobile detection
        this.setupResizeListener();

        // Initial mobile check
        this.updateMobileState();

        console.log('✅ Navigation initialized');
    }

    setupTabButtons() {
        const tabButtons = document.querySelectorAll('.sidebar-item');

        tabButtons.forEach(button => {
            const tabName = button.getAttribute('data-tab');
            if (!tabName) return;

            // Find corresponding tab content (uses "tab-{name}" pattern)
            const tabContent = document.getElementById(`tab-${tabName}`);

            // Store references
            this.tabs.set(tabName, {
                button: button,
                content: tabContent
            });

            // Add click handler
            button.addEventListener('click', () => {
                this.switchTab(tabName);
            });
        });

        console.log(`📋 Registered ${this.tabs.size} tabs:`, Array.from(this.tabs.keys()));
    }

    setupMobileMenu() {
        // Mobile menu button (hamburger)
        const mobileMenuButton = document.getElementById('mobileMenuToggle');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                this.openMobileMenu();
            });
        }

        // Mobile backdrop
        const backdrop = document.getElementById('sidebarBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close button in mobile menu (if exists)
        const closeButton = document.getElementById('closeMobileMenu');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.updateMobileState();
        });
    }

    updateMobileState() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        // If switching between mobile/desktop, adjust sidebar
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                // Switching to mobile
                this.closeMobileMenu();
                // Remove collapsed class on mobile
                if (this.sidebar) {
                    this.sidebar.classList.remove('collapsed');
                }
            } else {
                // Switching to desktop
                // Restore saved collapsed state
                this.loadSidebarState();
            }
        }
    }

    toggleSidebar() {
        // Skip if mobile (mobile uses overlay, not collapse)
        if (this.isMobile) return;

        // Toggle collapsed state
        this.sidebarCollapsed = !this.sidebarCollapsed;

        // Toggle class on sidebar
        if (this.sidebar) {
            this.sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }

        // Save state
        this.saveSidebarState();

        console.log(`📐 Sidebar ${this.sidebarCollapsed ? 'collapsed' : 'expanded'}`);
    }

    switchTab(tabName) {
        // If already on that tab, return
        if (tabName === this.activeTab) return;

        console.log(`🔄 Switching to tab: ${tabName}`);

        // Get current and new tab references
        const currentTabData = this.tabs.get(this.activeTab);
        const newTabData = this.tabs.get(tabName);

        if (!newTabData) {
            console.warn(`⚠️ Tab "${tabName}" not found`);
            return;
        }

        // Deactivate current tab
        if (currentTabData) {
            if (currentTabData.button) {
                currentTabData.button.classList.remove('active');
                currentTabData.button.setAttribute('aria-selected', 'false');
            }
            if (currentTabData.content) {
                currentTabData.content.classList.remove('active');
            }
        }

        // Activate new tab
        if (newTabData.button) {
            newTabData.button.classList.add('active');
            newTabData.button.setAttribute('aria-selected', 'true');
        }
        if (newTabData.content) {
            newTabData.content.classList.add('active');
        }

        // Update active tab
        this.activeTab = tabName;

        // Lazy initialize tab module if not yet initialized
        const tabModuleData = this.tabModules.get(tabName);
        if (tabModuleData && !tabModuleData.initialized) {
            console.log(`🎬 Initializing ${tabName} tab module...`);
            tabModuleData.init();
        }

        // Update URL hash (router will handle this)
        if (window.router) {
            window.router.navigate(tabName);
        }

        // Close mobile menu if open
        this.closeMobileMenu();
    }

    registerTabModule(tabName, module) {
        // Store module reference with initialized flag
        this.tabModules.set(tabName, {
            module: module,
            initialized: false,
            init: () => {
                if (module && typeof module.init === 'function') {
                    module.init();
                    this.tabModules.get(tabName).initialized = true;
                }
            }
        });

        console.log(`📦 Registered module for tab: ${tabName}`);
    }

    openMobileMenu() {
        if (!this.sidebar) return;

        this.sidebar.classList.add('mobile-open');

        const backdrop = document.getElementById('sidebarBackdrop');
        if (backdrop) {
            backdrop.classList.add('active');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log('📱 Mobile menu opened');
    }

    closeMobileMenu() {
        if (!this.sidebar) return;

        this.sidebar.classList.remove('mobile-open');

        const backdrop = document.getElementById('sidebarBackdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
        }

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('📱 Mobile menu closed');
    }

    loadSidebarState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.sidebarCollapsed = data.collapsed || false;

                // Apply collapsed class if needed (only on desktop)
                if (this.sidebar && this.sidebarCollapsed && !this.isMobile) {
                    this.sidebar.classList.add('collapsed');
                }

                console.log(`💾 Loaded sidebar state: ${this.sidebarCollapsed ? 'collapsed' : 'expanded'}`);
            }
        } catch (error) {
            console.warn('⚠️ Failed to load sidebar state:', error);
        }
    }

    saveSidebarState() {
        try {
            const data = {
                collapsed: this.sidebarCollapsed
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('💾 Saved sidebar state');
        } catch (error) {
            console.warn('⚠️ Failed to save sidebar state:', error);
        }
    }
}
