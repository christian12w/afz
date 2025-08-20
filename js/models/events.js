/**
 * AFZ Member Hub - Events Management Module
 * Comprehensive events system with creation, RSVP handling, calendar integration, and community engagement features
 */

class EventsManager {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            avatar: 'assets/avatars/john-doe.jpg'
        };
        
        this.events = this.generateMockEvents();
        this.userEvents = this.generateUserEvents();
        this.eventCategories = this.generateEventCategories();
        this.eventStats = this.generateEventStats();
        
        this.currentView = 'upcoming';
        this.currentFilter = 'all';
        this.currentDateRange = 'all';
        this.selectedEvents = new Set();
        this.calendarView = 'month';
        this.currentDate = new Date();
        
        this.init();
    }

    init() {
        this.setupEventsInterface();
        this.setupEventListeners();
        this.loadInitialData();
        this.startEventUpdates();
    }

    setupEventsInterface() {
        const eventsContainer = document.getElementById('section-events');
        if (!eventsContainer) return;

        eventsContainer.innerHTML = `
            <div class="events-interface">
                <!-- Events Header -->
                <div class="events-header">
                    <div class="header-content">
                        <h1>Community Events</h1>
                        <p>Discover, create, and participate in AFZ community activities</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="export-events">
                            <i class="fas fa-calendar-alt"></i>
                            Export Calendar
                        </button>
                        <button class="btn btn-primary" id="create-event-btn">
                            <i class="fas fa-plus"></i>
                            Create Event
                        </button>
                    </div>
                </div>

                <!-- Events Stats Dashboard -->
                <div class="events-stats">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon upcoming">
                                <i class="fas fa-calendar-day"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.eventStats.upcomingEvents}</h3>
                                <p>Upcoming Events</p>
                                <span class="stat-trend positive">+${this.eventStats.newThisWeek} this week</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon participating">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.eventStats.myEvents}</h3>
                                <p>My Events</p>
                                <span class="stat-trend neutral">${this.eventStats.rsvpPending} pending RSVP</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon hosting">
                                <i class="fas fa-crown"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.eventStats.hosting}</h3>
                                <p>Hosting</p>
                                <span class="stat-trend positive">${this.eventStats.avgAttendees} avg. attendees</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon engagement">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.eventStats.engagementScore}%</h3>
                                <p>Engagement</p>
                                <span class="stat-trend positive">Above average</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="events-nav">
                    <button class="nav-tab active" data-view="upcoming">
                        <i class="fas fa-calendar-plus"></i>
                        Upcoming Events
                    </button>
                    <button class="nav-tab" data-view="my-events">
                        <i class="fas fa-user-calendar"></i>
                        My Events
                    </button>
                    <button class="nav-tab" data-view="calendar">
                        <i class="fas fa-calendar"></i>
                        Calendar View
                    </button>
                    <button class="nav-tab" data-view="categories">
                        <i class="fas fa-tags"></i>
                        Browse Categories
                    </button>
                    <button class="nav-tab" data-view="past">
                        <i class="fas fa-history"></i>
                        Past Events
                    </button>
                </div>

                <!-- Content Area -->
                <div class="events-content">
                    <!-- Upcoming Events View -->
                    <div class="content-view active" id="view-upcoming">
                        ${this.renderUpcomingEventsView()}
                    </div>

                    <!-- My Events View -->
                    <div class="content-view" id="view-my-events">
                        ${this.renderMyEventsView()}
                    </div>

                    <!-- Calendar View -->
                    <div class="content-view" id="view-calendar">
                        ${this.renderCalendarView()}
                    </div>

                    <!-- Categories View -->
                    <div class="content-view" id="view-categories">
                        ${this.renderCategoriesView()}
                    </div>

                    <!-- Past Events View -->
                    <div class="content-view" id="view-past">
                        ${this.renderPastEventsView()}
                    </div>
                </div>

                <!-- Event Details Modal -->
                ${this.renderEventModal()}

                <!-- Create/Edit Event Modal -->
                ${this.renderCreateEventModal()}

                <!-- RSVP Modal -->
                ${this.renderRSVPModal()}
            </div>
        `;

        this.injectEventsStyles();
    }

    renderUpcomingEventsView() {
        return `
            <div class="events-controls">
                <div class="search-section">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="events-search" placeholder="Search events...">
                    </div>
                    <div class="filter-controls">
                        <select id="category-filter" class="filter-select">
                            <option value="all">All Categories</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="advocacy">Advocacy</option>
                            <option value="education">Education</option>
                            <option value="support">Support Groups</option>
                            <option value="social">Social</option>
                            <option value="fundraising">Fundraising</option>
                        </select>
                        <select id="date-filter" class="filter-select">
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <select id="location-filter" class="filter-select">
                            <option value="all">All Locations</option>
                            <option value="lusaka">Lusaka</option>
                            <option value="kitwe">Kitwe</option>
                            <option value="ndola">Ndola</option>
                            <option value="online">Online</option>
                        </select>
                    </div>
                </div>

                <div class="view-toggle">
                    <button class="toggle-btn active" data-layout="grid" title="Grid View">
                        <i class="fas fa-th"></i>
                    </button>
                    <button class="toggle-btn" data-layout="list" title="List View">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>

            <div class="events-container">
                <!-- Featured Events -->
                <div class="featured-events">
                    <h2>Featured Events</h2>
                    <div class="featured-events-slider">
                        ${this.renderFeaturedEvents()}
                    </div>
                </div>

                <!-- Upcoming Events Grid -->
                <div class="events-section">
                    <h2>All Upcoming Events</h2>
                    <div class="events-grid" id="events-grid">
                        ${this.renderEventsGrid(this.events.filter(e => new Date(e.date) > new Date()))}
                    </div>
                    <div class="load-more-container">
                        <button class="btn btn-secondary" id="load-more-events">
                            Load More Events
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMyEventsView() {
        return `
            <div class="my-events-container">
                <!-- My Events Tabs -->
                <div class="my-events-tabs">
                    <button class="tab-btn active" data-tab="attending">
                        Attending (${this.userEvents.attending.length})
                    </button>
                    <button class="tab-btn" data-tab="hosting">
                        Hosting (${this.userEvents.hosting.length})
                    </button>
                    <button class="tab-btn" data-tab="interested">
                        Interested (${this.userEvents.interested.length})
                    </button>
                    <button class="tab-btn" data-tab="invitations">
                        Invitations (${this.userEvents.invitations.length})
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-panel active" id="attending-tab">
                        <div class="events-list">
                            ${this.renderUserEventsList(this.userEvents.attending, 'attending')}
                        </div>
                    </div>
                    <div class="tab-panel" id="hosting-tab">
                        <div class="events-list">
                            ${this.renderUserEventsList(this.userEvents.hosting, 'hosting')}
                        </div>
                    </div>
                    <div class="tab-panel" id="interested-tab">
                        <div class="events-list">
                            ${this.renderUserEventsList(this.userEvents.interested, 'interested')}
                        </div>
                    </div>
                    <div class="tab-panel" id="invitations-tab">
                        <div class="events-list">
                            ${this.renderUserEventsList(this.userEvents.invitations, 'invitations')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCalendarView() {
        return `
            <div class="calendar-container">
                <!-- Calendar Header -->
                <div class="calendar-header">
                    <div class="calendar-controls">
                        <button class="btn btn-sm btn-secondary" id="prev-month">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 id="calendar-title">${this.formatMonthYear(this.currentDate)}</h3>
                        <button class="btn btn-sm btn-secondary" id="next-month">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="calendar-view-toggle">
                        <button class="view-btn active" data-view="month">Month</button>
                        <button class="view-btn" data-view="week">Week</button>
                        <button class="view-btn" data-view="agenda">Agenda</button>
                    </div>
                </div>

                <!-- Calendar Content -->
                <div class="calendar-content">
                    <div class="calendar-view active" id="month-view">
                        ${this.renderMonthView()}
                    </div>
                    <div class="calendar-view" id="week-view">
                        ${this.renderWeekView()}
                    </div>
                    <div class="calendar-view" id="agenda-view">
                        ${this.renderAgendaView()}
                    </div>
                </div>

                <!-- Calendar Legend -->
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-color healthcare"></span>
                        <span class="legend-label">Healthcare</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color advocacy"></span>
                        <span class="legend-label">Advocacy</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color education"></span>
                        <span class="legend-label">Education</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color social"></span>
                        <span class="legend-label">Social</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color my-event"></span>
                        <span class="legend-label">My Events</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategoriesView() {
        return `
            <div class="categories-container">
                <div class="categories-header">
                    <h2>Browse by Category</h2>
                    <p>Discover events that match your interests</p>
                </div>

                <div class="categories-grid">
                    ${this.eventCategories.map(category => `
                        <div class="category-card" onclick="eventsManager.filterByCategory('${category.id}')">
                            <div class="category-icon ${category.id}">
                                <i class="fas fa-${category.icon}"></i>
                            </div>
                            <div class="category-content">
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                                <div class="category-stats">
                                    <span class="event-count">${category.eventCount} events</span>
                                    <span class="upcoming-count">${category.upcomingCount} upcoming</span>
                                </div>
                            </div>
                            <div class="category-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Category Events -->
                <div class="category-events" id="category-events" style="display: none;">
                    <div class="category-events-header">
                        <button class="btn btn-sm btn-secondary" id="back-to-categories">
                            <i class="fas fa-arrow-left"></i>
                            Back to Categories
                        </button>
                        <h3 id="category-events-title">Category Events</h3>
                    </div>
                    <div class="events-grid" id="category-events-grid">
                        <!-- Events will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderPastEventsView() {
        return `
            <div class="past-events-container">
                <div class="past-events-header">
                    <h2>Past Events</h2>
                    <p>Review and reflect on previous community activities</p>
                </div>

                <div class="past-events-filters">
                    <select id="past-events-filter" class="filter-select">
                        <option value="attended">Events I Attended</option>
                        <option value="hosted">Events I Hosted</option>
                        <option value="all">All Past Events</option>
                    </select>
                    <select id="past-date-range" class="filter-select">
                        <option value="month">Last Month</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                <div class="past-events-timeline">
                    ${this.renderPastEventsTimeline()}
                </div>
            </div>
        `;
    }

    renderEventsGrid(events) {
        return events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-category ${event.category}">${this.getCategoryName(event.category)}</div>
                    ${event.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                </div>
                <div class="event-content">
                    <div class="event-date">
                        <div class="date-day">${this.formatEventDay(event.date)}</div>
                        <div class="date-month">${this.formatEventMonth(event.date)}</div>
                    </div>
                    <div class="event-info">
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-description">${event.description}</p>
                        <div class="event-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${this.formatEventTime(event.date)}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${event.attendees}/${event.maxAttendees || '∞'}</span>
                            </div>
                        </div>
                        <div class="event-organizer">
                            <img src="${event.organizer.avatar}" alt="${event.organizer.name}" class="organizer-avatar">
                            <span>by ${event.organizer.name}</span>
                        </div>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn btn-sm btn-secondary" onclick="eventsManager.viewEvent('${event.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="eventsManager.rsvpEvent('${event.id}')">
                        <i class="fas fa-calendar-check"></i>
                        RSVP
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedEvents() {
        const featured = this.events.filter(e => e.featured).slice(0, 3);
        return featured.map(event => `
            <div class="featured-event-card" onclick="eventsManager.viewEvent('${event.id}')">
                <div class="featured-event-bg" style="background-image: url('${event.image}')">
                    <div class="featured-event-overlay">
                        <div class="featured-event-content">
                            <div class="featured-category ${event.category}">${this.getCategoryName(event.category)}</div>
                            <h3>${event.title}</h3>
                            <p class="featured-date">
                                <i class="fas fa-calendar"></i>
                                ${this.formatEventDate(event.date)}
                            </p>
                            <p class="featured-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${event.location}
                            </p>
                            <div class="featured-attendees">
                                <i class="fas fa-users"></i>
                                ${event.attendees} attending
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderUserEventsList(events, type) {
        if (events.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-calendar-times"></i>
                    </div>
                    <h3>No events found</h3>
                    <p>You don't have any ${type} events at the moment.</p>
                </div>
            `;
        }

        return events.map(event => `
            <div class="user-event-item">
                <div class="event-thumbnail">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-status ${event.status || type}">${this.getEventStatusLabel(event.status || type)}</div>
                </div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p class="event-summary">${event.description}</p>
                    <div class="event-info-row">
                        <span class="info-item">
                            <i class="fas fa-calendar"></i>
                            ${this.formatEventDate(event.date)}
                        </span>
                        <span class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.location}
                        </span>
                        <span class="info-item">
                            <i class="fas fa-users"></i>
                            ${event.attendees} attending
                        </span>
                    </div>
                    ${type === 'hosting' ? `
                        <div class="host-controls">
                            <button class="btn btn-sm btn-secondary" onclick="eventsManager.editEvent('${event.id}')">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-sm btn-info" onclick="eventsManager.manageEvent('${event.id}')">
                                <i class="fas fa-cog"></i>
                                Manage
                            </button>
                        </div>
                    ` : type === 'invitations' ? `
                        <div class="invitation-actions">
                            <button class="btn btn-sm btn-success" onclick="eventsManager.acceptInvitation('${event.id}')">
                                <i class="fas fa-check"></i>
                                Accept
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="eventsManager.declineInvitation('${event.id}')">
                                <i class="fas fa-times"></i>
                                Decline
                            </button>
                        </div>
                    ` : `
                        <div class="event-quick-actions">
                            <button class="btn btn-sm btn-secondary" onclick="eventsManager.viewEvent('${event.id}')">
                                View Details
                            </button>
                            ${type === 'attending' ? `
                                <button class="btn btn-sm btn-warning" onclick="eventsManager.cancelRSVP('${event.id}')">
                                    Cancel RSVP
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-primary" onclick="eventsManager.rsvpEvent('${event.id}')">
                                    RSVP
                                </button>
                            `}
                        </div>
                    `}
                </div>
            </div>
        `).join('');
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = `
            <div class="calendar-grid">
                <div class="calendar-weekdays">
                    <div class="weekday">Sun</div>
                    <div class="weekday">Mon</div>
                    <div class="weekday">Tue</div>
                    <div class="weekday">Wed</div>
                    <div class="weekday">Thu</div>
                    <div class="weekday">Fri</div>
                    <div class="weekday">Sat</div>
                </div>
                <div class="calendar-days">
        `;

        const currentDate = new Date(startDate);
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const isCurrentMonth = currentDate.getMonth() === month;
                const isToday = this.isToday(currentDate);
                const dayEvents = this.getEventsForDate(currentDate);
                
                html += `
                    <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}" data-date="${this.formatDate(currentDate)}">
                        <div class="day-number">${currentDate.getDate()}</div>
                        <div class="day-events">
                            ${dayEvents.slice(0, 3).map(event => `
                                <div class="calendar-event ${event.category}" onclick="eventsManager.viewEvent('${event.id}')" title="${event.title}">
                                    <span class="event-title">${event.title}</span>
                                </div>
                            `).join('')}
                            ${dayEvents.length > 3 ? `<div class="more-events">+${dayEvents.length - 3} more</div>` : ''}
                        </div>
                    </div>
                `;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderWeekView() {
        // Simplified week view implementation
        return `
            <div class="week-view">
                <div class="week-header">
                    ${this.getWeekDays().map(day => `
                        <div class="week-day-header">
                            <div class="day-name">${day.name}</div>
                            <div class="day-date">${day.date}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="week-content">
                    <div class="time-slots">
                        ${this.generateTimeSlots().map(time => `
                            <div class="time-slot">
                                <div class="time-label">${time}</div>
                                <div class="time-content">
                                    <!-- Events for this time slot would go here -->
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderAgendaView() {
        const upcomingEvents = this.events
            .filter(e => new Date(e.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 10);

        return `
            <div class="agenda-view">
                ${upcomingEvents.map(event => `
                    <div class="agenda-item" onclick="eventsManager.viewEvent('${event.id}')">
                        <div class="agenda-date">
                            <div class="date-day">${this.formatEventDay(event.date)}</div>
                            <div class="date-month">${this.formatEventMonth(event.date)}</div>
                        </div>
                        <div class="agenda-event">
                            <div class="event-time">${this.formatEventTime(event.date)}</div>
                            <div class="event-title">${event.title}</div>
                            <div class="event-location">${event.location}</div>
                            <div class="event-category ${event.category}">${this.getCategoryName(event.category)}</div>
                        </div>
                        <div class="agenda-actions">
                            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); eventsManager.rsvpEvent('${event.id}')">
                                RSVP
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderPastEventsTimeline() {
        const pastEvents = this.events.filter(e => new Date(e.date) < new Date()).slice(0, 10);
        
        return pastEvents.map(event => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${this.formatEventDate(event.date)}</div>
                    <div class="timeline-event">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <div class="event-stats">
                            <span class="stat">
                                <i class="fas fa-users"></i>
                                ${event.attendees} attended
                            </span>
                            <span class="stat">
                                <i class="fas fa-heart"></i>
                                ${event.rating || 4.5}/5 rating
                            </span>
                        </div>
                        <div class="timeline-actions">
                            <button class="btn btn-sm btn-secondary" onclick="eventsManager.viewEvent('${event.id}')">
                                View Details
                            </button>
                            <button class="btn btn-sm btn-info" onclick="eventsManager.viewEventPhotos('${event.id}')">
                                <i class="fas fa-images"></i>
                                Photos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEventModal() {
        return `
            <div class="modal-overlay" id="event-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3 id="event-modal-title">Event Details</h3>
                        <button class="modal-close" onclick="eventsManager.closeModal('event-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="event-modal-body">
                        <!-- Event details will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderCreateEventModal() {
        return `
            <div class="modal-overlay" id="create-event-modal" style="display: none;">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3 id="create-event-title">Create New Event</h3>
                        <button class="modal-close" onclick="eventsManager.closeModal('create-event-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="create-event-form" class="event-form">
                            <div class="form-section">
                                <h4>Basic Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-title">Event Title *</label>
                                        <input type="text" id="event-title" name="title" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-category">Category *</label>
                                        <select id="event-category" name="category" required>
                                            <option value="">Select category...</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="advocacy">Advocacy</option>
                                            <option value="education">Education</option>
                                            <option value="support">Support Groups</option>
                                            <option value="social">Social</option>
                                            <option value="fundraising">Fundraising</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="event-description">Description *</label>
                                    <textarea id="event-description" name="description" rows="4" required></textarea>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Date & Time</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-date">Date *</label>
                                        <input type="date" id="event-date" name="date" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-time">Time *</label>
                                        <input type="time" id="event-time" name="time" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-duration">Duration (hours)</label>
                                        <input type="number" id="event-duration" name="duration" min="0.5" max="24" step="0.5" value="2">
                                    </div>
                                    <div class="form-group">
                                        <label for="event-timezone">Timezone</label>
                                        <select id="event-timezone" name="timezone">
                                            <option value="CAT">CAT (Central Africa Time)</option>
                                            <option value="UTC">UTC</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Location</h4>
                                <div class="form-group">
                                    <label>
                                        <input type="radio" name="location-type" value="physical" checked>
                                        Physical Location
                                    </label>
                                    <label>
                                        <input type="radio" name="location-type" value="online">
                                        Online Event
                                    </label>
                                    <label>
                                        <input type="radio" name="location-type" value="hybrid">
                                        Hybrid (Physical + Online)
                                    </label>
                                </div>
                                <div class="form-group" id="physical-location">
                                    <label for="event-address">Address/Venue *</label>
                                    <input type="text" id="event-address" name="address" placeholder="Enter venue address">
                                </div>
                                <div class="form-group" id="online-location" style="display: none;">
                                    <label for="event-link">Meeting Link</label>
                                    <input type="url" id="event-link" name="link" placeholder="https://zoom.us/j/...">
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Event Settings</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-capacity">Maximum Attendees</label>
                                        <input type="number" id="event-capacity" name="capacity" min="1" placeholder="Leave empty for unlimited">
                                    </div>
                                    <div class="form-group">
                                        <label for="event-fee">Registration Fee (ZMW)</label>
                                        <input type="number" id="event-fee" name="fee" min="0" step="0.01" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="event-approval" name="requiresApproval">
                                        Require approval for registration
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="event-featured" name="featured">
                                        Request to feature this event
                                    </label>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Additional Details</h4>
                                <div class="form-group">
                                    <label for="event-agenda">Agenda/Program</label>
                                    <textarea id="event-agenda" name="agenda" rows="3" placeholder="Optional: Outline the event schedule"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="event-requirements">Requirements/What to Bring</label>
                                    <textarea id="event-requirements" name="requirements" rows="2" placeholder="Optional: What attendees should bring or know"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="event-image">Event Image</label>
                                    <input type="file" id="event-image" name="image" accept="image/*">
                                    <small>Upload a banner image for your event</small>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="eventsManager.closeModal('create-event-modal')">Cancel</button>
                        <button class="btn btn-secondary" onclick="eventsManager.saveEventDraft()">Save as Draft</button>
                        <button class="btn btn-primary" onclick="eventsManager.createEvent()">Create Event</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRSVPModal() {
        return `
            <div class="modal-overlay" id="rsvp-modal" style="display: none;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>RSVP for Event</h3>
                        <button class="modal-close" onclick="eventsManager.closeModal('rsvp-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="rsvp-modal-body">
                        <!-- RSVP form will be populated here -->
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

        // Create event button
        const createEventBtn = document.getElementById('create-event-btn');
        if (createEventBtn) {
            createEventBtn.addEventListener('click', () => {
                this.showModal('create-event-modal');
            });
        }

        // Search functionality
        const eventsSearch = document.getElementById('events-search');
        if (eventsSearch) {
            eventsSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('category-filter');
        const dateFilter = document.getElementById('date-filter');
        const locationFilter = document.getElementById('location-filter');

        [categoryFilter, dateFilter, locationFilter].forEach(filter => {
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

        // My Events tabs
        const myEventsTabs = document.querySelectorAll('.tab-btn');
        myEventsTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchMyEventsTab(e.target.getAttribute('data-tab'));
            });
        });

        // Calendar controls
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.navigateCalendar(-1);
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.navigateCalendar(1);
            });
        }

        // Calendar view toggle
        const calendarViewBtns = document.querySelectorAll('.view-btn');
        calendarViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCalendarView(e.target.getAttribute('data-view'));
            });
        });

        // Location type radio buttons
        const locationTypeRadios = document.querySelectorAll('input[name="location-type"]');
        locationTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleLocationFields(e.target.value);
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

    switchLayout(layout) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-layout') === layout);
        });

        const eventsGrid = document.getElementById('events-grid');
        if (eventsGrid) {
            eventsGrid.classList.toggle('list-view', layout === 'list');
        }
    }

    switchMyEventsTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        // Update active panel
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
    }

    switchCalendarView(viewType) {
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-view') === viewType);
        });

        // Update active view
        document.querySelectorAll('.calendar-view').forEach(view => {
            view.classList.toggle('active', view.id === `${viewType}-view`);
        });

        this.calendarView = viewType;
    }

    navigateCalendar(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.refreshCalendarView();
    }

    toggleLocationFields(type) {
        const physicalLocation = document.getElementById('physical-location');
        const onlineLocation = document.getElementById('online-location');

        if (type === 'online') {
            physicalLocation.style.display = 'none';
            onlineLocation.style.display = 'block';
        } else if (type === 'physical') {
            physicalLocation.style.display = 'block';
            onlineLocation.style.display = 'none';
        } else { // hybrid
            physicalLocation.style.display = 'block';
            onlineLocation.style.display = 'block';
        }
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'upcoming':
                this.refreshUpcomingEvents();
                break;
            case 'calendar':
                this.refreshCalendarView();
                break;
            case 'my-events':
                this.refreshMyEvents();
                break;
        }
    }

    refreshUpcomingEvents() {
        const grid = document.getElementById('events-grid');
        if (grid) {
            const upcomingEvents = this.events.filter(e => new Date(e.date) > new Date());
            grid.innerHTML = this.renderEventsGrid(upcomingEvents);
        }
    }

    refreshCalendarView() {
        const calendarTitle = document.getElementById('calendar-title');
        if (calendarTitle) {
            calendarTitle.textContent = this.formatMonthYear(this.currentDate);
        }

        const monthView = document.getElementById('month-view');
        if (monthView && this.calendarView === 'month') {
            monthView.innerHTML = this.renderMonthView();
        }
    }

    refreshMyEvents() {
        // Refresh my events tabs content
        console.log('Refreshing my events...');
    }

    handleSearch(query) {
        // Implement search functionality
        console.log('Searching events:', query);
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const dateFilter = document.getElementById('date-filter');
        const locationFilter = document.getElementById('location-filter');

        const filters = {
            category: categoryFilter?.value || 'all',
            date: dateFilter?.value || 'all',
            location: locationFilter?.value || 'all'
        };

        // Apply filters to events display
        console.log('Applying filters:', filters);
    }

    // Event actions
    viewEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showEventDetails(event);
        }
    }

    showEventDetails(event) {
        const modalBody = document.getElementById('event-modal-body');
        modalBody.innerHTML = `
            <div class="event-detail-content">
                <div class="event-detail-image">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-detail-category ${event.category}">${this.getCategoryName(event.category)}</div>
                </div>
                <div class="event-detail-info">
                    <h2>${event.title}</h2>
                    <div class="event-detail-meta">
                        <div class="meta-row">
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${this.formatEventDate(event.date)}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${this.formatEventTime(event.date)}</span>
                            </div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${event.attendees}/${event.maxAttendees || '∞'} attending</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-organizer-info">
                        <img src="${event.organizer.avatar}" alt="${event.organizer.name}">
                        <div>
                            <strong>Organized by</strong>
                            <p>${event.organizer.name}</p>
                        </div>
                    </div>
                    <div class="event-description">
                        <h4>About this event</h4>
                        <p>${event.description}</p>
                        ${event.agenda ? `
                            <h4>Agenda</h4>
                            <p>${event.agenda}</p>
                        ` : ''}
                        ${event.requirements ? `
                            <h4>What to bring</h4>
                            <p>${event.requirements}</p>
                        ` : ''}
                    </div>
                    <div class="event-actions-detail">
                        <button class="btn btn-primary btn-lg" onclick="eventsManager.rsvpEvent('${event.id}')">
                            <i class="fas fa-calendar-check"></i>
                            RSVP to Event
                        </button>
                        <button class="btn btn-secondary" onclick="eventsManager.shareEvent('${event.id}')">
                            <i class="fas fa-share"></i>
                            Share Event
                        </button>
                        <button class="btn btn-info" onclick="eventsManager.addToCalendar('${event.id}')">
                            <i class="fas fa-calendar-plus"></i>
                            Add to Calendar
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.showModal('event-modal');
    }

    rsvpEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const modalBody = document.getElementById('rsvp-modal-body');
            modalBody.innerHTML = `
                <div class="rsvp-content">
                    <div class="rsvp-event-info">
                        <h4>${event.title}</h4>
                        <p>${this.formatEventDate(event.date)} at ${this.formatEventTime(event.date)}</p>
                        <p>${event.location}</p>
                    </div>
                    <form id="rsvp-form">
                        <div class="form-group">
                            <label>Your Response *</label>
                            <div class="rsvp-options">
                                <label class="rsvp-option">
                                    <input type="radio" name="response" value="attending" required>
                                    <span class="option-text">
                                        <i class="fas fa-check text-success"></i>
                                        Attending
                                    </span>
                                </label>
                                <label class="rsvp-option">
                                    <input type="radio" name="response" value="interested" required>
                                    <span class="option-text">
                                        <i class="fas fa-star text-warning"></i>
                                        Interested
                                    </span>
                                </label>
                                <label class="rsvp-option">
                                    <input type="radio" name="response" value="not-attending" required>
                                    <span class="option-text">
                                        <i class="fas fa-times text-danger"></i>
                                        Can't Attend
                                    </span>
                                </label>
                            </div>
                        </div>
                        ${event.fee && event.fee > 0 ? `
                            <div class="fee-info">
                                <p><strong>Registration Fee:</strong> ZMW ${event.fee}</p>
                                <p><small>Payment will be processed after confirmation</small></p>
                            </div>
                        ` : ''}
                        <div class="form-group">
                            <label for="rsvp-notes">Notes (optional)</label>
                            <textarea id="rsvp-notes" name="notes" rows="3" placeholder="Any dietary restrictions, accessibility needs, or questions?"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="notifications" checked>
                                Send me updates about this event
                            </label>
                        </div>
                    </form>
                    <div class="rsvp-actions">
                        <button class="btn btn-secondary" onclick="eventsManager.closeModal('rsvp-modal')">Cancel</button>
                        <button class="btn btn-primary" onclick="eventsManager.submitRSVP('${eventId}')">
                            Submit RSVP
                        </button>
                    </div>
                </div>
            `;
            this.showModal('rsvp-modal');
        }
    }

    submitRSVP(eventId) {
        const form = document.getElementById('rsvp-form');
        const formData = new FormData(form);
        
        // Simulate RSVP submission
        this.closeModal('rsvp-modal');
        this.showNotification('RSVP submitted successfully!', 'success');
    }

    createEvent() {
        const form = document.getElementById('create-event-form');
        const formData = new FormData(form);
        
        const newEvent = {
            id: `event_${Date.now()}`,
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            date: new Date(formData.get('date') + 'T' + formData.get('time')).toISOString(),
            location: formData.get('location-type') === 'online' ? 'Online Event' : formData.get('address'),
            organizer: this.currentUser,
            attendees: 0,
            maxAttendees: formData.get('capacity') || null,
            fee: parseFloat(formData.get('fee')) || 0,
            featured: formData.get('featured') === 'on',
            image: 'assets/events/default.jpg'
        };

        this.events.unshift(newEvent);
        this.userEvents.hosting.unshift(newEvent);
        
        this.closeModal('create-event-modal');
        this.showNotification('Event created successfully!', 'success');
        this.refreshUpcomingEvents();
    }

    filterByCategory(categoryId) {
        // Show events for specific category
        const categoryEvents = document.getElementById('category-events');
        const categoryEventsGrid = document.getElementById('category-events-grid');
        const categoryEventsTitle = document.getElementById('category-events-title');
        
        const category = this.eventCategories.find(c => c.id === categoryId);
        const filteredEvents = this.events.filter(e => e.category === categoryId);
        
        categoryEventsTitle.textContent = `${category.name} Events`;
        categoryEventsGrid.innerHTML = this.renderEventsGrid(filteredEvents);
        categoryEvents.style.display = 'block';
        
        // Hide categories grid
        document.querySelector('.categories-grid').style.display = 'none';
    }

    // Utility functions
    formatEventDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatEventTime(dateString) {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    formatEventDay(dateString) {
        return new Date(dateString).getDate().toString();
    }

    formatEventMonth(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
    }

    formatMonthYear(date) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getEventsForDate(date) {
        const dateString = this.formatDate(date);
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.formatDate(eventDate) === dateString;
        });
    }

    getWeekDays() {
        const days = [];
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push({
                name: day.toLocaleDateString('en-US', { weekday: 'short' }),
                date: day.getDate()
            });
        }
        return days;
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 6; hour < 24; hour++) {
            slots.push(`${hour}:00`);
        }
        return slots;
    }

    getCategoryName(categoryId) {
        const category = this.eventCategories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    getEventStatusLabel(status) {
        const labels = {
            attending: 'Attending',
            hosting: 'Hosting',
            interested: 'Interested',
            invitations: 'Invited'
        };
        return labels[status] || status;
    }

    loadInitialData() {
        this.refreshUpcomingEvents();
    }

    startEventUpdates() {
        // Simulate real-time event updates
        setInterval(() => {
            this.updateEventStats();
        }, 60000); // Update every minute
    }

    updateEventStats() {
        // Update event statistics
        console.log('Updating event statistics...');
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
    generateMockEvents() {
        const events = [];
        const titles = [
            'Healthcare Workshop: Managing Skin Care',
            'Community Advocacy Meeting',
            'Youth Empowerment Session',
            'Educational Webinar: Albinism Awareness',
            'Support Group Gathering',
            'Fundraising Gala Event',
            'Medical Check-up Camp',
            'Family Fun Day',
            'Skills Development Workshop',
            'Awareness Campaign Launch'
        ];
        
        const descriptions = [
            'Join us for an informative session about healthcare and wellness for people with albinism.',
            'Come together to discuss community advocacy initiatives and plan upcoming campaigns.',
            'Empowering young people with albinism through education and skill development.',
            'Learn about albinism, its challenges, and how to create inclusive environments.',
            'A safe space for sharing experiences and supporting each other.'
        ];

        const locations = ['Lusaka Community Center', 'Kitwe Medical Center', 'Online Event', 'Ndola Conference Hall', 'Livingstone Community Hall'];
        const categories = ['healthcare', 'advocacy', 'education', 'support', 'social', 'fundraising'];

        for (let i = 0; i < 20; i++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90)); // Next 90 days
            
            events.push({
                id: `event_${i + 1}`,
                title: titles[i % titles.length],
                description: descriptions[i % descriptions.length],
                category: categories[i % categories.length],
                date: futureDate.toISOString(),
                location: locations[i % locations.length],
                organizer: {
                    name: 'AFZ Community',
                    avatar: 'assets/avatars/organizer.jpg'
                },
                attendees: Math.floor(Math.random() * 100) + 10,
                maxAttendees: Math.floor(Math.random() * 150) + 50,
                fee: i % 4 === 0 ? Math.floor(Math.random() * 50) : 0,
                featured: i < 3,
                image: `assets/events/event${(i % 5) + 1}.jpg`,
                agenda: 'Detailed agenda will be shared with registered participants.',
                requirements: 'Please bring a notebook and pen for the session.'
            });
        }
        return events;
    }

    generateUserEvents() {
        return {
            attending: [
                {
                    id: 'event_1',
                    title: 'Healthcare Workshop: Managing Skin Care',
                    description: 'Learn essential skin care tips and techniques.',
                    date: '2024-02-15T10:00:00Z',
                    location: 'Lusaka Community Center',
                    attendees: 45,
                    image: 'assets/events/healthcare1.jpg',
                    status: 'confirmed'
                }
            ],
            hosting: [
                {
                    id: 'event_host_1',
                    title: 'Albinism Awareness Campaign',
                    description: 'Community awareness event about albinism.',
                    date: '2024-02-20T14:00:00Z',
                    location: 'Kitwe Community Center',
                    attendees: 67,
                    image: 'assets/events/awareness1.jpg',
                    status: 'active'
                }
            ],
            interested: [
                {
                    id: 'event_2',
                    title: 'Youth Empowerment Session',
                    description: 'Skills development for young people.',
                    date: '2024-02-25T09:00:00Z',
                    location: 'Online Event',
                    attendees: 32,
                    image: 'assets/events/youth1.jpg',
                    status: 'interested'
                }
            ],
            invitations: [
                {
                    id: 'event_3',
                    title: 'Medical Check-up Camp',
                    description: 'Free medical consultations and check-ups.',
                    date: '2024-03-05T08:00:00Z',
                    location: 'Ndola Medical Center',
                    attendees: 89,
                    image: 'assets/events/medical1.jpg',
                    status: 'pending'
                }
            ]
        };
    }

    generateEventCategories() {
        return [
            {
                id: 'healthcare',
                name: 'Healthcare',
                description: 'Medical workshops, health camps, and wellness sessions',
                icon: 'heartbeat',
                eventCount: 15,
                upcomingCount: 8
            },
            {
                id: 'advocacy',
                name: 'Advocacy',
                description: 'Rights awareness, policy discussions, and community action',
                icon: 'bullhorn',
                eventCount: 12,
                upcomingCount: 5
            },
            {
                id: 'education',
                name: 'Education',
                description: 'Learning workshops, skill development, and training sessions',
                icon: 'graduation-cap',
                eventCount: 18,
                upcomingCount: 9
            },
            {
                id: 'support',
                name: 'Support Groups',
                description: 'Peer support meetings and counseling sessions',
                icon: 'hands-helping',
                eventCount: 10,
                upcomingCount: 4
            },
            {
                id: 'social',
                name: 'Social Events',
                description: 'Community gatherings, celebrations, and networking',
                icon: 'users',
                eventCount: 22,
                upcomingCount: 11
            },
            {
                id: 'fundraising',
                name: 'Fundraising',
                description: 'Charity events, galas, and fundraising campaigns',
                icon: 'donate',
                eventCount: 8,
                upcomingCount: 3
            }
        ];
    }

    generateEventStats() {
        return {
            upcomingEvents: 24,
            newThisWeek: 5,
            myEvents: 8,
            rsvpPending: 3,
            hosting: 2,
            avgAttendees: 45,
            engagementScore: 87
        };
    }

    injectEventsStyles() {
        if (document.getElementById('events-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'events-styles';
        styles.textContent = `
            .events-interface {
                background: var(--surface-color);
                border-radius: 16px;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .events-header {
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

            /* Events Stats */
            .events-stats {
                padding: 24px 32px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-hover);
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 24px;
            }

            .stat-card {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                transition: all 0.3s ease;
            }

            .stat-card:hover {
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

            .stat-icon.upcoming { background: var(--primary-color); }
            .stat-icon.participating { background: var(--success-color); }
            .stat-icon.hosting { background: var(--warning-color); }
            .stat-icon.engagement { background: var(--info-color); }

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

            .stat-trend {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
            }

            .stat-trend.positive {
                background: var(--success-light);
                color: var(--success-color);
            }

            .stat-trend.neutral {
                background: var(--surface-hover);
                color: var(--text-secondary);
            }

            /* Navigation */
            .events-nav {
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
            .events-content {
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

            /* Events Controls */
            .events-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;
                gap: 24px;
            }

            .search-section {
                display: flex;
                align-items: center;
                gap: 16px;
                flex: 1;
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

            /* Featured Events */
            .featured-events {
                margin-bottom: 48px;
            }

            .featured-events h2 {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 24px;
                color: var(--text-primary);
            }

            .featured-events-slider {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
            }

            .featured-event-card {
                height: 200px;
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .featured-event-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }

            .featured-event-bg {
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                position: relative;
            }

            .featured-event-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
                display: flex;
                align-items: flex-end;
                padding: 24px;
            }

            .featured-event-content {
                color: white;
            }

            .featured-category {
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
                margin-bottom: 8px;
                display: inline-block;
            }

            .featured-category.healthcare { background: var(--error-color); }
            .featured-category.advocacy { background: var(--warning-color); }
            .featured-category.education { background: var(--info-color); }
            .featured-category.social { background: var(--success-color); }

            .featured-event-content h3 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
            }

            .featured-date,
            .featured-location {
                font-size: 13px;
                margin: 0 0 4px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .featured-attendees {
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 6px;
                opacity: 0.9;
            }

            /* Events Grid */
            .events-section h2 {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 24px;
                color: var(--text-primary);
            }

            .events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .events-grid.list-view {
                grid-template-columns: 1fr;
            }

            .event-card {
                background: var(--surface-hover);
                border-radius: 16px;
                border: 1px solid var(--border-color);
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .event-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color);
            }

            .event-image {
                position: relative;
                height: 200px;
                overflow: hidden;
            }

            .event-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .event-category {
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
                color: white;
            }

            .featured-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                background: var(--warning-color);
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }

            .event-content {
                padding: 20px;
                display: flex;
                gap: 16px;
            }

            .event-date {
                text-align: center;
                min-width: 50px;
            }

            .date-day {
                font-size: 24px;
                font-weight: 700;
                color: var(--primary-color);
                line-height: 1;
            }

            .date-month {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
                text-transform: uppercase;
            }

            .event-info {
                flex: 1;
            }

            .event-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
                line-height: 1.3;
            }

            .event-description {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .event-meta {
                margin-bottom: 12px;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--text-secondary);
                margin-bottom: 4px;
            }

            .meta-item i {
                width: 14px;
                opacity: 0.7;
            }

            .event-organizer {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--text-secondary);
            }

            .organizer-avatar {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                object-fit: cover;
            }

            .event-actions {
                padding: 16px 20px;
                border-top: 1px solid var(--border-color);
                display: flex;
                gap: 12px;
                justify-content: space-between;
            }

            /* My Events */
            .my-events-container {
                max-width: 1200px;
            }

            .my-events-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 32px;
                border-bottom: 1px solid var(--border-color);
            }

            .tab-btn {
                background: none;
                border: none;
                padding: 16px 24px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .tab-btn:hover {
                color: var(--text-primary);
            }

            .tab-btn.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }

            .tab-panel {
                display: none;
            }

            .tab-panel.active {
                display: block;
            }

            .user-event-item {
                display: flex;
                gap: 20px;
                padding: 24px;
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                margin-bottom: 16px;
                transition: all 0.2s ease;
            }

            .user-event-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .event-thumbnail {
                width: 120px;
                height: 80px;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                flex-shrink: 0;
            }

            .event-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .event-status {
                position: absolute;
                top: 6px;
                right: 6px;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
            }

            .event-status.attending { background: var(--success-color); }
            .event-status.hosting { background: var(--warning-color); }
            .event-status.interested { background: var(--info-color); }
            .event-status.pending { background: var(--text-secondary); }

            .event-details {
                flex: 1;
            }

            .event-details h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .event-summary {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 12px;
                line-height: 1.4;
            }

            .event-info-row {
                display: flex;
                gap: 20px;
                margin-bottom: 16px;
            }

            .info-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .host-controls,
            .invitation-actions,
            .event-quick-actions {
                display: flex;
                gap: 8px;
            }

            /* Calendar */
            .calendar-container {
                max-width: 1200px;
            }

            .calendar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 32px;
                padding: 0 8px;
            }

            .calendar-controls {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .calendar-controls h3 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                color: var(--text-primary);
                min-width: 200px;
                text-align: center;
            }

            .calendar-view-toggle {
                display: flex;
                gap: 4px;
            }

            .view-btn {
                padding: 8px 16px;
                border: 1px solid var(--border-color);
                background: var(--surface-color);
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .view-btn:first-child {
                border-radius: 8px 0 0 8px;
            }

            .view-btn:last-child {
                border-radius: 0 8px 8px 0;
            }

            .view-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            .calendar-content {
                margin-bottom: 24px;
            }

            .calendar-view {
                display: none;
            }

            .calendar-view.active {
                display: block;
            }

            /* Month View */
            .calendar-grid {
                background: var(--surface-color);
                border-radius: 12px;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }

            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                background: var(--surface-hover);
            }

            .weekday {
                padding: 16px 8px;
                text-align: center;
                font-weight: 600;
                color: var(--text-secondary);
                font-size: 14px;
                border-right: 1px solid var(--border-color);
            }

            .weekday:last-child {
                border-right: none;
            }

            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
            }

            .calendar-day {
                min-height: 120px;
                padding: 8px;
                border-right: 1px solid var(--border-color);
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: background 0.2s ease;
                position: relative;
            }

            .calendar-day:hover {
                background: var(--surface-hover);
            }

            .calendar-day.today {
                background: var(--primary-light);
            }

            .calendar-day.other-month {
                opacity: 0.5;
            }

            .day-number {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .day-events {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .calendar-event {
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .more-events {
                font-size: 10px;
                color: var(--text-secondary);
                text-align: center;
                cursor: pointer;
                padding: 2px;
            }

            /* Calendar Legend */
            .calendar-legend {
                display: flex;
                gap: 24px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .legend-color {
                width: 16px;
                height: 16px;
                border-radius: 4px;
            }

            .legend-color.healthcare { background: var(--error-color); }
            .legend-color.advocacy { background: var(--warning-color); }
            .legend-color.education { background: var(--info-color); }
            .legend-color.social { background: var(--success-color); }
            .legend-color.my-event { background: var(--primary-color); }

            .legend-label {
                font-size: 13px;
                color: var(--text-secondary);
            }

            /* Categories */
            .categories-container {
                max-width: 1000px;
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
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
                align-items: center;
                gap: 20px;
            }

            .category-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color);
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
                flex-shrink: 0;
            }

            .category-icon.healthcare { background: var(--error-color); }
            .category-icon.advocacy { background: var(--warning-color); }
            .category-icon.education { background: var(--info-color); }
            .category-icon.support { background: var(--success-color); }
            .category-icon.social { background: var(--primary-color); }
            .category-icon.fundraising { background: var(--text-secondary); }

            .category-content {
                flex: 1;
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

            .category-stats {
                display: flex;
                gap: 16px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .category-arrow {
                color: var(--text-secondary);
                font-size: 18px;
            }

            /* Past Events */
            .past-events-container {
                max-width: 900px;
            }

            .past-events-header {
                margin-bottom: 32px;
            }

            .past-events-header h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .past-events-header p {
                color: var(--text-secondary);
                margin: 0;
            }

            .past-events-filters {
                display: flex;
                gap: 16px;
                margin-bottom: 32px;
            }

            .past-events-timeline {
                position: relative;
            }

            .past-events-timeline::before {
                content: '';
                position: absolute;
                left: 20px;
                top: 0;
                bottom: 0;
                width: 2px;
                background: var(--border-color);
            }

            .timeline-item {
                display: flex;
                gap: 24px;
                margin-bottom: 32px;
                position: relative;
            }

            .timeline-marker {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--primary-color);
                margin-top: 6px;
                flex-shrink: 0;
                position: relative;
                z-index: 1;
                border: 3px solid var(--surface-color);
            }

            .timeline-content {
                flex: 1;
                background: var(--surface-hover);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid var(--border-color);
            }

            .timeline-date {
                font-size: 13px;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }

            .timeline-event h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .timeline-event p {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 0 0 16px;
                line-height: 1.4;
            }

            .event-stats {
                display: flex;
                gap: 20px;
                margin-bottom: 16px;
            }

            .event-stats .stat {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .timeline-actions {
                display: flex;
                gap: 8px;
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

            /* Event Detail Modal */
            .event-detail-content {
                max-width: none;
            }

            .event-detail-image {
                width: 100%;
                height: 200px;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 24px;
                position: relative;
            }

            .event-detail-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .event-detail-category {
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                text-transform: uppercase;
                color: white;
            }

            .event-detail-info h2 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 16px;
                color: var(--text-primary);
            }

            .event-detail-meta {
                margin-bottom: 24px;
            }

            .meta-row {
                display: flex;
                gap: 32px;
                margin-bottom: 12px;
            }

            .event-organizer-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: var(--surface-hover);
                border-radius: 8px;
                margin-bottom: 24px;
            }

            .event-organizer-info img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }

            .event-description h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 12px;
                color: var(--text-primary);
            }

            .event-description p {
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .event-actions-detail {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            /* Event Form */
            .event-form {
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

            .form-group input[type="radio"] {
                width: auto;
                margin-right: 8px;
            }

            .form-group label input[type="radio"] {
                margin-right: 8px;
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

            /* RSVP Modal */
            .rsvp-content {
                text-align: center;
            }

            .rsvp-event-info {
                background: var(--surface-hover);
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 24px;
            }

            .rsvp-event-info h4 {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .rsvp-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 16px;
            }

            .rsvp-option {
                display: flex;
                align-items: center;
                padding: 16px;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .rsvp-option:hover {
                border-color: var(--primary-color);
            }

            .rsvp-option input[type="radio"]:checked + .option-text {
                color: var(--primary-color);
                font-weight: 600;
            }

            .option-text {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                text-align: left;
            }

            .fee-info {
                background: var(--warning-light);
                border: 1px solid var(--warning-color);
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
            }

            .rsvp-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-top: 24px;
            }

            /* Empty State */
            .empty-state {
                text-align: center;
                padding: 48px 24px;
            }

            .empty-icon {
                font-size: 48px;
                color: var(--text-secondary);
                margin-bottom: 16px;
            }

            .empty-state h3 {
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 8px;
                color: var(--text-primary);
            }

            .empty-state p {
                color: var(--text-secondary);
                margin: 0;
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .events-header {
                    flex-direction: column;
                    gap: 24px;
                }

                .events-controls {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 16px;
                }

                .search-section {
                    flex-direction: column;
                }

                .filter-controls {
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .events-grid,
                .featured-events-slider,
                .categories-grid {
                    grid-template-columns: 1fr;
                }

                .meta-row {
                    flex-direction: column;
                    gap: 8px;
                }

                .event-actions-detail {
                    flex-direction: column;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }

                .calendar-header {
                    flex-direction: column;
                    gap: 16px;
                    text-align: center;
                }

                .calendar-legend {
                    flex-direction: column;
                    gap: 12px;
                }

                .user-event-item {
                    flex-direction: column;
                    gap: 12px;
                }

                .event-thumbnail {
                    width: 100%;
                    height: 150px;
                }

                .event-info-row {
                    flex-direction: column;
                    gap: 8px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in main dashboard
window.EventsManager = EventsManager;
