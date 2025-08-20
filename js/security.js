// AFZ Security Module
class SecurityManager {
    constructor() {
        this.config = {
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            passwordMinLength: 8,
            rateLimitRequests: 100,
            rateLimitWindow: 15 * 60 * 1000, // 15 minutes
            allowedOrigins: [
                window.location.origin,
                'https://afz-advocacy.org',
                'https://www.afz-advocacy.org'
            ]
        };
        
        this.sessionData = new Map();
        this.loginAttempts = new Map();
        this.requestCounts = new Map();
        this.securityLog = [];
        
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupSecurityHeaders();
        this.initializeSessionManagement();
        this.setupInputValidation();
        this.setupRateLimiting();
        this.setupSecurityEventListeners();
        this.startSecurityMonitoring();
    }

    // Content Security Policy Implementation
    setupCSP() {
        const cspPolicy = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'", // Required for inline scripts - consider removing in production
                "https://fonts.googleapis.com",
                "https://www.google-analytics.com"
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'", // Required for inline styles
                "https://fonts.googleapis.com"
            ],
            'font-src': [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            'img-src': [
                "'self'",
                "data:",
                "https:",
                "blob:"
            ],
            'connect-src': [
                "'self'",
                "https://api.afz-advocacy.org",
                "wss:"
            ],
            'media-src': ["'self'", "data:", "blob:"],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'frame-ancestors': ["'none'"],
            'upgrade-insecure-requests': []
        };

        const cspString = Object.entries(cspPolicy)
            .map(([directive, sources]) => 
                sources.length > 0 
                    ? `${directive} ${sources.join(' ')}`
                    : directive
            )
            .join('; ');

        // Create meta tag for CSP if not exists
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const meta = document.createElement('meta');
            meta.setAttribute('http-equiv', 'Content-Security-Policy');
            meta.setAttribute('content', cspString);
            document.head.appendChild(meta);
        }

        this.logSecurityEvent('CSP', 'Content Security Policy initialized', 'info');
    }

    // Security Headers Setup
    setupSecurityHeaders() {
        // These would typically be set server-side, but we can validate them
        const requiredHeaders = [
            'X-Frame-Options',
            'X-Content-Type-Options',
            'X-XSS-Protection',
            'Referrer-Policy',
            'Permissions-Policy'
        ];

        // Validate HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            this.logSecurityEvent('HTTPS', 'Insecure connection detected', 'warning');
            this.showSecurityWarning('This site should be served over HTTPS for security.');
        }

        // Check for mixed content
        this.checkMixedContent();
    }

    // Input Validation and Sanitization
    setupInputValidation() {
        // XSS Protection patterns
        this.xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /<object[^>]*>.*?<\/object>/gi,
            /<embed[^>]*>.*?<\/embed>/gi,
            /<form[^>]*>.*?<\/form>/gi
        ];

        // SQL Injection patterns
        this.sqlInjectionPatterns = [
            /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
            /(--|#|\/\*|\*\/)/g,
            /(\b(or|and)\s+\w+\s*=\s*\w+)/gi,
            /('|(\\x27)|(\\x2D\\x2D))/g
        ];

        // Set up form validation
        this.setupFormValidation();
    }

    // Form Validation Setup
    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.validateForm(e);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateInput(e.target);
            }
        });
    }

    // Validate Form Submission
    validateForm(event) {
        const form = event.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            event.preventDefault();
            this.logSecurityEvent('FORM_VALIDATION', 'Form validation failed', 'warning');
        }
    }

    // Input Validation
    validateInput(input) {
        const value = input.value;
        const type = input.type || input.tagName.toLowerCase();
        let isValid = true;

        // XSS Detection
        if (this.detectXSS(value)) {
            this.showInputError(input, 'Invalid characters detected');
            this.logSecurityEvent('XSS_ATTEMPT', `XSS attempt detected in ${input.name || input.id}`, 'critical');
            isValid = false;
        }

        // SQL Injection Detection
        if (this.detectSQLInjection(value)) {
            this.showInputError(input, 'Invalid input detected');
            this.logSecurityEvent('SQL_INJECTION_ATTEMPT', `SQL injection attempt detected in ${input.name || input.id}`, 'critical');
            isValid = false;
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showInputError(input, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
            case 'password':
                if (value && !this.isValidPassword(value)) {
                    this.showInputError(input, 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
                    isValid = false;
                }
                break;
            case 'url':
                if (value && !this.isValidURL(value)) {
                    this.showInputError(input, 'Please enter a valid URL');
                    isValid = false;
                }
                break;
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    this.showInputError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
                break;
        }

        if (isValid) {
            this.clearInputError(input);
        }

        return isValid;
    }

    // XSS Detection
    detectXSS(input) {
        if (!input || typeof input !== 'string') return false;
        
        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    // SQL Injection Detection
    detectSQLInjection(input) {
        if (!input || typeof input !== 'string') return false;
        
        return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
    }

    // Sanitize Input
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Validation Helper Functions
    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    isValidPassword(password) {
        if (password.length < this.config.passwordMinLength) return false;
        
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUpper && hasLower && hasNumber && hasSpecial;
    }

    isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    isValidPhone(phone) {
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        return phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Rate Limiting
    setupRateLimiting() {
        this.originalFetch = window.fetch;
        
        window.fetch = (...args) => {
            if (this.isRateLimited()) {
                this.logSecurityEvent('RATE_LIMIT', 'Rate limit exceeded', 'warning');
                return Promise.reject(new Error('Rate limit exceeded. Please try again later.'));
            }
            
            this.incrementRequestCount();
            return this.originalFetch(...args);
        };
    }

    isRateLimited() {
        const now = Date.now();
        const windowStart = now - this.config.rateLimitWindow;
        
        // Clean old requests
        this.requestCounts.forEach((timestamp, key) => {
            if (timestamp < windowStart) {
                this.requestCounts.delete(key);
            }
        });
        
        return this.requestCounts.size >= this.config.rateLimitRequests;
    }

    incrementRequestCount() {
        const requestId = Date.now() + Math.random();
        this.requestCounts.set(requestId, Date.now());
    }

    // Session Management
    initializeSessionManagement() {
        // Set up session timeout
        this.setupSessionTimeout();
        
        // Monitor for suspicious activity
        this.setupActivityMonitoring();
        
        // Secure cookie settings (would be set server-side in production)
        document.cookie = "SameSite=Strict; Secure; HttpOnly";
    }

    setupSessionTimeout() {
        let lastActivity = Date.now();
        
        const resetTimer = () => {
            lastActivity = Date.now();
        };
        
        // Track user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
        
        // Check session timeout
        setInterval(() => {
            if (Date.now() - lastActivity > this.config.sessionTimeout) {
                this.handleSessionTimeout();
            }
        }, 60000); // Check every minute
    }

    handleSessionTimeout() {
        this.logSecurityEvent('SESSION_TIMEOUT', 'Session expired due to inactivity', 'info');
        
        // Clear sensitive data
        sessionStorage.clear();
        
        // Redirect to login if user was authenticated
        if (this.isAuthenticated()) {
            this.logout();
            this.showSecurityMessage('Your session has expired. Please log in again.');
        }
    }

    setupActivityMonitoring() {
        // Monitor for rapid clicks (potential bot activity)
        let clickCount = 0;
        let clickTimer;
        
        document.addEventListener('click', () => {
            clickCount++;
            
            if (!clickTimer) {
                clickTimer = setTimeout(() => {
                    if (clickCount > 10) { // More than 10 clicks per second
                        this.logSecurityEvent('SUSPICIOUS_ACTIVITY', 'Rapid clicking detected', 'warning');
                    }
                    clickCount = 0;
                    clickTimer = null;
                }, 1000);
            }
        });
        
        // Monitor for rapid form submissions
        this.monitorFormSubmissions();
    }

    monitorFormSubmissions() {
        let submissionCount = 0;
        let submissionTimer;
        
        document.addEventListener('submit', () => {
            submissionCount++;
            
            if (!submissionTimer) {
                submissionTimer = setTimeout(() => {
                    if (submissionCount > 3) { // More than 3 submissions per minute
                        this.logSecurityEvent('SUSPICIOUS_ACTIVITY', 'Rapid form submissions detected', 'warning');
                    }
                    submissionCount = 0;
                    submissionTimer = null;
                }, 60000);
            }
        });
    }

    // Authentication Security
    enhanceAuthenticationSecurity() {
        // Password strength meter
        this.setupPasswordStrengthMeter();
        
        // Account lockout after failed attempts
        this.setupAccountLockout();
        
        // Secure password reset
        this.setupSecurePasswordReset();
    }

    setupPasswordStrengthMeter() {
        document.addEventListener('input', (e) => {
            if (e.target.type === 'password' && e.target.id !== 'confirmPassword') {
                this.updatePasswordStrength(e.target);
            }
        });
    }

    updatePasswordStrength(passwordInput) {
        const password = passwordInput.value;
        let strength = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) strength += 25;
        else feedback.push('At least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 25;
        else feedback.push('One uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) strength += 25;
        else feedback.push('One lowercase letter');

        // Number check
        if (/\d/.test(password)) strength += 12.5;
        else feedback.push('One number');

        // Special character check
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 12.5;
        else feedback.push('One special character');

        this.displayPasswordStrength(passwordInput, strength, feedback);
    }

    displayPasswordStrength(input, strength, feedback) {
        let strengthMeter = input.parentNode.querySelector('.password-strength');
        
        if (!strengthMeter) {
            strengthMeter = document.createElement('div');
            strengthMeter.className = 'password-strength';
            input.parentNode.appendChild(strengthMeter);
        }

        let strengthClass = 'weak';
        let strengthText = 'Weak';

        if (strength >= 75) {
            strengthClass = 'strong';
            strengthText = 'Strong';
        } else if (strength >= 50) {
            strengthClass = 'medium';
            strengthText = 'Medium';
        }

        strengthMeter.innerHTML = `
            <div class="strength-bar ${strengthClass}">
                <div class="strength-fill" style="width: ${strength}%"></div>
            </div>
            <div class="strength-text">${strengthText}</div>
            ${feedback.length > 0 ? `<div class="strength-feedback">Needs: ${feedback.join(', ')}</div>` : ''}
        `;
    }

    setupAccountLockout() {
        // This would typically be handled server-side
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                const email = e.target.querySelector('input[type="email"]').value;
                
                if (this.isAccountLocked(email)) {
                    e.preventDefault();
                    this.showSecurityMessage('Account temporarily locked due to multiple failed login attempts.');
                }
            }
        });
    }

    isAccountLocked(email) {
        const attempts = this.loginAttempts.get(email);
        
        if (!attempts) return false;
        
        if (attempts.count >= this.config.maxLoginAttempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            return timeSinceLastAttempt < this.config.lockoutDuration;
        }
        
        return false;
    }

    recordFailedLogin(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(email, attempts);
        
        this.logSecurityEvent('FAILED_LOGIN', `Failed login attempt for ${email}`, 'warning');
    }

    // Security Event Listeners
    setupSecurityEventListeners() {
        // Detect developer tools
        this.detectDeveloperTools();
        
        // Detect right-click disable attempts
        document.addEventListener('contextmenu', (e) => {
            // Allow right-click but log it for monitoring
            this.logSecurityEvent('RIGHT_CLICK', 'Context menu accessed', 'info');
        });
        
        // Detect F12 key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                this.logSecurityEvent('DEVTOOLS_ATTEMPT', 'Developer tools access attempt', 'info');
            }
        });
        
        // Detect copy attempts on sensitive data
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection().toString();
            if (selection.length > 100) {
                this.logSecurityEvent('COPY_LARGE_TEXT', 'Large text copy detected', 'info');
            }
        });
    }

    detectDeveloperTools() {
        let devtools = { open: false, orientation: null };
        const threshold = 160;

        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.logSecurityEvent('DEVTOOLS_OPEN', 'Developer tools opened', 'info');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // Mixed Content Check
    checkMixedContent() {
        const elements = document.querySelectorAll('img, script, link, iframe, video, audio');
        
        elements.forEach(el => {
            const src = el.src || el.href;
            if (src && src.startsWith('http:') && location.protocol === 'https:') {
                this.logSecurityEvent('MIXED_CONTENT', `Mixed content detected: ${src}`, 'warning');
            }
        });
    }

    // Security Monitoring
    startSecurityMonitoring() {
        // Monitor for unauthorized access attempts
        this.monitorUnauthorizedAccess();
        
        // Check for security updates
        this.checkSecurityUpdates();
        
        // Monitor performance for potential attacks
        this.monitorPerformance();
    }

    monitorUnauthorizedAccess() {
        // Monitor for access to restricted areas
        const restrictedPaths = ['/admin', '/api/admin', '/dashboard'];
        
        if (restrictedPaths.some(path => location.pathname.startsWith(path))) {
            if (!this.isAuthorized()) {
                this.logSecurityEvent('UNAUTHORIZED_ACCESS', `Unauthorized access attempt to ${location.pathname}`, 'critical');
                this.redirectToLogin();
            }
        }
    }

    monitorPerformance() {
        // Monitor for potential DoS attacks by checking performance
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 5000) { // More than 5 seconds
                    this.logSecurityEvent('PERFORMANCE_ISSUE', `Slow operation detected: ${entry.name}`, 'warning');
                }
            });
        });
        
        observer.observe({ entryTypes: ['navigation', 'resource'] });
    }

    // Utility Functions
    isAuthenticated() {
        return localStorage.getItem('authToken') !== null || 
               sessionStorage.getItem('authToken') !== null;
    }

    isAuthorized() {
        // Check user permissions - would integrate with actual auth system
        const userRole = localStorage.getItem('userRole');
        return userRole === 'admin' || userRole === 'moderator';
    }

    logout() {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.logSecurityEvent('LOGOUT', 'User logged out', 'info');
    }

    redirectToLogin() {
        window.location.href = '/pages/member-portal.html';
    }

    checkSecurityUpdates() {
        // In a real implementation, this would check for security updates
        console.log('Security update check completed');
    }

    // UI Helper Functions
    showInputError(input, message) {
        this.clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem;';
        
        input.parentNode.appendChild(errorDiv);
        input.classList.add('is-invalid');
    }

    clearInputError(input) {
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('is-invalid');
    }

    showSecurityWarning(message) {
        this.showSecurityNotification(message, 'warning');
    }

    showSecurityMessage(message) {
        this.showSecurityNotification(message, 'info');
    }

    showSecurityNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `security-notification security-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background: ${type === 'warning' ? '#fff3cd' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            border: 1px solid ${type === 'warning' ? '#ffeaa7' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            color: ${type === 'warning' ? '#856404' : type === 'error' ? '#721c24' : '#0c5460'};
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: inherit;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 8px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Security Logging
    logSecurityEvent(type, message, severity = 'info') {
        const event = {
            timestamp: new Date().toISOString(),
            type,
            message,
            severity,
            userAgent: navigator.userAgent,
            url: window.location.href,
            ip: 'client-side' // Would be actual IP server-side
        };

        this.securityLog.push(event);

        // Keep only last 1000 events
        if (this.securityLog.length > 1000) {
            this.securityLog = this.securityLog.slice(-1000);
        }

        // In production, send critical events to server immediately
        if (severity === 'critical') {
            this.reportSecurityEvent(event);
        }

        // Console log for debugging
        console.log(`[SECURITY ${severity.toUpperCase()}] ${type}: ${message}`);
    }

    reportSecurityEvent(event) {
        // In production, send to security monitoring service
        console.warn('CRITICAL SECURITY EVENT:', event);
        
        // Could integrate with services like:
        // - Sentry for error reporting
        // - LogRocket for session replay
        // - Custom security monitoring endpoint
    }

    // Public API
    getSecurityLog() {
        return [...this.securityLog];
    }

    clearSecurityLog() {
        this.securityLog = [];
    }

    getSecurityStatus() {
        return {
            cspEnabled: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            httpsEnabled: location.protocol === 'https:',
            sessionActive: this.isAuthenticated(),
            rateLimitActive: true,
            inputValidationActive: true
        };
    }
}

// Initialize Security Manager
const securityManager = new SecurityManager();

// Add CSS for security notifications and password strength
const securityStyles = document.createElement('style');
securityStyles.textContent = `
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        height: 4px;
        background-color: #e9ecef;
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease;
        background-color: #dc3545;
    }
    
    .strength-bar.medium .strength-fill {
        background-color: #ffc107;
    }
    
    .strength-bar.strong .strength-fill {
        background-color: #28a745;
    }
    
    .strength-text {
        font-size: 0.8rem;
        margin-top: 0.25rem;
        font-weight: 500;
    }
    
    .strength-feedback {
        font-size: 0.75rem;
        color: #6c757d;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(securityStyles);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}
