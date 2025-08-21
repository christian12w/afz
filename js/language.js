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
        
        // Optional nuclear cache clear – disabled by default. Enable only for local debugging.
        // To enable, set in DevTools: localStorage.setItem('afz-force-clear-caches','1')
        const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const shouldForceClear = isLocalhost && localStorage.getItem('afz-force-clear-caches') === '1';
        if (shouldForceClear) {
            const alreadyCleared = sessionStorage.getItem('langCachesCleared') === '1';
            if (!alreadyCleared) {
                sessionStorage.setItem('langCachesCleared', '1');
                await this.forceClearAllCaches();
            }
        }
        
        // Get saved language preference
        const savedLang = localStorage.getItem('afz-language') || 'en';
        console.log('🚀 [Language System] Saved language preference:', savedLang);
        
        // Initialize language
        await this.setLanguage(savedLang);
        
        // Ensure professional language selector exists on this page
        this.ensureProfessionalLanguageSelector();

        // Ensure viewport meta for proper mobile scaling (especially on Android)
        this.ensureViewportMetaTag();

        // Inject runtime CSS to force visibility and stacking on mobile
        this.injectMobileLanguageVisibilityStyles();

        // Setup event listeners
        this.setupEventListeners();
        
        console.log('🚀 [Language System] Language Manager initialized successfully');
    }

    ensureViewportMetaTag() {
        try {
            const hasViewport = document.querySelector('meta[name="viewport"]');
            if (!hasViewport) {
                const meta = document.createElement('meta');
                meta.setAttribute('name', 'viewport');
                meta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
                document.head.appendChild(meta);
            }
        } catch (_) {
            /* no-op */
        }
    }

    injectMobileLanguageVisibilityStyles() {
        const styleId = 'afz-language-visibility-overrides';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Force language control visibility and stacking on mobile */
            .professional-language-selector { position: fixed !important; top: max(12px, env(safe-area-inset-top)); right: max(12px, env(safe-area-inset-right)); z-index: 2147483647 !important; pointer-events: auto !important; }
            @media (max-width: 768px) {
                .professional-language-selector { top: max(12px, env(safe-area-inset-top)); right: max(12px, env(safe-area-inset-right)); }
                .language-dropdown-btn { width: 46px; height: 46px; min-height: 46px; border-radius: 50%; background: #ffffff !important; border: 2px solid #DAA520 !important; box-shadow: 0 8px 18px rgba(0,0,0,0.25) !important; padding: 0; display: flex; align-items: center; justify-content: center; }
                .current-flag { display: block !important; font-size: 1.2rem; line-height: 1; }
                .language-text, .dropdown-arrow { display: none !important; }
                .language-dropdown-menu { z-index: 2147483000 !important; width: min(92vw, 340px); max-height: 65vh; overflow: auto; background: #ffffff !important; color: #111827 !important; border: 1px solid rgba(0,0,0,0.12); top: 100% !important; right: 0 !important; margin-top: 8px !important; }
            }
        `;
        document.head.appendChild(style);
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
            
            // Do not force reload in production; leave page as-is after clearing
            console.log('🧨 [Language System] Caches cleared (no reload triggered)');
            
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

    // Ensure the professional language selector exists and is wired
    ensureProfessionalLanguageSelector() {
        // If markup doesn't exist, inject it
        let selector = document.querySelector('.professional-language-selector');
        if (!selector) {
            selector = this.createProfessionalLanguageSelector();
            if (selector) {
                document.body.prepend(selector);
            }
        }

        // Bind handlers if not already bound elsewhere
        this.bindProfessionalLanguageSelector();
    }

    createProfessionalLanguageSelector() {
        try {
            const container = document.createElement('div');
            container.className = 'professional-language-selector';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Language selection');

            container.innerHTML = `
                <button class="language-dropdown-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language">
                    <div class="current-language">
                        <span class="current-flag">${this.getLanguageDisplayInfo(this.currentLanguage).flag}</span>
                        <div class="language-text">
                            <span class="language-label" data-translate="language.label">Language</span>
                            <span class="current-lang-name">${this.getLanguageDisplayInfo(this.currentLanguage).shortName}</span>
                        </div>
                        <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11l-4-4h8l-4 4z"/></svg>
                    </div>
                </button>
                <div class="language-dropdown-menu" role="listbox" aria-label="Available languages">
                    <div class="language-section">
                        <h3 class="section-heading" data-translate="language.international">International</h3>
                        <div class="language-options">
                            ${this.renderLanguageOption('en', '🇺🇸', 'English', 'English')}
                            ${this.renderLanguageOption('fr', '🇫🇷', 'French', 'Français')}
                            ${this.renderLanguageOption('es', '🇪🇸', 'Spanish', 'Español')}
                            ${this.renderLanguageOption('pt', '🇵🇹', 'Portuguese', 'Português')}
                        </div>
                    </div>
                    <div class="language-section">
                        <h3 class="section-heading" data-translate="language.zambia">Zambia & Region</h3>
                        <div class="language-options">
                            ${this.renderLanguageOption('ny', '🇿🇲', 'Nyanja', 'Nyanja')}
                            ${this.renderLanguageOption('be', '🇿🇲', 'Bemba', 'Bemba')}
                            ${this.renderLanguageOption('to', '🇿🇲', 'Tonga', 'Tonga')}
                            ${this.renderLanguageOption('lo', '🇿🇲', 'Lozi', 'Lozi')}
                            ${this.renderLanguageOption('sn', '🇿🇼', 'Shona', 'Shona')}
                            ${this.renderLanguageOption('nd', '🇿🇼', 'Ndebele', 'Ndebele')}
                        </div>
                    </div>
                </div>
            `;

            return container;
        } catch (error) {
            console.warn('Failed to create professional language selector:', error);
            return null;
        }
    }

    renderLanguageOption(code, flag, name, nativeName) {
        const isSelected = this.currentLanguage === code ? ' aria-selected="true"' : '';
        return `
            <button class="language-option" data-lang="${code}" role="option"${isSelected}>
                <span class="flag">${flag}</span>
                <div class="language-info">
                    <span class="lang-name">${name}</span>
                    <span class="lang-native">${nativeName}</span>
                </div>
            </button>
        `;
    }

    bindProfessionalLanguageSelector() {
        if (window.languageUIBound) {
            return; // Already wired by page script
        }

        const languageDropdownBtn = document.querySelector('.language-dropdown-btn');
        const languageDropdownMenu = document.querySelector('.language-dropdown-menu');
        const languageOptions = document.querySelectorAll('.language-option');
        const currentFlag = document.querySelector('.current-flag');
        const currentLangName = document.querySelector('.current-lang-name');

        if (!languageDropdownBtn || !languageDropdownMenu) {
            return;
        }

        // Guard against double-binding
        if (languageDropdownBtn.dataset.bound === '1') {
            return;
        }

        languageDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = languageDropdownBtn.getAttribute('aria-expanded') === 'true';
            languageDropdownBtn.setAttribute('aria-expanded', String(!isExpanded));
            languageDropdownMenu.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.professional-language-selector')) {
                languageDropdownBtn.setAttribute('aria-expanded', 'false');
                languageDropdownMenu.classList.remove('open');
            }
        });

        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                const flag = option.querySelector('.flag')?.textContent || '';
                const langName = option.querySelector('.lang-name')?.textContent || '';

                if (currentFlag) currentFlag.textContent = flag;
                if (currentLangName) currentLangName.textContent = langName;

                languageOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
                option.setAttribute('aria-selected', 'true');

                languageDropdownBtn.setAttribute('aria-expanded', 'false');
                languageDropdownMenu.classList.remove('open');

                localStorage.setItem('afz-language', lang);
                this.setLanguage(lang);
            });
        });

        // Initialize display from saved preference
        const savedLang = localStorage.getItem('afz-language');
        if (savedLang) {
            const savedOption = document.querySelector(`[data-lang="${savedLang}"]`);
            if (savedOption) {
                const flag = savedOption.querySelector('.flag')?.textContent || '';
                const langName = savedOption.querySelector('.lang-name')?.textContent || '';
                if (currentFlag) currentFlag.textContent = flag;
                if (currentLangName) currentLangName.textContent = langName;
                savedOption.setAttribute('aria-selected', 'true');
            }
        }

        languageDropdownBtn.dataset.bound = '1';
        window.languageUIBound = true;
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
            // Simplified path resolution - always use root translation folder
            const translationPath = new URL(`translation/${langCode}.json`, window.location.href).toString();
            
            // Add cache-busting parameter for debugging
            const timestamp = Date.now();
            const translationURL = `${translationPath}${translationPath.includes('?') ? '&' : '?'}v=${timestamp}`;
            
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
