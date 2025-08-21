// AFZ Advocacy PWA JavaScript
// Handles service worker registration, app installation, push notifications, and offline functionality

class AFZPWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.installPromptShown = false;
        this.isRefreshing = false;
        this._controllerChangeBound = false;
        
        this.init();
    }
    
    async init() {
        // Register service worker
        await this.registerServiceWorker();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup connectivity monitoring
        this.setupConnectivityMonitoring();
        
        // Setup push notifications
        this.setupPushNotifications();
        
        // Setup offline functionality
        this.setupOfflineHandling();
        
        // Setup background sync
        this.setupBackgroundSync();
        
        console.log('[PWA] AFZ Advocacy PWA initialized');
    }
    
    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const baseDir = window.location.pathname.replace(/[^/]*$/, '');
                const swUrl = baseDir + 'sw.js';
                const scopeUrl = baseDir;
                this.swRegistration = await navigator.serviceWorker.register(swUrl, { scope: scopeUrl });
                
                console.log('[PWA] Service Worker registered successfully:', this.swRegistration);
                
                // Handle service worker updates
                this.swRegistration.addEventListener('updatefound', () => {
                    const newWorker = this.swRegistration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailableNotification();
                        }
                    });
                });
                
                return this.swRegistration;
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
                return null;
            }
        } else {
            console.warn('[PWA] Service Workers are not supported');
            return null;
        }
    }
    
    // App Installation Prompt
    setupInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');
            
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            
            // Store the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show custom install button
            this.showInstallButton();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', (e) => {
            console.log('[PWA] App installed successfully');
            this.hideInstallButton();
            this.trackEvent('pwa_installed', { method: 'browser_prompt' });
            
            // Show welcome message for installed app
            this.showWelcomeMessage();
        });
        
        // Check if app is already installed (running in standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            console.log('[PWA] App is running in standalone mode');
            this.handleStandaloneMode();
        }
    }
    
    // Show custom install button
    showInstallButton() {
        if (this.installPromptShown) return;
        
        // Create install banner if it doesn't exist
        let installBanner = document.getElementById('pwa-install-banner');
        if (!installBanner) {
            installBanner = this.createInstallBanner();
            document.body.appendChild(installBanner);
        }
        
        installBanner.style.display = 'block';
        this.installPromptShown = true;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installBanner && installBanner.style.display !== 'none') {
                this.hideInstallButton();
            }
        }, 10000);
    }
    
    // Create install banner element
    createInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-banner-icon">📱</div>
                <div class="install-banner-text">
                    <h4>Install AFZ Advocacy App</h4>
                    <p>Get quick access and offline functionality</p>
                </div>
                <div class="install-banner-actions">
                    <button class="install-btn" onclick="window.afzPWA.promptInstall()">
                        Install
                    </button>
                    <button class="dismiss-btn" onclick="window.afzPWA.hideInstallButton()">
                        ✕
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #2b6cb0 0%, #3b82f6 100%);
                color: white;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: none;
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            
            .install-banner-content {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .install-banner-icon {
                font-size: 2rem;
                margin-right: 12px;
            }
            
            .install-banner-text h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .install-banner-text p {
                margin: 0;
                font-size: 0.875rem;
                opacity: 0.9;
            }
            
            .install-banner-actions {
                margin-left: auto;
                display: flex;
                gap: 8px;
            }
            
            .install-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .install-btn:hover {
                background: rgba(255,255,255,0.3);
                border-color: rgba(255,255,255,0.5);
            }
            
            .dismiss-btn {
                background: none;
                border: none;
                color: white;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .dismiss-btn:hover {
                opacity: 1;
            }
            
            @media (max-width: 640px) {
                .install-banner-content {
                    padding: 10px 12px;
                }
                
                .install-banner-icon {
                    font-size: 1.5rem;
                }
                
                .install-banner-text h4 {
                    font-size: 0.9rem;
                }
                
                .install-banner-text p {
                    font-size: 0.8rem;
                }
                
                .install-btn {
                    padding: 6px 12px;
                    font-size: 0.875rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        return banner;
    }
    
    // Prompt user to install app
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('[PWA] Install prompt not available');
            return;
        }
        
        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`[PWA] User response to install prompt: ${outcome}`);
            this.trackEvent('pwa_install_prompt', { outcome });
            
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('[PWA] Error showing install prompt:', error);
        }
    }
    
    // Hide install button
    hideInstallButton() {
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) {
            installBanner.style.display = 'none';
        }
    }
    
    // Handle standalone mode
    handleStandaloneMode() {
        // Add standalone class to body
        document.body.classList.add('pwa-standalone');
        
        // Hide browser-specific elements
        const browserOnlyElements = document.querySelectorAll('[data-browser-only]');
        browserOnlyElements.forEach(el => el.style.display = 'none');
        
        // Show PWA-specific elements
        const pwaOnlyElements = document.querySelectorAll('[data-pwa-only]');
        pwaOnlyElements.forEach(el => el.style.display = 'block');
        
        // Track standalone usage
        this.trackEvent('pwa_standalone_usage');
    }
    
    // Connectivity Monitoring
    setupConnectivityMonitoring() {
        // Update online status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('[PWA] Connection restored');
            this.showConnectionStatus('online');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('[PWA] Connection lost');
            this.showConnectionStatus('offline');
        });
        
        // Initial connection check
        this.checkConnection();
    }
    
    // Check connection with network request
    async checkConnection() {
        try {
            const manifestUrl = new URL('manifest.json', window.location.href).toString();
            const response = await fetch(manifestUrl, { 
                method: 'HEAD', 
                cache: 'no-cache' 
            });
            
            if (response.ok) {
                this.isOnline = true;
            }
        } catch (error) {
            this.isOnline = false;
        }
        
        return this.isOnline;
    }
    
    // Show connection status
    showConnectionStatus(status) {
        // Remove existing status notifications
        const existingStatus = document.querySelector('.connection-status-notification');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Create new status notification
        const notification = document.createElement('div');
        notification.className = `connection-status-notification ${status}`;
        
        if (status === 'online') {
            notification.innerHTML = `
                <div class="status-content">
                    <span class="status-icon">✅</span>
                    <span class="status-text">Back online</span>
                </div>
            `;
        } else {
            notification.innerHTML = `
                <div class="status-content">
                    <span class="status-icon">⚠️</span>
                    <span class="status-text">You're offline</span>
                </div>
            `;
        }
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .connection-status-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                padding: 12px 16px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .connection-status-notification.online {
                background: #059669;
            }
            
            .connection-status-notification.offline {
                background: #dc2626;
            }
            
            .status-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @media (max-width: 640px) {
                .connection-status-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    font-size: 0.875rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Push Notifications Setup
    async setupPushNotifications() {
        if (!('Notification' in window) || !this.swRegistration) {
            console.log('[PWA] Push notifications not supported');
            return;
        }
        
        // Check current permission
        if (Notification.permission === 'granted') {
            console.log('[PWA] Notification permission granted');
            await this.subscribeToPush();
        } else if (Notification.permission !== 'denied') {
            // Show notification permission prompt
            this.showNotificationPermissionPrompt();
        }
    }
    
    // Show notification permission prompt
    showNotificationPermissionPrompt() {
        // Don't show if user previously denied or if already shown
        if (localStorage.getItem('notification-prompt-shown') === 'true') {
            return;
        }
        
        // Show after a delay to not overwhelm user
        setTimeout(() => {
            this.createNotificationPrompt();
        }, 5000);
    }
    
    // Create notification permission prompt
    createNotificationPrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'notification-permission-prompt';
        prompt.className = 'notification-prompt';
        
        prompt.innerHTML = `
            <div class="prompt-content">
                <div class="prompt-icon">🔔</div>
                <div class="prompt-text">
                    <h4>Stay Updated</h4>
                    <p>Get notified about AFZ events and advocacy updates</p>
                </div>
                <div class="prompt-actions">
                    <button class="allow-btn" onclick="window.afzPWA.requestNotificationPermission()">
                        Allow
                    </button>
                    <button class="decline-btn" onclick="window.afzPWA.declineNotifications()">
                        Not now
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-prompt {
                position: fixed;
                bottom: 20px;
                right: 20px;
                max-width: 350px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                z-index: 1002;
                animation: slideInUp 0.3s ease-out;
                border: 1px solid rgba(0,0,0,0.1);
            }
            
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .prompt-content {
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .prompt-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .prompt-text h4 {
                margin: 0 0 4px 0;
                color: #1f2937;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .prompt-text p {
                margin: 0;
                color: #6b7280;
                font-size: 0.875rem;
                line-height: 1.4;
            }
            
            .prompt-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-left: auto;
                flex-shrink: 0;
            }
            
            .allow-btn {
                background: #2b6cb0;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 0.875rem;
                transition: background 0.2s;
            }
            
            .allow-btn:hover {
                background: #1e40af;
            }
            
            .decline-btn {
                background: none;
                color: #6b7280;
                border: none;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 0.8rem;
                text-decoration: underline;
                opacity: 0.8;
            }
            
            .decline-btn:hover {
                opacity: 1;
            }
            
            @media (max-width: 640px) {
                .notification-prompt {
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
                
                .prompt-content {
                    padding: 16px;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(prompt);
        
        // Mark as shown
        localStorage.setItem('notification-prompt-shown', 'true');
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                this.declineNotifications();
            }
        }, 15000);
    }
    
    // Request notification permission
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('[PWA] Notification permission granted');
                await this.subscribeToPush();
                this.trackEvent('notification_permission_granted');
            } else {
                console.log('[PWA] Notification permission denied');
                this.trackEvent('notification_permission_denied');
            }
            
            this.removeNotificationPrompt();
        } catch (error) {
            console.error('[PWA] Error requesting notification permission:', error);
        }
    }
    
    // Decline notifications
    declineNotifications() {
        console.log('[PWA] User declined notifications');
        this.removeNotificationPrompt();
        this.trackEvent('notification_permission_declined');
    }
    
    // Remove notification prompt
    removeNotificationPrompt() {
        const prompt = document.getElementById('notification-permission-prompt');
        if (prompt) {
            prompt.remove();
        }
    }
    
    // Subscribe to push notifications
    async subscribeToPush() {
        try {
            // This is a simplified version - in production, you'd need a real VAPID key
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlB64ToUint8Array('your-vapid-public-key-here')
            });
            
            console.log('[PWA] Push subscription successful:', subscription);
            
            // Send subscription to server (in production)
            // await this.sendSubscriptionToServer(subscription);
            
            return subscription;
        } catch (error) {
            console.error('[PWA] Failed to subscribe to push notifications:', error);
        }
    }
    
    // Convert VAPID key
    urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    // Offline Handling
    setupOfflineHandling() {
        // Store form data when offline
        this.interceptFormSubmissions();
        
        // Show offline indicators
        this.updateOfflineUI();
    }
    
    // Intercept form submissions for offline handling
    interceptFormSubmissions() {
        document.addEventListener('submit', async (e) => {
            if (!this.isOnline) {
                e.preventDefault();
                
                const form = e.target;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Store for background sync
                await this.storeOfflineFormData(form.action, data);
                
                // Show offline submission message
                this.showOfflineSubmissionMessage();
            }
        });
    }
    
    // Store form data for background sync
    async storeOfflineFormData(action, data) {
        try {
            // In a real implementation, you'd use IndexedDB
            const offlineData = JSON.parse(localStorage.getItem('offline-form-data') || '[]');
            
            offlineData.push({
                id: Date.now(),
                action,
                data,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('offline-form-data', JSON.stringify(offlineData));
            
            console.log('[PWA] Form data stored for offline sync');
        } catch (error) {
            console.error('[PWA] Error storing offline form data:', error);
        }
    }
    
    // Show offline submission message
    showOfflineSubmissionMessage() {
        // Create and show notification that form will be submitted when online
        const message = document.createElement('div');
        message.className = 'offline-submission-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">📱</span>
                <span class="message-text">Saved! Will be submitted when you're back online.</span>
            </div>
        `;
        
        // Style the message
        const style = document.createElement('style');
        style.textContent = `
            .offline-submission-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #f59e0b;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1003;
                animation: slideInDown 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .message-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            @keyframes slideInDown {
                from { transform: translateX(-50%) translateY(-100%); }
                to { transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }
    
    // Background Sync Setup
    setupBackgroundSync() {
        if (!this.swRegistration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
            console.log('[PWA] Background sync not supported');
            return;
        }
        
        console.log('[PWA] Background sync available');
    }
    
    // Sync offline data when back online
    async syncOfflineData() {
        try {
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                // Register background sync
                await this.swRegistration.sync.register('form-submission');
                console.log('[PWA] Background sync registered for form submissions');
            } else {
                // Fallback: sync immediately
                await this.syncOfflineDataNow();
            }
        } catch (error) {
            console.error('[PWA] Error syncing offline data:', error);
        }
    }
    
    // Sync offline data immediately (fallback)
    async syncOfflineDataNow() {
        try {
            const offlineData = JSON.parse(localStorage.getItem('offline-form-data') || '[]');
            
            for (const submission of offlineData) {
                try {
                    const response = await fetch(submission.action, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(submission.data)
                    });
                    
                    if (response.ok) {
                        console.log('[PWA] Offline form submission synced successfully');
                    }
                } catch (error) {
                    console.error('[PWA] Error syncing form submission:', error);
                }
            }
            
            // Clear synced data
            localStorage.removeItem('offline-form-data');
            
        } catch (error) {
            console.error('[PWA] Error syncing offline data now:', error);
        }
    }
    
    // Update offline UI indicators
    updateOfflineUI() {
        const offlineIndicators = document.querySelectorAll('[data-offline-indicator]');
        
        offlineIndicators.forEach(indicator => {
            if (this.isOnline) {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'block';
            }
        });
    }
    
    // Show update available notification
    showUpdateAvailableNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span class="update-icon">🆕</span>
                <span class="update-text">New version available!</span>
                <button class="update-btn" onclick="window.afzPWA.updateApp()">Update</button>
                <button class="dismiss-btn" onclick="this.parentNode.parentNode.remove()">✕</button>
            </div>
        `;
        
        // Style the notification
        const style = document.createElement('style');
        style.textContent = `
            .update-notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                max-width: 400px;
                margin: 0 auto;
                background: #2b6cb0;
                color: white;
                padding: 16px;
                border-radius: 8px;
                z-index: 1004;
                animation: slideInUp 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .update-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .update-text {
                flex: 1;
                font-weight: 500;
            }
            
            .update-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.875rem;
            }
            
            .dismiss-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
    }
    
    // Update app
    async updateApp() {
        if (this.swRegistration && this.swRegistration.waiting) {
            // Listen for the new service worker to take control, then reload once
            if (!this._controllerChangeBound && typeof navigator !== 'undefined' && navigator.serviceWorker) {
                this._controllerChangeBound = true;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (this.isRefreshing) return;
                    this.isRefreshing = true;
                    window.location.reload();
                });
            }

            // Tell the waiting service worker to take over
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }
    
    // Show welcome message for installed app
    showWelcomeMessage() {
        const welcomeMessage = `
            <div class="welcome-message">
                <h3>🎉 Welcome to AFZ Advocacy!</h3>
                <p>You've successfully installed the app. You can now access AFZ content offline and receive updates.</p>
            </div>
        `;
        
        // Show welcome message implementation here
        console.log('[PWA] App installed - showing welcome message');
    }
    
    // Analytics/tracking helper
    trackEvent(eventName, properties = {}) {
        // In production, integrate with your analytics service
        console.log(`[PWA Analytics] ${eventName}:`, properties);
        
        // Example: Google Analytics 4
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, properties);
        // }
    }
    
    // Get app status
    getAppStatus() {
        return {
            isOnline: this.isOnline,
            isInstalled: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone,
            hasServiceWorker: !!this.swRegistration,
            hasNotificationPermission: Notification.permission === 'granted',
            version: '1.0.0'
        };
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.afzPWA = new AFZPWAManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AFZPWAManager;
}
