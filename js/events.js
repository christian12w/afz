// Events Page JavaScript
class EventManager {
    constructor() {
        this.events = [];
        this.currentView = 'calendar';
        this.currentDate = new Date();
        this.currentPage = 1;
        this.eventsPerPage = 10;
        this.filters = {
            category: 'all',
            location: 'all',
            search: ''
        };
        
        this.init();
        this.loadSampleData();
        this.render();
    }

    init() {
        this.bindEventListeners();
        this.initializeCalendar();
    }

    bindEventListeners() {
        // View toggle buttons
        const calendarViewBtn = document.getElementById('calendarViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (calendarViewBtn && listViewBtn) {
            calendarViewBtn.addEventListener('click', () => this.switchView('calendar'));
            listViewBtn.addEventListener('click', () => this.switchView('list'));
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        const searchInput = document.getElementById('searchInput');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        }
        
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateMonth(1));
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
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

        // Create event modal
        const createEventBtn = document.getElementById('createEventBtn');
        const closeCreateEventModal = document.getElementById('closeCreateEventModal');
        const cancelCreateEvent = document.getElementById('cancelCreateEvent');
        const createEventForm = document.getElementById('createEventForm');

        if (createEventBtn) {
            createEventBtn.addEventListener('click', () => this.openCreateEventModal());
        }

        if (closeCreateEventModal) {
            closeCreateEventModal.addEventListener('click', () => this.closeCreateEventModal());
        }

        if (cancelCreateEvent) {
            cancelCreateEvent.addEventListener('click', () => this.closeCreateEventModal());
        }

        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => this.handleCreateEvent(e));
        }

        // Event details modal
        const closeEventModal = document.getElementById('closeEventModal');
        if (closeEventModal) {
            closeEventModal.addEventListener('click', () => this.closeEventModal());
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

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Upcoming events button
        const upcomingEventsBtn = document.getElementById('upcomingEventsBtn');
        if (upcomingEventsBtn) {
            upcomingEventsBtn.addEventListener('click', () => this.showUpcomingEvents());
        }
    }

    initializeCalendar() {
        this.renderCalendar();
    }

    loadSampleData() {
        // Sample events data
        const sampleEvents = [
            {
                id: '1',
                title: 'Albinism Awareness Workshop',
                description: 'Educational workshop about albinism myths and facts for healthcare workers.',
                category: 'workshop',
                date: new Date('2024-08-20'),
                time: '14:00',
                location: 'Lusaka Central Hospital',
                capacity: 50,
                attendees: 23,
                organizer: 'Dr. Sarah Phiri',
                status: 'upcoming'
            },
            {
                id: '2',
                title: 'Advocacy Meeting with MPs',
                description: 'Meeting with Members of Parliament to discuss albinism rights legislation.',
                category: 'advocacy',
                date: new Date('2024-08-22'),
                time: '10:00',
                location: 'Parliament Building, Lusaka',
                capacity: 20,
                attendees: 15,
                organizer: 'AFZ Policy Team',
                status: 'upcoming'
            },
            {
                id: '3',
                title: 'Community Sunscreen Distribution',
                description: 'Free sunscreen distribution event for persons with albinism in rural areas.',
                category: 'support',
                date: new Date('2024-08-25'),
                time: '09:00',
                location: 'Chipata Community Center',
                capacity: 100,
                attendees: 45,
                organizer: 'AFZ Outreach Team',
                status: 'upcoming'
            },
            {
                id: '4',
                title: 'Fundraising Gala Dinner',
                description: 'Annual fundraising dinner to support albinism advocacy programs.',
                category: 'fundraising',
                date: new Date('2024-08-30'),
                time: '18:00',
                location: 'Pamodzi Hotel, Lusaka',
                capacity: 200,
                attendees: 120,
                organizer: 'AFZ Events Committee',
                status: 'upcoming'
            },
            {
                id: '5',
                title: 'School Awareness Campaign',
                description: 'Educational campaign in schools to promote inclusion and prevent discrimination.',
                category: 'awareness',
                date: new Date('2024-09-05'),
                time: '08:00',
                location: 'Multiple Schools - Ndola',
                capacity: 500,
                attendees: 0,
                organizer: 'AFZ Education Team',
                status: 'upcoming'
            },
            {
                id: '6',
                title: 'Medical Outreach Program',
                description: 'Free medical checkups and consultations for persons with albinism.',
                category: 'support',
                date: new Date('2024-09-10'),
                time: '09:00',
                location: 'Kitwe General Hospital',
                capacity: 75,
                attendees: 30,
                organizer: 'Medical Team',
                status: 'upcoming'
            }
        ];

        this.events = sampleEvents;
        this.originalEvents = [...sampleEvents]; // Keep original for filtering
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        const calendarBtn = document.getElementById('calendarViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (calendarBtn && listBtn) {
            calendarBtn.classList.toggle('toggle-btn-active', view === 'calendar');
            listBtn.classList.toggle('toggle-btn-active', view === 'list');
            
            calendarBtn.setAttribute('aria-pressed', view === 'calendar');
            listBtn.setAttribute('aria-pressed', view === 'list');
        }
        
        // Update view containers
        const calendarView = document.getElementById('calendarView');
        const listView = document.getElementById('listView');
        
        if (calendarView && listView) {
            calendarView.classList.toggle('events-view-hidden', view !== 'calendar');
            listView.classList.toggle('events-view-hidden', view !== 'list');
        }
        
        this.render();
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    render() {
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        } else {
            this.renderEventsList();
        }
    }

    renderCalendar() {
        const calendarTitle = document.getElementById('calendarTitle');
        const calendarDays = document.getElementById('calendarDays');
        
        if (!calendarTitle || !calendarDays) return;

        // Update calendar title
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        calendarTitle.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        // Clear previous calendar
        calendarDays.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createCalendarDay(date);
            calendarDays.appendChild(dayElement);
        }
    }

    createCalendarDay(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.setAttribute('tabindex', '0');
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);

        // Add classes for styling
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
        
        if (isToday) {
            dayElement.classList.add('calendar-day-today');
        }
        
        if (!isCurrentMonth) {
            dayElement.classList.add('calendar-day-other-month');
        }

        // Add events for this day
        const dayEvents = this.getEventsForDate(date);
        if (dayEvents.length > 0) {
            dayElement.classList.add('calendar-day-has-events');
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            
            dayEvents.slice(0, 3).forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `calendar-event event-${event.category}`;
                eventElement.textContent = event.title;
                eventElement.setAttribute('title', event.title);
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openEventModal(event);
                });
                eventsContainer.appendChild(eventElement);
            });
            
            if (dayEvents.length > 3) {
                const moreElement = document.createElement('div');
                moreElement.className = 'calendar-event';
                moreElement.textContent = `+${dayEvents.length - 3} more`;
                eventsContainer.appendChild(moreElement);
            }
            
            dayElement.appendChild(eventsContainer);
        }

        // Add click handler for day selection
        dayElement.addEventListener('click', () => {
            // Could implement day selection functionality here
            console.log('Selected date:', date.toDateString());
        });

        // Keyboard navigation
        dayElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dayElement.click();
            }
        });

        return dayElement;
    }

    getEventsForDate(date) {
        return this.events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
    }

    renderEventsList() {
        const eventsList = document.getElementById('eventsList');
        const noEvents = document.getElementById('noEvents');
        
        if (!eventsList || !noEvents) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const paginatedEvents = this.events.slice(startIndex, endIndex);

        if (paginatedEvents.length === 0) {
            eventsList.style.display = 'none';
            noEvents.style.display = 'block';
        } else {
            eventsList.style.display = 'block';
            noEvents.style.display = 'none';

            eventsList.innerHTML = '';
            
            paginatedEvents.forEach(event => {
                const eventCard = this.createEventCard(event);
                eventsList.appendChild(eventCard);
            });
        }

        this.updatePagination();
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${event.title}`);

        const eventDate = event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="event-card-header">
                <h3 class="event-card-title">${event.title}</h3>
                <span class="event-category category-${event.category}">${event.category}</span>
            </div>
            
            <div class="event-card-meta">
                <div class="event-meta-item">
                    <svg class="event-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${eventDate}</span>
                </div>
                <div class="event-meta-item">
                    <svg class="event-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>${event.time}</span>
                </div>
                <div class="event-meta-item">
                    <svg class="event-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${event.location}</span>
                </div>
            </div>
            
            <p class="event-card-description">${event.description}</p>
            
            <div class="event-card-actions">
                <span class="event-status status-${event.status}">${event.status.toUpperCase()}</span>
                <div class="event-attendees">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>${event.attendees}/${event.capacity} attending</span>
                </div>
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            this.openEventModal(event);
        });

        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openEventModal(event);
            }
        });

        return card;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.events.length / this.eventsPerPage);
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
        const totalPages = Math.ceil(this.events.length / this.eventsPerPage);
        const newPage = this.currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderEventsList();
        }
    }

    applyFilters() {
        this.currentPage = 1; // Reset to first page
        this.events = this.originalEvents.filter(event => {
            const matchesCategory = this.filters.category === 'all' || event.category === this.filters.category;
            const matchesLocation = this.filters.location === 'all' || 
                                  event.location.toLowerCase().includes(this.filters.location);
            const matchesSearch = this.filters.search === '' || 
                                event.title.toLowerCase().includes(this.filters.search) ||
                                event.description.toLowerCase().includes(this.filters.search);

            return matchesCategory && matchesLocation && matchesSearch;
        });

        this.render();
    }

    clearFilters() {
        this.filters = {
            category: 'all',
            location: 'all',
            search: ''
        };

        // Reset filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        const searchInput = document.getElementById('searchInput');

        if (categoryFilter) categoryFilter.value = 'all';
        if (locationFilter) locationFilter.value = 'all';
        if (searchInput) searchInput.value = '';

        this.applyFilters();
    }

    showUpcomingEvents() {
        this.switchView('list');
        
        // Filter to show only upcoming events
        const today = new Date();
        this.events = this.originalEvents.filter(event => 
            event.date >= today && event.status === 'upcoming'
        );
        
        this.currentPage = 1;
        this.renderEventsList();
    }

    openEventModal(event) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('eventModalTitle');
        const modalBody = document.getElementById('eventModalBody');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = event.title;
        
        const eventDate = event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        modalBody.innerHTML = `
            <div class="event-detail-header">
                <h3 class="event-detail-title">${event.title}</h3>
                <span class="event-detail-category category-${event.category}">${event.category}</span>
            </div>
            
            <div class="event-detail-meta">
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div class="event-detail-meta-text">${eventDate}</div>
                </div>
                
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <div class="event-detail-meta-text">${event.time}</div>
                </div>
                
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div class="event-detail-meta-text">${event.location}</div>
                </div>
                
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <div class="event-detail-meta-text">${event.attendees}/${event.capacity} Attendees</div>
                </div>
                
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div class="event-detail-meta-text">Organized by ${event.organizer}</div>
                </div>
                
                <div class="event-detail-meta-item">
                    <svg class="event-detail-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div class="event-detail-meta-text">Status: ${event.status.toUpperCase()}</div>
                </div>
            </div>
            
            <div class="event-detail-description">
                <p>${event.description}</p>
            </div>
            
            <div class="event-detail-actions">
                <button class="btn btn-primary" onclick="eventManager.registerForEvent('${event.id}')">
                    Register for Event
                </button>
                <button class="btn btn-outline" onclick="eventManager.shareEvent('${event.id}')">
                    Share Event
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

    closeEventModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    openCreateEventModal() {
        const modal = document.getElementById('createEventModal');
        if (modal) {
            modal.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            
            // Set minimum date to today
            const dateInput = document.getElementById('eventDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
            
            // Focus on first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeCreateEventModal() {
        const modal = document.getElementById('createEventModal');
        const form = document.getElementById('createEventForm');
        
        if (modal) {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        }
        
        if (form) {
            form.reset();
        }
    }

    handleCreateEvent(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventData = {
            id: Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            date: new Date(document.getElementById('eventDate').value),
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            capacity: parseInt(document.getElementById('eventCapacity').value) || 50,
            description: document.getElementById('eventDescription').value,
            attendees: 0,
            organizer: 'Current User',
            status: 'upcoming'
        };

        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.events.push(eventData);
            this.originalEvents.push(eventData);
            
            this.hideLoading();
            this.closeCreateEventModal();
            this.showNotification('Event created successfully!', 'success');
            this.render();
        }, 1500);
    }

    registerForEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event && event.attendees < event.capacity) {
            this.showLoading();
            
            setTimeout(() => {
                event.attendees++;
                this.hideLoading();
                this.showNotification('Successfully registered for event!', 'success');
                this.closeEventModal();
                this.render();
            }, 1000);
        } else {
            this.showNotification('Event is full or registration failed.', 'error');
        }
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event && navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const shareText = `${event.title} - ${event.description}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Event details copied to clipboard!', 'success');
            });
        }
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
            backgroundColor: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'
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

// Initialize events manager when page loads
let eventManager;

document.addEventListener('DOMContentLoaded', () => {
    eventManager = new EventManager();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}
