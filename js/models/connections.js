/**
 * AFZ Member Hub - Connections/Networking Module
 * Comprehensive networking system with connections, friend requests, and community building features
 */

class ConnectionsManager {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            avatar: 'assets/avatars/john-doe.jpg'
        };
        
        this.connections = this.generateMockConnections();
        this.pendingRequests = this.generatePendingRequests();
        this.suggestedConnections = this.generateSuggestedConnections();
        this.networkStats = this.generateNetworkStats();
        this.groups = this.generateGroups();
        
        this.currentView = 'my-network';
        this.selectedConnections = new Set();
        this.searchQuery = '';
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.setupConnectionsInterface();
        this.setupEventListeners();
        this.loadInitialData();
        this.startNetworkUpdates();
    }

    setupConnectionsInterface() {
        const connectionsContainer = document.getElementById('section-connections');
        if (!connectionsContainer) return;

        connectionsContainer.innerHTML = `
            <div class="connections-interface">
                <!-- Connections Header -->
                <div class="connections-header">
                    <div class="header-content">
                        <h1>My Network</h1>
                        <p>Build meaningful connections within the AFZ community</p>
                    </div>
                    <div class="header-stats">
                        <div class="stat-item">
                            <span class="stat-number">${this.connections.length}</span>
                            <span class="stat-label">Connections</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.pendingRequests.length}</span>
                            <span class="stat-label">Pending</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.networkStats.profileViews}</span>
                            <span class="stat-label">Profile Views</span>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="connections-nav">
                    <button class="nav-tab active" data-view="my-network">
                        <i class="fas fa-users"></i>
                        My Network
                    </button>
                    <button class="nav-tab" data-view="discover">
                        <i class="fas fa-user-plus"></i>
                        Discover People
                    </button>
                    <button class="nav-tab" data-view="requests">
                        <i class="fas fa-user-clock"></i>
                        Requests
                        ${this.pendingRequests.length > 0 ? `<span class="badge">${this.pendingRequests.length}</span>` : ''}
                    </button>
                    <button class="nav-tab" data-view="groups">
                        <i class="fas fa-layer-group"></i>
                        Groups
                    </button>
                    <button class="nav-tab" data-view="analytics">
                        <i class="fas fa-chart-network"></i>
                        Network Analytics
                    </button>
                </div>

                <!-- Content Area -->
                <div class="connections-content">
                    <!-- My Network View -->
                    <div class="content-view active" id="view-my-network">
                        ${this.renderMyNetworkView()}
                    </div>

                    <!-- Discover People View -->
                    <div class="content-view" id="view-discover">
                        ${this.renderDiscoverView()}
                    </div>

                    <!-- Requests View -->
                    <div class="content-view" id="view-requests">
                        ${this.renderRequestsView()}
                    </div>

                    <!-- Groups View -->
                    <div class="content-view" id="view-groups">
                        ${this.renderGroupsView()}
                    </div>

                    <!-- Analytics View -->
                    <div class="content-view" id="view-analytics">
                        ${this.renderAnalyticsView()}
                    </div>
                </div>

                <!-- Connection Profile Modal -->
                ${this.renderConnectionModal()}

                <!-- Group Modal -->
                ${this.renderGroupModal()}
            </div>
        `;

        this.injectConnectionsStyles();
    }

    renderMyNetworkView() {
        return `
            <div class="network-controls">
                <div class="search-section">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="network-search" placeholder="Search your connections...">
                    </div>
                    <div class="filter-controls">
                        <select id="connection-filter" class="filter-select">
                            <option value="all">All Connections</option>
                            <option value="recent">Recently Added</option>
                            <option value="active">Most Active</option>
                            <option value="location">Same Location</option>
                        </select>
                        <button class="btn btn-secondary" id="export-connections">
                            <i class="fas fa-download"></i>
                            Export
                        </button>
                    </div>
                </div>

                <div class="bulk-actions" id="bulk-actions" style="display: none;">
                    <div class="selected-count">
                        <span id="selected-count">0</span> connections selected
                    </div>
                    <div class="bulk-buttons">
                        <button class="btn btn-secondary" id="bulk-message">
                            <i class="fas fa-envelope"></i>
                            Send Message
                        </button>
                        <button class="btn btn-secondary" id="bulk-group">
                            <i class="fas fa-layer-group"></i>
                            Create Group
                        </button>
                        <button class="btn btn-warning" id="bulk-remove">
                            <i class="fas fa-user-minus"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <div class="connections-grid" id="connections-grid">
                ${this.renderConnectionsGrid(this.connections)}
            </div>

            <div class="load-more-container" id="load-more-container">
                <button class="btn btn-secondary" id="load-more-connections">
                    Load More Connections
                </button>
            </div>
        `;
    }

    renderDiscoverView() {
        return `
            <div class="discover-header">
                <h2>Discover New Connections</h2>
                <p>Find and connect with other members of the AFZ community</p>
            </div>

            <div class="discover-sections">
                <!-- Suggested Connections -->
                <div class="discover-section">
                    <div class="section-header">
                        <h3>Suggested for You</h3>
                        <button class="btn btn-sm btn-secondary" id="refresh-suggestions">
                            <i class="fas fa-sync"></i>
                            Refresh
                        </button>
                    </div>
                    <div class="suggestions-grid">
                        ${this.renderSuggestionsGrid()}
                    </div>
                </div>

                <!-- Browse by Location -->
                <div class="discover-section">
                    <div class="section-header">
                        <h3>Browse by Location</h3>
                        <select id="location-filter" class="filter-select">
                            <option value="">All Locations</option>
                            <option value="lusaka">Lusaka</option>
                            <option value="kitwe">Kitwe</option>
                            <option value="ndola">Ndola</option>
                            <option value="livingstone">Livingstone</option>
                        </select>
                    </div>
                    <div class="location-results" id="location-results">
                        ${this.renderLocationResults()}
                    </div>
                </div>

                <!-- Browse by Interests -->
                <div class="discover-section">
                    <div class="section-header">
                        <h3>Browse by Interests</h3>
                        <div class="interest-tags">
                            <button class="interest-tag" data-interest="healthcare">Healthcare</button>
                            <button class="interest-tag" data-interest="advocacy">Advocacy</button>
                            <button class="interest-tag" data-interest="education">Education</button>
                            <button class="interest-tag" data-interest="support">Support Groups</button>
                            <button class="interest-tag" data-interest="youth">Youth Programs</button>
                        </div>
                    </div>
                    <div class="interest-results" id="interest-results">
                        <!-- Results will be populated based on selected interest -->
                    </div>
                </div>
            </div>
        `;
    }

    renderRequestsView() {
        return `
            <div class="requests-container">
                <!-- Pending Incoming Requests -->
                <div class="requests-section">
                    <div class="section-header">
                        <h3>Connection Requests</h3>
                        <span class="count-badge">${this.pendingRequests.filter(r => r.type === 'incoming').length}</span>
                    </div>
                    <div class="requests-list">
                        ${this.renderIncomingRequests()}
                    </div>
                </div>

                <!-- Sent Requests -->
                <div class="requests-section">
                    <div class="section-header">
                        <h3>Sent Requests</h3>
                        <span class="count-badge">${this.pendingRequests.filter(r => r.type === 'outgoing').length}</span>
                    </div>
                    <div class="requests-list">
                        ${this.renderOutgoingRequests()}
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="requests-section">
                    <div class="section-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div class="activity-timeline">
                        ${this.renderConnectionActivity()}
                    </div>
                </div>
            </div>
        `;
    }

    renderGroupsView() {
        return `
            <div class="groups-header">
                <div class="header-content">
                    <h2>Interest Groups</h2>
                    <p>Join groups based on shared interests and experiences</p>
                </div>
                <button class="btn btn-primary" id="create-group-btn">
                    <i class="fas fa-plus"></i>
                    Create Group
                </button>
            </div>

            <div class="groups-tabs">
                <button class="group-tab active" data-tab="my-groups">My Groups</button>
                <button class="group-tab" data-tab="discover-groups">Discover Groups</button>
                <button class="group-tab" data-tab="recommended">Recommended</button>
            </div>

            <div class="groups-content">
                <div class="group-tab-content active" id="my-groups">
                    <div class="groups-grid">
                        ${this.renderMyGroups()}
                    </div>
                </div>

                <div class="group-tab-content" id="discover-groups">
                    <div class="group-categories">
                        <div class="category-filters">
                            <button class="category-btn active" data-category="all">All Categories</button>
                            <button class="category-btn" data-category="healthcare">Healthcare</button>
                            <button class="category-btn" data-category="advocacy">Advocacy</button>
                            <button class="category-btn" data-category="support">Support</button>
                            <button class="category-btn" data-category="youth">Youth</button>
                        </div>
                        <div class="groups-grid" id="discover-groups-grid">
                            ${this.renderAllGroups()}
                        </div>
                    </div>
                </div>

                <div class="group-tab-content" id="recommended">
                    <div class="groups-grid">
                        ${this.renderRecommendedGroups()}
                    </div>
                </div>
            </div>
        `;
    }

    renderAnalyticsView() {
        return `
            <div class="analytics-dashboard">
                <!-- Network Overview -->
                <div class="analytics-overview">
                    <div class="overview-stats">
                        <div class="overview-card">
                            <div class="card-icon network-growth">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="card-content">
                                <h3>${this.networkStats.growthRate}%</h3>
                                <p>Network Growth</p>
                                <span class="trend positive">+${this.networkStats.newConnections} this month</span>
                            </div>
                        </div>

                        <div class="overview-card">
                            <div class="card-icon engagement">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div class="card-content">
                                <h3>${this.networkStats.engagementRate}%</h3>
                                <p>Engagement Rate</p>
                                <span class="trend positive">+${this.networkStats.engagementIncrease}% vs last month</span>
                            </div>
                        </div>

                        <div class="overview-card">
                            <div class="card-icon connections">
                                <i class="fas fa-network-wired"></i>
                            </div>
                            <div class="card-content">
                                <h3>${this.networkStats.mutualConnections}</h3>
                                <p>Mutual Connections</p>
                                <span class="trend neutral">Average network size</span>
                            </div>
                        </div>

                        <div class="overview-card">
                            <div class="card-icon influence">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="card-content">
                                <h3>${this.networkStats.influenceScore}/100</h3>
                                <p>Network Influence</p>
                                <span class="trend positive">Top 15% of members</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Visualization -->
                <div class="network-visualization">
                    <div class="viz-header">
                        <h3>Network Map</h3>
                        <div class="viz-controls">
                            <button class="btn btn-sm btn-secondary" id="center-network">
                                <i class="fas fa-crosshairs"></i>
                                Center
                            </button>
                            <button class="btn btn-sm btn-secondary" id="export-network">
                                <i class="fas fa-download"></i>
                                Export
                            </button>
                        </div>
                    </div>
                    <div class="network-canvas" id="network-canvas">
                        <!-- Network visualization will be rendered here -->
                        <div class="network-placeholder">
                            <div class="placeholder-content">
                                <i class="fas fa-project-diagram"></i>
                                <p>Interactive network visualization</p>
                                <small>Shows connections and relationship strength</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Charts -->
                <div class="activity-charts">
                    <div class="chart-container">
                        <h3>Connection Growth Over Time</h3>
                        <canvas id="growth-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>Interaction Frequency</h3>
                        <canvas id="interaction-chart"></canvas>
                    </div>
                </div>

                <!-- Network Insights -->
                <div class="network-insights">
                    <h3>Network Insights</h3>
                    <div class="insights-grid">
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div class="insight-content">
                                <h4>Strong Healthcare Network</h4>
                                <p>You have 73% more healthcare connections than average, making you a key connector in this space.</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="insight-content">
                                <h4>Geographic Diversity</h4>
                                <p>Your network spans 8 different cities, providing diverse perspectives and opportunities.</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">
                                <i class="fas fa-users-cog"></i>
                            </div>
                            <div class="insight-content">
                                <h4>Bridge Builder</h4>
                                <p>You connect different groups within the community, increasing overall network cohesion.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderConnectionsGrid(connections) {
        return connections.map(connection => `
            <div class="connection-card" data-connection-id="${connection.id}">
                <div class="card-header">
                    <input type="checkbox" class="connection-checkbox" value="${connection.id}">
                    <div class="connection-status ${connection.status}"></div>
                </div>
                <div class="connection-avatar">
                    <img src="${connection.avatar}" alt="${connection.name}">
                    <div class="online-indicator ${connection.online ? 'online' : 'offline'}"></div>
                </div>
                <div class="connection-info">
                    <h4 class="connection-name">${connection.name}</h4>
                    <p class="connection-title">${connection.title}</p>
                    <p class="connection-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${connection.location}
                    </p>
                    <div class="connection-tags">
                        ${connection.interests.slice(0, 2).map(interest => 
                            `<span class="interest-tag">${interest}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="connection-stats">
                    <div class="stat">
                        <span class="stat-value">${connection.mutualConnections}</span>
                        <span class="stat-label">Mutual</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${connection.interactionScore}</span>
                        <span class="stat-label">Score</span>
                    </div>
                </div>
                <div class="connection-actions">
                    <button class="action-btn message-btn" onclick="connectionsManager.messageConnection('${connection.id}')" title="Send Message">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="action-btn profile-btn" onclick="connectionsManager.viewProfile('${connection.id}')" title="View Profile">
                        <i class="fas fa-user"></i>
                    </button>
                    <button class="action-btn more-btn" onclick="connectionsManager.showConnectionOptions('${connection.id}')" title="More Options">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderSuggestionsGrid() {
        return this.suggestedConnections.map(suggestion => `
            <div class="suggestion-card">
                <div class="suggestion-avatar">
                    <img src="${suggestion.avatar}" alt="${suggestion.name}">
                </div>
                <div class="suggestion-info">
                    <h4 class="suggestion-name">${suggestion.name}</h4>
                    <p class="suggestion-title">${suggestion.title}</p>
                    <p class="suggestion-reason">${suggestion.reason}</p>
                    <div class="mutual-connections">
                        <i class="fas fa-users"></i>
                        ${suggestion.mutualConnections} mutual connections
                    </div>
                </div>
                <div class="suggestion-actions">
                    <button class="btn btn-primary btn-sm" onclick="connectionsManager.sendConnectionRequest('${suggestion.id}')">
                        <i class="fas fa-user-plus"></i>
                        Connect
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="connectionsManager.dismissSuggestion('${suggestion.id}')">
                        <i class="fas fa-times"></i>
                        Dismiss
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderIncomingRequests() {
        const incomingRequests = this.pendingRequests.filter(r => r.type === 'incoming');
        return incomingRequests.map(request => `
            <div class="request-item" data-request-id="${request.id}">
                <div class="request-avatar">
                    <img src="${request.avatar}" alt="${request.name}">
                </div>
                <div class="request-info">
                    <h4 class="request-name">${request.name}</h4>
                    <p class="request-title">${request.title}</p>
                    <p class="request-message">"${request.message}"</p>
                    <div class="request-meta">
                        <span class="request-time">${this.formatTimeAgo(request.date)}</span>
                        <span class="mutual-count">${request.mutualConnections} mutual connections</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn btn-primary btn-sm" onclick="connectionsManager.acceptRequest('${request.id}')">
                        <i class="fas fa-check"></i>
                        Accept
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="connectionsManager.declineRequest('${request.id}')">
                        <i class="fas fa-times"></i>
                        Decline
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderOutgoingRequests() {
        const outgoingRequests = this.pendingRequests.filter(r => r.type === 'outgoing');
        return outgoingRequests.map(request => `
            <div class="request-item outgoing" data-request-id="${request.id}">
                <div class="request-avatar">
                    <img src="${request.avatar}" alt="${request.name}">
                </div>
                <div class="request-info">
                    <h4 class="request-name">${request.name}</h4>
                    <p class="request-title">${request.title}</p>
                    <div class="request-status">
                        <i class="fas fa-clock"></i>
                        Request sent ${this.formatTimeAgo(request.date)}
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn btn-secondary btn-sm" onclick="connectionsManager.cancelRequest('${request.id}')">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderConnectionActivity() {
        const activities = [
            { type: 'accepted', name: 'Sarah Williams', time: '2 hours ago', action: 'accepted your connection request' },
            { type: 'connected', name: 'Michael Johnson', time: '1 day ago', action: 'connected with you' },
            { type: 'viewed', name: 'Emma Davis', time: '2 days ago', action: 'viewed your profile' },
            { type: 'requested', name: 'James Wilson', time: '3 days ago', action: 'sent you a connection request' }
        ];

        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.name}</strong> ${activity.action}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderMyGroups() {
        const myGroups = this.groups.filter(g => g.isMember);
        return myGroups.map(group => `
            <div class="group-card my-group">
                <div class="group-header">
                    <div class="group-avatar">
                        <img src="${group.avatar}" alt="${group.name}">
                    </div>
                    <div class="group-badge ${group.privacy}">${group.privacy}</div>
                </div>
                <div class="group-content">
                    <h4 class="group-name">${group.name}</h4>
                    <p class="group-description">${group.description}</p>
                    <div class="group-stats">
                        <span><i class="fas fa-users"></i> ${group.memberCount} members</span>
                        <span><i class="fas fa-comments"></i> ${group.activity} active</span>
                    </div>
                </div>
                <div class="group-actions">
                    <button class="btn btn-primary btn-sm" onclick="connectionsManager.viewGroup('${group.id}')">
                        View Group
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAllGroups() {
        const publicGroups = this.groups.filter(g => !g.isMember);
        return publicGroups.map(group => `
            <div class="group-card">
                <div class="group-header">
                    <div class="group-avatar">
                        <img src="${group.avatar}" alt="${group.name}">
                    </div>
                    <div class="group-badge ${group.privacy}">${group.privacy}</div>
                </div>
                <div class="group-content">
                    <h4 class="group-name">${group.name}</h4>
                    <p class="group-description">${group.description}</p>
                    <div class="group-stats">
                        <span><i class="fas fa-users"></i> ${group.memberCount} members</span>
                        <span><i class="fas fa-chart-line"></i> ${group.growth}% growth</span>
                    </div>
                </div>
                <div class="group-actions">
                    <button class="btn btn-primary btn-sm" onclick="connectionsManager.joinGroup('${group.id}')">
                        <i class="fas fa-plus"></i>
                        Join Group
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRecommendedGroups() {
        const recommended = this.groups.slice(0, 3);
        return recommended.map(group => `
            <div class="group-card recommended">
                <div class="recommendation-badge">
                    <i class="fas fa-star"></i>
                    Recommended
                </div>
                <div class="group-header">
                    <div class="group-avatar">
                        <img src="${group.avatar}" alt="${group.name}">
                    </div>
                </div>
                <div class="group-content">
                    <h4 class="group-name">${group.name}</h4>
                    <p class="group-description">${group.description}</p>
                    <div class="recommendation-reason">
                        <i class="fas fa-lightbulb"></i>
                        Based on your interests in ${group.matchReason}
                    </div>
                </div>
                <div class="group-actions">
                    <button class="btn btn-primary btn-sm" onclick="connectionsManager.joinGroup('${group.id}')">
                        Join Group
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderLocationResults() {
        // Mock results for location browsing
        return `
            <div class="location-grid">
                <div class="location-item">
                    <h4>Lusaka Members</h4>
                    <p>156 members in your area</p>
                    <button class="btn btn-sm btn-secondary">Browse</button>
                </div>
                <div class="location-item">
                    <h4>Kitwe Members</h4>
                    <p>89 members in this area</p>
                    <button class="btn btn-sm btn-secondary">Browse</button>
                </div>
            </div>
        `;
    }

    renderConnectionModal() {
        return `
            <div class="modal-overlay" id="connection-modal" style="display: none;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 id="connection-modal-title">Connection Profile</h3>
                        <button class="modal-close" onclick="connectionsManager.closeModal('connection-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="connection-modal-body">
                        <!-- Content will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    }

    renderGroupModal() {
        return `
            <div class="modal-overlay" id="group-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>Create New Group</h3>
                        <button class="modal-close" onclick="connectionsManager.closeModal('group-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="create-group-form">
                            <div class="form-group">
                                <label for="group-name">Group Name *</label>
                                <input type="text" id="group-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="group-description">Description *</label>
                                <textarea id="group-description" name="description" rows="4" required></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="group-category">Category</label>
                                    <select id="group-category" name="category">
                                        <option value="healthcare">Healthcare</option>
                                        <option value="advocacy">Advocacy</option>
                                        <option value="support">Support</option>
                                        <option value="youth">Youth</option>
                                        <option value="education">Education</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="group-privacy">Privacy</label>
                                    <select id="group-privacy" name="privacy">
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="connectionsManager.closeModal('group-modal')">Cancel</button>
                        <button class="btn btn-primary" onclick="connectionsManager.createGroup()">Create Group</button>
                    </div>
                </div>
            </div>
        `;
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

        // Search functionality
        const networkSearch = document.getElementById('network-search');
        if (networkSearch) {
            networkSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter controls
        const connectionFilter = document.getElementById('connection-filter');
        if (connectionFilter) {
            connectionFilter.addEventListener('change', (e) => {
                this.filterConnections(e.target.value);
            });
        }

        // Bulk selection
        const selectAllConnections = document.querySelectorAll('.connection-checkbox');
        selectAllConnections.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleConnectionSelection(e.target);
            });
        });

        // Group tabs
        const groupTabs = document.querySelectorAll('.group-tab');
        groupTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchGroupTab(e.target.getAttribute('data-tab'));
            });
        });

        // Create group button
        const createGroupBtn = document.getElementById('create-group-btn');
        if (createGroupBtn) {
            createGroupBtn.addEventListener('click', () => {
                this.showModal('group-modal');
            });
        }

        // Interest tags
        const interestTags = document.querySelectorAll('.interest-tag');
        interestTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.filterByInterest(e.target.getAttribute('data-interest'));
            });
        });

        // Category filters for groups
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterGroupsByCategory(e.target.getAttribute('data-category'));
            });
        });
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

    switchGroupTab(tabName) {
        // Update active tab
        document.querySelectorAll('.group-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        // Update active content
        document.querySelectorAll('.group-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'discover':
                this.refreshSuggestions();
                break;
            case 'requests':
                this.refreshRequests();
                break;
            case 'analytics':
                this.loadNetworkAnalytics();
                break;
        }
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.filterAndDisplayConnections();
    }

    filterConnections(filter) {
        this.currentFilter = filter;
        this.filterAndDisplayConnections();
    }

    filterAndDisplayConnections() {
        let filtered = this.connections;

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(connection =>
                connection.name.toLowerCase().includes(this.searchQuery) ||
                connection.title.toLowerCase().includes(this.searchQuery) ||
                connection.location.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply category filter
        if (this.currentFilter !== 'all') {
            switch (this.currentFilter) {
                case 'recent':
                    filtered = filtered.sort((a, b) => new Date(b.connectedDate) - new Date(a.connectedDate));
                    break;
                case 'active':
                    filtered = filtered.filter(c => c.online).sort((a, b) => b.interactionScore - a.interactionScore);
                    break;
                case 'location':
                    filtered = filtered.filter(c => c.location === this.currentUser.location);
                    break;
            }
        }

        this.updateConnectionsDisplay(filtered);
    }

    updateConnectionsDisplay(connections) {
        const grid = document.getElementById('connections-grid');
        if (grid) {
            grid.innerHTML = this.renderConnectionsGrid(connections);
        }
    }

    handleConnectionSelection(checkbox) {
        if (checkbox.checked) {
            this.selectedConnections.add(checkbox.value);
        } else {
            this.selectedConnections.delete(checkbox.value);
        }

        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (this.selectedConnections.size > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = this.selectedConnections.size;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    // Connection actions
    sendConnectionRequest(userId) {
        // Simulate sending a connection request
        this.showNotification('Connection request sent!', 'success');
        
        // Remove from suggestions
        this.suggestedConnections = this.suggestedConnections.filter(s => s.id !== userId);
        this.refreshSuggestions();
    }

    acceptRequest(requestId) {
        const request = this.pendingRequests.find(r => r.id === requestId);
        if (request) {
            // Move to connections
            this.connections.unshift({
                id: request.id,
                name: request.name,
                title: request.title,
                avatar: request.avatar,
                location: request.location || 'Unknown',
                interests: request.interests || [],
                mutualConnections: request.mutualConnections,
                interactionScore: 0,
                online: Math.random() > 0.5,
                status: 'new',
                connectedDate: new Date().toISOString()
            });

            // Remove from pending
            this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
            
            this.showNotification(`You are now connected with ${request.name}!`, 'success');
            this.refreshRequests();
        }
    }

    declineRequest(requestId) {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
        this.showNotification('Connection request declined', 'info');
        this.refreshRequests();
    }

    cancelRequest(requestId) {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
        this.showNotification('Connection request cancelled', 'info');
        this.refreshRequests();
    }

    messageConnection(connectionId) {
        const connection = this.connections.find(c => c.id === connectionId);
        if (connection) {
            this.showNotification(`Opening chat with ${connection.name}...`, 'info');
            // In a real app, this would open the chat interface
        }
    }

    viewProfile(connectionId) {
        const connection = this.connections.find(c => c.id === connectionId);
        if (connection) {
            this.showConnectionProfile(connection);
        }
    }

    showConnectionProfile(connection) {
        const modalBody = document.getElementById('connection-modal-body');
        modalBody.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="${connection.avatar}" alt="${connection.name}">
                        <div class="online-indicator ${connection.online ? 'online' : 'offline'}"></div>
                    </div>
                    <div class="profile-info">
                        <h3>${connection.name}</h3>
                        <p class="profile-title">${connection.title}</p>
                        <p class="profile-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${connection.location}
                        </p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number">${connection.mutualConnections}</span>
                        <span class="stat-label">Mutual Connections</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${connection.interactionScore}</span>
                        <span class="stat-label">Interaction Score</span>
                    </div>
                </div>
                <div class="profile-interests">
                    <h4>Interests</h4>
                    <div class="interests-list">
                        ${connection.interests.map(interest => 
                            `<span class="interest-tag">${interest}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="connectionsManager.messageConnection('${connection.id}')">
                        <i class="fas fa-comment"></i>
                        Send Message
                    </button>
                    <button class="btn btn-secondary" onclick="connectionsManager.removeConnection('${connection.id}')">
                        <i class="fas fa-user-minus"></i>
                        Remove Connection
                    </button>
                </div>
            </div>
        `;
        this.showModal('connection-modal');
    }

    joinGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (group) {
            group.isMember = true;
            group.memberCount++;
            this.showNotification(`You joined ${group.name}!`, 'success');
            this.refreshGroups();
        }
    }

    createGroup() {
        const form = document.getElementById('create-group-form');
        const formData = new FormData(form);
        
        const newGroup = {
            id: `group_${Date.now()}`,
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            privacy: formData.get('privacy'),
            avatar: 'assets/groups/default.png',
            memberCount: 1,
            isMember: true,
            activity: 'new',
            growth: 0
        };

        this.groups.unshift(newGroup);
        this.closeModal('group-modal');
        this.showNotification(`Group "${newGroup.name}" created successfully!`, 'success');
        this.refreshGroups();
    }

    filterByInterest(interest) {
        // Update interest tag states
        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        document.querySelector(`[data-interest="${interest}"]`).classList.add('active');

        // Filter and display results
        const filtered = this.suggestedConnections.filter(s => 
            s.interests && s.interests.includes(interest)
        );

        const resultsContainer = document.getElementById('interest-results');
        resultsContainer.innerHTML = this.renderSuggestionsGrid(filtered);
    }

    filterGroupsByCategory(category) {
        // Update category button states
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter groups
        let filtered = this.groups.filter(g => !g.isMember);
        if (category !== 'all') {
            filtered = filtered.filter(g => g.category === category);
        }

        const grid = document.getElementById('discover-groups-grid');
        grid.innerHTML = this.renderAllGroups(filtered);
    }

    refreshSuggestions() {
        const grid = document.querySelector('.suggestions-grid');
        if (grid) {
            grid.innerHTML = this.renderSuggestionsGrid();
        }
    }

    refreshRequests() {
        const incomingContainer = document.querySelector('.requests-list');
        if (incomingContainer) {
            incomingContainer.innerHTML = this.renderIncomingRequests();
        }
    }

    refreshGroups() {
        const myGroupsGrid = document.querySelector('#my-groups .groups-grid');
        const discoverGroupsGrid = document.getElementById('discover-groups-grid');
        
        if (myGroupsGrid) {
            myGroupsGrid.innerHTML = this.renderMyGroups();
        }
        if (discoverGroupsGrid) {
            discoverGroupsGrid.innerHTML = this.renderAllGroups();
        }
    }

    loadNetworkAnalytics() {
        // In a real app, this would load analytics charts
        console.log('Loading network analytics...');
    }

    startNetworkUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000);
    }

    updateOnlineStatus() {
        // Randomly update online status of connections
        this.connections.forEach(connection => {
            if (Math.random() > 0.95) {
                connection.online = !connection.online;
            }
        });
    }

    // Modal management
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

    // Utility functions
    loadInitialData() {
        this.filterAndDisplayConnections();
    }

    getActivityIcon(type) {
        const icons = {
            accepted: 'check',
            connected: 'handshake',
            viewed: 'eye',
            requested: 'user-clock'
        };
        return icons[type] || 'circle';
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    showNotification(message, type = 'info') {
        if (window.afzDashboard) {
            window.afzDashboard.showNotification(message, type);
        }
    }

    // Mock data generators
    generateMockConnections() {
        const connections = [];
        const names = ['Sarah Williams', 'Michael Johnson', 'Emma Davis', 'James Wilson', 'Lisa Anderson', 'David Miller', 'Maria Garcia', 'Robert Brown', 'Jennifer Taylor', 'Christopher Lee'];
        const titles = ['Healthcare Advocate', 'Community Volunteer', 'Support Group Leader', 'Youth Coordinator', 'Education Specialist', 'Healthcare Worker', 'Advocacy Manager', 'Social Worker'];
        const locations = ['Lusaka, Zambia', 'Kitwe, Zambia', 'Ndola, Zambia', 'Livingstone, Zambia'];
        const interests = ['Healthcare', 'Advocacy', 'Education', 'Support Groups', 'Youth Programs', 'Community Building'];

        for (let i = 0; i < 24; i++) {
            connections.push({
                id: `connection_${i + 1}`,
                name: names[i % names.length],
                title: titles[i % titles.length],
                avatar: `assets/avatars/user${(i % 10) + 1}.jpg`,
                location: locations[i % locations.length],
                interests: interests.slice(i % 3, (i % 3) + 3),
                mutualConnections: Math.floor(Math.random() * 20) + 1,
                interactionScore: Math.floor(Math.random() * 100),
                online: Math.random() > 0.6,
                status: i < 3 ? 'new' : 'established',
                connectedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return connections;
    }

    generatePendingRequests() {
        return [
            {
                id: 'req_1',
                type: 'incoming',
                name: 'Grace Mwamba',
                title: 'Healthcare Coordinator',
                avatar: 'assets/avatars/grace.jpg',
                message: 'Hi! I saw we have mutual connections in the healthcare community. Would love to connect!',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                mutualConnections: 5
            },
            {
                id: 'req_2',
                type: 'incoming',
                name: 'Peter Banda',
                title: 'Youth Program Director',
                avatar: 'assets/avatars/peter.jpg',
                message: 'Hello, I\'d like to connect and share resources for youth programs.',
                date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                mutualConnections: 3
            },
            {
                id: 'req_3',
                type: 'outgoing',
                name: 'Mary Phiri',
                title: 'Community Organizer',
                avatar: 'assets/avatars/mary.jpg',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                mutualConnections: 7
            }
        ];
    }

    generateSuggestedConnections() {
        return [
            {
                id: 'sug_1',
                name: 'Dr. Joseph Mulenga',
                title: 'Medical Specialist',
                avatar: 'assets/avatars/doctor.jpg',
                reason: 'Works in healthcare',
                mutualConnections: 8,
                interests: ['Healthcare', 'Medical Research']
            },
            {
                id: 'sug_2',
                name: 'Alice Tembo',
                title: 'Education Advocate',
                avatar: 'assets/avatars/alice.jpg',
                reason: 'Similar interests in education',
                mutualConnections: 4,
                interests: ['Education', 'Youth Programs']
            },
            {
                id: 'sug_3',
                name: 'Daniel Chama',
                title: 'Policy Researcher',
                avatar: 'assets/avatars/daniel.jpg',
                reason: 'Active in advocacy',
                mutualConnections: 6,
                interests: ['Advocacy', 'Policy', 'Research']
            }
        ];
    }

    generateNetworkStats() {
        return {
            growthRate: 24.5,
            newConnections: 8,
            engagementRate: 68,
            engagementIncrease: 12,
            mutualConnections: 156,
            influenceScore: 85,
            profileViews: 247
        };
    }

    generateGroups() {
        return [
            {
                id: 'group_1',
                name: 'Healthcare Support Network',
                description: 'A community for sharing healthcare resources and experiences',
                category: 'healthcare',
                privacy: 'public',
                avatar: 'assets/groups/healthcare.jpg',
                memberCount: 234,
                isMember: true,
                activity: 'high',
                growth: 15,
                matchReason: 'healthcare and advocacy'
            },
            {
                id: 'group_2',
                name: 'Youth Empowerment',
                description: 'Empowering young people with albinism through education and support',
                category: 'youth',
                privacy: 'public',
                avatar: 'assets/groups/youth.jpg',
                memberCount: 156,
                isMember: true,
                activity: 'medium',
                growth: 23,
                matchReason: 'youth programs'
            },
            {
                id: 'group_3',
                name: 'Advocacy Champions',
                description: 'Working together to advance rights and awareness',
                category: 'advocacy',
                privacy: 'public',
                avatar: 'assets/groups/advocacy.jpg',
                memberCount: 189,
                isMember: false,
                activity: 'high',
                growth: 18,
                matchReason: 'advocacy work'
            },
            {
                id: 'group_4',
                name: 'Education Initiative',
                description: 'Promoting inclusive education for all',
                category: 'education',
                privacy: 'public',
                avatar: 'assets/groups/education.jpg',
                memberCount: 98,
                isMember: false,
                activity: 'medium',
                growth: 12,
                matchReason: 'education'
            }
        ];
    }

    injectConnectionsStyles() {
        if (document.getElementById('connections-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'connections-styles';
        styles.textContent = `
            .connections-interface {
                background: var(--surface-color);
                border-radius: 16px;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .connections-header {
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

            .header-stats {
                display: flex;
                gap: 32px;
            }

            .stat-item {
                text-align: center;
            }

            .stat-number {
                display: block;
                font-size: 28px;
                font-weight: 700;
                color: var(--primary-color);
                line-height: 1;
            }

            .stat-label {
                font-size: 14px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .connections-nav {
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
                position: relative;
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

            .nav-tab .badge {
                background: var(--error-color);
                color: white;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 16px;
                text-align: center;
            }

            .connections-content {
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

            /* Network Controls */
            .network-controls {
                margin-bottom: 32px;
            }

            .search-section {
                display: flex;
                align-items: center;
                gap: 24px;
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
                padding: 16px 20px 16px 48px;
                border: 2px solid var(--border-color);
                border-radius: 12px;
                background: var(--surface-color);
                color: var(--text-primary);
                font-size: 16px;
                transition: all 0.2s ease;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px var(--primary-light);
            }

            .filter-controls {
                display: flex;
                gap: 16px;
                align-items: center;
            }

            .filter-select {
                padding: 12px 16px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
                font-size: 14px;
                min-width: 150px;
            }

            .bulk-actions {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 24px;
                background: var(--warning-light);
                border: 1px solid var(--warning-color);
                border-radius: 8px;
                margin-bottom: 24px;
            }

            .selected-count {
                font-weight: 600;
                color: var(--warning-color);
            }

            .bulk-buttons {
                display: flex;
                gap: 12px;
            }

            /* Connections Grid */
            .connections-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .connection-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                padding: 24px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .connection-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color);
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .connection-status {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--border-color);
            }

            .connection-status.new {
                background: var(--primary-color);
                animation: pulse-status 2s infinite;
            }

            .connection-status.established {
                background: var(--success-color);
            }

            .connection-avatar {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 16px;
            }

            .connection-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--surface-color);
            }

            .online-indicator {
                position: absolute;
                bottom: 4px;
                right: 4px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid var(--surface-color);
            }

            .online-indicator.online {
                background: var(--success-color);
            }

            .online-indicator.offline {
                background: var(--border-color);
            }

            .connection-info {
                text-align: center;
                margin-bottom: 16px;
            }

            .connection-name {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .connection-title {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .connection-location {
                font-size: 13px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }

            .connection-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                justify-content: center;
            }

            .interest-tag {
                background: var(--primary-light);
                color: var(--primary-color);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .interest-tag:hover,
            .interest-tag.active {
                background: var(--primary-color);
                color: white;
            }

            .connection-stats {
                display: flex;
                justify-content: space-around;
                margin: 16px 0;
                padding: 12px 0;
                border-top: 1px solid var(--border-color);
                border-bottom: 1px solid var(--border-color);
            }

            .connection-stats .stat {
                text-align: center;
            }

            .stat-value {
                display: block;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
                line-height: 1;
            }

            .stat-label {
                font-size: 11px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .connection-actions {
                display: flex;
                justify-content: center;
                gap: 8px;
            }

            .action-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .message-btn {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            .message-btn:hover {
                background: var(--primary-color);
                color: white;
            }

            .profile-btn {
                background: var(--info-light);
                color: var(--info-color);
            }

            .profile-btn:hover {
                background: var(--info-color);
                color: white;
            }

            .more-btn {
                background: var(--surface-color);
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }

            .more-btn:hover {
                background: var(--surface-hover);
                color: var(--text-primary);
            }

            /* Suggestions Grid */
            .suggestions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }

            .suggestion-card {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 20px;
                transition: all 0.2s ease;
            }

            .suggestion-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .suggestion-avatar {
                width: 60px;
                height: 60px;
                margin: 0 auto 12px;
            }

            .suggestion-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .suggestion-info {
                text-align: center;
                margin-bottom: 16px;
            }

            .suggestion-name {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .suggestion-title {
                font-size: 13px;
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .suggestion-reason {
                font-size: 12px;
                color: var(--primary-color);
                background: var(--primary-light);
                padding: 4px 8px;
                border-radius: 6px;
                display: inline-block;
                margin-bottom: 8px;
            }

            .mutual-connections {
                font-size: 12px;
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }

            .suggestion-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
            }

            /* Requests */
            .requests-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 32px;
            }

            .requests-section {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .section-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .count-badge {
                background: var(--primary-color);
                color: white;
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 10px;
                font-weight: 500;
            }

            .requests-list {
                padding: 0;
            }

            .request-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px 24px;
                border-bottom: 1px solid var(--border-color);
                transition: background 0.2s ease;
            }

            .request-item:hover {
                background: var(--surface-color);
            }

            .request-item:last-child {
                border-bottom: none;
            }

            .request-avatar {
                width: 50px;
                height: 50px;
                flex-shrink: 0;
            }

            .request-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .request-info {
                flex: 1;
            }

            .request-name {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .request-title {
                font-size: 13px;
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .request-message {
                font-size: 14px;
                color: var(--text-primary);
                margin: 0 0 8px;
                font-style: italic;
                background: var(--surface-color);
                padding: 8px 12px;
                border-radius: 8px;
                border-left: 3px solid var(--primary-color);
            }

            .request-meta {
                display: flex;
                gap: 16px;
                font-size: 12px;
                color: var(--text-secondary);
            }

            .request-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .request-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            .request-item.outgoing {
                background: var(--info-light);
            }

            /* Activity Timeline */
            .activity-timeline {
                padding: 24px;
            }

            .activity-item {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 20px;
                padding: 16px;
                background: var(--surface-color);
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }

            .activity-item:last-child {
                margin-bottom: 0;
            }

            .activity-icon {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                flex-shrink: 0;
            }

            .activity-icon.accepted { background: var(--success-color); }
            .activity-icon.connected { background: var(--primary-color); }
            .activity-icon.viewed { background: var(--info-color); }
            .activity-icon.requested { background: var(--warning-color); }

            .activity-content {
                flex: 1;
            }

            .activity-content p {
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .activity-time {
                font-size: 12px;
                color: var(--text-secondary);
            }

            /* Groups */
            .groups-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;
            }

            .groups-header .header-content h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .groups-header .header-content p {
                color: var(--text-secondary);
                margin: 0;
            }

            .groups-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 32px;
                border-bottom: 1px solid var(--border-color);
            }

            .group-tab {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .group-tab:hover {
                color: var(--text-primary);
            }

            .group-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }

            .group-tab-content {
                display: none;
            }

            .group-tab-content.active {
                display: block;
            }

            .groups-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 24px;
            }

            .group-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
            }

            .group-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
            }

            .group-card.recommended {
                border-color: var(--primary-color);
                background: linear-gradient(135deg, var(--primary-light) 0%, var(--surface-hover) 100%);
            }

            .recommendation-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                background: var(--primary-color);
                color: white;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 4px;
                z-index: 2;
            }

            .group-header {
                position: relative;
                height: 120px;
                background: linear-gradient(135deg, var(--primary-light) 0%, var(--info-light) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .group-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .group-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .group-badge {
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 10px;
                padding: 3px 6px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
            }

            .group-badge.public {
                background: var(--success-light);
                color: var(--success-color);
            }

            .group-badge.private {
                background: var(--warning-light);
                color: var(--warning-color);
            }

            .group-content {
                padding: 20px;
            }

            .group-name {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
                line-height: 1.3;
            }

            .group-description {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 16px;
                line-height: 1.4;
            }

            .group-stats {
                display: flex;
                gap: 16px;
                margin-bottom: 16px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .group-stats span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .recommendation-reason {
                background: var(--info-light);
                color: var(--info-color);
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .group-actions {
                display: flex;
                justify-content: center;
            }

            .category-filters {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                flex-wrap: wrap;
            }

            .category-btn {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .category-btn:hover,
            .category-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            /* Analytics */
            .analytics-overview {
                margin-bottom: 32px;
            }

            .overview-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
            }

            .overview-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                padding: 24px;
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.3s ease;
            }

            .overview-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .card-icon {
                width: 56px;
                height: 56px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }

            .card-icon.network-growth { background: var(--success-color); }
            .card-icon.engagement { background: var(--info-color); }
            .card-icon.connections { background: var(--primary-color); }
            .card-icon.influence { background: var(--warning-color); }

            .card-content h3 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .card-content p {
                color: var(--text-secondary);
                margin: 0 0 8px;
                font-weight: 500;
            }

            .trend {
                font-size: 14px;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 6px;
            }

            .trend.positive {
                background: var(--success-light);
                color: var(--success-color);
            }

            .trend.negative {
                background: var(--error-light);
                color: var(--error-color);
            }

            .trend.neutral {
                background: var(--surface-color);
                color: var(--text-secondary);
            }

            .network-visualization {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                margin-bottom: 32px;
                overflow: hidden;
            }

            .viz-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .viz-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .viz-controls {
                display: flex;
                gap: 8px;
            }

            .network-canvas {
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, var(--surface-color) 0%, var(--surface-hover) 100%);
            }

            .network-placeholder {
                text-align: center;
                color: var(--text-secondary);
            }

            .network-placeholder i {
                font-size: 64px;
                margin-bottom: 16px;
                color: var(--primary-light);
            }

            .network-placeholder p {
                font-size: 18px;
                font-weight: 500;
                margin: 0 0 8px;
            }

            .network-placeholder small {
                font-size: 14px;
                color: var(--text-secondary);
            }

            .activity-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .chart-container {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                padding: 24px;
            }

            .chart-container h3 {
                margin: 0 0 20px;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .chart-container canvas {
                width: 100% !important;
                height: 250px !important;
            }

            .network-insights {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                padding: 24px;
            }

            .network-insights h3 {
                margin: 0 0 20px;
                font-size: 20px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .insight-card {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
            }

            .insight-icon {
                width: 48px;
                height: 48px;
                background: var(--primary-light);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary-color);
                font-size: 20px;
                flex-shrink: 0;
            }

            .insight-content h4 {
                margin: 0 0 8px;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .insight-content p {
                margin: 0;
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.5;
            }

            /* Modal Styles */
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
                max-width: 600px;
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

            .profile-content {
                text-align: center;
            }

            .profile-header {
                margin-bottom: 24px;
            }

            .profile-avatar {
                width: 100px;
                height: 100px;
                margin: 0 auto 16px;
                position: relative;
            }

            .profile-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .profile-info h3 {
                margin: 0 0 8px;
                font-size: 24px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .profile-title {
                font-size: 16px;
                color: var(--text-secondary);
                margin: 0 0 8px;
            }

            .profile-location {
                font-size: 14px;
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                margin: 0;
            }

            .profile-stats {
                display: flex;
                justify-content: center;
                gap: 32px;
                margin: 24px 0;
                padding: 20px 0;
                border-top: 1px solid var(--border-color);
                border-bottom: 1px solid var(--border-color);
            }

            .profile-interests {
                margin: 24px 0;
            }

            .profile-interests h4 {
                margin: 0 0 12px;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .interests-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
            }

            .profile-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }

            /* Form Styles */
            .form-group {
                margin-bottom: 20px;
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

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            /* Animations */
            @keyframes pulse-status {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.8;
                }
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .connections-header {
                    flex-direction: column;
                    gap: 24px;
                    text-align: center;
                }

                .header-stats {
                    gap: 16px;
                }

                .search-section {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 16px;
                }

                .filter-controls {
                    justify-content: space-between;
                }

                .connections-grid,
                .suggestions-grid {
                    grid-template-columns: 1fr;
                }

                .requests-container {
                    grid-template-columns: 1fr;
                }

                .overview-stats {
                    grid-template-columns: repeat(2, 1fr);
                }

                .activity-charts {
                    grid-template-columns: 1fr;
                }

                .insights-grid {
                    grid-template-columns: 1fr;
                }

                .bulk-actions {
                    flex-direction: column;
                    gap: 12px;
                    align-items: stretch;
                }

                .bulk-buttons {
                    justify-content: space-around;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in main dashboard
window.ConnectionsManager = ConnectionsManager;
