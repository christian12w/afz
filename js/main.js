/**
 * AFZ Advocacy Application - Main JavaScript
 * Modern, Accessible JavaScript for Albinism Foundation of Zambia - AFZ
 */

// Global Application Object
window.AFZ = window.AFZ || {};

// Configuration
AFZ.config = {
    supportedLanguages: ['en', 'fr', 'es', 'pt', 'ny', 'be', 'to', 'lo', 'sn', 'nd'],
    defaultLanguage: 'en',
    animationDuration: 300,
    debounceDelay: 250
};

// Current state
AFZ.state = {
    currentLanguage: AFZ.config.defaultLanguage,
    mobileMenuOpen: false,
    translations: {},
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/**
 * Utility Functions
 */
AFZ.utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Announce to screen readers
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll with accessibility consideration
    smoothScrollTo(element, offset = 0) {
        if (AFZ.state.isReducedMotion) {
            element.scrollIntoView();
        } else {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
};

/**
 * Language and Translation Management - DISABLED (handled by language.js)
 */
AFZ.i18n = {
    // Initialize translations - DISABLED
    async init() {
        console.log('Language system disabled - using language.js instead');
        return;
    },

    // Load translation files - DISABLED
    async loadTranslations() {
        console.log('Translation loading disabled - using language.js instead');
        return {};
    },

    // Get fallback translations for critical UI elements
    getFallbackTranslations(lang) {
        const fallbacks = {
            en: {
                'org-name': 'Albinism Foundation of Zambia - AFZ',
                'org-tagline': 'Breaking the silence on Albinism',
                'nav-home': 'Home',
                'nav-about': 'About Us',
                'nav-programs': 'Programs',
                'nav-resources': 'Resources',
                'nav-advocacy': 'Advocacy',
                'nav-contact': 'Contact'
            },
            sn: {
                'org-name': 'Albinism Foundation of Zambia - AFZ',
                'org-tagline': 'Kurwira Kodzero, Kuvaka Ruzivo, Kugadzira Shanduko',
                'nav-home': 'Musha',
                'nav-about': 'Nesu',
                'nav-programs': 'Zvirongwa',
                'nav-resources': 'Zvinhu',
                'nav-advocacy': 'Kurwira',
                'nav-contact': 'Bata'
            },
            nd: {
                'org-name': 'Albinism Foundation of Zambia - AFZ',
                'org-tagline': 'Ukumela Amalungelo, Ukwakha Ukuqonda, Ukwenza Uguquko',
                'nav-home': 'Ikhaya',
                'nav-about': 'Ngathi',
                'nav-programs': 'Izinhlelo',
                'nav-resources': 'Izinsiza',
                'nav-advocacy': 'Ukumela',
                'nav-contact': 'Thintana'
            }
        };
        return fallbacks[lang] || fallbacks.en;
    },

    // Set application language
    setLanguage(langCode) {
        if (!AFZ.config.supportedLanguages.includes(langCode)) {
            langCode = AFZ.config.defaultLanguage;
        }

        AFZ.state.currentLanguage = langCode;
        localStorage.setItem('afz-language', langCode);
        
        // Update HTML lang attribute
        document.documentElement.lang = langCode;
        
        // Update UI
        this.updateLanguageButtons();
        this.translatePage();
        
        // Announce language change
        const languageNames = {
            'en': 'English',
            'sn': 'Shona',
            'nd': 'Ndebele'
        };
        AFZ.utils.announceToScreenReader(`Language changed to ${languageNames[langCode]}`);
    },

    // Update language button states
    updateLanguageButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(button => {
            const isActive = button.dataset.lang === AFZ.state.currentLanguage;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive.toString());
        });
    },

    // Translate page content
    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        const translations = AFZ.state.translations[AFZ.state.currentLanguage] || {};
        
        elements.forEach(element => {
            const key = element.dataset.translate;
            if (translations[key]) {
                if (element.tagName.toLowerCase() === 'input') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }
};

/**
 * Navigation Management
 */
AFZ.navigation = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveStates();
    },

    // Setup mobile menu functionality
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                const isOpen = nav.classList.contains('open');
                
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && AFZ.state.mobileMenuOpen) {
                    this.closeMobileMenu();
                    toggle.focus();
                }
            });
        }
    },

    // Open mobile menu
    openMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        nav.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        AFZ.state.mobileMenuOpen = true;

        // Focus first menu item
        const firstLink = nav.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }

        AFZ.utils.announceToScreenReader('Menu opened');
    },

    // Close mobile menu
    closeMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        AFZ.state.mobileMenuOpen = false;

        AFZ.utils.announceToScreenReader('Menu closed');
    },

    // Setup smooth scrolling for navigation links
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    AFZ.utils.smoothScrollTo(target, 80);
                    
                    // Close mobile menu if open
                    if (AFZ.state.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    },

    // Setup active navigation states based on scroll position
    setupActiveStates() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const updateActiveLink = AFZ.utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveLink);
    }
};

/**
 * Animation and Visual Effects
 */
AFZ.animations = {
    init() {
        if (!AFZ.state.isReducedMotion) {
            this.setupScrollAnimations();
            this.setupCounterAnimations();
        }
        this.setupHoverEffects();
    },

    // Setup scroll-based animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.focus-item, .news-item, .stat-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    },

    // Setup counter animations for statistics
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + '+';
                }
            };
            
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    },

    // Setup hover effects with keyboard support
    setupHoverEffects() {
        const interactiveElements = document.querySelectorAll('.cta-button, .focus-item, .news-item');
        
        interactiveElements.forEach(element => {
            // Add keyboard support for hover effects
            element.addEventListener('focus', () => {
                element.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('keyboard-focus');
            });
        });
    }
};

/**
 * Form Handling
 */
AFZ.forms = {
    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupFormValidation();
    },

    // Setup contact form functionality
    setupContactForm() {
        const contactForms = document.querySelectorAll('.contact-form');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(form);
            });
        });
    },

    // Setup newsletter form functionality  
    setupNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(form);
            });
        });
    },

    // Handle contact form submission
    async handleContactSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(form);
            
            // Here you would typically send to your backend
            // For now, we'll simulate the process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            this.showFormSuccess(form, 'Thank you for your message. We will get back to you soon!');
            form.reset();
            
        } catch (error) {
            // Error state
            this.showFormError(form, 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Restore button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    },

    // Handle newsletter form submission
    async handleNewsletterSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            const formData = new FormData(form);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showFormSuccess(form, 'Successfully subscribed to our newsletter!');
            form.reset();
            
        } catch (error) {
            this.showFormError(form, 'Subscription failed. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    },

    // Setup form validation
    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },

    // Validate individual field
    validateField(field) {
        const isValid = field.checkValidity();
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (isValid) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            if (!errorElement) {
                const error = document.createElement('span');
                error.className = 'field-error';
                error.textContent = field.validationMessage;
                error.setAttribute('role', 'alert');
                field.parentNode.appendChild(error);
            }
        }
        
        return isValid;
    },

    // Show form success message
    showFormSuccess(form, message) {
        this.showFormMessage(form, message, 'success');
        AFZ.utils.announceToScreenReader(message, 'assertive');
    },

    // Show form error message
    showFormError(form, message) {
        this.showFormMessage(form, message, 'error');
        AFZ.utils.announceToScreenReader(message, 'assertive');
    },

    // Show form message (success or error)
    showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.setAttribute('role', 'alert');
        messageElement.textContent = message;
        
        // Insert message
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
};

/**
 * Accessibility Enhancements
 */
AFZ.accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
        this.monitorColorScheme();
    },

    // Setup keyboard navigation enhancements
    setupKeyboardNavigation() {
        // Skip link functionality is already in HTML
        
        // Escape key handling for modals/menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or menus
                if (AFZ.state.mobileMenuOpen) {
                    AFZ.navigation.closeMobileMenu();
                }
            }
        });
    },

    // Setup focus management
    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    // Setup ARIA live regions
    setupAriaLiveRegions() {
        // Screen reader announcements div is already in HTML
        const announcer = document.getElementById('sr-announcements');
        if (!announcer) {
            const div = document.createElement('div');
            div.id = 'sr-announcements';
            div.className = 'sr-only';
            div.setAttribute('aria-live', 'polite');
            div.setAttribute('aria-atomic', 'true');
            document.body.appendChild(div);
        }
    },

    // Monitor color scheme changes
    monitorColorScheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleColorSchemeChange = (e) => {
            // Update CSS custom properties if needed
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        };
        
        mediaQuery.addListener(handleColorSchemeChange);
        handleColorSchemeChange(mediaQuery);
    }
};

/**
 * Event Handlers
 */
AFZ.events = {
    init() {
        this.setupLanguageButtons();
        this.setupCtaButtons();
        this.setupScrollToTop();
    },

    // Setup language switching buttons - DISABLED (handled by language.js)
    setupLanguageButtons() {
        console.log('Language button setup disabled - using language.js instead');
        // Language switching handled by language.js
        return;
    },

    // Setup call-to-action buttons
    setupCtaButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add click analytics or handling here
                console.log('CTA clicked:', button.textContent);
            });
        });
    },

    // Setup scroll to top functionality
    setupScrollToTop() {
        const scrollButton = document.querySelector('.scroll-to-top');
        
        if (scrollButton) {
            const toggleScrollButton = AFZ.utils.throttle(() => {
                const scrolled = window.pageYOffset > 500;
                scrollButton.classList.toggle('visible', scrolled);
            }, 100);
            
            window.addEventListener('scroll', toggleScrollButton);
            
            scrollButton.addEventListener('click', () => {
                AFZ.utils.smoothScrollTo(document.body);
            });
        }
    }
};

/**
 * Performance Monitoring
 */
AFZ.performance = {
    init() {
        this.monitorPerformance();
        this.setupLazyLoading();
    },

    // Monitor and log performance metrics
    monitorPerformance() {
        if ('performance' in window && 'observe' in window.PerformanceObserver.prototype) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    // Log performance metrics for debugging
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        }
    },

    // Setup lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Add fade-in effect
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s';
                        
                        img.onload = () => {
                            img.style.opacity = '1';
                        };
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
};

/**
 * Application Initialization
 */
AFZ.init = async function() {
    try {
        console.log('Initializing AFZ Advocacy Application...');
        
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        AFZ.state.isReducedMotion = mediaQuery.matches;
        
        mediaQuery.addListener((e) => {
            AFZ.state.isReducedMotion = e.matches;
        });
        
        // Initialize modules
        // AFZ.i18n.init(); // Language system handled by language.js
        AFZ.navigation.init();
        AFZ.animations.init();
        AFZ.forms.init();
        AFZ.accessibility.init();
        AFZ.events.init();
        AFZ.performance.init();
        
        // Mark app as initialized
        document.body.classList.add('app-initialized');
        
        console.log('AFZ Advocacy Application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize AFZ application:', error);
        // Still allow basic functionality
        AFZ.navigation.init();
        AFZ.events.init();
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AFZ.init);
} else {
    AFZ.init();
}

// Handle window load for performance optimizations
window.addEventListener('load', () => {
    // Remove loading states, enable animations, etc.
    document.body.classList.add('loaded');
});
