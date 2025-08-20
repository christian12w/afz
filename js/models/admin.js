/**
 * AFZ Member Hub - Admin Management Module
 * Comprehensive admin dashboard with member management, analytics, content moderation, and system controls
 */

class AdminManager {
    constructor() {
        this.currentUser = {
            id: 'admin_001',
            role: 'admin',
            permissions: ['manage_users', 'manage_content', 'view_analytics', 'system_admin']
        };
        
        this.members = this.generateMockMembers();
        this.analytics = this.generateMockAnalytics();
        this.systemStats = this.generateSystemStats();
        this.auditLogs = this.generateAuditLogs();
        this.reportedContent = this.generateReportedContent();
        
        this.currentView = 'dashboard';
        this.selectedMembers = new Set();
        this.filters = {
            status: 'all',
            role: 'all',
            dateRange: '30days',
            searchQuery: ''
        };
        
        this.init();
    }

    init() {
        this.setupAdminInterface();
        this.setupEventListeners();
        this.loadInitialData();
        this.startRealTimeUpdates();
        this.setupCharts();
    }

    setupAdminInterface() {
        const adminContainer = document.getElementById('section-admin-dashboard');
        if (!adminContainer) return;

        adminContainer.innerHTML = `
            <div class="admin-interface">
                <!-- Admin Header -->
                <div class="admin-header">
                    <div class="admin-title">
                        <h1>Administration Dashboard</h1>
                        <p>Manage members, content, and system settings</p>
                    </div>
                    <div class="admin-actions">
                        <button class="btn btn-primary" id="create-announcement-btn">
                            <i class="fas fa-bullhorn"></i>
                            Create Announcement
                        </button>
                        <button class="btn btn-secondary" id="export-data-btn">
                            <i class="fas fa-download"></i>
                            Export Data
                        </button>
                        <div class="admin-notifications">
                            <button class="notification-btn" id="admin-notifications" title="System Alerts">
                                <i class="fas fa-bell"></i>
                                <span class="notification-count">3</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Admin Navigation Tabs -->
                <div class="admin-nav">
                    <button class="nav-tab active" data-view="dashboard">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard
                    </button>
                    <button class="nav-tab" data-view="members">
                        <i class="fas fa-users"></i>
                        Members
                    </button>
                    <button class="nav-tab" data-view="content">
                        <i class="fas fa-file-alt"></i>
                        Content
                    </button>
                    <button class="nav-tab" data-view="analytics">
                        <i class="fas fa-chart-bar"></i>
                        Analytics
                    </button>
                    <button class="nav-tab" data-view="system">
                        <i class="fas fa-cogs"></i>
                        System
                    </button>
                    <button class="nav-tab" data-view="audit">
                        <i class="fas fa-history"></i>
                        Audit Logs
                    </button>
                </div>

                <!-- Admin Content -->
                <div class="admin-content">
                    <!-- Dashboard View -->
                    <div class="admin-view active" id="view-dashboard">
                        ${this.renderDashboardView()}
                    </div>

                    <!-- Members View -->
                    <div class="admin-view" id="view-members">
                        ${this.renderMembersView()}
                    </div>

                    <!-- Content View -->
                    <div class="admin-view" id="view-content">
                        ${this.renderContentView()}
                    </div>

                    <!-- Analytics View -->
                    <div class="admin-view" id="view-analytics">
                        ${this.renderAnalyticsView()}
                    </div>

                    <!-- System View -->
                    <div class="admin-view" id="view-system">
                        ${this.renderSystemView()}
                    </div>

                    <!-- Audit Logs View -->
                    <div class="admin-view" id="view-audit">
                        ${this.renderAuditView()}
                    </div>
                </div>

                <!-- Action Modals -->
                ${this.renderModals()}
            </div>
        `;

        this.injectAdminStyles();
    }

    renderDashboardView() {
        return `
            <div class="dashboard-overview">
                <!-- Quick Stats -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon members">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="total-members">${this.systemStats.totalMembers.toLocaleString()}</h3>
                            <p>Total Members</p>
                            <span class="stat-change positive">+${this.systemStats.newMembersToday} today</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon activity">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="monthly-active">${this.systemStats.monthlyActive.toLocaleString()}</h3>
                            <p>Monthly Active Users</p>
                            <span class="stat-change positive">+12.5%</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon messages">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="total-messages">${this.systemStats.totalMessages.toLocaleString()}</h3>
                            <p>Messages Sent</p>
                            <span class="stat-change positive">+${this.systemStats.messagesToday} today</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon events">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="upcoming-events">${this.systemStats.upcomingEvents}</h3>
                            <p>Upcoming Events</p>
                            <span class="stat-change neutral">This month</span>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Content Grid -->
                <div class="dashboard-grid">
                    <!-- Recent Activity -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Recent Activity</h3>
                            <button class="btn btn-sm btn-secondary" onclick="this.refreshActivity()">
                                <i class="fas fa-refresh"></i>
                            </button>
                        </div>
                        <div class="activity-feed">
                            ${this.renderRecentActivity()}
                        </div>
                    </div>

                    <!-- Pending Actions -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Pending Actions</h3>
                            <span class="badge badge-warning">${this.getPendingActionsCount()}</span>
                        </div>
                        <div class="pending-actions">
                            ${this.renderPendingActions()}
                        </div>
                    </div>

                    <!-- System Health -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>System Health</h3>
                            <span class="status-indicator healthy"></span>
                        </div>
                        <div class="system-health">
                            ${this.renderSystemHealth()}
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div class="quick-actions">
                            <button class="quick-action-btn" onclick="adminManager.showCreateUserModal()">
                                <i class="fas fa-user-plus"></i>
                                Add Member
                            </button>
                            <button class="quick-action-btn" onclick="adminManager.showCreateEventModal()">
                                <i class="fas fa-calendar-plus"></i>
                                Create Event
                            </button>
                            <button class="quick-action-btn" onclick="adminManager.showBulkMessageModal()">
                                <i class="fas fa-envelope"></i>
                                Send Announcement
                            </button>
                            <button class="quick-action-btn" onclick="adminManager.exportUserData()">
                                <i class="fas fa-download"></i>
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMembersView() {
        return `
            <div class="members-management">
                <!-- Members Controls -->
                <div class="members-controls">
                    <div class="search-filters">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="member-search" placeholder="Search members...">
                        </div>
                        <select id="status-filter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <select id="role-filter" class="filter-select">
                            <option value="all">All Roles</option>
                            <option value="member">Members</option>
                            <option value="moderator">Moderators</option>
                            <option value="admin">Administrators</option>
                        </select>
                    </div>
                    <div class="bulk-actions">
                        <button class="btn btn-secondary" id="bulk-email-btn" disabled>
                            <i class="fas fa-envelope"></i>
                            Email Selected
                        </button>
                        <button class="btn btn-warning" id="bulk-suspend-btn" disabled>
                            <i class="fas fa-ban"></i>
                            Suspend Selected
                        </button>
                        <button class="btn btn-primary" id="add-member-btn">
                            <i class="fas fa-user-plus"></i>
                            Add Member
                        </button>
                    </div>
                </div>

                <!-- Members Table -->
                <div class="members-table-container">
                    <table class="members-table" id="members-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" id="select-all-members"></th>
                                <th>Member</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderMembersRows()}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="table-pagination">
                    <div class="pagination-info">
                        Showing 1-25 of ${this.members.length} members
                    </div>
                    <div class="pagination-controls">
                        <button class="btn btn-sm btn-secondary" disabled>Previous</button>
                        <button class="btn btn-sm btn-secondary">1</button>
                        <button class="btn btn-sm btn-secondary">2</button>
                        <button class="btn btn-sm btn-secondary">3</button>
                        <button class="btn btn-sm btn-secondary">Next</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderContentView() {
        return `
            <div class="content-management">
                <!-- Content Controls -->
                <div class="content-controls">
                    <div class="content-tabs">
                        <button class="content-tab active" data-content="reported">
                            Reported Content
                            <span class="badge badge-danger">${this.reportedContent.filter(c => c.status === 'pending').length}</span>
                        </button>
                        <button class="content-tab" data-content="messages">Chat Messages</button>
                        <button class="content-tab" data-content="resources">Resources</button>
                        <button class="content-tab" data-content="events">Events</button>
                    </div>
                    <div class="content-actions">
                        <button class="btn btn-primary" id="create-resource-btn">
                            <i class="fas fa-plus"></i>
                            Create Resource
                        </button>
                    </div>
                </div>

                <!-- Reported Content -->
                <div class="content-section active" id="reported-content">
                    <div class="reported-items">
                        ${this.renderReportedContent()}
                    </div>
                </div>

                <!-- Other content sections would be implemented similarly -->
                <div class="content-section" id="messages-content">
                    <p>Chat message moderation tools will be displayed here</p>
                </div>

                <div class="content-section" id="resources-content">
                    <p>Resource management tools will be displayed here</p>
                </div>

                <div class="content-section" id="events-content">
                    <p>Event management tools will be displayed here</p>
                </div>
            </div>
        `;
    }

    renderAnalyticsView() {
        return `
            <div class="analytics-dashboard">
                <!-- Analytics Controls -->
                <div class="analytics-controls">
                    <div class="date-range-selector">
                        <select id="analytics-range">
                            <option value="7days">Last 7 Days</option>
                            <option value="30days" selected>Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="1year">Last Year</option>
                        </select>
                    </div>
                    <div class="analytics-actions">
                        <button class="btn btn-secondary" id="export-analytics">
                            <i class="fas fa-download"></i>
                            Export Report
                        </button>
                    </div>
                </div>

                <!-- Analytics Content -->
                <div class="analytics-content">
                    <!-- Key Metrics -->
                    <div class="analytics-metrics">
                        <div class="metric-card">
                            <h4>User Growth</h4>
                            <div class="metric-value">+24.5%</div>
                            <div class="metric-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                vs last period
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>Engagement Rate</h4>
                            <div class="metric-value">68.2%</div>
                            <div class="metric-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                +5.1% vs last period
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>Event Attendance</h4>
                            <div class="metric-value">89.3%</div>
                            <div class="metric-trend neutral">
                                <i class="fas fa-minus"></i>
                                -2.1% vs last period
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>Support Requests</h4>
                            <div class="metric-value">12</div>
                            <div class="metric-trend negative">
                                <i class="fas fa-arrow-down"></i>
                                -33% vs last period
                            </div>
                        </div>
                    </div>

                    <!-- Charts Grid -->
                    <div class="charts-grid">
                        <div class="chart-container">
                            <h3>User Growth Over Time</h3>
                            <canvas id="growth-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>User Activity Heatmap</h3>
                            <canvas id="activity-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Content Engagement</h3>
                            <canvas id="engagement-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Geographic Distribution</h3>
                            <canvas id="geographic-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSystemView() {
        return `
            <div class="system-management">
                <!-- System Status -->
                <div class="system-status">
                    <div class="status-card">
                        <div class="status-header">
                            <h3>System Status</h3>
                            <span class="status-badge operational">Operational</span>
                        </div>
                        <div class="status-metrics">
                            <div class="metric">
                                <label>Uptime</label>
                                <span>99.9% (30 days)</span>
                            </div>
                            <div class="metric">
                                <label>Response Time</label>
                                <span>145ms avg</span>
                            </div>
                            <div class="metric">
                                <label>Active Sessions</label>
                                <span>234 users</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Settings -->
                <div class="system-settings">
                    <div class="settings-section">
                        <h3>General Settings</h3>
                        <div class="settings-form">
                            <div class="form-group">
                                <label>Site Name</label>
                                <input type="text" value="AFZ Member Hub" id="site-name">
                            </div>
                            <div class="form-group">
                                <label>Maintenance Mode</label>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="maintenance-mode">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Registration</label>
                                <select id="registration-mode">
                                    <option value="open">Open Registration</option>
                                    <option value="approval" selected>Approval Required</option>
                                    <option value="closed">Closed Registration</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Security Settings</h3>
                        <div class="settings-form">
                            <div class="form-group">
                                <label>Two-Factor Authentication</label>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="two-factor-required" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Session Timeout (minutes)</label>
                                <input type="number" value="30" id="session-timeout">
                            </div>
                            <div class="form-group">
                                <label>Password Policy</label>
                                <select id="password-policy">
                                    <option value="basic">Basic (8 characters)</option>
                                    <option value="strong" selected>Strong (12 chars, mixed case)</option>
                                    <option value="enterprise">Enterprise (16 chars, symbols)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Backup & Maintenance</h3>
                        <div class="backup-controls">
                            <button class="btn btn-primary" id="backup-now">
                                <i class="fas fa-save"></i>
                                Backup Now
                            </button>
                            <button class="btn btn-secondary" id="restore-backup">
                                <i class="fas fa-undo"></i>
                                Restore Backup
                            </button>
                            <button class="btn btn-warning" id="clear-cache">
                                <i class="fas fa-broom"></i>
                                Clear Cache
                            </button>
                        </div>
                        <div class="backup-schedule">
                            <label>Automatic Backup Schedule</label>
                            <select id="backup-schedule">
                                <option value="daily" selected>Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="system-actions">
                    <button class="btn btn-success" id="save-system-settings">Save Settings</button>
                    <button class="btn btn-secondary" id="reset-system-settings">Reset to Default</button>
                </div>
            </div>
        `;
    }

    renderAuditView() {
        return `
            <div class="audit-logs">
                <!-- Audit Controls -->
                <div class="audit-controls">
                    <div class="audit-filters">
                        <input type="text" id="audit-search" placeholder="Search logs...">
                        <select id="audit-action-filter">
                            <option value="all">All Actions</option>
                            <option value="login">Login</option>
                            <option value="user_created">User Created</option>
                            <option value="user_modified">User Modified</option>
                            <option value="content_moderated">Content Moderated</option>
                            <option value="system_changed">System Changed</option>
                        </select>
                        <input type="date" id="audit-date-from">
                        <input type="date" id="audit-date-to">
                    </div>
                    <div class="audit-actions">
                        <button class="btn btn-secondary" id="export-audit-logs">
                            <i class="fas fa-download"></i>
                            Export Logs
                        </button>
                    </div>
                </div>

                <!-- Audit Table -->
                <div class="audit-table-container">
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderAuditRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderModals() {
        return `
            <!-- User Management Modal -->
            <div class="modal-overlay" id="user-modal" style="display: none;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 id="user-modal-title">Add New Member</h3>
                        <button class="modal-close" onclick="adminManager.closeModal('user-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="user-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" id="user-name" required>
                                </div>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" id="user-email" required>
                                </div>
                                <div class="form-group">
                                    <label>Role</label>
                                    <select id="user-role">
                                        <option value="member">Member</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Status</label>
                                    <select id="user-status">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="adminManager.closeModal('user-modal')">Cancel</button>
                        <button class="btn btn-primary" onclick="adminManager.saveUser()">Save</button>
                    </div>
                </div>
            </div>

            <!-- Announcement Modal -->
            <div class="modal-overlay" id="announcement-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>Create Announcement</h3>
                        <button class="modal-close" onclick="adminManager.closeModal('announcement-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="announcement-form">
                            <div class="form-group">
                                <label>Title *</label>
                                <input type="text" id="announcement-title" required>
                            </div>
                            <div class="form-group">
                                <label>Message *</label>
                                <textarea id="announcement-message" rows="6" required></textarea>
                            </div>
                            <div class="form-group">
                                <label>Target Audience</label>
                                <select id="announcement-audience">
                                    <option value="all">All Members</option>
                                    <option value="active">Active Members Only</option>
                                    <option value="admins">Administrators</option>
                                    <option value="moderators">Moderators</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select id="announcement-priority">
                                    <option value="low">Low</option>
                                    <option value="normal" selected>Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="adminManager.closeModal('announcement-modal')">Cancel</button>
                        <button class="btn btn-primary" onclick="adminManager.sendAnnouncement()">Send Announcement</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentActivity() {
        const activities = [
            { user: 'Sarah Williams', action: 'joined the community', time: '5 minutes ago', type: 'join' },
            { user: 'Michael Johnson', action: 'created a new event', time: '12 minutes ago', type: 'event' },
            { user: 'Emma Davis', action: 'uploaded a resource', time: '1 hour ago', type: 'resource' },
            { user: 'James Wilson', action: 'reported inappropriate content', time: '2 hours ago', type: 'report' }
        ];

        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.user}</strong> ${activity.action}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderPendingActions() {
        return `
            <div class="pending-item">
                <div class="pending-icon">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="pending-content">
                    <p>3 membership applications awaiting approval</p>
                    <button class="btn btn-sm btn-primary">Review</button>
                </div>
            </div>
            <div class="pending-item">
                <div class="pending-icon">
                    <i class="fas fa-flag"></i>
                </div>
                <div class="pending-content">
                    <p>2 reported messages need moderation</p>
                    <button class="btn btn-sm btn-warning">Moderate</button>
                </div>
            </div>
            <div class="pending-item">
                <div class="pending-icon">
                    <i class="fas fa-calendar-times"></i>
                </div>
                <div class="pending-content">
                    <p>1 event needs approval</p>
                    <button class="btn btn-sm btn-success">Approve</button>
                </div>
            </div>
        `;
    }

    renderSystemHealth() {
        return `
            <div class="health-metric">
                <label>Database</label>
                <div class="health-status">
                    <span class="health-indicator healthy"></span>
                    <span>Healthy</span>
                </div>
            </div>
            <div class="health-metric">
                <label>Cache</label>
                <div class="health-status">
                    <span class="health-indicator healthy"></span>
                    <span>Optimal</span>
                </div>
            </div>
            <div class="health-metric">
                <label>File Storage</label>
                <div class="health-status">
                    <span class="health-indicator warning"></span>
                    <span>78% Full</span>
                </div>
            </div>
            <div class="health-metric">
                <label>Email Service</label>
                <div class="health-status">
                    <span class="health-indicator healthy"></span>
                    <span>Online</span>
                </div>
            </div>
        `;
    }

    renderMembersRows() {
        return this.members.slice(0, 25).map(member => `
            <tr data-member-id="${member.id}">
                <td><input type="checkbox" class="member-checkbox" value="${member.id}"></td>
                <td>
                    <div class="member-info">
                        <div class="member-avatar">
                            <img src="${member.avatar}" alt="${member.name}">
                        </div>
                        <div class="member-details">
                            <div class="member-name">${member.name}</div>
                            <div class="member-email">${member.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="role-badge ${member.role}">${member.role}</span></td>
                <td><span class="status-badge ${member.status}">${member.status}</span></td>
                <td>${this.formatDate(member.joinDate)}</td>
                <td>${this.formatRelativeTime(member.lastActive)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="adminManager.editMember('${member.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="adminManager.toggleMemberStatus('${member.id}')" title="Toggle Status">
                            <i class="fas fa-ban"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminManager.deleteMember('${member.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderReportedContent() {
        return this.reportedContent.map(item => `
            <div class="reported-item" data-report-id="${item.id}">
                <div class="report-header">
                    <div class="report-info">
                        <h4>${item.type}: ${item.title}</h4>
                        <p>Reported by ${item.reportedBy} - ${item.reason}</p>
                    </div>
                    <div class="report-status">
                        <span class="status-badge ${item.status}">${item.status}</span>
                        <span class="report-time">${this.formatRelativeTime(item.reportDate)}</span>
                    </div>
                </div>
                <div class="report-content">
                    <p>${item.content}</p>
                </div>
                <div class="report-actions">
                    <button class="btn btn-sm btn-success" onclick="adminManager.approveContent('${item.id}')">
                        <i class="fas fa-check"></i>
                        Approve
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="adminManager.editContent('${item.id}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminManager.removeContent('${item.id}')">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAuditRows() {
        return this.auditLogs.map(log => `
            <tr>
                <td>${this.formatDateTime(log.timestamp)}</td>
                <td>
                    <div class="user-info-simple">
                        <strong>${log.user}</strong>
                        <small>${log.userRole}</small>
                    </div>
                </td>
                <td><span class="action-badge ${log.action}">${log.actionLabel}</span></td>
                <td>${log.target}</td>
                <td><code>${log.ipAddress}</code></td>
                <td><span class="status-badge ${log.status}">${log.status}</span></td>
            </tr>
        `).join('');
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

        // Member search and filters
        const memberSearch = document.getElementById('member-search');
        if (memberSearch) {
            memberSearch.addEventListener('input', (e) => {
                this.filterMembers({ searchQuery: e.target.value });
            });
        }

        // Status and role filters
        const statusFilter = document.getElementById('status-filter');
        const roleFilter = document.getElementById('role-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterMembers({ status: e.target.value });
            });
        }
        
        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.filterMembers({ role: e.target.value });
            });
        }

        // Select all members
        const selectAllMembers = document.getElementById('select-all-members');
        if (selectAllMembers) {
            selectAllMembers.addEventListener('change', (e) => {
                this.toggleSelectAllMembers(e.target.checked);
            });
        }

        // Bulk actions
        const bulkEmailBtn = document.getElementById('bulk-email-btn');
        const bulkSuspendBtn = document.getElementById('bulk-suspend-btn');
        
        if (bulkEmailBtn) {
            bulkEmailBtn.addEventListener('click', () => this.bulkEmailMembers());
        }
        
        if (bulkSuspendBtn) {
            bulkSuspendBtn.addEventListener('click', () => this.bulkSuspendMembers());
        }

        // Content tabs
        const contentTabs = document.querySelectorAll('.content-tab');
        contentTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const contentType = e.target.getAttribute('data-content');
                this.switchContentTab(contentType);
            });
        });

        // System settings
        const saveSystemSettings = document.getElementById('save-system-settings');
        if (saveSystemSettings) {
            saveSystemSettings.addEventListener('click', () => this.saveSystemSettings());
        }

        // Quick actions
        const createAnnouncementBtn = document.getElementById('create-announcement-btn');
        if (createAnnouncementBtn) {
            createAnnouncementBtn.addEventListener('click', () => this.showAnnouncementModal());
        }
    }

    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-view') === viewName);
        });

        // Update active view
        document.querySelectorAll('.admin-view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${viewName}`);
        });

        this.currentView = viewName;

        // Load view-specific data
        this.loadViewData(viewName);
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'analytics':
                this.loadAnalyticsCharts();
                break;
            case 'members':
                this.refreshMembersList();
                break;
            case 'content':
                this.refreshContentModeration();
                break;
        }
    }

    filterMembers(newFilters = {}) {
        this.filters = { ...this.filters, ...newFilters };
        this.refreshMembersList();
    }

    refreshMembersList() {
        const tbody = document.querySelector('#members-table tbody');
        if (tbody) {
            tbody.innerHTML = this.renderMembersRows();
            this.updateBulkActionButtons();
        }
    }

    toggleSelectAllMembers(checked) {
        const checkboxes = document.querySelectorAll('.member-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateSelectedMembers();
    }

    updateSelectedMembers() {
        const checkboxes = document.querySelectorAll('.member-checkbox:checked');
        this.selectedMembers.clear();
        checkboxes.forEach(checkbox => {
            this.selectedMembers.add(checkbox.value);
        });
        this.updateBulkActionButtons();
    }

    updateBulkActionButtons() {
        const bulkEmailBtn = document.getElementById('bulk-email-btn');
        const bulkSuspendBtn = document.getElementById('bulk-suspend-btn');
        const hasSelection = this.selectedMembers.size > 0;
        
        if (bulkEmailBtn) bulkEmailBtn.disabled = !hasSelection;
        if (bulkSuspendBtn) bulkSuspendBtn.disabled = !hasSelection;
    }

    switchContentTab(contentType) {
        // Update active tab
        document.querySelectorAll('.content-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-content') === contentType);
        });

        // Update active content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === `${contentType}-content`);
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

    showAnnouncementModal() {
        this.showModal('announcement-modal');
    }

    showCreateUserModal() {
        this.showModal('user-modal');
    }

    // Member management actions
    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            // Populate modal with member data
            document.getElementById('user-name').value = member.name;
            document.getElementById('user-email').value = member.email;
            document.getElementById('user-role').value = member.role;
            document.getElementById('user-status').value = member.status;
            document.getElementById('user-modal-title').textContent = 'Edit Member';
            this.showModal('user-modal');
        }
    }

    toggleMemberStatus(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            member.status = member.status === 'active' ? 'suspended' : 'active';
            this.refreshMembersList();
            this.showNotification(`Member ${member.status === 'active' ? 'activated' : 'suspended'}`, 'success');
        }
    }

    deleteMember(memberId) {
        if (confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
            this.members = this.members.filter(m => m.id !== memberId);
            this.refreshMembersList();
            this.showNotification('Member deleted successfully', 'success');
        }
    }

    // Content moderation actions
    approveContent(reportId) {
        const report = this.reportedContent.find(r => r.id === reportId);
        if (report) {
            report.status = 'approved';
            this.refreshContentModeration();
            this.showNotification('Content approved', 'success');
        }
    }

    removeContent(reportId) {
        const report = this.reportedContent.find(r => r.id === reportId);
        if (report) {
            report.status = 'removed';
            this.refreshContentModeration();
            this.showNotification('Content removed', 'success');
        }
    }

    refreshContentModeration() {
        const reportedContentContainer = document.getElementById('reported-content');
        if (reportedContentContainer) {
            reportedContentContainer.innerHTML = `
                <div class="reported-items">
                    ${this.renderReportedContent()}
                </div>
            `;
        }
    }

    // System management
    saveSystemSettings() {
        // Simulate saving settings
        this.showNotification('System settings saved successfully', 'success');
    }

    // Analytics
    loadAnalyticsCharts() {
        // This would integrate with a charting library like Chart.js
        setTimeout(() => {
            this.showNotification('Analytics data updated', 'info');
        }, 1000);
    }

    // Utility methods
    loadInitialData() {
        this.updateDashboardStats();
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateSystemStats();
        }, 30000);
    }

    setupCharts() {
        // Chart.js integration would go here
        console.log('Setting up analytics charts...');
    }

    updateDashboardStats() {
        // Animate counter updates
        this.animateCounter('total-members', this.systemStats.totalMembers);
        this.animateCounter('monthly-active', this.systemStats.monthlyActive);
        this.animateCounter('total-messages', this.systemStats.totalMessages);
    }

    updateSystemStats() {
        // Simulate real-time stat updates
        this.systemStats.totalMessages += Math.floor(Math.random() * 5);
        this.systemStats.newMembersToday += Math.floor(Math.random() * 2);
        this.updateDashboardStats();
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        const updateCounter = () => {
            const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
            if (current < targetValue) {
                element.textContent = Math.min(current + increment, targetValue).toLocaleString();
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }

    getActivityIcon(type) {
        const icons = {
            join: 'user-plus',
            event: 'calendar-plus',
            resource: 'file-upload',
            report: 'flag'
        };
        return icons[type] || 'circle';
    }

    getPendingActionsCount() {
        return 6; // Mock count
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString();
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }

    showNotification(message, type = 'info') {
        if (window.afzDashboard) {
            window.afzDashboard.showNotification(message, type);
        }
    }

    // Mock data generators
    generateMockMembers() {
        const members = [];
        const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams', 'Robert Brown', 'Emma Davis', 'James Wilson', 'Lisa Anderson', 'David Miller', 'Maria Garcia'];
        const roles = ['member', 'moderator', 'admin'];
        const statuses = ['active', 'inactive', 'suspended'];

        for (let i = 0; i < 150; i++) {
            members.push({
                id: `member_${i + 1}`,
                name: names[i % names.length] + ` ${i + 1}`,
                email: `user${i + 1}@example.com`,
                role: roles[Math.floor(Math.random() * roles.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                avatar: `assets/avatars/user${(i % 10) + 1}.jpg`,
                joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
                lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return members;
    }

    generateMockAnalytics() {
        return {
            userGrowth: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
                users: Math.floor(Math.random() * 50) + 100
            })),
            engagement: {
                daily: Math.random() * 100,
                weekly: Math.random() * 100,
                monthly: Math.random() * 100
            }
        };
    }

    generateSystemStats() {
        return {
            totalMembers: 1247,
            monthlyActive: 856,
            totalMessages: 15439,
            upcomingEvents: 8,
            newMembersToday: 12,
            messagesToday: 234
        };
    }

    generateAuditLogs() {
        const logs = [];
        const actions = ['login', 'user_created', 'user_modified', 'content_moderated', 'system_changed'];
        const users = ['Admin User', 'Moderator Smith', 'Admin Johnson'];
        
        for (let i = 0; i < 50; i++) {
            logs.push({
                id: `log_${i + 1}`,
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                user: users[Math.floor(Math.random() * users.length)],
                userRole: 'admin',
                action: actions[Math.floor(Math.random() * actions.length)],
                actionLabel: actions[Math.floor(Math.random() * actions.length)].replace('_', ' ').toUpperCase(),
                target: `Target ${i + 1}`,
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                status: Math.random() > 0.1 ? 'success' : 'failed'
            });
        }
        return logs;
    }

    generateReportedContent() {
        return [
            {
                id: 'report_1',
                type: 'Message',
                title: 'Inappropriate language in chat',
                content: 'This message contains offensive language that violates community guidelines...',
                reportedBy: 'Sarah Williams',
                reason: 'Offensive language',
                reportDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                status: 'pending'
            },
            {
                id: 'report_2',
                type: 'Resource',
                title: 'Misleading health information',
                content: 'This resource contains unverified medical advice that could be harmful...',
                reportedBy: 'Dr. Michael Johnson',
                reason: 'Misinformation',
                reportDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                status: 'pending'
            }
        ];
    }

    injectAdminStyles() {
        if (document.getElementById('admin-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'admin-styles';
        styles.textContent = `
            .admin-interface {
                background: var(--surface-color);
                border-radius: 16px;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .admin-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px 32px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .admin-title h1 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .admin-title p {
                color: var(--text-secondary);
                margin: 0;
            }

            .admin-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .admin-notifications {
                position: relative;
            }

            .notification-btn {
                background: var(--surface-hover);
                border: none;
                width: 44px;
                height: 44px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .notification-btn:hover {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            .notification-count {
                position: absolute;
                top: -6px;
                right: -6px;
                background: var(--error-color);
                color: white;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
            }

            .admin-nav {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
                overflow-x: auto;
            }

            .nav-tab {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
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

            .admin-content {
                flex: 1;
                overflow-y: auto;
            }

            .admin-view {
                display: none;
                padding: 32px;
                height: 100%;
            }

            .admin-view.active {
                display: block;
            }

            /* Dashboard Styles */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .stat-card {
                background: var(--surface-hover);
                padding: 24px;
                border-radius: 16px;
                border: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.2s ease;
            }

            .stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }

            .stat-icon {
                width: 64px;
                height: 64px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }

            .stat-icon.members { background: var(--primary-color); }
            .stat-icon.activity { background: var(--success-color); }
            .stat-icon.messages { background: var(--info-color); }
            .stat-icon.events { background: var(--warning-color); }

            .stat-content h3 {
                font-size: 32px;
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
                font-size: 14px;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 6px;
            }

            .stat-change.positive {
                background: var(--success-light);
                color: var(--success-color);
            }

            .stat-change.negative {
                background: var(--error-light);
                color: var(--error-color);
            }

            .stat-change.neutral {
                background: var(--surface-color);
                color: var(--text-secondary);
            }

            .dashboard-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 24px;
            }

            .dashboard-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .card-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .activity-feed {
                padding: 20px 24px;
                max-height: 400px;
                overflow-y: auto;
            }

            .activity-item {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 20px;
            }

            .activity-item:last-child {
                margin-bottom: 0;
            }

            .activity-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }

            .activity-icon.join { background: var(--success-color); }
            .activity-icon.event { background: var(--info-color); }
            .activity-icon.resource { background: var(--warning-color); }
            .activity-icon.report { background: var(--error-color); }

            .activity-content p {
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .activity-time {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .pending-actions {
                padding: 20px 24px;
            }

            .pending-item {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 16px;
                padding: 16px;
                background: var(--surface-color);
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }

            .pending-item:last-child {
                margin-bottom: 0;
            }

            .pending-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: var(--warning-light);
                color: var(--warning-color);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .pending-content {
                flex: 1;
            }

            .pending-content p {
                margin: 0 0 8px;
                color: var(--text-primary);
                font-size: 14px;
            }

            .quick-actions {
                padding: 20px 24px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
            }

            .quick-action-btn {
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                padding: 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .quick-action-btn:hover {
                background: var(--primary-light);
                color: var(--primary-color);
                border-color: var(--primary-color);
            }

            .system-health {
                padding: 20px 24px;
            }

            .health-metric {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                padding: 12px 0;
                border-bottom: 1px solid var(--border-color);
            }

            .health-metric:last-child {
                margin-bottom: 0;
                border-bottom: none;
            }

            .health-metric label {
                font-weight: 500;
                color: var(--text-primary);
            }

            .health-status {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .health-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .health-indicator.healthy { background: var(--success-color); }
            .health-indicator.warning { background: var(--warning-color); }
            .health-indicator.error { background: var(--error-color); }

            /* Members Management */
            .members-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
                gap: 20px;
            }

            .search-filters {
                display: flex;
                align-items: center;
                gap: 16px;
                flex: 1;
            }

            .search-box {
                position: relative;
                flex: 1;
                max-width: 300px;
            }

            .search-box i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-secondary);
            }

            .search-box input {
                width: 100%;
                padding: 12px 16px 12px 40px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
            }

            .filter-select {
                padding: 12px 16px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
                min-width: 120px;
            }

            .bulk-actions {
                display: flex;
                gap: 12px;
            }

            .members-table-container {
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                margin-bottom: 20px;
            }

            .members-table {
                width: 100%;
                border-collapse: collapse;
            }

            .members-table th {
                background: var(--surface-hover);
                padding: 16px;
                text-align: left;
                font-weight: 600;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-color);
            }

            .members-table td {
                padding: 16px;
                border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
            }

            .members-table tr:hover {
                background: var(--surface-hover);
            }

            .member-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .member-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
            }

            .member-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .member-details {
                display: flex;
                flex-direction: column;
            }

            .member-name {
                font-weight: 500;
                color: var(--text-primary);
            }

            .member-email {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .role-badge, .status-badge, .action-badge {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                text-transform: capitalize;
            }

            .role-badge.admin, .status-badge.active { 
                background: var(--success-light); 
                color: var(--success-color); 
            }
            .role-badge.moderator { 
                background: var(--info-light); 
                color: var(--info-color); 
            }
            .role-badge.member { 
                background: var(--surface-hover); 
                color: var(--text-secondary); 
            }
            .status-badge.inactive { 
                background: var(--warning-light); 
                color: var(--warning-color); 
            }
            .status-badge.suspended { 
                background: var(--error-light); 
                color: var(--error-color); 
            }

            .action-buttons {
                display: flex;
                gap: 4px;
            }

            .table-pagination {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 0;
            }

            .pagination-info {
                color: var(--text-secondary);
                font-size: 14px;
            }

            .pagination-controls {
                display: flex;
                gap: 4px;
            }

            /* Content Management */
            .content-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
            }

            .content-tabs {
                display: flex;
                gap: 8px;
            }

            .content-tab {
                background: var(--surface-hover);
                border: 1px solid var(--border-color);
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-secondary);
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .content-tab.active {
                background: var(--primary-light);
                color: var(--primary-color);
                border-color: var(--primary-color);
            }

            .content-section {
                display: none;
            }

            .content-section.active {
                display: block;
            }

            .reported-items {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .reported-item {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 20px;
            }

            .report-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            .report-info h4 {
                margin: 0 0 4px;
                color: var(--text-primary);
            }

            .report-info p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 14px;
            }

            .report-status {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
            }

            .report-time {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .report-content {
                margin-bottom: 16px;
                padding: 16px;
                background: var(--surface-color);
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }

            .report-content p {
                margin: 0;
                color: var(--text-secondary);
                line-height: 1.5;
            }

            .report-actions {
                display: flex;
                gap: 8px;
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
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .modal-container.large {
                max-width: 700px;
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
                font-size: 18px;
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

            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
            }

            .form-group label {
                font-weight: 500;
                margin-bottom: 8px;
                color: var(--text-primary);
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                background: var(--surface-hover);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 14px;
                color: var(--text-primary);
                transition: all 0.2s ease;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px var(--primary-light);
            }

            .badge {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
            }

            .badge.badge-danger {
                background: var(--error-light);
                color: var(--error-color);
            }

            .badge.badge-warning {
                background: var(--warning-light);
                color: var(--warning-color);
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
            }

            .status-indicator.healthy {
                background: var(--success-color);
            }

            .status-badge {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
            }

            .status-badge.operational {
                background: var(--success-light);
                color: var(--success-color);
            }

            /* System Settings */
            .system-status {
                margin-bottom: 32px;
            }

            .status-card {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 24px;
            }

            .status-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }

            .status-header h3 {
                margin: 0;
                color: var(--text-primary);
            }

            .status-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
            }

            .metric {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .metric label {
                font-size: 13px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .metric span {
                font-size: 16px;
                color: var(--text-primary);
                font-weight: 600;
            }

            .system-settings {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .settings-section {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 24px;
            }

            .settings-section h3 {
                margin: 0 0 20px;
                color: var(--text-primary);
                font-size: 18px;
            }

            .settings-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--border-color);
                transition: 0.3s;
                border-radius: 24px;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: white;
                transition: 0.3s;
                border-radius: 50%;
            }

            input:checked + .toggle-slider {
                background: var(--primary-color);
            }

            input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }

            .backup-controls {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 16px;
            }

            .backup-schedule {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .system-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }

            /* Analytics */
            .analytics-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
            }

            .analytics-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 32px;
            }

            .metric-card {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 20px;
                text-align: center;
            }

            .metric-card h4 {
                margin: 0 0 8px;
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 500;
            }

            .metric-value {
                font-size: 32px;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .metric-trend {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                font-size: 13px;
                font-weight: 500;
            }

            .metric-trend.positive { color: var(--success-color); }
            .metric-trend.negative { color: var(--error-color); }
            .metric-trend.neutral { color: var(--text-secondary); }

            .charts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 24px;
            }

            .chart-container {
                background: var(--surface-hover);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                padding: 20px;
            }

            .chart-container h3 {
                margin: 0 0 16px;
                color: var(--text-primary);
                font-size: 16px;
                font-weight: 600;
            }

            .chart-container canvas {
                width: 100% !important;
                height: 250px !important;
            }

            /* Audit Logs */
            .audit-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
                gap: 20px;
            }

            .audit-filters {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .audit-filters input,
            .audit-filters select {
                padding: 12px 16px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-primary);
            }

            .audit-table-container {
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }

            .audit-table {
                width: 100%;
                border-collapse: collapse;
            }

            .audit-table th {
                background: var(--surface-hover);
                padding: 16px;
                text-align: left;
                font-weight: 600;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-color);
            }

            .audit-table td {
                padding: 16px;
                border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
                font-size: 14px;
            }

            .audit-table tr:hover {
                background: var(--surface-hover);
            }

            .user-info-simple {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .user-info-simple strong {
                color: var(--text-primary);
            }

            .user-info-simple small {
                color: var(--text-secondary);
                font-size: 12px;
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .admin-header {
                    flex-direction: column;
                    gap: 16px;
                    align-items: stretch;
                }

                .admin-actions {
                    justify-content: space-between;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .dashboard-grid {
                    grid-template-columns: 1fr;
                }

                .members-controls {
                    flex-direction: column;
                    gap: 16px;
                    align-items: stretch;
                }

                .search-filters {
                    flex-wrap: wrap;
                }

                .system-settings {
                    grid-template-columns: 1fr;
                }

                .analytics-metrics {
                    grid-template-columns: repeat(2, 1fr);
                }

                .charts-grid {
                    grid-template-columns: 1fr;
                }

                .audit-controls {
                    flex-direction: column;
                    align-items: stretch;
                }

                .audit-filters {
                    flex-wrap: wrap;
                }

                .members-table,
                .audit-table {
                    font-size: 12px;
                }

                .members-table th,
                .members-table td,
                .audit-table th,
                .audit-table td {
                    padding: 8px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in main dashboard
window.AdminManager = AdminManager;
