// Resource Library JavaScript
class ResourceManager {
    constructor() {
        this.resources = [];
        this.originalResources = [];
        this.currentPage = 1;
        this.resourcesPerPage = 18;
        this.filters = {
            category: 'all',
            type: 'all',
            language: 'all',
            search: ''
        };
        this.sortBy = 'newest';
        
        this.init();
        this.loadSampleData();
        this.render();
    }

    init() {
        this.bindEventListeners();
        this.setupFileUpload();
    }

    bindEventListeners() {
        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.filterByCategory(category);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const category = card.getAttribute('data-category');
                    this.filterByCategory(category);
                }
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.toggleSearchClear();
                this.applyFilters();
            }, 300));
        }
        
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.filters.search = '';
                this.toggleSearchClear();
                this.applyFilters();
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const typeFilter = document.getElementById('typeFilter');
        const languageFilter = document.getElementById('languageFilter');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        }

        if (languageFilter) {
            languageFilter.addEventListener('change', (e) => {
                this.filters.language = e.target.value;
                this.applyFilters();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Sort control
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortResources();
                this.renderResources();
            });
        }

        // Pagination
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (prevPage) {
            prevPage.addEventListener('click', () => this.changePage(-1));
        }
        
        if (nextPage) {
            nextPage.addEventListener('click', () => this.changePage(1));
        }

        // Modal controls
        const uploadResourceBtn = document.getElementById('uploadResourceBtn');
        const browseResourcesBtn = document.getElementById('browseResourcesBtn');
        const closeResourceModal = document.getElementById('closeResourceModal');
        const closeUploadModal = document.getElementById('closeUploadModal');
        const cancelUpload = document.getElementById('cancelUpload');
        const uploadForm = document.getElementById('uploadForm');

        if (uploadResourceBtn) {
            uploadResourceBtn.addEventListener('click', () => this.openUploadModal());
        }

        if (browseResourcesBtn) {
            browseResourcesBtn.addEventListener('click', () => {
                document.querySelector('.resources-content').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        if (closeResourceModal) {
            closeResourceModal.addEventListener('click', () => this.closeResourceModal());
        }

        if (closeUploadModal) {
            closeUploadModal.addEventListener('click', () => this.closeUploadModal());
        }

        if (cancelUpload) {
            cancelUpload.addEventListener('click', () => this.closeUploadModal());
        }

        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleResourceUpload(e));
        }

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Clear search/filters buttons
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.clearFilters();
                if (searchInput) searchInput.value = '';
                this.toggleSearchClear();
            });
        }
    }

    setupFileUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('resourceFile');

        if (fileUploadArea && fileInput) {
            // Drag and drop functionality
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('drag-over');
            });

            fileUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                if (!fileUploadArea.contains(e.relatedTarget)) {
                    fileUploadArea.classList.remove('drag-over');
                }
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    this.handleFileSelection(files[0]);
                }
            });

            // File selection
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelection(e.target.files[0]);
                }
            });
        }
    }

    handleFileSelection(file) {
        // Update UI to show selected file
        const uploadText = document.querySelector('.file-upload-text');
        if (uploadText) {
            uploadText.innerHTML = `
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                <p class="upload-primary">File selected: ${file.name}</p>
                <p class="upload-secondary">Size: ${this.formatFileSize(file.size)}</p>
            `;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadSampleData() {
        const sampleResources = [
            {
                id: '1',
                title: 'Understanding Albinism: A Comprehensive Guide',
                description: 'Complete medical guide covering the genetics, types, and characteristics of albinism.',
                category: 'educational',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-08-01'),
                views: 1250,
                downloads: 340,
                fileSize: '2.5 MB',
                tags: ['genetics', 'medical', 'guide'],
                featured: true,
                author: 'Dr. Sarah Phiri',
                url: '#'
            },
            {
                id: '2',
                title: 'Skin Care Tips for Persons with Albinism',
                description: 'Essential daily skin care routine and sun protection guidelines.',
                category: 'medical',
                type: 'video',
                language: 'en',
                dateAdded: new Date('2024-07-28'),
                views: 892,
                downloads: 0,
                duration: '12:34',
                tags: ['skincare', 'protection', 'health'],
                featured: true,
                author: 'AFZ Medical Team',
                url: '#'
            },
            {
                id: '3',
                title: 'Your Rights: Legal Protections in Zambia',
                description: 'Overview of legal rights and protections for persons with albinism under Zambian law.',
                category: 'legal',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-07-25'),
                views: 674,
                downloads: 156,
                fileSize: '1.8 MB',
                tags: ['rights', 'law', 'protection'],
                featured: false,
                author: 'AFZ Legal Team',
                url: '#'
            },
            {
                id: '4',
                title: 'Kufundisha za Albinism - Chichewa',
                description: 'Maphunziro ofunikira pa za albinism mu Chichewa.',
                category: 'educational',
                type: 'document',
                language: 'ny',
                dateAdded: new Date('2024-07-20'),
                views: 456,
                downloads: 89,
                fileSize: '1.2 MB',
                tags: ['education', 'chichewa', 'awareness'],
                featured: false,
                author: 'AFZ Education Team',
                url: '#'
            },
            {
                id: '5',
                title: 'Family Support Guide',
                description: 'A comprehensive guide for families raising children with albinism.',
                category: 'support',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-07-18'),
                views: 823,
                downloads: 245,
                fileSize: '3.1 MB',
                tags: ['family', 'children', 'support'],
                featured: true,
                author: 'AFZ Counseling Team',
                url: '#'
            },
            {
                id: '6',
                title: 'Educational Accommodations Checklist',
                description: 'Checklist of necessary accommodations for students with albinism in schools.',
                category: 'educational',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-07-15'),
                views: 567,
                downloads: 134,
                fileSize: '0.8 MB',
                tags: ['education', 'school', 'accommodations'],
                featured: false,
                author: 'AFZ Education Team',
                url: '#'
            },
            {
                id: '7',
                title: 'Advocacy Toolkit: Know Your Voice',
                description: 'Tools and strategies for self-advocacy and community advocacy.',
                category: 'legal',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-07-12'),
                views: 789,
                downloads: 198,
                fileSize: '2.2 MB',
                tags: ['advocacy', 'toolkit', 'empowerment'],
                featured: false,
                author: 'AFZ Advocacy Team',
                url: '#'
            },
            {
                id: '8',
                title: 'Mental Health and Albinism',
                description: 'Addressing psychological challenges and building resilience.',
                category: 'support',
                type: 'video',
                language: 'en',
                dateAdded: new Date('2024-07-10'),
                views: 634,
                downloads: 0,
                duration: '18:45',
                tags: ['mental health', 'resilience', 'counseling'],
                featured: false,
                author: 'Dr. James Mwangi',
                url: '#'
            },
            {
                id: '9',
                title: 'Sunscreen Application Demonstration',
                description: 'Step-by-step video guide on proper sunscreen application.',
                category: 'medical',
                type: 'video',
                language: 'en',
                dateAdded: new Date('2024-07-08'),
                views: 1100,
                downloads: 0,
                duration: '8:20',
                tags: ['sunscreen', 'protection', 'demonstration'],
                featured: false,
                author: 'AFZ Medical Team',
                url: '#'
            },
            {
                id: '10',
                title: 'Workplace Rights and Accommodations',
                description: 'Guide to employment rights and reasonable workplace accommodations.',
                category: 'legal',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-07-05'),
                views: 445,
                downloads: 87,
                fileSize: '1.5 MB',
                tags: ['employment', 'workplace', 'rights'],
                featured: false,
                author: 'AFZ Legal Team',
                url: '#'
            },
            {
                id: '11',
                title: 'Community Support Networks',
                description: 'How to build and maintain support networks in your community.',
                category: 'support',
                type: 'audio',
                language: 'en',
                dateAdded: new Date('2024-07-02'),
                views: 367,
                downloads: 78,
                duration: '25:30',
                tags: ['community', 'support', 'networks'],
                featured: false,
                author: 'AFZ Community Team',
                url: '#'
            },
            {
                id: '12',
                title: 'Vision Care Essentials',
                description: 'Eye care tips and resources for managing vision challenges.',
                category: 'medical',
                type: 'document',
                language: 'en',
                dateAdded: new Date('2024-06-30'),
                views: 712,
                downloads: 167,
                fileSize: '2.0 MB',
                tags: ['vision', 'eye care', 'health'],
                featured: false,
                author: 'Dr. Mary Banda',
                url: '#'
            }
        ];

        this.resources = sampleResources;
        this.originalResources = [...sampleResources];
    }

    filterByCategory(category) {
        this.filters.category = category;
        
        // Update filter dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        this.applyFilters();
    }

    applyFilters() {
        this.currentPage = 1; // Reset to first page
        
        this.resources = this.originalResources.filter(resource => {
            const matchesCategory = this.filters.category === 'all' || resource.category === this.filters.category;
            const matchesType = this.filters.type === 'all' || resource.type === this.filters.type;
            const matchesLanguage = this.filters.language === 'all' || resource.language === this.filters.language;
            const matchesSearch = this.filters.search === '' || 
                                resource.title.toLowerCase().includes(this.filters.search) ||
                                resource.description.toLowerCase().includes(this.filters.search) ||
                                resource.tags.some(tag => tag.toLowerCase().includes(this.filters.search));

            return matchesCategory && matchesType && matchesLanguage && matchesSearch;
        });

        this.sortResources();
        this.render();
    }

    clearFilters() {
        this.filters = {
            category: 'all',
            type: 'all',
            language: 'all',
            search: ''
        };

        // Reset filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const typeFilter = document.getElementById('typeFilter');
        const languageFilter = document.getElementById('languageFilter');

        if (categoryFilter) categoryFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        if (languageFilter) languageFilter.value = 'all';

        this.applyFilters();
    }

    sortResources() {
        this.resources.sort((a, b) => {
            switch (this.sortBy) {
                case 'newest':
                    return b.dateAdded - a.dateAdded;
                case 'oldest':
                    return a.dateAdded - b.dateAdded;
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'popular':
                    return b.views - a.views;
                default:
                    return 0;
            }
        });
    }

    toggleSearchClear() {
        const searchClear = document.getElementById('searchClear');
        const searchInput = document.getElementById('searchInput');
        
        if (searchClear && searchInput) {
            if (searchInput.value.length > 0) {
                searchClear.classList.add('show');
            } else {
                searchClear.classList.remove('show');
            }
        }
    }

    render() {
        this.renderResources();
        this.renderFeaturedResources();
        this.updateResultsInfo();
        this.updatePagination();
    }

    renderResources() {
        const resourcesGrid = document.getElementById('resourcesGrid');
        const noResults = document.getElementById('noResults');
        
        if (!resourcesGrid || !noResults) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.resourcesPerPage;
        const endIndex = startIndex + this.resourcesPerPage;
        const paginatedResources = this.resources.slice(startIndex, endIndex);

        if (paginatedResources.length === 0) {
            resourcesGrid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            resourcesGrid.style.display = 'grid';
            noResults.style.display = 'none';

            resourcesGrid.innerHTML = '';
            
            paginatedResources.forEach(resource => {
                const resourceCard = this.createResourceCard(resource);
                resourcesGrid.appendChild(resourceCard);
            });
        }
    }

    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${resource.title}`);

        const typeIcon = this.getTypeIcon(resource.type);
        const formattedDate = resource.dateAdded.toLocaleDateString();

        card.innerHTML = `
            <div class="resource-card-header">
                ${typeIcon}
                <span class="resource-category-badge ${resource.category}">${resource.category}</span>
                <h3 class="resource-title">${resource.title}</h3>
            </div>
            
            <div class="resource-card-body">
                <p class="resource-description">${resource.description}</p>
                
                <div class="resource-meta">
                    <span class="resource-language">${this.getLanguageName(resource.language)}</span>
                    <span class="resource-date">${formattedDate}</span>
                </div>
                
                <div class="resource-actions">
                    <button class="resource-action-btn" data-action="view">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </button>
                    ${resource.type !== 'video' && resource.type !== 'audio' && resource.type !== 'link' ? `
                        <button class="resource-action-btn" data-action="download">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </button>
                    ` : ''}
                    <button class="resource-action-btn" data-action="share">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share
                    </button>
                </div>
                
                <div class="resource-stats">
                    <div class="resource-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${resource.views}
                    </div>
                    ${resource.downloads > 0 ? `
                        <div class="resource-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            ${resource.downloads}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add event listeners
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('resource-action-btn')) {
                this.openResourceModal(resource);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openResourceModal(resource);
            }
        });

        // Action button listeners
        const actionButtons = card.querySelectorAll('.resource-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                this.handleResourceAction(resource, action);
            });
        });

        return card;
    }

    getTypeIcon(type) {
        const icons = {
            document: `<svg class="resource-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
            </svg>`,
            video: `<svg class="resource-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>`,
            audio: `<svg class="resource-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`,
            image: `<svg class="resource-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
            </svg>`,
            link: `<svg class="resource-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>`
        };
        return icons[type] || icons.document;
    }

    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'ny': 'Chichewa',
            'be': 'Bemba',
            'to': 'Tonga',
            'lz': 'Lozi'
        };
        return languages[code] || code.toUpperCase();
    }

    renderFeaturedResources() {
        const featuredGrid = document.getElementById('featuredGrid');
        if (!featuredGrid) return;

        const featuredResources = this.originalResources.filter(resource => resource.featured);
        
        featuredGrid.innerHTML = '';
        
        featuredResources.forEach(resource => {
            const featuredCard = this.createFeaturedCard(resource);
            featuredGrid.appendChild(featuredCard);
        });
    }

    createFeaturedCard(resource) {
        const card = document.createElement('div');
        card.className = 'featured-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        const typeIcon = this.getTypeIcon(resource.type);
        
        card.innerHTML = `
            <div class="featured-card-image">
                ${typeIcon}
            </div>
            <div class="featured-card-content">
                <h3 class="featured-card-title">${resource.title}</h3>
                <p class="featured-card-description">${resource.description}</p>
                <div class="featured-card-meta">
                    <span>${this.getLanguageName(resource.language)}</span>
                    <span>${resource.views} views</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.openResourceModal(resource));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openResourceModal(resource);
            }
        });
        
        return card;
    }

    updateResultsInfo() {
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsCount = document.getElementById('resultsCount');
        
        if (resultsTitle && resultsCount) {
            let titleText = 'Showing All Resources';
            
            if (this.filters.category !== 'all') {
                titleText = `Showing ${this.filters.category} Resources`;
            }
            
            if (this.filters.search) {
                titleText = `Search Results for "${this.filters.search}"`;
            }
            
            resultsTitle.textContent = titleText;
            resultsCount.textContent = `${this.resources.length} resources found`;
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.resources.length / this.resourcesPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }

        if (prevPage) {
            prevPage.disabled = this.currentPage <= 1;
        }

        if (nextPage) {
            nextPage.disabled = this.currentPage >= totalPages;
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.resources.length / this.resourcesPerPage);
        const newPage = this.currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderResources();
            this.updatePagination();
            
            // Scroll to top of resources
            document.querySelector('.resources-content').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    handleResourceAction(resource, action) {
        switch (action) {
            case 'view':
                this.openResourceModal(resource);
                break;
            case 'download':
                this.downloadResource(resource);
                break;
            case 'share':
                this.shareResource(resource);
                break;
        }
    }

    downloadResource(resource) {
        this.showLoading();
        
        // Simulate download
        setTimeout(() => {
            this.hideLoading();
            
            // Update download count
            resource.downloads++;
            
            this.showNotification(`${resource.title} downloaded successfully!`, 'success');
            this.renderResources();
        }, 1500);
    }

    shareResource(resource) {
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const shareText = `${resource.title} - ${resource.description} - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Resource link copied to clipboard!', 'success');
            });
        }
    }

    openResourceModal(resource) {
        const modal = document.getElementById('resourceModal');
        const modalTitle = document.getElementById('resourceModalTitle');
        const modalBody = document.getElementById('resourceModalBody');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = resource.title;
        
        const typeIcon = this.getTypeIcon(resource.type);
        const formattedDate = resource.dateAdded.toLocaleDateString();
        
        modalBody.innerHTML = `
            <div class="resource-detail-header">
                ${typeIcon}
                <div class="resource-detail-info">
                    <h3 class="resource-detail-title">${resource.title}</h3>
                    <div class="resource-detail-badges">
                        <span class="resource-detail-badge educational">${resource.category}</span>
                        <span class="resource-detail-badge educational">${resource.type}</span>
                        <span class="resource-detail-badge educational">${this.getLanguageName(resource.language)}</span>
                    </div>
                </div>
            </div>
            
            <div class="resource-detail-meta">
                <div class="resource-detail-meta-item">
                    <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div class="resource-detail-meta-text">By ${resource.author}</div>
                </div>
                
                <div class="resource-detail-meta-item">
                    <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div class="resource-detail-meta-text">${formattedDate}</div>
                </div>
                
                <div class="resource-detail-meta-item">
                    <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <div class="resource-detail-meta-text">${resource.views} views</div>
                </div>
                
                ${resource.fileSize ? `
                    <div class="resource-detail-meta-item">
                        <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                        </svg>
                        <div class="resource-detail-meta-text">${resource.fileSize}</div>
                    </div>
                ` : ''}
                
                ${resource.duration ? `
                    <div class="resource-detail-meta-item">
                        <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <div class="resource-detail-meta-text">${resource.duration}</div>
                    </div>
                ` : ''}
                
                ${resource.downloads > 0 ? `
                    <div class="resource-detail-meta-item">
                        <svg class="resource-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7,10 12,15 17,10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <div class="resource-detail-meta-text">${resource.downloads} downloads</div>
                    </div>
                ` : ''}
            </div>
            
            <div class="resource-detail-description">
                <p>${resource.description}</p>
            </div>
            
            ${resource.tags.length > 0 ? `
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="resource-detail-actions">
                ${resource.type !== 'video' && resource.type !== 'audio' && resource.type !== 'link' ? `
                    <button class="btn btn-primary" onclick="resourceManager.downloadResource(resourceManager.originalResources.find(r => r.id === '${resource.id}'))">
                        Download Resource
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="resourceManager.shareResource(resourceManager.originalResources.find(r => r.id === '${resource.id}'))">
                    Share Resource
                </button>
            </div>
        `;

        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    closeResourceModal() {
        const modal = document.getElementById('resourceModal');
        if (modal) {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    openUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus on first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        const form = document.getElementById('uploadForm');
        
        if (modal) {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        }
        
        if (form) {
            form.reset();
            
            // Reset file upload area
            const uploadText = document.querySelector('.file-upload-text');
            if (uploadText) {
                uploadText.innerHTML = `
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <p class="upload-primary">Drag and drop a file here, or click to select</p>
                    <p class="upload-secondary">Supported formats: PDF, DOC, MP4, MP3, JPG, PNG</p>
                `;
            }
        }
    }

    handleResourceUpload(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const resourceData = {
            id: Date.now().toString(),
            title: document.getElementById('resourceTitle').value,
            category: document.getElementById('resourceCategory').value,
            type: document.getElementById('resourceType').value,
            language: document.getElementById('resourceLanguage').value,
            description: document.getElementById('resourceDescription').value,
            dateAdded: new Date(),
            views: 0,
            downloads: 0,
            tags: document.getElementById('resourceTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            featured: false,
            author: 'Current User',
            url: '#'
        };

        // Handle file or URL
        const fileInput = document.getElementById('resourceFile');
        const urlInput = document.getElementById('resourceUrl');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            resourceData.fileSize = this.formatFileSize(file.size);
        } else if (urlInput.value) {
            resourceData.url = urlInput.value;
        }

        this.showLoading();
        
        // Simulate upload process
        setTimeout(() => {
            this.originalResources.push(resourceData);
            this.resources = [...this.originalResources];
            
            this.hideLoading();
            this.closeUploadModal();
            this.showNotification('Resource uploaded successfully!', 'success');
            this.render();
        }, 2000);
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('loading-active');
            spinner.setAttribute('aria-hidden', 'false');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.remove('loading-active');
            spinner.setAttribute('aria-hidden', 'true');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#2e7d32' : type === 'error' ? '#d32f2f' : '#1976d2'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

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
    }
}

// Initialize resource manager when page loads
let resourceManager;

document.addEventListener('DOMContentLoaded', () => {
    resourceManager = new ResourceManager();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourceManager;
}
