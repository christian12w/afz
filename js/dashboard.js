/**
 * AFZ Member Hub - Advanced Dashboard JavaScript
 * Modern, interactive dashboard functionality with real-time features
 */

class AFZDashboard {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            email: 'john.doe@email.com',
            role: 'member',
            avatar: 'assets/avatars/john-doe.jpg',
            status: 'online',
            joinDate: '2023-01-15'
        };
        
        this.notifications = [];
        this.connections = [];
        this.chatMessages = [];
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('afz-theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.loadInitialData();
        this.startRealtimeUpdates();
        this.hideLoadingScreen();
        this.checkUserRole();
        this.setupAnimations();
        this.animateStatsCounters();
        this.setupSmoothScrolling();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger entrance animations after loading
                    this.animateDashboardEntrance();
                }, 500);
            }
        }, 1500);
    }

    checkUserRole() {
        const adminSection = document.getElementById('admin-section');
        const userRoleAttr = document.body.getAttribute('data-user-role');
        
        if (this.currentUser.role === 'admin' || userRoleAttr === 'admin') {
            adminSection.style.display = 'block';
            this.currentUser.role = 'admin';
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }

        // Sidebar navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Global search
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                this.showSearchResults();
            });
            
            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSearchResults(), 150);
            });
        }

        // Notifications
        const notificationsBtn = document.getElementById('notifications-btn');
        const notificationPanel = document.getElementById('notification-panel');
        
        if (notificationsBtn && notificationPanel) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });

            // Mark all as read
            const markAllRead = document.getElementById('mark-all-read');
            if (markAllRead) {
                markAllRead.addEventListener('click', () => {
                    this.markAllNotificationsRead();
                });
            }

            // Notification filters
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');
                    this.filterNotifications(filter);
                });
            });
        }

        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });

            // User menu actions
            const menuItems = userDropdown.querySelectorAll('[data-action]');
            menuItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = item.getAttribute('data-action');
                    this.handleUserAction(action);
                });
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('afz-theme', this.theme);
        
        // Show theme change notification
        this.showNotification('Theme changed successfully', 'success');
    }

    switchSection(sectionName) {
        // Show transition loading
        this.showSectionTransition();
        
        setTimeout(() => {
            // Update navigation with animation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                if (link.getAttribute('data-section') === sectionName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Update content sections with fade transition
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(`section-${sectionName}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Animate breadcrumb change
            const breadcrumb = document.querySelector('.breadcrumb-item.active');
            if (breadcrumb) {
                breadcrumb.style.opacity = '0';
                setTimeout(() => {
                    breadcrumb.textContent = this.formatSectionName(sectionName);
                    breadcrumb.style.opacity = '1';
                }, 200);
            }

            // Update welcome section content based on section
            this.updateWelcomeContent(sectionName);

            this.currentSection = sectionName;

            // Load section-specific data
            this.loadSectionData(sectionName);

            // Close mobile menu
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('show');
            }
            
            // Hide transition after content is loaded
            this.hideSectionTransition();
        }, 300);
    }

    formatSectionName(sectionName) {
        const nameMap = {
            'dashboard': 'Dashboard',
            'chat': 'Community Chat',
            'connections': 'My Network',
            'events': 'Events',
            'resources': 'Resources',
            'profile': 'My Profile',
            'admin-dashboard': 'Admin Dashboard',
            'member-management': 'Member Management',
            'event-management': 'Event Management',
            'analytics': 'Analytics',
            'content-curation': 'Content Curation'
        };
        return nameMap[sectionName] || sectionName;
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        // Simulate search results
        const mockResults = [
            { type: 'member', name: 'Sarah Williams', avatar: 'assets/avatars/sarah.jpg' },
            { type: 'event', name: 'Albinism Awareness Workshop', date: '2024-08-24' },
            { type: 'resource', name: 'Healthcare Directory', type: 'PDF' },
            { type: 'member', name: 'Michael Johnson', avatar: 'assets/avatars/michael.jpg' }
        ];

        const filteredResults = mockResults.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(filteredResults);
    }

    displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        if (!searchResultsContainer) return;

        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            searchResultsContainer.innerHTML = results.map(result => {
                const icon = this.getSearchResultIcon(result.type);
                return `
                    <div class="search-result-item" data-type="${result.type}">
                        <div class="result-icon">${icon}</div>
                        <div class="result-content">
                            <div class="result-name">${result.name}</div>
                            <div class="result-meta">${this.getSearchResultMeta(result)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        searchResultsContainer.style.display = 'block';
    }

    getSearchResultIcon(type) {
        const icons = {
            'member': '<i class="fas fa-user"></i>',
            'event': '<i class="fas fa-calendar"></i>',
            'resource': '<i class="fas fa-file"></i>'
        };
        return icons[type] || '<i class="fas fa-search"></i>';
    }

    getSearchResultMeta(result) {
        switch (result.type) {
            case 'member':
                return 'Community Member';
            case 'event':
                return result.date ? new Date(result.date).toLocaleDateString() : 'Event';
            case 'resource':
                return result.type || 'Resource';
            default:
                return '';
        }
    }

    showSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults && searchResults.innerHTML.trim()) {
            searchResults.style.display = 'block';
        }
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            const isVisible = panel.classList.contains('show');
            this.closeAllDropdowns();
            if (!isVisible) {
                panel.classList.add('show');
            }
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            const isVisible = dropdown.classList.contains('show');
            this.closeAllDropdowns();
            if (!isVisible) {
                dropdown.classList.add('show');
            }
        }
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.notification-panel, .user-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    loadInitialData() {
        this.loadNotifications();
        this.loadUserStats();
        this.updateUserInfo();
    }

    loadNotifications() {
        // Mock notification data
        this.notifications = [
            {
                id: 1,
                type: 'message',
                title: 'New message from Sarah M.',
                message: 'Thanks for sharing the healthcare guide...',
                time: new Date(Date.now() - 2 * 60 * 1000),
                read: false,
                avatar: 'assets/avatars/user1.jpg'
            },
            {
                id: 2,
                type: 'event',
                title: 'Event Reminder',
                message: 'Albinism Awareness Workshop starts in 2 hours',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false
            },
            {
                id: 3,
                type: 'system',
                title: 'System Update',
                message: 'New features added to member dashboard',
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: true
            }
        ];

        this.updateNotificationDisplay();
        this.updateNotificationBadge();
    }

    updateNotificationDisplay() {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notification => {
            const timeAgo = this.getTimeAgo(notification.time);
            const unreadClass = notification.read ? '' : 'unread';
            
            let iconHtml = '';
            if (notification.type === 'message' && notification.avatar) {
                iconHtml = `
                    <div class="notification-avatar">
                        <img src="${notification.avatar}" alt="User">
                        <div class="status-dot online"></div>
                    </div>
                `;
            } else {
                const iconClass = notification.type === 'event' ? 'event' : 'system';
                const iconName = notification.type === 'event' ? 'calendar-check' : 'info-circle';
                iconHtml = `
                    <div class="notification-icon ${iconClass}">
                        <i class="fas fa-${iconName}"></i>
                    </div>
                `;
            }

            return `
                <div class="notification-item ${unreadClass}" data-id="${notification.id}" data-type="${notification.type}">
                    ${iconHtml}
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                    ${notification.type === 'message' ? '<div class="notification-actions"><button class="reply-btn"><i class="fas fa-reply"></i></button></div>' : ''}
                </div>
            `;
        }).join('');

        // Add click listeners to notification items
        const notificationItems = notificationList.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                const notificationId = parseInt(item.getAttribute('data-id'));
                this.handleNotificationClick(notificationId);
            });
        });
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAllNotificationsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationDisplay();
        this.updateNotificationBadge();
        this.showNotification('All notifications marked as read', 'success');
    }

    filterNotifications(filter) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });

        let filteredNotifications = this.notifications;
        if (filter === 'unread') {
            filteredNotifications = this.notifications.filter(n => !n.read);
        }

        // Update display with filtered notifications
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;

        const items = notificationList.querySelectorAll('.notification-item');
        items.forEach((item, index) => {
            const notification = this.notifications[index];
            if (filter === 'all' || (filter === 'unread' && !notification.read)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationDisplay();
            this.updateNotificationBadge();

            // Handle different notification types
            if (notification.type === 'message') {
                this.switchSection('chat');
            } else if (notification.type === 'event') {
                this.switchSection('events');
            }
        }
    }

    handleUserAction(action) {
        switch (action) {
            case 'edit-profile':
                this.switchSection('profile');
                break;
            case 'account-settings':
                this.showModal('Account Settings', 'Account settings functionality will be available soon.');
                break;
            case 'privacy-settings':
                this.showModal('Privacy Settings', 'Privacy settings functionality will be available soon.');
                break;
            case 'billing':
                this.showModal('Billing & Donations', 'Billing and donation management will be available soon.');
                break;
            case 'help':
                this.showModal('Help & Support', 'For immediate assistance, please contact us at support@afz.org');
                break;
            case 'logout':
                this.handleLogout();
                break;
        }
        this.closeAllDropdowns();
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 1500);
        }
    }

    loadUserStats() {
        // Animate stat counters
        this.animateCounters();
    }

    animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/,/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            setTimeout(() => updateCounter(), Math.random() * 1000);
        });
    }

    updateUserInfo() {
        // Update user info in various places
        const userNameElements = document.querySelectorAll('.user-name');
        const userAvatarElements = document.querySelectorAll('.user-avatar');
        const avatarTextElements = document.querySelectorAll('.avatar-text');

        userNameElements.forEach(el => {
            if (el) el.textContent = this.currentUser.name;
        });

        userAvatarElements.forEach(el => {
            if (el) el.src = this.currentUser.avatar;
        });

        avatarTextElements.forEach(el => {
            if (el && !el.classList.contains('org')) {
                el.textContent = this.currentUser.name.split(' ').map(n => n[0]).join('');
            }
        });
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'chat':
                this.loadChatInterface();
                break;
            case 'connections':
                this.loadConnectionsInterface();
                break;
            case 'profile':
                this.loadProfileInterface();
                break;
            case 'admin-dashboard':
                this.loadAdminDashboard();
                break;
        }
    }

    loadChatInterface() {
        // Will implement chat interface
        console.log('Loading chat interface...');
    }

    loadConnectionsInterface() {
        // Will implement connections interface
        console.log('Loading connections interface...');
    }

    loadProfileInterface() {
        // Will implement profile interface
        console.log('Loading profile interface...');
    }

    loadAdminDashboard() {
        // Will implement admin dashboard
        console.log('Loading admin dashboard...');
    }

    startRealtimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000);

        setInterval(() => {
            this.checkForNewNotifications();
        }, 60000);
    }

    updateOnlineStatus() {
        const statusIndicators = document.querySelectorAll('.status-indicator.online');
        statusIndicators.forEach(indicator => {
            indicator.style.animation = 'pulse-status 2s infinite';
        });
    }

    checkForNewNotifications() {
        // Simulate receiving new notifications
        if (Math.random() > 0.7) {
            const newNotification = {
                id: Date.now(),
                type: 'system',
                title: 'New Update Available',
                message: 'Check out the latest features in your dashboard',
                time: new Date(),
                read: false
            };

            this.notifications.unshift(newNotification);
            this.updateNotificationDisplay();
            this.updateNotificationBadge();
        }
    }

    handleKeyboardShortcuts(e) {
        // Cmd/Ctrl + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close dropdowns
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
        }

        // Number keys for quick navigation
        if (e.key >= '1' && e.key <= '6' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const sections = ['dashboard', 'chat', 'connections', 'events', 'resources', 'profile'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.switchSection(sections[sectionIndex]);
            }
        }
    }

    handleWindowResize() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('show');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-${this.getToastIcon(type)}"></i>
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add toast styles if not already present
        this.addToastStyles();

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    addToastStyles() {
        if (document.getElementById('toast-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                border-left: 4px solid;
                transform: translateX(100%);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .notification-toast.show {
                transform: translateX(0);
            }
            
            .notification-toast.notification-success {
                border-left-color: #10b981;
            }
            
            .notification-toast.notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-toast.notification-warning {
                border-left-color: #f59e0b;
            }
            
            .notification-toast.notification-info {
                border-left-color: #3b82f6;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            
            .toast-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-success .toast-icon {
                color: #10b981;
            }
            
            .notification-error .toast-icon {
                color: #ef4444;
            }
            
            .notification-warning .toast-icon {
                color: #f59e0b;
            }
            
            .notification-info .toast-icon {
                color: #3b82f6;
            }
            
            .toast-message {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }
            
            .toast-close {
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                color: #6b7280;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .toast-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
        `;
        document.head.appendChild(styles);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles if not already present
        this.addModalStyles();

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-container {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px 24px 0;
                border-bottom: 1px solid #e5e7eb;
                margin-bottom: 20px;
            }
            
            .modal-header h3 {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                color: #111827;
            }
            
            .modal-close {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: #6b7280;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .modal-body {
                padding: 0 24px 24px;
            }
            
            .modal-body p {
                margin: 0;
                line-height: 1.6;
                color: #4b5563;
            }
        `;
        document.head.appendChild(styles);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    // Animation and transition methods
    setupAnimations() {
        this.setupCardHoverEffects();
        this.setupProgressBarAnimations();
        this.setupEntranceAnimations();
    }

    animateStatsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    animateDashboardEntrance() {
        const cards = document.querySelectorAll('.dashboard-card, .stat-card, .quick-link-card, .welcome-section');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.dashboard-card, .stat-card, .quick-link-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.style.transition) {
                    card.style.transition = 'all 0.3s ease';
                }
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = 'var(--shadow-xl)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    setupProgressBarAnimations() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    const width = progress.style.width;
                    progress.style.width = '0%';
                    progress.style.transition = 'width 1s ease-out';
                    
                    setTimeout(() => {
                        progress.style.width = width;
                    }, 100);
                    
                    observer.unobserve(progress);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }

    setupEntranceAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-animate');
                    this.playEntranceAnimation(element, animationType);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.3 });

        animatedElements.forEach(element => observer.observe(element));
    }

    playEntranceAnimation(element, type) {
        switch (type) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease-out';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
                break;
            case 'fade-in':
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.6s ease-out';
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 100);
                break;
            case 'slide-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-30px)';
                element.style.transition = 'all 0.6s ease-out';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    showSectionTransition() {
        const contentSections = document.querySelector('.content-sections');
        if (contentSections) {
            contentSections.classList.add('page-transition-exit');
        }
    }

    hideSectionTransition() {
        const contentSections = document.querySelector('.content-sections');
        if (contentSections) {
            contentSections.classList.remove('page-transition-exit');
            contentSections.classList.add('page-transition-enter');
            
            setTimeout(() => {
                contentSections.classList.remove('page-transition-enter');
            }, 400);
        }
    }

    updateWelcomeContent(sectionName) {
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');
        
        if (welcomeTitle && welcomeSubtitle) {
            const sectionMessages = {
                'chat': {
                    title: 'Community Chat',
                    subtitle: 'Connect with other AFZ community members, share experiences, and get support.'
                },
                'connections': {
                    title: 'My Network',
                    subtitle: 'Manage your connections and expand your support network within the AFZ community.'
                },
                'events': {
                    title: 'Upcoming Events',
                    subtitle: 'Discover and participate in AFZ events, workshops, and community gatherings.'
                },
                'resources': {
                    title: 'Resources Library',
                    subtitle: 'Access educational materials, guides, and tools to support your journey.'
                },
                'profile': {
                    title: 'My Profile',
                    subtitle: 'Manage your account settings, preferences, and personal information.'
                },
                'dashboard': {
                    title: 'Welcome back, John!',
                    subtitle: 'Here\'s what\'s happening in your AFZ community today. Continue making a difference in the lives of persons with albinism across Zambia.'
                }
            };

            const message = sectionMessages[sectionName] || sectionMessages['dashboard'];
            
            // Animate title change
            welcomeTitle.style.opacity = '0';
            welcomeSubtitle.style.opacity = '0';
            
            setTimeout(() => {
                welcomeTitle.textContent = message.title;
                welcomeSubtitle.textContent = message.subtitle;
                welcomeTitle.style.opacity = '1';
                welcomeSubtitle.style.opacity = '1';
            }, 200);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.afzDashboard = new AFZDashboard();
});

// Global functions for backward compatibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

function switchTheme() {
    if (window.afzDashboard) {
        window.afzDashboard.toggleTheme();
    }
}

// Service Worker registration for PWA capabilities (guarded - PWA manager handles this)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations && registrations.length > 0) {
                console.log('SW already registered by another module, skipping dashboard registration');
                return;
            }
        } catch (e) {
            console.warn('Could not check existing SW registrations, attempting register once');
        }
        const swUrl = new URL('sw.js', window.location.origin + window.location.pathname).pathname.replace(/\/[^/]*$/, '/sw.js');
        navigator.serviceWorker.register(swUrl)
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
export default AFZDashboard;
