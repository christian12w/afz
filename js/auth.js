/**
 * Authentication System JavaScript
 * Handles user registration, login, password management, and form validation
 */

(function() {
    'use strict';

    // Authentication state management
    let authState = {
        isLoggedIn: false,
        user: null,
        token: null
    };

    // Initialize authentication system
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    } else {
        initializeAuth();
    }

    function initializeAuth() {
        // Check for existing authentication
        checkAuthStatus();
        
        // Setup tab switching
        setupTabSwitching();
        
        // Setup form handling
        setupFormHandlers();
        
        // Setup password toggles
        setupPasswordToggles();
        
        // Setup social login buttons
        setupSocialLogin();
        
        // Setup forgot password
        setupForgotPassword();
        
        // Progressive enhancements
        setupFormPersistence();
        setupAutoComplete();
        setupOfflineSupport();
        setupAccessibilityEnhancements();
    }

    // Tab Switching Functionality
    function setupTabSwitching() {
        const tabs = document.querySelectorAll('.auth-tab');
        const panels = document.querySelectorAll('.auth-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetPanel = this.getAttribute('aria-controls');
                
                // Update tab states
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                
                // Update panel states
                panels.forEach(p => {
                    p.classList.remove('active');
                });
                
                // Activate selected tab and panel
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                document.getElementById(targetPanel).classList.add('active');
                
                // Clear any existing errors when switching tabs
                clearAllErrors();
                
                // Announce tab change to screen readers
                announceToScreenReader(`Switched to ${this.textContent} form`);
            });
        });
    }

    // Form Handler Setup
    function setupFormHandlers() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            setupFormValidation(loginForm);
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegistration);
            setupFormValidation(registerForm);
            setupPasswordStrengthChecker();
        }
    }

    // Password Toggle Functionality
    function setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
                const icon = this.querySelector('.password-toggle-icon');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.textContent = '🙈';
                    this.setAttribute('aria-label', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    icon.textContent = '👁️';
                    this.setAttribute('aria-label', 'Show password');
                }
            });
        });
    }

    // Form Validation Setup
    function setupFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="tel"]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    // Field Validation
    function validateField(field) {
        const fieldName = getFieldName(field);
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `${fieldName} is required.`;
        } else if (field.value.trim()) {
            // Type-specific validation
            switch (field.type) {
                case 'email':
                    if (!isValidEmail(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                    
                case 'tel':
                    if (field.value && !isValidPhone(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                    
                case 'password':
                    if (field.id.includes('register-password') && !isValidPassword(field.value)) {
                        isValid = false;
                        errorMessage = 'Password must meet the requirements shown below.';
                    }
                    break;
            }
            
            // Confirm password validation
            if (field.name === 'confirmPassword') {
                const passwordField = document.getElementById('register-password');
                if (passwordField && field.value !== passwordField.value) {
                    isValid = false;
                    errorMessage = 'Passwords do not match.';
                }
            }
        }

        // Display error if validation failed
        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Password Strength Checker
    function setupPasswordStrengthChecker() {
        const passwordField = document.getElementById('register-password');
        const requirements = document.querySelectorAll('.password-requirements li');
        
        if (!passwordField || !requirements.length) return;
        
        passwordField.addEventListener('input', function() {
            const password = this.value;
            const checks = [
                password.length >= 8, // Length
                /[A-Z]/.test(password), // Uppercase
                /[a-z]/.test(password), // Lowercase
                /\d/.test(password) // Number
            ];
            
            requirements.forEach((req, index) => {
                req.classList.toggle('met', checks[index]);
                req.setAttribute('aria-label', 
                    checks[index] ? 'Requirement met' : 'Requirement not met');
            });
        });
    }

    // Login Handler
    async function handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            rememberMe: formData.get('rememberMe') === 'on'
        };
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        showLoadingState(submitButton);
        
        try {
            // Simulate API call (replace with actual authentication)
            const response = await simulateLogin(loginData);
            
            if (response.success) {
                // Store authentication data
                authState.isLoggedIn = true;
                authState.user = response.user;
                authState.token = response.token;
                
                // Store in localStorage if remember me is checked
                if (loginData.rememberMe) {
                    localStorage.setItem('afz_auth_token', response.token);
                    localStorage.setItem('afz_user', JSON.stringify(response.user));
                }
                
                // Show success message
                showAuthSuccess('Login successful! Welcome back.', () => {
                    // Redirect to member hub or return URL
                    window.location.href = './member-hub.html';
                });
                
            } else {
                showAuthError(response.message || 'Login failed. Please check your credentials.');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showAuthError('Network error. Please check your connection and try again.');
        } finally {
            hideLoadingState(submitButton);
        }
    }

    // Registration Handler
    async function handleRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const registrationData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            agreeToTerms: formData.get('agreeToTerms') === 'on',
            subscribeNewsletter: formData.get('subscribeNewsletter') === 'on'
        };
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Check terms agreement
        if (!registrationData.agreeToTerms) {
            showAuthError('You must agree to the Terms of Service and Privacy Policy to create an account.');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        showLoadingState(submitButton);
        
        try {
            // Simulate API call (replace with actual registration)
            const response = await simulateRegistration(registrationData);
            
            if (response.success) {
                // Show success message
                showAuthSuccess('Account created successfully! Please check your email to verify your account.', () => {
                    // Switch to login tab
                    document.getElementById('login-tab').click();
                });
                
                // Clear form
                form.reset();
                
            } else {
                showAuthError(response.message || 'Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showAuthError('Network error. Please check your connection and try again.');
        } finally {
            hideLoadingState(submitButton);
        }
    }

    // Social Login Setup
    function setupSocialLogin() {
        const googleButtons = document.querySelectorAll('.google-login');
        const facebookButtons = document.querySelectorAll('.facebook-login');
        
        googleButtons.forEach(button => {
            button.addEventListener('click', () => handleSocialLogin('google'));
        });
        
        facebookButtons.forEach(button => {
            button.addEventListener('click', () => handleSocialLogin('facebook'));
        });
    }

    // Social Login Handler
    function handleSocialLogin(provider) {
        // This would integrate with actual social login APIs
        showAuthNotification(`${provider} login is not yet available. Please use email registration.`, 'info');
        
        // In a real implementation:
        // - Initialize OAuth flow
        // - Handle callback
        // - Create/login user account
        // - Redirect to dashboard
    }

    // Forgot Password Setup
    function setupForgotPassword() {
        const forgotPasswordLink = document.querySelector('.forgot-password-link');
        
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                showForgotPasswordModal();
            });
        }
    }

    // Forgot Password Modal
    function showForgotPasswordModal() {
        const modal = createModal('forgot-password', 'Reset Password', `
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="forgot-email">Email Address</label>
                    <input type="email" id="forgot-email" name="email" required 
                           placeholder="Enter your email address">
                    <div class="field-help">
                        We'll send you a link to reset your password.
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="modal-button secondary" data-modal-close>Cancel</button>
                    <button type="submit" class="modal-button primary">Send Reset Link</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#forgotPasswordForm');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = form.querySelector('#forgot-email').value;
            const submitButton = form.querySelector('button[type="submit"]');
            
            showLoadingState(submitButton);
            
            try {
                // Simulate password reset request
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showAuthSuccess('Password reset link sent! Check your email for instructions.', () => {
                    closeModal(modal);
                });
                
            } catch (error) {
                showAuthError('Failed to send reset link. Please try again.');
            } finally {
                hideLoadingState(submitButton);
            }
        });
        
        showModal(modal);
    }

    // Utility Functions
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('input[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }

    function getFieldName(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name || field.id;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function isValidPassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /\d/.test(password);
    }

    function showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const errorFields = document.querySelectorAll('.error');
        
        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        });
    }

    function showLoadingState(button) {
        if (button) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Processing...';
            button.classList.add('loading');
        }
    }

    function hideLoadingState(button) {
        if (button) {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Submit';
            button.classList.remove('loading');
        }
    }

    function showAuthSuccess(message, callback) {
        showAuthNotification(message, 'success', callback);
    }

    function showAuthError(message) {
        showAuthNotification(message, 'error');
    }

    function showAuthNotification(message, type = 'info', callback) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button type="button" class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
            hideNotification(notification);
            if (callback) callback();
        }, 5000);
        
        // Manual close
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            hideNotification(notification);
            if (callback) callback();
        });
        
        // Screen reader announcement
        announceToScreenReader(message);
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    // Authentication Status Check
    function checkAuthStatus() {
        const token = localStorage.getItem('afz_auth_token');
        const userString = localStorage.getItem('afz_user');
        
        if (token && userString) {
            try {
                authState.isLoggedIn = true;
                authState.token = token;
                authState.user = JSON.parse(userString);
                
                // Verify token with server (in real implementation)
                // validateToken(token);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                clearAuthData();
            }
        }
    }

    function clearAuthData() {
        localStorage.removeItem('afz_auth_token');
        localStorage.removeItem('afz_user');
        authState.isLoggedIn = false;
        authState.token = null;
        authState.user = null;
    }

    // Simulation Functions (Replace with actual API calls)
    async function simulateLogin(loginData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful login
        if (loginData.email && loginData.password) {
            return {
                success: true,
                user: {
                    id: 'user123',
                    email: loginData.email,
                    firstName: 'John',
                    lastName: 'Doe',
                    location: 'lusaka'
                },
                token: 'fake-jwt-token-' + Date.now()
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password.'
            };
        }
    }

    async function simulateRegistration(registrationData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful registration
        return {
            success: true,
            message: 'Account created successfully. Please check your email to verify your account.'
        };
    }

    // Modal Utilities
    function createModal(id, title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-overlay" data-modal-close></div>
            <div class="modal-content" role="dialog" aria-labelledby="${id}-title">
                <div class="modal-header">
                    <h3 id="${id}-title" class="modal-title">${title}</h3>
                    <button type="button" class="modal-close" data-modal-close aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Setup close handlers
        modal.querySelectorAll('[data-modal-close]').forEach(element => {
            element.addEventListener('click', () => closeModal(modal));
        });
        
        // Close on escape key
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
        
        return modal;
    }

    function showModal(modal) {
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Focus management
        setTimeout(() => {
            const firstInput = modal.querySelector('input, button');
            if (firstInput) firstInput.focus();
        }, 100);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Dashboard Preview Function
    function showDashboardPreview() {
        const modal = createModal('dashboard-preview', '🎯 Member Dashboard Preview', `
            <div class="dashboard-preview">
                <div class="preview-intro">
                    <p>Get a glimpse of what awaits you as an AFZ member:</p>
                </div>
                
                <div class="dashboard-features">
                    <div class="feature-section">
                        <div class="feature-header">
                            <span class="feature-icon">📊</span>
                            <h4>Personal Impact Dashboard</h4>
                        </div>
                        <ul class="feature-list">
                            <li>Track your advocacy journey and milestones</li>
                            <li>View donation history and impact metrics</li>
                            <li>Monitor event participation and certificates</li>
                        </ul>
                    </div>
                    
                    <div class="feature-section">
                        <div class="feature-header">
                            <span class="feature-icon">📚</span>
                            <h4>Exclusive Resources Library</h4>
                        </div>
                        <ul class="feature-list">
                            <li>Medical guides tailored to your location</li>
                            <li>Educational materials and toolkits</li>
                            <li>Legal advocacy resources and templates</li>
                        </ul>
                    </div>
                    
                    <div class="feature-section">
                        <div class="feature-header">
                            <span class="feature-icon">🤝</span>
                            <h4>Community Network</h4>
                        </div>
                        <ul class="feature-list">
                            <li>Connect with local advocates and families</li>
                            <li>Join province-specific support groups</li>
                            <li>Access mentor matching programs</li>
                        </ul>
                    </div>
                    
                    <div class="feature-section">
                        <div class="feature-header">
                            <span class="feature-icon">📅</span>
                            <h4>Event Management</h4>
                        </div>
                        <ul class="feature-list">
                            <li>Early access to workshop registrations</li>
                            <li>Personalized event recommendations</li>
                            <li>Digital certificates and achievements</li>
                        </ul>
                    </div>
                    
                    <div class="feature-section">
                        <div class="feature-header">
                            <span class="feature-icon">🔔</span>
                            <h4>Smart Notifications</h4>
                        </div>
                        <ul class="feature-list">
                            <li>Medical appointment reminders</li>
                            <li>Local event alerts and updates</li>
                            <li>Advocacy opportunity notifications</li>
                        </ul>
                    </div>
                </div>
                
                <div class="preview-cta">
                    <p><strong>Ready to unlock these features?</strong></p>
                    <p>Join thousands of advocates making a difference across Zambia.</p>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="modal-button secondary" data-modal-close>Maybe Later</button>
                    <button type="button" class="modal-button primary" onclick="closeModal(document.getElementById('dashboard-preview')); document.getElementById('register-tab').click();">Sign Up Now</button>
                </div>
            </div>
        `);
        
        showModal(modal);
    }
    
    // Make dashboard preview available globally
    window.showDashboardPreview = showDashboardPreview;

    // Progressive Enhancement Features
    function setupFormPersistence() {
        // Save form data as user types (except passwords)
        const forms = document.querySelectorAll('.auth-form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input:not([type="password"])');
            
            inputs.forEach(input => {
                // Load saved data
                const savedValue = localStorage.getItem(`afz_form_${input.id}`);
                if (savedValue && input.type !== 'checkbox') {
                    input.value = savedValue;
                } else if (savedValue && input.type === 'checkbox') {
                    input.checked = savedValue === 'true';
                }
                
                // Save data on input
                input.addEventListener('input', function() {
                    if (this.type === 'checkbox') {
                        localStorage.setItem(`afz_form_${this.id}`, this.checked);
                    } else {
                        localStorage.setItem(`afz_form_${this.id}`, this.value);
                    }
                });
            });
        });
        
        // Clear form data on successful submission
        document.addEventListener('authSuccess', function() {
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input:not([type="password"])');
                inputs.forEach(input => {
                    localStorage.removeItem(`afz_form_${input.id}`);
                });
            });
        });
    }
    
    function setupAutoComplete() {
        // Enhanced autocomplete suggestions
        const emailInputs = document.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            input.addEventListener('input', function() {
                // Common email domain suggestions
                const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
                const value = this.value;
                
                if (value.includes('@') && !value.includes('.')) {
                    const username = value.split('@')[0];
                    const partial = value.split('@')[1];
                    
                    const suggestions = commonDomains
                        .filter(domain => domain.startsWith(partial))
                        .slice(0, 3)
                        .map(domain => `${username}@${domain}`);
                    
                    if (suggestions.length > 0) {
                        showEmailSuggestions(this, suggestions);
                    }
                }
            });
        });
    }
    
    function showEmailSuggestions(input, suggestions) {
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.email-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        const suggestionContainer = document.createElement('div');
        suggestionContainer.className = 'email-suggestions';
        suggestionContainer.innerHTML = suggestions.map(suggestion => 
            `<button type="button" class="email-suggestion" data-email="${suggestion}">${suggestion}</button>`
        ).join('');
        
        input.parentNode.appendChild(suggestionContainer);
        
        // Handle suggestion clicks
        suggestionContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('email-suggestion')) {
                input.value = e.target.dataset.email;
                input.focus();
                suggestionContainer.remove();
            }
        });
        
        // Hide suggestions when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function hideHandler(e) {
                if (!input.parentNode.contains(e.target)) {
                    suggestionContainer.remove();
                    document.removeEventListener('click', hideHandler);
                }
            });
        }, 100);
    }
    
    function setupOfflineSupport() {
        // Check for online/offline status
        function updateOnlineStatus() {
            const isOnline = navigator.onLine;
            const offlineIndicator = document.getElementById('offline-indicator');
            
            if (!isOnline && !offlineIndicator) {
                const indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.className = 'offline-banner';
                indicator.innerHTML = `
                    <div class="offline-content">
                        <span class="offline-icon">📡</span>
                        <span class="offline-text">You're currently offline. Some features may be limited.</span>
                    </div>
                `;
                document.body.prepend(indicator);
            } else if (isOnline && offlineIndicator) {
                offlineIndicator.remove();
            }
            
            // Disable forms when offline
            const submitButtons = document.querySelectorAll('.auth-button');
            submitButtons.forEach(button => {
                if (!isOnline) {
                    button.disabled = true;
                    button.dataset.offlineDisabled = 'true';
                } else if (button.dataset.offlineDisabled) {
                    button.disabled = false;
                    delete button.dataset.offlineDisabled;
                }
            });
        }
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus(); // Initial check
    }
    
    function setupAccessibilityEnhancements() {
        // Keyboard navigation for tabs
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach((tab, index) => {
            tab.addEventListener('keydown', function(e) {
                let targetIndex;
                
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        targetIndex = (index + 1) % tabs.length;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        targetIndex = (index - 1 + tabs.length) % tabs.length;
                        break;
                    case 'Home':
                        targetIndex = 0;
                        break;
                    case 'End':
                        targetIndex = tabs.length - 1;
                        break;
                    default:
                        return;
                }
                
                e.preventDefault();
                tabs[targetIndex].click();
                tabs[targetIndex].focus();
            });
        });
        
        // Focus management for modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        });
        
        // Enhanced form validation announcements
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault(); // Prevent default browser validation
                
                const fieldName = getFieldName(this);
                const message = this.validationMessage || `${fieldName} is required`;
                
                // Show custom validation message
                showFieldError(this, message);
                
                // Announce to screen reader
                announceToScreenReader(`Error in ${fieldName}: ${message}`);
            });
        });
    }
    
    // Export auth state for other scripts
    window.AFZAuth = {
        getAuthState: () => authState,
        logout: clearAuthData,
        isLoggedIn: () => authState.isLoggedIn
    };

})();
