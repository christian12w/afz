/**
 * Language Management System for AFZ Platform
 * Handles multi-language support for the Albinism Foundation of Zambia website
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.supportedLanguages = {
            'en': 'English',
            'fr': 'Français',
            'es': 'Español',
            'pt': 'Português',
            'ny': 'Nyanja',
            'be': 'Bemba',
            'to': 'Tonga',
            'lo': 'Lozi',
            'sn': 'Shona',
            'nd': 'Ndebele'
        };
        
        this.init();
    }

    async init() {
        console.log('🚀 [Language System] Initializing Language Manager...');
        console.log('🚀 [Language System] Current page:', window.location.pathname);
        console.log('🚀 [Language System] Document ready state:', document.readyState);
        
        // DEBUG: Track all translation requests to identify old code
        this.debugTranslationRequests();
        
        // NUCLEAR OPTION: Force clear all browser caches
        await this.forceClearAllCaches();
        
        // Get saved language preference
        const savedLang = localStorage.getItem('afz-language') || 'en';
        console.log('🚀 [Language System] Saved language preference:', savedLang);
        
        // Initialize language
        await this.setLanguage(savedLang);
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('🚀 [Language System] Language Manager initialized successfully');
    }

    // DEBUG: Track all translation requests to identify old code
    debugTranslationRequests() {
        console.log('🔍 [Language System] Setting up translation request debugging...');
        
        // Override fetch to track all translation requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const url = args[0];
            if (typeof url === 'string' && url.includes('translations')) {
                console.log('🔍 [Language System] TRANSLATION REQUEST DETECTED:', {
                    url: url,
                    stack: new Error().stack,
                    timestamp: new Date().toISOString()
                });
            }
            return originalFetch(...args);
        };
        
        console.log('🔍 [Language System] Translation request debugging enabled');
    }

    // NUCLEAR OPTION: Force clear all browser caches
    async forceClearAllCaches() {
        console.log('🧨 [Language System] NUCLEAR OPTION: Clearing ALL browser caches...');
        
        try {
            // Clear localStorage (keep only language preference)
            const currentLang = localStorage.getItem('afz-language');
            localStorage.clear();
            if (currentLang) {
                localStorage.setItem('afz-language', currentLang);
            }
            console.log('🧨 [Language System] localStorage cleared');
            
            // Clear sessionStorage
            sessionStorage.clear();
            console.log('🧨 [Language System] sessionStorage cleared');
            
            // Clear IndexedDB
            if ('indexedDB' in window) {
                const databases = await indexedDB.databases();
                for (const db of databases) {
                    if (db.name) {
                        indexedDB.deleteDatabase(db.name);
                    }
                }
                console.log('🧨 [Language System] IndexedDB cleared');
            }
            
            // Unregister all service workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    console.log('🧨 [Language System] Service Worker unregistered:', registration.scope);
                }
            }
            
            // Clear all caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log('🧨 [Language System] Cache deleted:', cacheName);
                }
            }
            
            console.log('🧨 [Language System] All caches cleared successfully');
            
            // FORCE RELOAD to eliminate any cached JavaScript
            console.log('🧨 [Language System] Force reloading page to eliminate cached JavaScript...');
            if (!sessionStorage.getItem('langForceReloaded')) {
                sessionStorage.setItem('langForceReloaded', '1');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.log('⚠️ [Language System] Skipping reload to prevent loop (langForceReloaded)');
            }
            
        } catch (error) {
            console.warn('⚠️ [Language System] Some cache clearing failed:', error);
        }
    }

    setupEventListeners() {
        // Language selector buttons (all types)
        document.addEventListener('click', (e) => {
            // Check for various language selector button types
            const target = e.target;
            let langElement = null;
            let lang = null;

            // Direct flag option click
            if (target.classList.contains('flag-option')) {
                langElement = target;
            }
            // Click inside flag option (on child elements)
            else if (target.closest('.flag-option')) {
                langElement = target.closest('.flag-option');
            }
            // Legacy language buttons
            else if (target.matches('.lang-btn, .language-option')) {
                langElement = target;
            }

            // Get language code from element
            if (langElement) {
                lang = langElement.getAttribute('data-lang');
                if (lang) {
                    console.log(`🌐 Language selected: ${lang}`);
                    this.setLanguage(lang);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });

        // New horizontal flag-based language selector
        const languageToggle = document.getElementById('languageToggle');
        const languageOverlay = document.getElementById('languageOverlay');
        const closeLanguageModal = document.getElementById('closeLanguageModal');
        
        if (languageToggle && languageOverlay) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLanguageModal();
            });
            
            languageToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLanguageModal();
                }
            });
        }
        
        if (closeLanguageModal) {
            closeLanguageModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeLanguageModal();
            });
        }
        
        if (languageOverlay) {
            languageOverlay.addEventListener('click', (e) => {
                if (e.target === languageOverlay) {
                    this.closeLanguageModal();
                }
            });
        }
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLanguageModal();
            }
        });

        // Legacy language dropdown toggle (backward compatibility)
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (languageBtn && languageDropdown) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = languageBtn.getAttribute('aria-expanded') === 'true';
                languageBtn.setAttribute('aria-expanded', !isOpen);
                languageDropdown.classList.toggle('show', !isOpen);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                languageBtn.setAttribute('aria-expanded', 'false');
                languageDropdown.classList.remove('show');
            });
        }
    }
    
    openLanguageModal() {
        const overlay = document.getElementById('languageOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first flag option after animation
            setTimeout(() => {
                const firstFlag = overlay.querySelector('.flag-option');
                if (firstFlag) {
                    firstFlag.focus();
                }
            }, 300);
        }
    }
    
    closeLanguageModal() {
        const overlay = document.getElementById('languageOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Return focus to toggle button
            const toggleBtn = document.getElementById('languageToggle');
            if (toggleBtn) {
                toggleBtn.focus();
            }
        }
    }

    async setLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) {
            console.warn(`Language ${langCode} not supported`);
            return;
        }

        try {
            // Load translation file if not already loaded
            if (!this.translations[langCode]) {
                await this.loadTranslations(langCode);
            }

            this.currentLanguage = langCode;
            
            // Save preference
            localStorage.setItem('afz-language', langCode);
            
            // Update UI
            this.updateLanguageUI();
            this.translatePage();
            
            // Update document language
            document.documentElement.lang = langCode;
            
        } catch (error) {
            console.error('Error setting language:', error);
        }
    }

    async loadTranslations(langCode) {
        try {
            // Simplified path resolution - always use root translations folder
            const translationPath = `/translations/${langCode}.json`;
            
            // Add cache-busting parameter for debugging
            const timestamp = Date.now();
            const translationURL = `${translationPath}?v=${timestamp}`;
            
            console.log(`🌐 [Language System] Loading translations for ${langCode} from: ${translationPath}`);
            console.log(`🌐 [Language System] Full request URL with cache-bust: ${translationURL}`);
            console.log(`🌐 [Language System] Current URL: ${window.location.href}`);
            console.log(`🌐 [Language System] Base path: ${window.location.origin}`);
            console.log(`🌐 [Language System] Final URL: ${window.location.origin}${translationURL}`);
            
            const response = await fetch(translationURL, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const translations = await response.json();
                this.translations[langCode] = translations;
                console.log(`✅ [Language System] Successfully loaded translations for ${langCode}:`, translations);
            } else {
                console.warn(`❌ [Language System] Failed to load translations for ${langCode}: ${response.status} ${response.statusText}`);
                console.warn(`❌ [Language System] Response URL: ${response.url}`);
                console.warn(`❌ [Language System] Response headers:`, response.headers);
                // Use English as fallback
                if (langCode !== 'en') {
                    if (!this.translations['en']) {
                        await this.loadTranslations('en');
                    }
                    this.translations[langCode] = this.translations['en'] || {};
                } else {
                    this.translations[langCode] = {};
                }
            }
        } catch (error) {
            console.error(`💥 [Language System] Error loading translations for ${langCode}:`, error);
            console.error(`💥 [Language System] Error details:`, error.message, error.stack);
            // Use English as fallback
            if (langCode !== 'en') {
                if (!this.translations['en']) {
                    await this.loadTranslations('en');
                }
                this.translations[langCode] = this.translations['en'] || {};
            } else {
                this.translations[langCode] = {};
            }
        }
    }

    updateLanguageUI() {
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLanguage) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        // Update language options
        document.querySelectorAll('.language-option').forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === this.currentLanguage) {
                option.setAttribute('aria-selected', 'true');
            } else {
                option.setAttribute('aria-selected', 'false');
            }
        });

        // Update current language display with full language name and flag
        this.updateCurrentLanguageDisplay();
        
        // Close dropdown after selection
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageBtn && languageDropdown) {
            languageBtn.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('show');
        }
    }

    updateCurrentLanguageDisplay() {
        const currentLangDisplay = document.getElementById('currentLanguage');
        const currentFlagDisplay = document.getElementById('currentLanguageFlag');
        
        // Legacy Facebook-style dropdown (if present)
        if (currentLangDisplay) {
            const langInfo = this.getLanguageDisplayInfo(this.currentLanguage);
            currentLangDisplay.textContent = langInfo.name;
        }
        
        if (currentFlagDisplay) {
            const langInfo = this.getLanguageDisplayInfo(this.currentLanguage);
            currentFlagDisplay.textContent = langInfo.flag;
        }
        
        // New premium language selector toggle button
        const currentFlag = document.getElementById('currentFlag');
        const currentLangCode = document.getElementById('currentLangCode');
        
        if (currentFlag) {
            const langInfo = this.getLanguageDisplayInfo(this.currentLanguage);
            currentFlag.textContent = langInfo.flag;
        }
        
        if (currentLangCode) {
            const langInfo = this.getLanguageDisplayInfo(this.currentLanguage);
            currentLangCode.textContent = langInfo.shortName || langInfo.name;
        }
        
        // Close language modal after selection
        this.closeLanguageModal();
    }

    getLanguageDisplayInfo(langCode) {
        const languageMap = {
            'en': { name: 'English (US)', shortName: 'English', flag: '🇺🇸' },
            'fr': { name: 'French', shortName: 'Français', flag: '🇫🇷' },
            'es': { name: 'Spanish', shortName: 'Español', flag: '🇪🇸' },
            'pt': { name: 'Portuguese', shortName: 'Português', flag: '🇵🇹' },
            'ar': { name: 'Arabic', shortName: 'العربية', flag: '🇸🇦' },
            'ny': { name: 'Nyanja', shortName: 'Nyanja', flag: '🇿🇲' },
            'be': { name: 'Bemba', shortName: 'Bemba', flag: '🇿🇲' },
            'to': { name: 'Tonga', shortName: 'Tonga', flag: '🇿🇲' },
            'lo': { name: 'Lozi', shortName: 'Lozi', flag: '🇿🇲' },
            'sn': { name: 'Shona', shortName: 'Shona', flag: '🇿🇼' },
            'nd': { name: 'Ndebele', shortName: 'Ndebele', flag: '🇿🇼' }
        };
        
        return languageMap[langCode] || { name: langCode.toUpperCase(), shortName: langCode.toUpperCase(), flag: '🌍' };
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate placeholders
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Translate aria-labels
        const ariaElements = document.querySelectorAll('[data-translate-aria]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-translate-aria');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });
    }

    getTranslation(key) {
        const lang = this.currentLanguage;
        
        if (!this.translations[lang]) {
            return null;
        }

        // Support nested keys with dot notation
        const keys = key.split('.');
        let value = this.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }

        return typeof value === 'string' ? value : null;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 [Language System] DOM Content Loaded - Creating Language Manager...');
    console.log('📱 [Language System] Document title:', document.title);
    console.log('📱 [Language System] Available scripts:', Array.from(document.scripts).map(s => s.src || 'inline'));
    
    window.languageManager = new LanguageManager();
    console.log('📱 [Language System] Language Manager created and assigned to window.languageManager');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
