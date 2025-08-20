/**
 * AFZ Member Hub - Resources Module
 * Comprehensive resource library with uploads, search, categorization, downloads tracking, and collaborative features
 */

class ResourcesManager {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            avatar: 'assets/avatars/john-doe.jpg',
            role: 'member'
        };
        
        this.resources = this.generateMockResources();
        this.categories = this.generateResourceCategories();
        this.collections = this.generateCollections();
        this.resourceStats = this.generateResourceStats();
        this.userLibrary = this.generateUserLibrary();
        
        this.currentView = 'browse';
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.searchQuery = '';
        this.selectedResources = new Set();
        
        this.init();
    }

    init() {
        this.setupResourcesInterface();
        this.setupEventListeners();
        this.loadInitialData();
        this.startResourceUpdates();
    }

    setupResourcesInterface() {
        const resourcesContainer = document.getElementById('section-resources');
        if (!resourcesContainer) return;

        resourcesContainer.innerHTML = `
            <div class="resources-interface">
                <!-- Resources Header -->
                <div class="resources-header">
                    <div class="header-content">
                        <h1>Resource Library</h1>
                        <p>Access, share, and discover valuable resources for the AFZ community</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="create-collection-btn">
                            <i class="fas fa-folder-plus"></i>
                            New Collection
                        </button>
                        <button class="btn btn-primary" id="upload-resource-btn">
                            <i class="fas fa-upload"></i>
                            Upload Resource
                        </button>
                    </div>
                </div>

                <!-- Resources Stats -->
                <div class="resources-stats">
                    <div class="stats-overview">
                        <div class="stat-item">
                            <div class="stat-icon total">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.resourceStats.totalResources}</h3>
                                <p>Total Resources</p>
                                <span class="stat-change positive">+${this.resourceStats.newThisMonth} this month</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon downloads">
                                <i class="fas fa-download"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.resourceStats.totalDownloads}</h3>
                                <p>Downloads</p>
                                <span class="stat-change positive">+${this.resourceStats.downloadsThisWeek} this week</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon categories">
                                <i class="fas fa-tags"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.categories.length}</h3>
                                <p>Categories</p>
                                <span class="stat-change neutral">Covering all topics</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon my-uploads">
                                <i class="fas fa-user-edit"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.resourceStats.myUploads}</h3>
                                <p>My Uploads</p>
                                <span class="stat-change positive">${this.resourceStats.myDownloads} total downloads</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="resources-nav">
                    <button class="nav-tab active" data-view="browse">
                        <i class="fas fa-search"></i>
                        Browse Resources
                    </button>
                    <button class="nav-tab" data-view="categories">
                        <i class="fas fa-th-large"></i>
                        Categories
                    </button>
                    <button class="nav-tab" data-view="collections">
                        <i class="fas fa-folder"></i>
                        Collections
                    </button>
                    <button class="nav-tab" data-view="my-library">
                        <i class="fas fa-bookmark"></i>
                        My Library
                    </button>
                    <button class="nav-tab" data-view="uploads">
                        <i class="fas fa-cloud-upload-alt"></i>
                        My Uploads
                    </button>
                </div>

                <!-- Content Area -->
                <div class="resources-content">
                    <!-- Browse View -->
                    <div class="content-view active" id="view-browse">
                        ${this.renderBrowseView()}
                    </div>

                    <!-- Categories View -->
                    <div class="content-view" id="view-categories">
                        ${this.renderCategoriesView()}
                    </div>

                    <!-- Collections View -->
                    <div class="content-view" id="view-collections">
                        ${this.renderCollectionsView()}
                    </div>

                    <!-- My Library View -->
                    <div class="content-view" id="view-my-library">
                        ${this.renderMyLibraryView()}
                    </div>

                    <!-- Uploads View -->
                    <div class="content-view" id="view-uploads">
                        ${this.renderUploadsView()}
                    </div>
                </div>

                <!-- Resource Preview Modal -->
                ${this.renderResourceModal()}

                <!-- Upload Modal -->
                ${this.renderUploadModal()}

                <!-- Collection Modal -->
                ${this.renderCollectionModal()}
            </div>
        `;

        this.injectResourcesStyles();
    }

    renderBrowseView() {
        return `
            <div class="browse-controls">
                <div class="search-section">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="resource-search" placeholder="Search resources, documents, guides...">
                    </div>
                    <div class="filter-controls">
                        <select id="category-filter" class="filter-select">
                            <option value="all">All Categories</option>
                            ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                        </select>
                        <select id="type-filter" class="filter-select">
                            <option value="all">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="doc">Word Documents</option>
                            <option value="video">Videos</option>
                            <option value="audio">Audio</option>
                            <option value="image">Images</option>
                            <option value="link">External Links</option>
                        </select>
                        <select id="sort-filter" class="filter-select">
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Popular</option>
                            <option value="name">A-Z</option>
                            <option value="downloads">Most Downloaded</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>

                <div class="view-options">
                    <div class="view-toggle">
                        <button class="toggle-btn active" data-layout="grid" title="Grid View">
                            <i class="fas fa-th"></i>
                        </button>
                        <button class="toggle-btn" data-layout="list" title="List View">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                    <div class="bulk-actions" id="bulk-actions" style="display: none;">
                        <span class="selected-count">
                            <span id="selected-count">0</span> selected
                        </span>
                        <button class="btn btn-sm btn-secondary" id="bulk-download">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                        <button class="btn btn-sm btn-primary" id="bulk-add-collection">
                            <i class="fas fa-plus"></i>
                            Add to Collection
                        </button>
                    </div>
                </div>
            </div>

            <!-- Featured Resources -->
            <div class="featured-section">
                <h2>Featured Resources</h2>
                <div class="featured-resources">
                    ${this.renderFeaturedResources()}
                </div>
            </div>

            <!-- Resource Grid -->
            <div class="resources-section">
                <h2>All Resources</h2>
                <div class="resources-grid" id="resources-grid">
                    ${this.renderResourcesGrid(this.resources)}
                </div>
                <div class="load-more-container">
                    <button class="btn btn-secondary" id="load-more-resources">
                        Load More Resources
                    </button>
                </div>
            </div>
        `;
    }

    renderCategoriesView() {
        return `
            <div class="categories-overview">
                <div class="categories-header">
                    <h2>Resource Categories</h2>
                    <p>Explore resources organized by topic and type</p>
                </div>

                <div class="categories-grid">
                    ${this.categories.map(category => `
                        <div class="category-card" onclick="resourcesManager.filterByCategory('${category.id}')">
                            <div class="category-header">
                                <div class="category-icon ${category.color}">
                                    <i class="fas fa-${category.icon}"></i>
                                </div>
                                <div class="category-stats">
                                    <span class="resource-count">${category.resourceCount}</span>
                                    <span class="download-count">${category.totalDownloads} downloads</span>
                                </div>
                            </div>
                            <div class="category-content">
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                                <div class="category-types">
                                    ${category.types.map(type => `
                                        <span class="type-tag">${type}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="category-action">
                                <span class="view-all">View All <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Category Detail View -->
                <div class="category-detail" id="category-detail" style="display: none;">
                    <div class="category-detail-header">
                        <button class="btn btn-sm btn-secondary" id="back-to-categories">
                            <i class="fas fa-arrow-left"></i>
                            Back to Categories
                        </button>
                        <div class="category-info">
                            <h2 id="category-detail-title">Category Resources</h2>
                            <p id="category-detail-description">Resources in this category</p>
                        </div>
                    </div>
                    <div class="resources-grid" id="category-resources-grid">
                        <!-- Resources will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderCollectionsView() {
        return `
            <div class="collections-container">
                <div class="collections-header">
                    <div class="header-content">
                        <h2>Resource Collections</h2>
                        <p>Curated collections of resources for specific topics and purposes</p>
                    </div>
                    <button class="btn btn-primary" id="create-collection-main">
                        <i class="fas fa-plus"></i>
                        Create Collection
                    </button>
                </div>

                <div class="collections-tabs">
                    <button class="collection-tab active" data-tab="public">Public Collections</button>
                    <button class="collection-tab" data-tab="my">My Collections</button>
                    <button class="collection-tab" data-tab="saved">Saved Collections</button>
                </div>

                <div class="collections-content">
                    <!-- Public Collections -->
                    <div class="collection-tab-content active" id="public-collections">
                        <div class="collections-grid">
                            ${this.renderPublicCollections()}
                        </div>
                    </div>

                    <!-- My Collections -->
                    <div class="collection-tab-content" id="my-collections">
                        <div class="collections-grid">
                            ${this.renderMyCollections()}
                        </div>
                    </div>

                    <!-- Saved Collections -->
                    <div class="collection-tab-content" id="saved-collections">
                        <div class="collections-grid">
                            ${this.renderSavedCollections()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMyLibraryView() {
        return `
            <div class="library-container">
                <div class="library-header">
                    <h2>My Library</h2>
                    <p>Your saved resources, bookmarks, and personal collections</p>
                </div>

                <div class="library-sections">
                    <!-- Quick Stats -->
                    <div class="library-stats">
                        <div class="library-stat">
                            <i class="fas fa-bookmark"></i>
                            <div>
                                <h4>${this.userLibrary.bookmarks.length}</h4>
                                <p>Bookmarked</p>
                            </div>
                        </div>
                        <div class="library-stat">
                            <i class="fas fa-download"></i>
                            <div>
                                <h4>${this.userLibrary.downloaded.length}</h4>
                                <p>Downloaded</p>
                            </div>
                        </div>
                        <div class="library-stat">
                            <i class="fas fa-heart"></i>
                            <div>
                                <h4>${this.userLibrary.favorites.length}</h4>
                                <p>Favorites</p>
                            </div>
                        </div>
                        <div class="library-stat">
                            <i class="fas fa-eye"></i>
                            <div>
                                <h4>${this.userLibrary.recent.length}</h4>
                                <p>Recently Viewed</p>
                            </div>
                        </div>
                    </div>

                    <!-- Library Tabs -->
                    <div class="library-tabs">
                        <button class="library-tab active" data-tab="bookmarks">Bookmarked</button>
                        <button class="library-tab" data-tab="downloaded">Downloaded</button>
                        <button class="library-tab" data-tab="favorites">Favorites</button>
                        <button class="library-tab" data-tab="recent">Recently Viewed</button>
                    </div>

                    <!-- Library Content -->
                    <div class="library-content">
                        <div class="library-tab-content active" id="bookmarks-content">
                            <div class="resources-list">
                                ${this.renderLibraryResources(this.userLibrary.bookmarks, 'bookmark')}
                            </div>
                        </div>
                        <div class="library-tab-content" id="downloaded-content">
                            <div class="resources-list">
                                ${this.renderLibraryResources(this.userLibrary.downloaded, 'download')}
                            </div>
                        </div>
                        <div class="library-tab-content" id="favorites-content">
                            <div class="resources-list">
                                ${this.renderLibraryResources(this.userLibrary.favorites, 'favorite')}
                            </div>
                        </div>
                        <div class="library-tab-content" id="recent-content">
                            <div class="resources-list">
                                ${this.renderLibraryResources(this.userLibrary.recent, 'recent')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderUploadsView() {
        return `
            <div class="uploads-container">
                <div class="uploads-header">
                    <div class="header-content">
                        <h2>My Uploads</h2>
                        <p>Manage resources you've shared with the community</p>
                    </div>
                    <div class="upload-stats">
                        <div class="upload-stat">
                            <h4>${this.resourceStats.myUploads}</h4>
                            <p>Resources Uploaded</p>
                        </div>
                        <div class="upload-stat">
                            <h4>${this.resourceStats.myDownloads}</h4>
                            <p>Total Downloads</p>
                        </div>
                        <div class="upload-stat">
                            <h4>${this.resourceStats.myRating}/5</h4>
                            <p>Average Rating</p>
                        </div>
                    </div>
                </div>

                <div class="uploads-tabs">
                    <button class="upload-tab active" data-tab="published">Published (${this.resourceStats.published})</button>
                    <button class="upload-tab" data-tab="pending">Pending Review (${this.resourceStats.pending})</button>
                    <button class="upload-tab" data-tab="drafts">Drafts (${this.resourceStats.drafts})</button>
                </div>

                <div class="uploads-content">
                    <div class="upload-tab-content active" id="published-uploads">
                        ${this.renderMyUploads('published')}
                    </div>
                    <div class="upload-tab-content" id="pending-uploads">
                        ${this.renderMyUploads('pending')}
                    </div>
                    <div class="upload-tab-content" id="drafts-uploads">
                        ${this.renderMyUploads('drafts')}
                    </div>
                </div>
            </div>
        `;
    }

    renderResourcesGrid(resources) {
        return resources.map(resource => `
            <div class="resource-card" data-resource-id="${resource.id}">
                <div class="resource-header">
                    <input type="checkbox" class="resource-checkbox" value="${resource.id}">
                    <div class="resource-type ${resource.type}">
                        <i class="fas fa-${this.getTypeIcon(resource.type)}"></i>
                    </div>
                    ${resource.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                </div>
                
                <div class="resource-preview" onclick="resourcesManager.viewResource('${resource.id}')">
                    <div class="resource-thumbnail">
                        <img src="${resource.thumbnail}" alt="${resource.title}">
                        <div class="resource-overlay">
                            <i class="fas fa-eye"></i>
                            <span>Preview</span>
                        </div>
                    </div>
                </div>

                <div class="resource-info">
                    <div class="resource-category">${this.getCategoryName(resource.category)}</div>
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    
                    <div class="resource-meta">
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${resource.author}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(resource.uploadDate)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-download"></i>
                            <span>${resource.downloads}</span>
                        </div>
                    </div>

                    <div class="resource-rating">
                        ${this.renderStarRating(resource.rating)}
                        <span class="rating-count">(${resource.ratingCount})</span>
                    </div>
                </div>

                <div class="resource-actions">
                    <button class="action-btn download-btn" onclick="resourcesManager.downloadResource('${resource.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn bookmark-btn" onclick="resourcesManager.bookmarkResource('${resource.id}')" title="Bookmark">
                        <i class="fas fa-bookmark"></i>
                    </button>
                    <button class="action-btn share-btn" onclick="resourcesManager.shareResource('${resource.id}')" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="action-btn more-btn" onclick="resourcesManager.showResourceMenu('${resource.id}')" title="More Options">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedResources() {
        const featured = this.resources.filter(r => r.featured).slice(0, 3);
        return featured.map(resource => `
            <div class="featured-resource" onclick="resourcesManager.viewResource('${resource.id}')">
                <div class="featured-thumbnail">
                    <img src="${resource.thumbnail}" alt="${resource.title}">
                    <div class="featured-overlay">
                        <div class="featured-content">
                            <h4>${resource.title}</h4>
                            <p>${this.getCategoryName(resource.category)}</p>
                            <div class="featured-stats">
                                <span><i class="fas fa-download"></i> ${resource.downloads}</span>
                                <span>${this.renderStarRating(resource.rating)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPublicCollections() {
        const publicCollections = this.collections.filter(c => c.isPublic);
        return publicCollections.map(collection => `
            <div class="collection-card" onclick="resourcesManager.viewCollection('${collection.id}')">
                <div class="collection-thumbnail">
                    <div class="collection-preview">
                        ${collection.resources.slice(0, 4).map(resource => `
                            <img src="${resource.thumbnail}" alt="${resource.title}">
                        `).join('')}
                    </div>
                    <div class="collection-count">${collection.resources.length} items</div>
                </div>
                <div class="collection-info">
                    <h4>${collection.title}</h4>
                    <p>${collection.description}</p>
                    <div class="collection-meta">
                        <span class="author">by ${collection.author}</span>
                        <span class="date">${this.formatDate(collection.createdDate)}</span>
                    </div>
                    <div class="collection-stats">
                        <span><i class="fas fa-eye"></i> ${collection.views}</span>
                        <span><i class="fas fa-heart"></i> ${collection.likes}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderMyCollections() {
        const myCollections = this.collections.filter(c => c.authorId === this.currentUser.id);
        return myCollections.map(collection => `
            <div class="collection-card my-collection">
                <div class="collection-header">
                    <div class="collection-status ${collection.status}">${collection.status}</div>
                    <div class="collection-actions">
                        <button class="btn btn-sm btn-secondary" onclick="resourcesManager.editCollection('${collection.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="resourcesManager.deleteCollection('${collection.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="collection-thumbnail">
                    <div class="collection-preview">
                        ${collection.resources.slice(0, 4).map(resource => `
                            <img src="${resource.thumbnail}" alt="${resource.title}">
                        `).join('')}
                    </div>
                    <div class="collection-count">${collection.resources.length} items</div>
                </div>
                <div class="collection-info">
                    <h4>${collection.title}</h4>
                    <p>${collection.description}</p>
                    <div class="collection-stats">
                        <span><i class="fas fa-eye"></i> ${collection.views}</span>
                        <span><i class="fas fa-download"></i> ${collection.downloads}</span>
                        <span><i class="fas fa-heart"></i> ${collection.likes}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderSavedCollections() {
        const savedCollections = this.collections.filter(c => c.isSaved);
        return savedCollections.map(collection => `
            <div class="collection-card saved-collection">
                <div class="collection-thumbnail">
                    <div class="collection-preview">
                        ${collection.resources.slice(0, 4).map(resource => `
                            <img src="${resource.thumbnail}" alt="${resource.title}">
                        `).join('')}
                    </div>
                    <div class="collection-count">${collection.resources.length} items</div>
                </div>
                <div class="collection-info">
                    <h4>${collection.title}</h4>
                    <p>${collection.description}</p>
                    <div class="collection-meta">
                        <span class="author">by ${collection.author}</span>
                        <span class="saved-date">Saved ${this.formatDate(collection.savedDate)}</span>
                    </div>
                </div>
                <div class="collection-action">
                    <button class="btn btn-sm btn-secondary" onclick="resourcesManager.unsaveCollection('${collection.id}')">
                        <i class="fas fa-bookmark"></i>
                        Saved
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderLibraryResources(resources, type) {
        if (resources.length === 0) {
            return `
                <div class="empty-library">
                    <div class="empty-icon">
                        <i class="fas fa-${this.getLibraryIcon(type)}"></i>
                    </div>
                    <h3>No ${type} resources yet</h3>
                    <p>Start exploring the resource library to build your collection.</p>
                </div>
            `;
        }

        return resources.map(resource => `
            <div class="library-resource-item" onclick="resourcesManager.viewResource('${resource.id}')">
                <div class="resource-thumbnail-small">
                    <img src="${resource.thumbnail}" alt="${resource.title}">
                    <div class="resource-type-badge ${resource.type}">
                        <i class="fas fa-${this.getTypeIcon(resource.type)}"></i>
                    </div>
                </div>
                <div class="resource-details">
                    <h4>${resource.title}</h4>
                    <p class="resource-category">${this.getCategoryName(resource.category)}</p>
                    <p class="resource-author">by ${resource.author}</p>
                    <div class="resource-stats">
                        <span>${this.renderStarRating(resource.rating)}</span>
                        <span class="downloads">${resource.downloads} downloads</span>
                        ${type === 'recent' ? `<span class="viewed-date">Viewed ${this.formatDate(resource.viewedDate)}</span>` : ''}
                        ${type === 'bookmark' ? `<span class="bookmark-date">Saved ${this.formatDate(resource.bookmarkDate)}</span>` : ''}
                    </div>
                </div>
                <div class="resource-quick-actions">
                    <button class="quick-action-btn" onclick="event.stopPropagation(); resourcesManager.downloadResource('${resource.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="quick-action-btn" onclick="event.stopPropagation(); resourcesManager.shareResource('${resource.id}')" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                    ${type === 'bookmark' ? `
                        <button class="quick-action-btn remove" onclick="event.stopPropagation(); resourcesManager.removeBookmark('${resource.id}')" title="Remove Bookmark">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    renderMyUploads(status) {
        const uploads = this.resources.filter(r => r.authorId === this.currentUser.id && r.status === status);
        
        if (uploads.length === 0) {
            return `
                <div class="empty-uploads">
                    <div class="empty-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>No ${status} resources</h3>
                    <p>${this.getEmptyUploadMessage(status)}</p>
                </div>
            `;
        }

        return `
            <div class="uploads-grid">
                ${uploads.map(resource => `
                    <div class="upload-card">
                        <div class="upload-header">
                            <div class="upload-status ${resource.status}">${resource.status}</div>
                            <div class="upload-actions">
                                <button class="action-btn" onclick="resourcesManager.editResource('${resource.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn" onclick="resourcesManager.duplicateResource('${resource.id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="action-btn delete" onclick="resourcesManager.deleteResource('${resource.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="upload-thumbnail">
                            <img src="${resource.thumbnail}" alt="${resource.title}">
                            <div class="resource-type-overlay ${resource.type}">
                                <i class="fas fa-${this.getTypeIcon(resource.type)}"></i>
                            </div>
                        </div>
                        <div class="upload-info">
                            <h4>${resource.title}</h4>
                            <p class="upload-category">${this.getCategoryName(resource.category)}</p>
                            <div class="upload-stats">
                                <span><i class="fas fa-download"></i> ${resource.downloads}</span>
                                <span><i class="fas fa-eye"></i> ${resource.views}</span>
                                ${resource.status === 'published' ? `
                                    <span>${this.renderStarRating(resource.rating)}</span>
                                ` : ''}
                            </div>
                            <div class="upload-date">Uploaded ${this.formatDate(resource.uploadDate)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderResourceModal() {
        return `
            <div class="modal-overlay" id="resource-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3 id="resource-modal-title">Resource Preview</h3>
                        <button class="modal-close" onclick="resourcesManager.closeModal('resource-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="resource-modal-body">
                        <!-- Resource details will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderUploadModal() {
        return `
            <div class="modal-overlay" id="upload-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>Upload New Resource</h3>
                        <button class="modal-close" onclick="resourcesManager.closeModal('upload-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="upload-form" class="upload-form">
                            <div class="form-section">
                                <h4>File Upload</h4>
                                <div class="file-upload-area" id="file-upload-area">
                                    <div class="upload-placeholder">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <h4>Upload Resource File</h4>
                                        <p>Drag and drop your file here, or click to browse</p>
                                        <p class="file-types">Supported: PDF, DOC, PPT, Video, Audio, Images</p>
                                        <input type="file" id="resource-file" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.jpg,.jpeg,.png,.gif">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Resource Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="resource-title">Title *</label>
                                        <input type="text" id="resource-title" name="title" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="resource-category">Category *</label>
                                        <select id="resource-category" name="category" required>
                                            <option value="">Select category...</option>
                                            ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="resource-description">Description *</label>
                                    <textarea id="resource-description" name="description" rows="4" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="resource-tags">Tags (comma separated)</label>
                                    <input type="text" id="resource-tags" name="tags" placeholder="e.g., healthcare, guide, albinism">
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Additional Details</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="resource-author">Author/Creator</label>
                                        <input type="text" id="resource-author" name="author" value="${this.currentUser.name}">
                                    </div>
                                    <div class="form-group">
                                        <label for="resource-language">Language</label>
                                        <select id="resource-language" name="language">
                                            <option value="en">English</option>
                                            <option value="bem">Bemba</option>
                                            <option value="ny">Nyanja</option>
                                            <option value="ton">Tonga</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Publishing Options</h4>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="resource-featured" name="featured">
                                        Request to feature this resource
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="resource-comments" name="allowComments" checked>
                                        Allow comments and reviews
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="resource-notifications" name="notifications" checked>
                                        Notify me of downloads and comments
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="resourcesManager.closeModal('upload-modal')">Cancel</button>
                        <button class="btn btn-secondary" onclick="resourcesManager.saveDraft()">Save as Draft</button>
                        <button class="btn btn-primary" onclick="resourcesManager.uploadResource()">Upload Resource</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCollectionModal() {
        return `
            <div class="modal-overlay" id="collection-modal" style="display: none;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>Create New Collection</h3>
                        <button class="modal-close" onclick="resourcesManager.closeModal('collection-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="collection-form">
                            <div class="form-group">
                                <label for="collection-title">Collection Title *</label>
                                <input type="text" id="collection-title" name="title" required>
                            </div>
                            <div class="form-group">
                                <label for="collection-description">Description *</label>
                                <textarea id="collection-description" name="description" rows="3" required></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="collection-visibility">Visibility</label>
                                    <select id="collection-visibility" name="visibility">
                                        <option value="public">Public - Anyone can view</option>
                                        <option value="unlisted">Unlisted - Only with link</option>
                                        <option value="private">Private - Only you can view</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="collection-category">Category</label>
                                    <select id="collection-category" name="category">
                                        <option value="">Select category...</option>
                                        ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="resourcesManager.closeModal('collection-modal')">Cancel</button>
                        <button class="btn btn-primary" onclick="resourcesManager.createCollection()">Create Collection</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return `<div class="star-rating">${stars}</div>`;
    }

    setupEventListeners() {
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Upload resource button
        const uploadBtn = document.getElementById('upload-resource-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.showModal('upload-modal');
            });
        }

        // Create collection buttons
        const createCollectionBtns = document.querySelectorAll('#create-collection-btn, #create-collection-main');
        createCollectionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showModal('collection-modal');
            });
        });

        // Search functionality
        const resourceSearch = document.getElementById('resource-search');
        if (resourceSearch) {
            resourceSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter controls
        const filters = ['category-filter', 'type-filter', 'sort-filter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        // View toggle
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layout = e.target.getAttribute('data-layout');
                this.switchLayout(layout);
            });
        });

        // Resource checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('resource-checkbox')) {
                this.handleResourceSelection(e.target);
            }
        });

        // Collection tabs
        const collectionTabs = document.querySelectorAll('.collection-tab');
        collectionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCollectionTab(e.target.getAttribute('data-tab'));
            });
        });

        // Library tabs
        const libraryTabs = document.querySelectorAll('.library-tab');
        libraryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchLibraryTab(e.target.getAttribute('data-tab'));
            });
        });

        // Upload tabs
        const uploadTabs = document.querySelectorAll('.upload-tab');
        uploadTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchUploadTab(e.target.getAttribute('data-tab'));
            });
        });

        // File upload area
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('resource-file');
        
        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });

            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('dragover');
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    this.handleFileSelection(files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelection(e.target.files[0]);
                }
            });
        }
    }

    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-view') === viewName);
        });

        // Update active view
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${viewName}`);
        });

        this.currentView = viewName;
        this.loadViewData(viewName);
    }

    switchLayout(layout) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-layout') === layout);
        });

        const resourcesGrid = document.getElementById('resources-grid');
        if (resourcesGrid) {
            resourcesGrid.classList.toggle('list-layout', layout === 'list');
        }
    }

    switchCollectionTab(tabName) {
        document.querySelectorAll('.collection-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.collection-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-collections`);
        });
    }

    switchLibraryTab(tabName) {
        document.querySelectorAll('.library-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.library-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-content`);
        });
    }

    switchUploadTab(tabName) {
        document.querySelectorAll('.upload-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.upload-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-uploads`);
        });
    }

    handleResourceSelection(checkbox) {
        if (checkbox.checked) {
            this.selectedResources.add(checkbox.value);
        } else {
            this.selectedResources.delete(checkbox.value);
        }
        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (this.selectedResources.size > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = this.selectedResources.size;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    handleFileSelection(file) {
        const placeholder = document.querySelector('.upload-placeholder');
        placeholder.innerHTML = `
            <div class="file-selected">
                <i class="fas fa-${this.getFileIcon(file.type)}"></i>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${this.formatFileSize(file.size)}</p>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="resourcesManager.removeFile()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    removeFile() {
        const fileInput = document.getElementById('resource-file');
        fileInput.value = '';
        
        const placeholder = document.querySelector('.upload-placeholder');
        placeholder.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h4>Upload Resource File</h4>
            <p>Drag and drop your file here, or click to browse</p>
            <p class="file-types">Supported: PDF, DOC, PPT, Video, Audio, Images</p>
        `;
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'browse':
                this.refreshResourcesGrid();
                break;
            case 'categories':
                this.refreshCategories();
                break;
            case 'collections':
                this.refreshCollections();
                break;
            case 'my-library':
                this.refreshLibrary();
                break;
            case 'uploads':
                this.refreshUploads();
                break;
        }
    }

    refreshResourcesGrid() {
        const grid = document.getElementById('resources-grid');
        if (grid) {
            grid.innerHTML = this.renderResourcesGrid(this.resources);
        }
    }

    refreshCategories() {
        // Refresh categories view
        console.log('Refreshing categories...');
    }

    refreshCollections() {
        // Refresh collections view
        console.log('Refreshing collections...');
    }

    refreshLibrary() {
        // Refresh library view
        console.log('Refreshing library...');
    }

    refreshUploads() {
        // Refresh uploads view
        console.log('Refreshing uploads...');
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const typeFilter = document.getElementById('type-filter');
        const sortFilter = document.getElementById('sort-filter');

        const filters = {
            category: categoryFilter?.value || 'all',
            type: typeFilter?.value || 'all',
            sort: sortFilter?.value || 'recent'
        };

        let filtered = this.resources;

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(resource =>
                resource.title.toLowerCase().includes(this.searchQuery) ||
                resource.description.toLowerCase().includes(this.searchQuery) ||
                resource.author.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(resource => resource.category === filters.category);
        }

        // Apply type filter
        if (filters.type !== 'all') {
            filtered = filtered.filter(resource => resource.type === filters.type);
        }

        // Apply sort
        filtered = this.sortResources(filtered, filters.sort);

        this.updateResourcesDisplay(filtered);
    }

    sortResources(resources, sortType) {
        switch (sortType) {
            case 'recent':
                return resources.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            case 'popular':
                return resources.sort((a, b) => b.downloads - a.downloads);
            case 'name':
                return resources.sort((a, b) => a.title.localeCompare(b.title));
            case 'rating':
                return resources.sort((a, b) => b.rating - a.rating);
            default:
                return resources;
        }
    }

    updateResourcesDisplay(resources) {
        const grid = document.getElementById('resources-grid');
        if (grid) {
            grid.innerHTML = this.renderResourcesGrid(resources);
        }
    }

    // Resource actions
    viewResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            this.showResourceDetails(resource);
        }
    }

    showResourceDetails(resource) {
        const modalBody = document.getElementById('resource-modal-body');
        modalBody.innerHTML = `
            <div class="resource-detail">
                <div class="resource-detail-header">
                    <div class="resource-detail-thumbnail">
                        <img src="${resource.thumbnail}" alt="${resource.title}">
                        <div class="resource-type-indicator ${resource.type}">
                            <i class="fas fa-${this.getTypeIcon(resource.type)}"></i>
                        </div>
                    </div>
                    <div class="resource-detail-info">
                        <div class="resource-category-badge">${this.getCategoryName(resource.category)}</div>
                        <h2>${resource.title}</h2>
                        <p class="resource-author">by ${resource.author}</p>
                        <div class="resource-rating-detail">
                            ${this.renderStarRating(resource.rating)}
                            <span class="rating-text">${resource.rating}/5 (${resource.ratingCount} reviews)</span>
                        </div>
                        <div class="resource-stats-detail">
                            <span><i class="fas fa-download"></i> ${resource.downloads} downloads</span>
                            <span><i class="fas fa-eye"></i> ${resource.views} views</span>
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(resource.uploadDate)}</span>
                        </div>
                    </div>
                </div>

                <div class="resource-description-detail">
                    <h4>Description</h4>
                    <p>${resource.description}</p>
                </div>

                ${resource.tags ? `
                    <div class="resource-tags-detail">
                        <h4>Tags</h4>
                        <div class="tags-list">
                            ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="resource-actions-detail">
                    <button class="btn btn-primary btn-lg" onclick="resourcesManager.downloadResource('${resource.id}')">
                        <i class="fas fa-download"></i>
                        Download Resource
                    </button>
                    <button class="btn btn-secondary" onclick="resourcesManager.bookmarkResource('${resource.id}')">
                        <i class="fas fa-bookmark"></i>
                        Save to Library
                    </button>
                    <button class="btn btn-secondary" onclick="resourcesManager.shareResource('${resource.id}')">
                        <i class="fas fa-share"></i>
                        Share Resource
                    </button>
                    <button class="btn btn-info" onclick="resourcesManager.addToCollection('${resource.id}')">
                        <i class="fas fa-plus"></i>
                        Add to Collection
                    </button>
                </div>
            </div>
        `;
        this.showModal('resource-modal');
    }

    downloadResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            // Increment download count
            resource.downloads++;
            
            // Add to user's downloaded resources
            if (!this.userLibrary.downloaded.find(r => r.id === resourceId)) {
                this.userLibrary.downloaded.unshift({...resource, downloadDate: new Date().toISOString()});
            }
            
            this.showNotification(`Downloading "${resource.title}"...`, 'success');
            
            // In a real app, this would trigger the actual file download
            setTimeout(() => {
                this.showNotification('Download completed!', 'success');
            }, 2000);
        }
    }

    bookmarkResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            const existingBookmark = this.userLibrary.bookmarks.find(r => r.id === resourceId);
            
            if (existingBookmark) {
                this.userLibrary.bookmarks = this.userLibrary.bookmarks.filter(r => r.id !== resourceId);
                this.showNotification('Removed from bookmarks', 'info');
            } else {
                this.userLibrary.bookmarks.unshift({...resource, bookmarkDate: new Date().toISOString()});
                this.showNotification('Added to bookmarks!', 'success');
            }
        }
    }

    shareResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            // In a real app, this would open a share dialog
            this.showNotification(`Share link copied to clipboard!`, 'success');
        }
    }

    uploadResource() {
        const form = document.getElementById('upload-form');
        const formData = new FormData(form);
        
        const newResource = {
            id: `resource_${Date.now()}`,
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            author: formData.get('author') || this.currentUser.name,
            authorId: this.currentUser.id,
            type: this.getFileTypeFromInput(),
            thumbnail: 'assets/resources/default-thumbnail.jpg',
            uploadDate: new Date().toISOString(),
            downloads: 0,
            views: 0,
            rating: 0,
            ratingCount: 0,
            featured: formData.get('featured') === 'on',
            status: 'pending',
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
        };

        this.resources.unshift(newResource);
        this.closeModal('upload-modal');
        this.showNotification('Resource uploaded successfully! It will be reviewed before publishing.', 'success');
        this.refreshResourcesGrid();
    }

    createCollection() {
        const form = document.getElementById('collection-form');
        const formData = new FormData(form);
        
        const newCollection = {
            id: `collection_${Date.now()}`,
            title: formData.get('title'),
            description: formData.get('description'),
            author: this.currentUser.name,
            authorId: this.currentUser.id,
            isPublic: formData.get('visibility') === 'public',
            category: formData.get('category'),
            resources: [],
            createdDate: new Date().toISOString(),
            views: 0,
            likes: 0,
            downloads: 0,
            status: 'active'
        };

        this.collections.unshift(newCollection);
        this.closeModal('collection-modal');
        this.showNotification('Collection created successfully!', 'success');
    }

    filterByCategory(categoryId) {
        // Show resources for specific category
        const categoryDetail = document.getElementById('category-detail');
        const categoryTitle = document.getElementById('category-detail-title');
        const categoryDescription = document.getElementById('category-detail-description');
        const categoryGrid = document.getElementById('category-resources-grid');
        
        const category = this.categories.find(c => c.id === categoryId);
        const categoryResources = this.resources.filter(r => r.category === categoryId);
        
        categoryTitle.textContent = category.name;
        categoryDescription.textContent = category.description;
        categoryGrid.innerHTML = this.renderResourcesGrid(categoryResources);
        categoryDetail.style.display = 'block';
        
        // Hide main categories grid
        document.querySelector('.categories-grid').style.display = 'none';
    }

    // Utility functions
    getTypeIcon(type) {
        const icons = {
            pdf: 'file-pdf',
            doc: 'file-word',
            ppt: 'file-powerpoint',
            video: 'play-circle',
            audio: 'volume-up',
            image: 'image',
            link: 'external-link-alt'
        };
        return icons[type] || 'file';
    }

    getFileIcon(mimeType) {
        if (mimeType.includes('pdf')) return 'file-pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'file-word';
        if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'file-powerpoint';
        if (mimeType.includes('video')) return 'play-circle';
        if (mimeType.includes('audio')) return 'volume-up';
        if (mimeType.includes('image')) return 'image';
        return 'file';
    }

    getLibraryIcon(type) {
        const icons = {
            bookmark: 'bookmark',
            download: 'download',
            favorite: 'heart',
            recent: 'clock'
        };
        return icons[type] || 'file';
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    }

    getFileTypeFromInput() {
        const fileInput = document.getElementById('resource-file');
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const mimeType = file.type;
            
            if (mimeType.includes('pdf')) return 'pdf';
            if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
            if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'ppt';
            if (mimeType.includes('video')) return 'video';
            if (mimeType.includes('audio')) return 'audio';
            if (mimeType.includes('image')) return 'image';
        }
        return 'doc';
    }

    getEmptyUploadMessage(status) {
        const messages = {
            published: 'Upload your first resource to share with the community.',
            pending: 'No resources awaiting review at the moment.',
            drafts: 'Start creating a resource draft to save your progress.'
        };
        return messages[status] || 'No resources found.';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadInitialData() {
        this.refreshResourcesGrid();
    }

    startResourceUpdates() {
        // Simulate real-time resource updates
        setInterval(() => {
            this.updateResourceStats();
        }, 60000);
    }

    updateResourceStats() {
        // Update resource statistics
        console.log('Updating resource statistics...');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        if (window.afzDashboard) {
            window.afzDashboard.showNotification(message, type);
        }
    }

    // Mock data generators
    generateMockResources() {
        const resources = [];
        const titles = [
            'Complete Guide to Albinism Healthcare',
            'Understanding Skin Protection for People with Albinism',
            'Educational Rights and Advocacy Toolkit',
            'Community Support Group Handbook',
            'Youth Empowerment Program Manual',
            'Workplace Rights and Accommodation Guide',
            'Family Support and Counseling Resources',
            'Medical Care Best Practices',
            'Albinism Awareness Campaign Materials',
            'Research and Clinical Studies Overview'
        ];

        const descriptions = [
            'Comprehensive healthcare guidelines for people with albinism, covering medical care, skin protection, and visual health.',
            'Educational materials about albinism, its types, inheritance patterns, and management strategies.',
            'Advocacy tools and resources for promoting rights and awareness in communities and schools.',
            'Support materials for families and individuals affected by albinism.'
        ];

        const authors = ['Dr. Sarah Mwanza', 'AFZ Medical Team', 'Prof. James Banda', 'Mary Tembo', 'Community Health Experts'];
        const categories = ['healthcare', 'education', 'advocacy', 'support', 'research', 'community'];
        const types = ['pdf', 'doc', 'video', 'audio', 'image'];

        for (let i = 0; i < 30; i++) {
            const uploadDate = new Date();
            uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 365));
            
            resources.push({
                id: `resource_${i + 1}`,
                title: titles[i % titles.length],
                description: descriptions[i % descriptions.length],
                category: categories[i % categories.length],
                type: types[i % types.length],
                author: authors[i % authors.length],
                authorId: i % 3 === 0 ? this.currentUser.id : `user_${i}`,
                thumbnail: `assets/resources/thumbnail${(i % 10) + 1}.jpg`,
                uploadDate: uploadDate.toISOString(),
                downloads: Math.floor(Math.random() * 500) + 10,
                views: Math.floor(Math.random() * 1000) + 50,
                rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
                ratingCount: Math.floor(Math.random() * 50) + 5,
                featured: i < 3,
                status: i % 10 === 0 ? 'pending' : i % 15 === 0 ? 'draft' : 'published',
                tags: ['albinism', 'healthcare', 'guide'].slice(0, Math.floor(Math.random() * 3) + 1)
            });
        }
        return resources;
    }

    generateResourceCategories() {
        return [
            {
                id: 'healthcare',
                name: 'Healthcare',
                description: 'Medical guides, healthcare resources, and clinical information',
                icon: 'heartbeat',
                color: 'red',
                resourceCount: 12,
                totalDownloads: 2847,
                types: ['Medical Guides', 'Clinical Studies', 'Health Tips']
            },
            {
                id: 'education',
                name: 'Education',
                description: 'Educational materials, school resources, and learning tools',
                icon: 'graduation-cap',
                color: 'blue',
                resourceCount: 18,
                totalDownloads: 1923,
                types: ['Study Materials', 'Teaching Resources', 'Curricula']
            },
            {
                id: 'advocacy',
                name: 'Advocacy',
                description: 'Rights awareness, policy documents, and advocacy tools',
                icon: 'bullhorn',
                color: 'green',
                resourceCount: 15,
                totalDownloads: 1456,
                types: ['Policy Documents', 'Advocacy Kits', 'Legal Resources']
            },
            {
                id: 'support',
                name: 'Support',
                description: 'Community support materials, counseling resources, and group activities',
                icon: 'hands-helping',
                color: 'purple',
                resourceCount: 10,
                totalDownloads: 987,
                types: ['Support Guides', 'Activities', 'Counseling Materials']
            },
            {
                id: 'research',
                name: 'Research',
                description: 'Scientific papers, research findings, and academic studies',
                icon: 'microscope',
                color: 'orange',
                resourceCount: 8,
                totalDownloads: 654,
                types: ['Research Papers', 'Studies', 'Data Reports']
            },
            {
                id: 'community',
                name: 'Community',
                description: 'Community resources, event materials, and local information',
                icon: 'users',
                color: 'teal',
                resourceCount: 14,
                totalDownloads: 1234,
                types: ['Event Materials', 'Community Guides', 'Local Resources']
            }
        ];
    }

    generateCollections() {
        return [
            {
                id: 'collection_1',
                title: 'Essential Healthcare Resources',
                description: 'Must-have healthcare guides and medical information for people with albinism',
                author: 'Dr. Sarah Mwanza',
                authorId: 'user_doc1',
                isPublic: true,
                category: 'healthcare',
                resources: this.resources.filter(r => r.category === 'healthcare').slice(0, 5),
                createdDate: '2024-01-15T10:00:00Z',
                views: 234,
                likes: 45,
                downloads: 123,
                status: 'active'
            },
            {
                id: 'collection_2',
                title: 'Educational Support Materials',
                description: 'Comprehensive collection of educational resources for students and teachers',
                author: 'Mary Tembo',
                authorId: 'user_teacher1',
                isPublic: true,
                category: 'education',
                resources: this.resources.filter(r => r.category === 'education').slice(0, 8),
                createdDate: '2024-01-20T14:30:00Z',
                views: 189,
                likes: 32,
                downloads: 87,
                status: 'active'
            }
        ];
    }

    generateUserLibrary() {
        const sampleResources = this.resources.slice(0, 10);
        
        return {
            bookmarks: sampleResources.slice(0, 3).map(r => ({...r, bookmarkDate: new Date().toISOString()})),
            downloaded: sampleResources.slice(1, 4).map(r => ({...r, downloadDate: new Date().toISOString()})),
            favorites: sampleResources.slice(2, 5).map(r => ({...r, favoriteDate: new Date().toISOString()})),
            recent: sampleResources.slice(3, 8).map(r => ({...r, viewedDate: new Date().toISOString()}))
        };
    }

    generateResourceStats() {
        return {
            totalResources: 847,
            newThisMonth: 23,
            totalDownloads: 12567,
            downloadsThisWeek: 145,
            myUploads: 8,
            myDownloads: 234,
            myRating: 4.6,
            published: 6,
            pending: 1,
            drafts: 1
        };
    }

    injectResourcesStyles() {
        if (document.getElementById('resources-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'resources-styles';
        styles.textContent = `
            .resources-interface {
                background: var(--surface-color);
                border-radius: 16px;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .resources-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 32px;
                border-bottom: 1px solid var(--border-color);
                background: linear-gradient(135deg, var(--primary-light) 0%, var(--surface-color) 100%);
            }

            .header-content h1 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .header-content p {
                color: var(--text-secondary);
                margin: 0;
                font-size: 16px;
            }

            .header-actions {
                display: flex;
                gap: 16px;
                align-items: center;
            }

            /* Resources Stats */
            .resources-stats {
                padding: 24px 32px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-hover);
            }

            .stats-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 24px;
            }

            .stat-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                transition: all 0.3s ease;
            }

            .stat-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .stat-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
            }

            .stat-icon.total { background: var(--primary-color); }
            .stat-icon.downloads { background: var(--success-color); }
            .stat-icon.categories { background: var(--info-color); }
            .stat-icon.my-uploads { background: var(--warning-color); }

            .stat-content h3 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .stat-content p {
                color: var(--text-secondary);
                margin: 0 0 8px;
                font-weight: 500;
            }

            .stat-change {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
            }

            .stat-change.positive {
                background: var(--success-light);
                color: var(--success-color);
            }

            .stat-change.neutral {
                background: var(--surface-hover);
                color: var(--text-secondary);
            }

            /* Navigation */
            .resources-nav {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
                overflow-x: auto;
            }

            .nav-tab {
                background: none;
                border: none;
                padding: 20px 32px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
            }

            .nav-tab:hover {
                color: var(--text-primary);
                background: var(--surface-hover);
            }

            .nav-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
                background: var(--primary-light);
            }

            /* Content */
            .resources-content {
                flex: 1;
                overflow-y: auto;
            }

            .content-view {
                display: none;
                padding: 32px;
                height: 100%;
            }

            .content-view.active {
                display: block;
            }

            /* Browse Controls */
            .browse-controls {
                margin-bottom: 32px;
            }

            .search-section {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 16px;
            }

            .search-box {
                position: relative;
                flex: 1;
                max-width: 400px;
            }

            .search-box i {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-secondary);
                z-index: 1;
            }

            .search-box input {
                width: 100%;
                padding: 12px 20px 12px 48px;
                border: 2px solid var(--border-color);
                border-radius: 12px;
                background: var(--surface-color);
                color: var(--text-primary);
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px var(--primary-light);
            }

            .filter-controls {
                display: flex;
                gap: 12px;
                align-items: center;
                flex-wrap: wrap;
            }

            .filter-select {
                padding: 10px 12px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
                font-size: 13px;
                min-width: 130px;
            }

            .view-options {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }

            .view-toggle {
                display: flex;
                gap: 4px;
            }

            .toggle-btn {
                width: 40px;
                height: 40px;
                border: 1px solid var(--border-color);
                background: var(--surface-color);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .toggle-btn:first-child {
                border-radius: 8px 0 0 8px;
            }

            .toggle-btn:last-child {
                border-radius: 0 8px 8px 0;
            }

            .toggle-btn:hover,
            .toggle-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            .bulk-actions {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px 16px;
                background: var(--primary-light);
                border: 1px solid var(--primary-color);
                border-radius: 8px;
            }

            .selected-count {
                font-weight: 600;
                color: var(--primary-color);
            }

            /* Featured Resources */
            .featured-section {
                margin-bottom: 48px;
            }

            .featured-section h2 {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 24px;
                color: var(--text-primary);
            }

            .featured-resources {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
            }

            .featured-resource {
                height: 200px;
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .featured-resource:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }

            .featured-thumbnail {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .featured-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .featured-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
                display: flex;
                align-items: flex-end;
                padding: 20px;
            }

            .featured-content {
                color: white;
            }

            .featured-content h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 8px;
            }

            .featured-content p {
                font-size: 13px;
                margin: 0 0 8px;
                opacity: 0.9;
            }

            .featured-stats {
                display: flex;
                gap: 16px;
                font-size: 12px;
            }

            .featured-stats span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            /* Resources Grid */
            .resources-section h2 {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 24px;
                color: var(--text-primary);
            }

            .resources-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .resources-grid.list-layout {
                grid-template-columns: 1fr;
            }

            .resource-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
            }

            .resource-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color);
            }

            .resource-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--surface-color);
            }

            .resource-type {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
            }

            .resource-type.pdf { background: var(--error-color); }
            .resource-type.doc { background: var(--info-color); }
            .resource-type.video { background: var(--warning-color); }
            .resource-type.audio { background: var(--success-color); }
            .resource-type.image { background: var(--purple-color); }
            .resource-type.link { background: var(--teal-color); }

            .featured-badge {
                position: absolute;
                top: 16px;
                right: 16px;
                background: var(--warning-color);
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                z-index: 2;
            }

            .resource-preview {
                position: relative;
                cursor: pointer;
            }

            .resource-thumbnail {
                width: 100%;
                height: 160px;
                position: relative;
                overflow: hidden;
            }

            .resource-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .resource-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                color: white;
                gap: 8px;
            }

            .resource-preview:hover .resource-overlay {
                opacity: 1;
            }

            .resource-info {
                padding: 20px;
            }

            .resource-category {
                font-size: 12px;
                color: var(--primary-color);
                background: var(--primary-light);
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-block;
                margin-bottom: 8px;
                font-weight: 500;
            }

            .resource-title {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .resource-description {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .resource-meta {
                margin-bottom: 12px;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 4px;
            }

            .meta-item i {
                width: 12px;
                opacity: 0.7;
            }

            .resource-rating {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            .star-rating {
                display: flex;
                gap: 2px;
                font-size: 12px;
            }

            .star-rating .fas {
                color: var(--warning-color);
            }

            .star-rating .far {
                color: var(--border-color);
            }

            .rating-count {
                font-size: 11px;
                color: var(--text-secondary);
            }

            .resource-actions {
                display: flex;
                justify-content: center;
                gap: 8px;
                padding: 16px;
                border-top: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .action-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 12px;
            }

            .download-btn {
                background: var(--success-light);
                color: var(--success-color);
            }

            .download-btn:hover {
                background: var(--success-color);
                color: white;
            }

            .bookmark-btn {
                background: var(--warning-light);
                color: var(--warning-color);
            }

            .bookmark-btn:hover {
                background: var(--warning-color);
                color: white;
            }

            .share-btn {
                background: var(--info-light);
                color: var(--info-color);
            }

            .share-btn:hover {
                background: var(--info-color);
                color: white;
            }

            .more-btn {
                background: var(--surface-hover);
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }

            .more-btn:hover {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            /* Categories */
            .categories-overview {
                max-width: 1200px;
            }

            .categories-header {
                text-align: center;
                margin-bottom: 48px;
            }

            .categories-header h2 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 12px;
                color: var(--text-primary);
            }

            .categories-header p {
                font-size: 16px;
                color: var(--text-secondary);
                margin: 0;
            }

            .categories-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 24px;
            }

            .category-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                padding: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .category-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color);
            }

            .category-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .category-icon {
                width: 56px;
                height: 56px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }

            .category-icon.red { background: var(--error-color); }
            .category-icon.blue { background: var(--info-color); }
            .category-icon.green { background: var(--success-color); }
            .category-icon.purple { background: var(--purple-color); }
            .category-icon.orange { background: var(--warning-color); }
            .category-icon.teal { background: var(--teal-color); }

            .category-stats {
                text-align: right;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .resource-count {
                display: block;
                font-size: 20px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 4px;
            }

            .category-content h3 {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .category-content p {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                line-height: 1.4;
            }

            .category-types {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .type-tag {
                font-size: 11px;
                padding: 4px 8px;
                background: var(--surface-color);
                color: var(--text-secondary);
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }

            .category-action {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: auto;
            }

            .view-all {
                font-size: 14px;
                color: var(--primary-color);
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Collections */
            .collections-container {
                max-width: 1200px;
            }

            .collections-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;
            }

            .collections-header .header-content h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .collections-header .header-content p {
                color: var(--text-secondary);
                margin: 0;
            }

            .collections-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 32px;
                border-bottom: 1px solid var(--border-color);
            }

            .collection-tab {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .collection-tab:hover {
                color: var(--text-primary);
            }

            .collection-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }

            .collection-tab-content {
                display: none;
            }

            .collection-tab-content.active {
                display: block;
            }

            .collections-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 24px;
            }

            .collection-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .collection-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
            }

            .collection-card.my-collection {
                border-color: var(--warning-color);
            }

            .collection-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--surface-color);
            }

            .collection-status {
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
            }

            .collection-status.active {
                background: var(--success-light);
                color: var(--success-color);
            }

            .collection-actions {
                display: flex;
                gap: 4px;
            }

            .collection-thumbnail {
                height: 120px;
                position: relative;
                background: var(--surface-color);
            }

            .collection-preview {
                display: grid;
                grid-template-columns: 1fr 1fr;
                height: 100%;
                gap: 1px;
                padding: 8px;
            }

            .collection-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
            }

            .collection-count {
                position: absolute;
                bottom: 8px;
                right: 8px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 12px;
                font-weight: 500;
            }

            .collection-info {
                padding: 20px;
            }

            .collection-info h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .collection-info p {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .collection-meta {
                margin-bottom: 12px;
                font-size: 12px;
                color: var(--text-secondary);
            }

            .collection-meta .author {
                font-weight: 500;
            }

            .collection-stats {
                display: flex;
                gap: 16px;
                font-size: 12px;
                color: var(--text-secondary);
            }

            .collection-stats span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            /* Library */
            .library-container {
                max-width: 1000px;
            }

            .library-header {
                margin-bottom: 32px;
            }

            .library-header h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .library-header p {
                color: var(--text-secondary);
                margin: 0;
            }

            .library-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                margin-bottom: 32px;
            }

            .library-stat {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }

            .library-stat i {
                font-size: 20px;
                color: var(--primary-color);
            }

            .library-stat h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                color: var(--text-primary);
            }

            .library-stat p {
                font-size: 12px;
                color: var(--text-secondary);
                margin: 0;
            }

            .library-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
                border-bottom: 1px solid var(--border-color);
            }

            .library-tab {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .library-tab:hover {
                color: var(--text-primary);
            }

            .library-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }

            .library-tab-content {
                display: none;
            }

            .library-tab-content.active {
                display: block;
            }

            .library-resource-item {
                display: flex;
                gap: 16px;
                padding: 16px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .library-resource-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                border-color: var(--primary-color);
            }

            .resource-thumbnail-small {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                flex-shrink: 0;
            }

            .resource-thumbnail-small img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .resource-type-badge {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 16px;
                height: 16px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: white;
            }

            .resource-details {
                flex: 1;
            }

            .resource-details h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .resource-details .resource-category {
                font-size: 12px;
                color: var(--primary-color);
                margin: 0 0 4px;
            }

            .resource-details .resource-author {
                font-size: 12px;
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .resource-stats {
                display: flex;
                gap: 12px;
                font-size: 11px;
                color: var(--text-secondary);
            }

            .resource-quick-actions {
                display: flex;
                gap: 8px;
                align-items: flex-start;
            }

            .quick-action-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 11px;
                background: var(--surface-hover);
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }

            .quick-action-btn:hover {
                background: var(--primary-light);
                color: var(--primary-color);
                border-color: var(--primary-color);
            }

            .quick-action-btn.remove:hover {
                background: var(--error-light);
                color: var(--error-color);
                border-color: var(--error-color);
            }

            .empty-library {
                text-align: center;
                padding: 48px 24px;
            }

            .empty-library .empty-icon {
                font-size: 48px;
                color: var(--text-secondary);
                margin-bottom: 16px;
            }

            .empty-library h3 {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .empty-library p {
                color: var(--text-secondary);
                margin: 0;
            }

            /* Uploads */
            .uploads-container {
                max-width: 1200px;
            }

            .uploads-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;
            }

            .uploads-header .header-content h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .uploads-header .header-content p {
                color: var(--text-secondary);
                margin: 0;
            }

            .upload-stats {
                display: flex;
                gap: 24px;
                text-align: center;
            }

            .upload-stat h4 {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .upload-stat p {
                font-size: 12px;
                color: var(--text-secondary);
                margin: 0;
            }

            .uploads-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 32px;
                border-bottom: 1px solid var(--border-color);
            }

            .upload-tab {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .upload-tab:hover {
                color: var(--text-primary);
            }

            .upload-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }

            .upload-tab-content {
                display: none;
            }

            .upload-tab-content.active {
                display: block;
            }

            .uploads-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
            }

            .upload-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .upload-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .upload-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--surface-color);
            }

            .upload-status {
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
            }

            .upload-status.published {
                background: var(--success-light);
                color: var(--success-color);
            }

            .upload-status.pending {
                background: var(--warning-light);
                color: var(--warning-color);
            }

            .upload-status.draft {
                background: var(--info-light);
                color: var(--info-color);
            }

            .upload-actions {
                display: flex;
                gap: 4px;
            }

            .upload-actions .action-btn.delete {
                background: var(--error-light);
                color: var(--error-color);
            }

            .upload-actions .action-btn.delete:hover {
                background: var(--error-color);
                color: white;
            }

            .upload-thumbnail {
                height: 120px;
                position: relative;
                background: var(--surface-color);
            }

            .upload-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .resource-type-overlay {
                position: absolute;
                top: 8px;
                left: 8px;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: white;
            }

            .upload-info {
                padding: 16px;
            }

            .upload-info h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .upload-category {
                font-size: 12px;
                color: var(--primary-color);
                margin: 0 0 8px;
            }

            .upload-stats {
                display: flex;
                gap: 12px;
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }

            .upload-stats span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .upload-date {
                font-size: 11px;
                color: var(--text-secondary);
            }

            .empty-uploads {
                text-align: center;
                padding: 48px 24px;
            }

            .empty-uploads .empty-icon {
                font-size: 48px;
                color: var(--text-secondary);
                margin-bottom: 16px;
            }

            .empty-uploads h3 {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .empty-uploads p {
                color: var(--text-secondary);
                margin: 0;
            }

            /* Modals */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .modal-container {
                background: var(--surface-color);
                border-radius: 16px;
                width: 100%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .modal-container.large {
                max-width: 800px;
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px;
                border-bottom: 1px solid var(--border-color);
            }

            .modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .modal-close {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: var(--text-secondary);
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .modal-close:hover {
                background: var(--surface-hover);
            }

            .modal-body {
                padding: 24px;
            }

            .modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                padding: 24px;
                border-top: 1px solid var(--border-color);
            }

            /* Upload Form */
            .upload-form {
                max-width: none;
            }

            .form-section {
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 1px solid var(--border-color);
            }

            .form-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .form-section h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 20px;
                color: var(--text-primary);
            }

            .file-upload-area {
                border: 2px dashed var(--border-color);
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .file-upload-area:hover,
            .file-upload-area.dragover {
                border-color: var(--primary-color);
                background: var(--primary-light);
            }

            .upload-placeholder i {
                font-size: 48px;
                color: var(--primary-color);
                margin-bottom: 16px;
            }

            .upload-placeholder h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .upload-placeholder p {
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .file-types {
                font-size: 12px;
                color: var(--text-secondary);
                opacity: 0.7;
            }

            .file-selected {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: var(--surface-hover);
                border-radius: 8px;
            }

            .file-selected i {
                font-size: 32px;
                color: var(--primary-color);
            }

            .file-info h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .file-info p {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .form-group {
                margin-bottom: 16px;
            }

            .form-group label {
                display: block;
                font-weight: 500;
                margin-bottom: 8px;
                color: var(--text-primary);
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px var(--primary-light);
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                margin-bottom: 12px;
            }

            .checkbox-label input[type="checkbox"] {
                width: auto;
                margin: 0;
            }

            /* Resource Detail Modal */
            .resource-detail {
                max-width: none;
            }

            .resource-detail-header {
                display: flex;
                gap: 20px;
                margin-bottom: 24px;
            }

            .resource-detail-thumbnail {
                width: 120px;
                height: 120px;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
                flex-shrink: 0;
            }

            .resource-detail-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .resource-type-indicator {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: white;
            }

            .resource-detail-info {
                flex: 1;
            }

            .resource-category-badge {
                font-size: 12px;
                color: var(--primary-color);
                background: var(--primary-light);
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-block;
                margin-bottom: 8px;
                font-weight: 500;
            }

            .resource-detail-info h2 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .resource-detail-info .resource-author {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
            }

            .resource-rating-detail {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }

            .rating-text {
                font-size: 14px;
                color: var(--text-secondary);
            }

            .resource-stats-detail {
                display: flex;
                gap: 20px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .resource-stats-detail span {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .resource-description-detail h4,
            .resource-tags-detail h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 12px;
                color: var(--text-primary);
            }

            .resource-description-detail p {
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.6;
                margin: 0;
            }

            .tags-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .tag {
                font-size: 12px;
                padding: 4px 8px;
                background: var(--surface-hover);
                color: var(--text-secondary);
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }

            .resource-actions-detail {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 24px;
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .resources-header {
                    flex-direction: column;
                    gap: 24px;
                }

                .browse-controls {
                    flex-direction: column;
                    gap: 16px;
                }

                .search-section {
                    flex-direction: column;
                    align-items: stretch;
                }

                .filter-controls {
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .view-options {
                    flex-direction: column;
                    gap: 12px;
                }

                .stats-overview {
                    grid-template-columns: repeat(2, 1fr);
                }

                .resources-grid,
                .featured-resources,
                .categories-grid,
                .collections-grid {
                    grid-template-columns: 1fr;
                }

                .library-stats {
                    grid-template-columns: repeat(2, 1fr);
                }

                .form-row {
                    grid-template-columns: 1fr;
                }

                .resource-detail-header {
                    flex-direction: column;
                    gap: 16px;
                }

                .resource-actions-detail {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in main dashboard
window.ResourcesManager = ResourcesManager;
