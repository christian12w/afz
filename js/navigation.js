/**
 * Navigation Management System for AFZ Platform
 * Handles mobile menu, navigation state, and smooth scrolling
 */

class NavigationManager {
    constructor() {
        this.mobileMenuOpen = false;
        this.currentPage = this.getCurrentPage();
        this.autoHideHeaderEnabled = document.body && document.body.hasAttribute('data-auto-hide-header');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setActiveNavLinks();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.nav-toggle, .mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.main-nav, .nav-menu');
            const toggle = document.querySelector('.nav-toggle, .mobile-menu-toggle');
            
            if (this.mobileMenuOpen && nav && !nav.contains(e.target) && e.target !== toggle) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Scroll handling for header
        this.setupScrollHandler();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '');
    }

    setActiveNavLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'nav-link-active');
            
            const href = link.getAttribute('href');
            if (href) {
                // Check for exact page match
                if (href.includes(this.currentPage + '.html') || 
                    (this.currentPage === 'index' && href === '../index.html') ||
                    (this.currentPage === 'index' && href === './index.html') ||
                    (this.currentPage === 'index' && href === '#home')) {
                    link.classList.add('active', 'nav-link-active');
                }
            }
        });
    }

    setupMobileMenu() {
        const nav = document.querySelector('.main-nav, .nav-menu');
        const toggle = document.querySelector('.nav-toggle, .mobile-menu-toggle');
        
        if (nav && toggle) {
            // Ensure proper ARIA attributes
            toggle.setAttribute('aria-controls', nav.id || 'navigation');
            toggle.setAttribute('aria-expanded', 'false');
            
            // Add mobile menu class for styling
            nav.classList.add('mobile-menu');
        }
    }

    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const nav = document.querySelector('.main-nav, .nav-menu');
        const toggle = document.querySelector('.nav-toggle, .mobile-menu-toggle');
        
        if (nav && toggle) {
            this.mobileMenuOpen = true;
            nav.classList.add('mobile-menu-open');
            toggle.classList.add('mobile-menu-active');
            toggle.setAttribute('aria-expanded', 'true');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstLink = nav.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }

    closeMobileMenu() {
        const nav = document.querySelector('.main-nav, .nav-menu');
        const toggle = document.querySelector('.nav-toggle, .mobile-menu-toggle');
        
        if (nav && toggle) {
            this.mobileMenuOpen = false;
            nav.classList.remove('mobile-menu-open');
            toggle.classList.remove('mobile-menu-active');
            toggle.setAttribute('aria-expanded', 'false');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    setupSmoothScrolling() {
        // Handle smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target === '#' || target === '#top') {
                    return;
                }
                
                const targetElement = document.querySelector(target);
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const headerHeight = this.getHeaderHeight();
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    getHeaderHeight() {
        const header = document.querySelector('.site-header, .dashboard-header, .header');
        return header ? header.offsetHeight : 80;
    }

    setupScrollHandler() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            const header = document.querySelector('.site-header, .dashboard-header, .header');
            if (!header) return;

            const currentScrollY = window.scrollY;
            const headerHeight = header.offsetHeight;

            // Add scrolled class for styling
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll only if explicitly enabled via data-auto-hide-header
            if (this.autoHideHeaderEnabled) {
                if (currentScrollY > headerHeight && currentScrollY > lastScrollY) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            }

            lastScrollY = currentScrollY;
        };

        const requestScrollTick = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollTick, { passive: true });
    }

    // Utility method to highlight current section in navigation
    updateActiveSection() {
        if (this.currentPage !== 'index') return;

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        const scrollPos = window.scrollY + this.getHeaderHeight() + 100;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Method to programmatically navigate
    navigateTo(url) {
        window.location.href = url;
    }

    // Method to add navigation items dynamically
    addNavItem(text, href, position = 'end') {
        const navList = document.querySelector('.nav-list, .nav-menu');
        if (!navList) return;

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = href;
        link.textContent = text;
        link.className = 'nav-link';
        
        listItem.appendChild(link);

        if (position === 'end') {
            navList.appendChild(listItem);
        } else if (position === 'start') {
            navList.insertBefore(listItem, navList.firstChild);
        }

        // Re-setup event listeners for the new item
        link.addEventListener('click', () => {
            if (this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
}

// Breadcrumb functionality
class BreadcrumbManager {
    constructor() {
        this.init();
    }

    init() {
        this.generateBreadcrumbs();
    }

    generateBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb, .breadcrumbs');
        if (!breadcrumbContainer) return;

        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');
        
        const breadcrumbs = [{ text: 'Home', href: '../index.html' }];

        // Build breadcrumb trail
        let currentPath = '';
        segments.forEach(segment => {
            currentPath += `/${segment}`;
            const text = this.formatSegmentText(segment);
            breadcrumbs.push({ text, href: currentPath });
        });

        this.renderBreadcrumbs(breadcrumbs, breadcrumbContainer);
    }

    formatSegmentText(segment) {
        return segment
            .replace('.html', '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    renderBreadcrumbs(breadcrumbs, container) {
        container.innerHTML = '';
        
        breadcrumbs.forEach((crumb, index) => {
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            
            if (index === breadcrumbs.length - 1) {
                // Last item (current page)
                item.textContent = crumb.text;
                item.setAttribute('aria-current', 'page');
            } else {
                const link = document.createElement('a');
                link.href = crumb.href;
                link.textContent = crumb.text;
                item.appendChild(link);
            }
            
            container.appendChild(item);
            
            // Add separator (except for last item)
            if (index < breadcrumbs.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = '/';
                separator.setAttribute('aria-hidden', 'true');
                container.appendChild(separator);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
    window.breadcrumbManager = new BreadcrumbManager();

    // Update active sections on scroll for single-page navigation
    window.addEventListener('scroll', () => {
        if (window.navigationManager) {
            window.navigationManager.updateActiveSection();
        }
    }, { passive: true });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, BreadcrumbManager };
}
