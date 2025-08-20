/**
 * AFZ Member Hub - Enhanced Resource Library Module
 * Interactive resource management with ratings, comments, bookmarking, sharing, and download tracking
 */

class ResourcesManager {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            email: 'john.doe@afz.org',
            avatar: 'assets/avatars/john-doe.jpg'
        };
        
        this.resources = this.generateMockResources();
        this.categories = this.generateResourceCategories();
        this.userBookmarks = this.loadUserBookmarks();
        this.userRatings = this.loadUserRatings();
        this.resourceComments = this.loadResourceComments();
        this.downloadHistory = this.loadDownloadHistory();
        this.searchHistory = this.loadSearchHistory();
        this.recentViews = this.loadRecentViews();
        
        this.currentView = 'all';
        this.currentSort = 'newest';
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.selectedTags = new Set();
        this.viewMode = 'grid';
        
        this.init();
    }

    init() {
        this.setupResourceInterface();
        this.setupEventListeners();
        this.loadInitialData();
        this.setupSearchSuggestions();
        this.trackAnalytics();
        console.log('Enhanced Resources Manager initialized');
    }

    // Enhanced resource data with comprehensive metadata
    generateMockResources() {
        return [
            {
                id: 'res_001',
                title: 'Comprehensive Guide to Albinism Healthcare',
                description: 'A complete medical guide covering healthcare needs, sun protection strategies, and medical management for individuals with albinism. Includes latest research findings and treatment protocols.',
                content: 'This comprehensive guide provides essential healthcare information for people with albinism...',
                category: 'healthcare',
                type: 'guide',
                format: 'pdf',
                language: 'english',
                author: {
                    id: 'author_001',
                    name: 'Dr. Sarah Mwanza',
                    title: 'Dermatologist',
                    avatar: 'assets/authors/dr-mwanza.jpg'
                },
                organization: 'AFZ Medical Committee',
                publishedDate: '2024-07-15T00:00:00Z',
                lastUpdated: '2024-08-10T14:30:00Z',
                fileSize: '2.5MB',
                pages: 45,
                downloadUrl: '/downloads/albinism-healthcare-guide.pdf',
                previewUrl: '/previews/albinism-healthcare-guide.html',
                coverImage: 'assets/resources/healthcare-guide-cover.jpg',
                thumbnailUrl: 'assets/resources/thumbnails/healthcare-guide-thumb.jpg',
                tags: ['healthcare', 'medical', 'sun-protection', 'dermatology', 'treatment'],
                difficulty: 'intermediate',
                estimatedReadTime: 25,
                featured: true,
                verified: true,
                downloadCount: 1247,
                viewCount: 3580,
                bookmarkCount: 189,
                shareCount: 45,
                rating: {
                    average: 4.7,
                    count: 89,
                    distribution: { 5: 65, 4: 18, 3: 4, 2: 1, 1: 1 }
                },
                comments: [
                    {
                        id: 'comment_001',
                        userId: 'user_456',
                        userName: 'Emily Johnson',
                        userAvatar: 'assets/avatars/emily-johnson.jpg',
                        content: 'This guide has been incredibly helpful for understanding healthcare needs. Very comprehensive!',
                        rating: 5,
                        createdAt: '2024-08-05T10:30:00Z',
                        helpful: 23,
                        replies: []
                    }
                ],
                relatedResources: ['res_002', 'res_005'],
                prerequisites: [],
                targetAudience: ['individuals-with-albinism', 'families', 'healthcare-providers'],
                accessLevel: 'public',
                license: 'CC BY-SA 4.0',
                version: '1.2',
                changelog: [
                    { version: '1.2', date: '2024-08-10', changes: 'Updated with latest research findings' },
                    { version: '1.1', date: '2024-07-20', changes: 'Added section on preventive care' },
                    { version: '1.0', date: '2024-07-15', changes: 'Initial release' }
                ]
            },
            {
                id: 'res_002',
                title: 'Sun Protection Kit Instructions',
                description: 'Step-by-step visual instructions for using sun protection equipment including sunscreen application techniques, protective clothing guidelines, and UV monitoring.',
                content: 'Proper sun protection is crucial for people with albinism...',
                category: 'healthcare',
                type: 'instructional',
                format: 'video',
                language: 'english',
                author: {
                    id: 'author_002',
                    name: 'Patricia Mbewe',
                    title: 'Health Educator',
                    avatar: 'assets/authors/patricia-mbewe.jpg'
                },
                organization: 'AFZ Health Initiative',
                publishedDate: '2024-08-01T00:00:00Z',
                lastUpdated: '2024-08-01T00:00:00Z',
                duration: 15, // minutes for video
                fileSize: '125MB',
                downloadUrl: '/downloads/sun-protection-instructions.mp4',
                streamingUrl: '/streaming/sun-protection-instructions',
                coverImage: 'assets/resources/sun-protection-cover.jpg',
                thumbnailUrl: 'assets/resources/thumbnails/sun-protection-thumb.jpg',
                tags: ['sun-protection', 'healthcare', 'instructional', 'prevention'],
                difficulty: 'beginner',
                estimatedReadTime: 15,
                featured: false,
                verified: true,
                downloadCount: 856,
                viewCount: 2140,
                bookmarkCount: 124,
                shareCount: 78,
                rating: {
                    average: 4.5,
                    count: 45,
                    distribution: { 5: 28, 4: 12, 3: 4, 2: 1, 1: 0 }
                },
                comments: [],
                relatedResources: ['res_001', 'res_003'],
                prerequisites: [],
                targetAudience: ['individuals-with-albinism', 'families', 'caregivers'],
                accessLevel: 'public',
                license: 'CC BY 4.0',
                version: '1.0',
                subtitles: ['english', 'bemba', 'nyanja']
            },
            {
                id: 'res_003',
                title: 'Educational Rights and Advocacy Toolkit',
                description: 'Comprehensive toolkit for advocating educational rights and accommodations for students with albinism. Includes templates, legal guidelines, and communication strategies.',
                content: 'Every child with albinism has the right to quality education with appropriate accommodations...',
                category: 'education',
                type: 'toolkit',
                format: 'interactive',
                language: 'english',
                author: {
                    id: 'author_003',
                    name: 'Michael Banda',
                    title: 'Education Advocate',
                    avatar: 'assets/authors/michael-banda.jpg'
                },
                organization: 'AFZ Education Committee',
                publishedDate: '2024-06-20T00:00:00Z',
                lastUpdated: '2024-08-15T16:45:00Z',
                fileSize: '15.7MB',
                downloadUrl: '/downloads/education-advocacy-toolkit.zip',
                interactiveUrl: '/interactive/education-toolkit',
                coverImage: 'assets/resources/education-toolkit-cover.jpg',
                thumbnailUrl: 'assets/resources/thumbnails/education-toolkit-thumb.jpg',
                tags: ['education', 'advocacy', 'rights', 'legal', 'templates', 'accommodations'],
                difficulty: 'intermediate',
                estimatedReadTime: 45,
                featured: true,
                verified: true,
                downloadCount: 432,
                viewCount: 1890,
                bookmarkCount: 67,
                shareCount: 34,
                rating: {
                    average: 4.8,
                    count: 32,
                    distribution: { 5: 26, 4: 5, 3: 1, 2: 0, 1: 0 }
                },
                comments: [],
                relatedResources: ['res_004', 'res_006'],
                prerequisites: [],
                targetAudience: ['parents', 'educators', 'advocates', 'students'],
                accessLevel: 'public',
                license: 'CC BY-NC 4.0',
                version: '2.1',
                includes: [
                    'IEP templates',
                    'Accommodation request letters',
                    'Legal reference guide',
                    'Communication scripts',
                    'Resource directory'
                ]
            },
            {
                id: 'res_004',
                title: 'Community Support Network Directory',
                description: 'Comprehensive directory of support services, organizations, and community resources available for individuals with albinism and their families across Zambia.',
                content: 'Building a strong support network is essential for thriving with albinism...',
                category: 'support',
                type: 'directory',
                format: 'database',
                language: 'english',
                author: {
                    id: 'author_004',
                    name: 'Grace Tembo',
                    title: 'Community Coordinator',
                    avatar: 'assets/authors/grace-tembo.jpg'
                },
                organization: 'AFZ Community Services',
                publishedDate: '2024-05-10T00:00:00Z',
                lastUpdated: '2024-08-20T09:15:00Z',
                entries: 156, // number of directory entries
                downloadUrl: '/downloads/community-directory.pdf',
                searchableUrl: '/directory/community-support',
                coverImage: 'assets/resources/directory-cover.jpg',
                thumbnailUrl: 'assets/resources/thumbnails/directory-thumb.jpg',
                tags: ['support', 'community', 'directory', 'services', 'organizations'],
                difficulty: 'beginner',
                estimatedReadTime: 20,
                featured: false,
                verified: true,
                downloadCount: 678,
                viewCount: 2456,
                bookmarkCount: 145,
                shareCount: 89,
                rating: {
                    average: 4.6,
                    count: 67,
                    distribution: { 5: 45, 4: 16, 3: 4, 2: 2, 1: 0 }
                },
                comments: [],
                relatedResources: ['res_003', 'res_005'],
                prerequisites: [],
                targetAudience: ['individuals-with-albinism', 'families', 'social-workers'],
                accessLevel: 'public',
                license: 'Open Directory',
                version: '3.4',
                coverage: ['lusaka', 'kitwe', 'ndola', 'livingstone', 'chipata'],
                lastVerified: '2024-08-20T00:00:00Z'
            },
            {
                id: 'res_005',
                title: 'Legal Rights and Protection Guide',
                description: 'Essential legal information about rights, protections, and legal recourse available to people with albinism under Zambian law and international conventions.',
                content: 'Understanding your legal rights is fundamental to advocating for yourself and others...',
                category: 'legal',
                type: 'guide',
                format: 'pdf',
                language: 'english',
                author: {
                    id: 'author_005',
                    name: 'James Phiri',
                    title: 'Legal Advisor',
                    avatar: 'assets/authors/james-phiri.jpg'
                },
                organization: 'AFZ Legal Committee',
                publishedDate: '2024-04-25T00:00:00Z',
                lastUpdated: '2024-07-30T11:20:00Z',
                fileSize: '1.8MB',
                pages: 32,
                downloadUrl: '/downloads/legal-rights-guide.pdf',
                coverImage: 'assets/resources/legal-guide-cover.jpg',
                thumbnailUrl: 'assets/resources/thumbnails/legal-guide-thumb.jpg',
                tags: ['legal', 'rights', 'protection', 'law', 'advocacy'],
                difficulty: 'intermediate',
                estimatedReadTime: 35,
                featured: false,
                verified: true,
                downloadCount: 543,
                viewCount: 1678,
                bookmarkCount: 89,
                shareCount: 23,
                rating: {
                    average: 4.4,
                    count: 28,
                    distribution: { 5: 16, 4: 8, 3: 3, 2: 1, 1: 0 }
                },
                comments: [],
                relatedResources: ['res_001', 'res_003'],
                prerequisites: [],
                targetAudience: ['advocates', 'individuals-with-albinism', 'legal-professionals'],
                accessLevel: 'public',
                license: 'CC BY-NC-SA 4.0',
                version: '1.3',
                jurisdiction: 'zambia',
                lastLegalReview: '2024-07-30T00:00:00Z'
            }
        ];
    }

    generateResourceCategories() {
        return [
            {
                id: 'healthcare',
                name: 'Healthcare & Medical',
                description: 'Medical guides, health resources, and care information',
                icon: 'heartbeat',
                color: '#e74c3c',
                resourceCount: 28,
                subcategories: [
                    { id: 'medical-care', name: 'Medical Care', count: 12 },
                    { id: 'sun-protection', name: 'Sun Protection', count: 8 },
                    { id: 'vision-care', name: 'Vision Care', count: 6 },
                    { id: 'mental-health', name: 'Mental Health', count: 2 }
                ]
            },
            {
                id: 'education',
                name: 'Education & Learning',
                description: 'Educational resources, learning materials, and academic support',
                icon: 'graduation-cap',
                color: '#3498db',
                resourceCount: 22,
                subcategories: [
                    { id: 'academic-support', name: 'Academic Support', count: 9 },
                    { id: 'learning-materials', name: 'Learning Materials', count: 7 },
                    { id: 'accommodation-guides', name: 'Accommodations', count: 4 },
                    { id: 'educational-rights', name: 'Educational Rights', count: 2 }
                ]
            },
            {
                id: 'legal',
                name: 'Legal & Rights',
                description: 'Legal information, rights awareness, and advocacy resources',
                icon: 'balance-scale',
                color: '#9b59b6',
                resourceCount: 15,
                subcategories: [
                    { id: 'legal-rights', name: 'Legal Rights', count: 6 },
                    { id: 'advocacy-tools', name: 'Advocacy Tools', count: 5 },
                    { id: 'policy-documents', name: 'Policy Documents', count: 4 }
                ]
            },
            {
                id: 'support',
                name: 'Community Support',
                description: 'Support networks, community resources, and peer connections',
                icon: 'hands-helping',
                color: '#2ecc71',
                resourceCount: 19,
                subcategories: [
                    { id: 'support-groups', name: 'Support Groups', count: 7 },
                    { id: 'community-services', name: 'Community Services', count: 6 },
                    { id: 'peer-resources', name: 'Peer Resources', count: 4 },
                    { id: 'family-support', name: 'Family Support', count: 2 }
                ]
            },
            {
                id: 'lifestyle',
                name: 'Lifestyle & Living',
                description: 'Daily living tips, lifestyle advice, and practical guides',
                icon: 'home',
                color: '#f39c12',
                resourceCount: 16,
                subcategories: [
                    { id: 'daily-living', name: 'Daily Living', count: 6 },
                    { id: 'career-guidance', name: 'Career Guidance', count: 5 },
                    { id: 'social-tips', name: 'Social Tips', count: 3 },
                    { id: 'technology', name: 'Assistive Technology', count: 2 }
                ]
            }
        ];
    }

    setupResourceInterface() {
        const resourcesContainer = document.getElementById('section-resources');
        if (!resourcesContainer) return;

        resourcesContainer.innerHTML = `
            <div class="resources-interface">
                <!-- Enhanced Resources Header -->
                <div class="resources-header">
                    <div class="header-content">
                        <h1>Resource Library</h1>
                        <p>Access comprehensive educational materials, guides, and community resources</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="contribute-resource-btn">
                            <i class="fas fa-plus"></i>
                            Contribute Resource
                        </button>
                        <div class="view-mode-toggle">
                            <button class="toggle-btn active" data-view="grid" title="Grid View">
                                <i class="fas fa-th"></i>
                            </button>
                            <button class="toggle-btn" data-view="list" title="List View">
                                <i class="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Search and Filters -->
                <div class="resources-search-section">
                    <div class="search-container">
                        <div class="search-box-enhanced">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" id="resources-search" placeholder="Search resources, topics, or keywords..." autocomplete="off">
                            <div class="search-suggestions" id="search-suggestions"></div>
                        </div>
                        <button class="btn btn-primary" id="advanced-search-btn">
                            <i class="fas fa-filter"></i>
                            Advanced Search
                        </button>
                    </div>
                    
                    <div class="filters-container">
                        <div class="filter-group">
                            <label>Category:</label>
                            <select id="category-filter" class="filter-select">
                                <option value="all">All Categories</option>
                                ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Type:</label>
                            <select id="type-filter" class="filter-select">
                                <option value="all">All Types</option>
                                <option value="guide">Guides</option>
                                <option value="toolkit">Toolkits</option>
                                <option value="video">Videos</option>
                                <option value="directory">Directories</option>
                                <option value="template">Templates</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Format:</label>
                            <select id="format-filter" class="filter-select">
                                <option value="all">All Formats</option>
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                                <option value="interactive">Interactive</option>
                                <option value="audio">Audio</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Sort by:</label>
                            <select id="sort-filter" class="filter-select">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="downloads">Most Downloaded</option>
                                <option value="title">Title A-Z</option>
                            </select>
                        </div>
                        
                        <button class="btn btn-outline" id="clear-filters-btn">
                            <i class="fas fa-times"></i>
                            Clear All
                        </button>
                    </div>
                    
                    <div class="active-tags" id="active-tags"></div>
                </div>

                <!-- Resource Stats -->
                <div class="resources-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.getTotalResourceCount()}</span>
                        <span class="stat-label">Total Resources</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.userBookmarks.length}</span>
                        <span class="stat-label">Bookmarked</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.downloadHistory.length}</span>
                        <span class="stat-label">Downloaded</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.getRecentlyAddedCount()}</span>
                        <span class="stat-label">Added This Month</span>
                    </div>
                </div>

                <!-- Quick Navigation -->
                <div class="resources-nav">
                    <button class="nav-tab active" data-view="all">
                        <i class="fas fa-th-large"></i>
                        All Resources
                    </button>
                    <button class="nav-tab" data-view="bookmarks">
                        <i class="fas fa-bookmark"></i>
                        My Bookmarks
                        <span class="nav-badge">${this.userBookmarks.length}</span>
                    </button>
                    <button class="nav-tab" data-view="recent">
                        <i class="fas fa-clock"></i>
                        Recently Viewed
                    </button>
                    <button class="nav-tab" data-view="categories">
                        <i class="fas fa-folder-open"></i>
                        Browse Categories
                    </button>
                    <button class="nav-tab" data-view="featured">
                        <i class="fas fa-star"></i>
                        Featured
                    </button>
                </div>

                <!-- Resource Content Area -->
                <div class="resources-content" id="resources-content">
                    ${this.renderResourcesView()}
                </div>

                <!-- Enhanced Modals -->
                ${this.renderResourceModal()}
                ${this.renderAdvancedSearchModal()}
                ${this.renderContributeModal()}
                ${this.renderRatingModal()}
            </div>
        `;

        this.injectResourcesStyles();
    }

    renderResourcesView() {
        const filteredResources = this.getFilteredResources();
        
        if (filteredResources.length === 0) {
            return this.renderEmptyState();
        }
        
        return `
            <div class="resources-grid ${this.viewMode}" id="resources-grid">
                ${filteredResources.map(resource => this.renderResourceCard(resource)).join('')}
            </div>
            ${this.renderPagination()}
        `;
    }

    renderResourceCard(resource) {
        const isBookmarked = this.userBookmarks.includes(resource.id);
        const userRating = this.userRatings[resource.id] || null;
        const formatIcon = this.getFormatIcon(resource.format);
        const difficultyBadge = this.getDifficultyBadge(resource.difficulty);
        
        return `
            <div class="resource-card ${this.viewMode === 'list' ? 'list-view' : ''}" data-resource-id="${resource.id}">
                <div class="resource-thumbnail">
                    <img src="${resource.thumbnailUrl}" alt="${resource.title}" loading="lazy">
                    <div class="resource-overlay">
                        <button class="overlay-btn preview-btn" onclick="resourcesManager.previewResource('${resource.id}')" title="Quick Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="overlay-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="resourcesManager.toggleBookmark('${resource.id}')" title="${isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="overlay-btn share-btn" onclick="resourcesManager.shareResource('${resource.id}')" title="Share Resource">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                    <div class="resource-badges">
                        <span class="format-badge ${resource.format}">${formatIcon}</span>
                        ${resource.featured ? '<span class="featured-badge"><i class="fas fa-star"></i></span>' : ''}
                        ${resource.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>' : ''}
                        ${difficultyBadge}
                    </div>
                </div>
                
                <div class="resource-content">
                    <div class="resource-header">
                        <h3 class="resource-title" onclick="resourcesManager.viewResource('${resource.id}')">${resource.title}</h3>
                        <span class="resource-category ${resource.category}">${this.getCategoryName(resource.category)}</span>
                    </div>
                    
                    <p class="resource-description">${this.truncateText(resource.description, 120)}</p>
                    
                    <div class="resource-meta">
                        <div class="resource-author">
                            <img src="${resource.author.avatar}" alt="${resource.author.name}" class="author-avatar">
                            <span class="author-name">${resource.author.name}</span>
                        </div>
                        <div class="resource-stats">
                            <span class="stat-item">
                                <i class="fas fa-download"></i>
                                ${this.formatNumber(resource.downloadCount)}
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-eye"></i>
                                ${this.formatNumber(resource.viewCount)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="resource-rating">
                        <div class="stars">
                            ${this.renderStars(resource.rating.average)}
                        </div>
                        <span class="rating-text">${resource.rating.average.toFixed(1)} (${resource.rating.count} reviews)</span>
                    </div>
                    
                    <div class="resource-tags">
                        ${resource.tags.slice(0, 3).map(tag => 
                            `<span class="resource-tag" onclick="resourcesManager.filterByTag('${tag}')">${tag}</span>`
                        ).join('')}
                        ${resource.tags.length > 3 ? `<span class="more-tags">+${resource.tags.length - 3} more</span>` : ''}
                    </div>
                </div>
                
                <div class="resource-actions">
                    <button class="btn btn-outline btn-sm" onclick="resourcesManager.viewResource('${resource.id}')">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="resourcesManager.downloadResource('${resource.id}')">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
                
                ${this.viewMode === 'list' ? this.renderListViewExtras(resource) : ''}
            </div>
        `;
    }

    renderListViewExtras(resource) {
        return `
            <div class="resource-extras">
                <div class="resource-details">
                    <div class="detail-item">
                        <strong>Published:</strong> ${this.formatDate(resource.publishedDate)}
                    </div>
                    <div class="detail-item">
                        <strong>Size:</strong> ${resource.fileSize || 'N/A'}
                    </div>
                    <div class="detail-item">
                        <strong>Language:</strong> ${resource.language}
                    </div>
                    <div class="detail-item">
                        <strong>Read Time:</strong> ~${resource.estimatedReadTime} min
                    </div>
                </div>
                <div class="resource-engagement">
                    <button class="engagement-btn rate-btn" onclick="resourcesManager.rateResource('${resource.id}')">
                        <i class="fas fa-star"></i>
                        Rate
                    </button>
                    <button class="engagement-btn comment-btn" onclick="resourcesManager.commentOnResource('${resource.id}')">
                        <i class="fas fa-comment"></i>
                        Comment
                    </button>
                </div>
            </div>
        `;
    }

    // Enhanced interaction methods
    viewResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;

        // Track view
        this.trackResourceView(resource);
        
        // Show detailed modal
        this.showResourceDetailModal(resource);
    }

    showResourceDetailModal(resource) {
        const modal = document.getElementById('resource-detail-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        const isBookmarked = this.userBookmarks.includes(resource.id);
        const userRating = this.userRatings[resource.id] || null;
        const relatedResources = this.getRelatedResources(resource.id);
        
        modalBody.innerHTML = `
            <div class="resource-detail-content">
                <div class="resource-detail-header">
                    <div class="resource-main-info">
                        <div class="resource-image-large">
                            <img src="${resource.coverImage}" alt="${resource.title}">
                        </div>
                        <div class="resource-info">
                            <h2>${resource.title}</h2>
                            <div class="resource-meta-detailed">
                                <div class="meta-row">
                                    <span class="resource-category-large ${resource.category}">
                                        <i class="fas fa-${this.getCategoryIcon(resource.category)}"></i>
                                        ${this.getCategoryName(resource.category)}
                                    </span>
                                    <span class="resource-type">${resource.type}</span>
                                    <span class="resource-format format-${resource.format}">${resource.format.toUpperCase()}</span>
                                </div>
                                <div class="meta-row">
                                    <div class="author-info-detailed">
                                        <img src="${resource.author.avatar}" alt="${resource.author.name}">
                                        <div>
                                            <strong>${resource.author.name}</strong>
                                            <span>${resource.author.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="meta-row">
                                    <span><i class="fas fa-calendar"></i> Published: ${this.formatDate(resource.publishedDate)}</span>
                                    <span><i class="fas fa-clock"></i> ${resource.estimatedReadTime} min read</span>
                                    ${resource.fileSize ? `<span><i class="fas fa-file"></i> ${resource.fileSize}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="resource-actions-header">
                        <button class="btn btn-primary btn-lg" onclick="resourcesManager.downloadResource('${resource.id}')">
                            <i class="fas fa-download"></i>
                            Download Resource
                        </button>
                        <div class="action-buttons">
                            <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="resourcesManager.toggleBookmark('${resource.id}')" title="${isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}">
                                <i class="fas fa-bookmark"></i>
                            </button>
                            <button class="action-btn share-btn" onclick="resourcesManager.shareResource('${resource.id}')" title="Share Resource">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            ${resource.previewUrl ? `
                                <button class="action-btn preview-btn" onclick="window.open('${resource.previewUrl}', '_blank')" title="Preview">
                                    <i class="fas fa-eye"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="resource-detail-tabs">
                    <nav class="tab-nav">
                        <button class="tab-btn active" data-tab="overview">Overview</button>
                        <button class="tab-btn" data-tab="details">Details</button>
                        <button class="tab-btn" data-tab="reviews">Reviews (${resource.rating.count})</button>
                        <button class="tab-btn" data-tab="related">Related</button>
                    </nav>
                    
                    <div class="tab-content">
                        <div class="tab-panel active" id="overview-tab">
                            <div class="resource-description-full">
                                <h4>Description</h4>
                                <p>${resource.description}</p>
                                ${resource.content ? `<div class="resource-content-preview">${resource.content.substring(0, 500)}...</div>` : ''}
                            </div>
                            
                            ${resource.agenda || resource.includes ? `
                                <div class="resource-contents">
                                    <h4>What's Included</h4>
                                    <ul>
                                        ${(resource.includes || resource.agenda || []).map(item => `<li>${typeof item === 'string' ? item : item.item}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <div class="resource-tags-full">
                                <h4>Topics</h4>
                                <div class="tags-list">
                                    ${resource.tags.map(tag => `<span class="resource-tag" onclick="resourcesManager.filterByTag('${tag}')">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-panel" id="details-tab">
                            ${this.renderResourceDetailsTab(resource)}
                        </div>
                        
                        <div class="tab-panel" id="reviews-tab">
                            ${this.renderResourceReviewsTab(resource)}
                        </div>
                        
                        <div class="tab-panel" id="related-tab">
                            ${this.renderRelatedResourcesTab(relatedResources)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('resource-detail-modal');
        this.bindTabEvents();
    }

    // Enhanced rating and review system
    rateResource(resourceId, rating = null) {
        if (!rating) {
            // Show rating modal
            this.showRatingModal(resourceId);
            return;
        }
        
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Update user rating
        this.userRatings[resourceId] = {
            rating: rating,
            date: new Date().toISOString(),
            resourceId: resourceId
        };
        
        // Update resource rating (simplified calculation)
        const newCount = resource.rating.count + 1;
        const newAverage = ((resource.rating.average * resource.rating.count) + rating) / newCount;
        resource.rating.average = newAverage;
        resource.rating.count = newCount;
        resource.rating.distribution[rating] = (resource.rating.distribution[rating] || 0) + 1;
        
        this.saveUserRatings();
        this.showNotification('Thank you for rating this resource!', 'success');
        this.refreshResourceDisplay();
    }

    // Enhanced bookmark system
    toggleBookmark(resourceId) {
        const isBookmarked = this.userBookmarks.includes(resourceId);
        const resource = this.resources.find(r => r.id === resourceId);
        
        if (isBookmarked) {
            this.userBookmarks = this.userBookmarks.filter(id => id !== resourceId);
            resource.bookmarkCount = Math.max(0, resource.bookmarkCount - 1);
            this.showNotification('Removed from bookmarks', 'info');
        } else {
            this.userBookmarks.push(resourceId);
            resource.bookmarkCount++;
            this.showNotification('Added to bookmarks', 'success');
        }
        
        this.saveUserBookmarks();
        this.refreshResourceDisplay();
    }

    // Enhanced sharing system
    shareResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.description,
                url: `${window.location.origin}/resources/${resourceId}`
            }).catch(console.error);
        } else {
            // Fallback: copy link to clipboard
            const shareUrl = `${window.location.origin}/resources/${resourceId}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
        
        // Track share
        resource.shareCount++;
        this.trackResourceShare(resourceId);
    }

    // Enhanced download tracking
    downloadResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Track download
        this.trackResourceDownload(resource);
        
        // Update stats
        resource.downloadCount++;
        
        // Add to download history
        this.downloadHistory.unshift({
            resourceId: resourceId,
            title: resource.title,
            downloadDate: new Date().toISOString(),
            fileSize: resource.fileSize
        });
        
        // Keep only last 100 downloads
        if (this.downloadHistory.length > 100) {
            this.downloadHistory = this.downloadHistory.slice(0, 100);
        }
        
        this.saveDownloadHistory();
        this.showNotification(`Downloading: ${resource.title}`, 'success');
        
        // Initiate download
        const link = document.createElement('a');
        link.href = resource.downloadUrl;
        link.download = resource.title;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Analytics and tracking
    trackResourceView(resource) {
        // Add to recent views
        const existingIndex = this.recentViews.findIndex(v => v.resourceId === resource.id);
        if (existingIndex >= 0) {
            this.recentViews.splice(existingIndex, 1);
        }
        
        this.recentViews.unshift({
            resourceId: resource.id,
            title: resource.title,
            category: resource.category,
            viewDate: new Date().toISOString()
        });
        
        // Keep only last 50 views
        if (this.recentViews.length > 50) {
            this.recentViews = this.recentViews.slice(0, 50);
        }
        
        // Update resource view count
        resource.viewCount++;
        
        this.saveRecentViews();
    }

    trackResourceDownload(resource) {
        // Analytics tracking would go here
        console.log(`Resource downloaded: ${resource.title}`);
    }

    trackResourceShare(resourceId) {
        // Analytics tracking would go here
        console.log(`Resource shared: ${resourceId}`);
    }

    // Utility methods
    getFilteredResources() {
        let filtered = [...this.resources];
        
        // Apply current view filter
        if (this.currentView === 'bookmarks') {
            filtered = filtered.filter(r => this.userBookmarks.includes(r.id));
        } else if (this.currentView === 'recent') {
            const recentIds = this.recentViews.map(v => v.resourceId);
            filtered = filtered.filter(r => recentIds.includes(r.id));
        } else if (this.currentView === 'featured') {
            filtered = filtered.filter(r => r.featured);
        }
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(resource => 
                resource.title.toLowerCase().includes(query) ||
                resource.description.toLowerCase().includes(query) ||
                resource.tags.some(tag => tag.toLowerCase().includes(query)) ||
                resource.author.name.toLowerCase().includes(query)
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(r => r.category === this.currentFilter);
        }
        
        // Apply tag filters
        if (this.selectedTags.size > 0) {
            filtered = filtered.filter(r => 
                Array.from(this.selectedTags).every(tag => r.tags.includes(tag))
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                case 'oldest':
                    return new Date(a.publishedDate) - new Date(b.publishedDate);
                case 'popular':
                    return b.viewCount - a.viewCount;
                case 'rating':
                    return b.rating.average - a.rating.average;
                case 'downloads':
                    return b.downloadCount - a.downloadCount;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        
        return filtered;
    }

    // Data persistence methods
    loadUserBookmarks() {
        const stored = localStorage.getItem('afz_user_bookmarks');
        return stored ? JSON.parse(stored) : [];
    }

    saveUserBookmarks() {
        localStorage.setItem('afz_user_bookmarks', JSON.stringify(this.userBookmarks));
    }

    loadUserRatings() {
        const stored = localStorage.getItem('afz_user_ratings');
        return stored ? JSON.parse(stored) : {};
    }

    saveUserRatings() {
        localStorage.setItem('afz_user_ratings', JSON.stringify(this.userRatings));
    }

    loadResourceComments() {
        const stored = localStorage.getItem('afz_resource_comments');
        return stored ? JSON.parse(stored) : {};
    }

    saveResourceComments() {
        localStorage.setItem('afz_resource_comments', JSON.stringify(this.resourceComments));
    }

    loadDownloadHistory() {
        const stored = localStorage.getItem('afz_download_history');
        return stored ? JSON.parse(stored) : [];
    }

    saveDownloadHistory() {
        localStorage.setItem('afz_download_history', JSON.stringify(this.downloadHistory));
    }

    loadRecentViews() {
        const stored = localStorage.getItem('afz_recent_views');
        return stored ? JSON.parse(stored) : [];
    }

    saveRecentViews() {
        localStorage.setItem('afz_recent_views', JSON.stringify(this.recentViews));
    }

    loadSearchHistory() {
        const stored = localStorage.getItem('afz_search_history');
        return stored ? JSON.parse(stored) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('afz_search_history', JSON.stringify(this.searchHistory));
    }

    // Helper methods
    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    getCategoryIcon(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.icon : 'folder';
    }

    getFormatIcon(format) {
        const icons = {
            pdf: '<i class="fas fa-file-pdf"></i>',
            video: '<i class="fas fa-play-circle"></i>',
            audio: '<i class="fas fa-volume-up"></i>',
            interactive: '<i class="fas fa-mouse-pointer"></i>',
            database: '<i class="fas fa-database"></i>'
        };
        return icons[format] || '<i class="fas fa-file"></i>';
    }

    getDifficultyBadge(difficulty) {
        const badges = {
            beginner: '<span class="difficulty-badge beginner">Beginner</span>',
            intermediate: '<span class="difficulty-badge intermediate">Intermediate</span>',
            advanced: '<span class="difficulty-badge advanced">Advanced</span>'
        };
        return badges[difficulty] || '';
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    getTotalResourceCount() {
        return this.resources.length;
    }

    getRecentlyAddedCount() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return this.resources.filter(r => 
            new Date(r.publishedDate) > oneMonthAgo
        ).length;
    }

    // Placeholder methods for complex features
    setupEventListeners() {
        console.log('Setting up enhanced resource event listeners...');
    }

    loadInitialData() {
        console.log('Loading initial resource data...');
    }

    setupSearchSuggestions() {
        console.log('Setting up search suggestions...');
    }

    trackAnalytics() {
        console.log('Setting up resource analytics...');
    }

    renderEmptyState() {
        return `<div class="empty-state">No resources found</div>`;
    }

    renderPagination() {
        return `<div class="pagination">Pagination placeholder</div>`;
    }

    renderResourceModal() {
        return `<div id="resource-detail-modal" class="modal">Resource detail modal</div>`;
    }

    renderAdvancedSearchModal() {
        return `<div id="advanced-search-modal" class="modal">Advanced search modal</div>`;
    }

    renderContributeModal() {
        return `<div id="contribute-modal" class="modal">Contribute resource modal</div>`;
    }

    renderRatingModal() {
        return `<div id="rating-modal" class="modal">Rating modal</div>`;
    }

    renderResourceDetailsTab(resource) {
        return `<div class="resource-details-tab">Resource details tab content</div>`;
    }

    renderResourceReviewsTab(resource) {
        return `<div class="resource-reviews-tab">Resource reviews tab content</div>`;
    }

    renderRelatedResourcesTab(resources) {
        return `<div class="related-resources-tab">Related resources tab content</div>`;
    }

    getRelatedResources(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return [];
        
        return this.resources.filter(r => 
            r.id !== resourceId && 
            (r.category === resource.category || 
             r.tags.some(tag => resource.tags.includes(tag)))
        ).slice(0, 4);
    }

    showModal(modalId) {
        console.log(`Showing modal: ${modalId}`);
    }

    bindTabEvents() {
        console.log('Binding tab events...');
    }

    refreshResourceDisplay() {
        console.log('Refreshing resource display...');
    }

    showNotification(message, type) {
        if (window.afzMemberHub && window.afzMemberHub.showToastNotification) {
            window.afzMemberHub.showToastNotification(message, type);
        }
    }

    injectResourcesStyles() {
        console.log('Injecting enhanced resource styles...');
    }
}
