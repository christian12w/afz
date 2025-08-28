/**
 * AFZ Member Hub - Advanced Interactive Experience
 * Modern JavaScript functionality for the member portal
 * Matches the quality and features of dashboard.js
 */

class AFZMemberHub {
    constructor() {
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            email: 'john.doe@email.com',
            role: 'member',
            avatar: '../images/avatars/john-doe.jpg',
            status: 'online',
            joinDate: '2023-01-15',
            membershipType: 'Active Member'
        };
        
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('afz-member-hub-theme') || 'light';
        this.notifications = [];
        this.searchResults = [];
        this.isLoading = true;
        this.sectionHistory = ['dashboard'];
        
        // Feature flags for progressive enhancement
        this.features = {
            animations: true,
            notifications: true,
            realTimeUpdates: true,
            advancedSearch: true,
            offlineSupport: false
        };
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupTheme();
        this.setupKeyboardShortcuts();
        this.setupAnimations();
        this.setupRealtimeFeatures();
        this.initNotificationSystem();
        this.initMemberNetworking();
        this.loadUserData();
        this.setupAccessibility();
        this.checkBrowserCompatibility();
        this.bindLogout();
    }

    // ============================================
    // LOADING & INITIALIZATION
    // ============================================

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.isLoading = false;
                    this.animatePageEntrance();
                    this.announceToScreenReader('AFZ Member Hub loaded successfully');
                }, 600);
            }
        }, 2000);
    }

    bindLogout() {
        document.addEventListener('click', (e) => {
            const el = e.target.closest('[data-action="logout"]');
            if (!el) return;
            e.preventDefault();
            if (window.sb && window.sb.auth && window.sb.auth.signOut) {
                window.sb.auth.signOut().finally(() => {
                    window.location.href = './auth.html';
                });
            } else {
                window.location.href = './auth.html';
            }
        });
    }

    animatePageEntrance() {
        // Animate statistics cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });

        // Animate quick action cards
        const actionCards = document.querySelectorAll('.quick-action-card');
        actionCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                card.style.transition = 'all 0.5s ease-out';
                
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                });
            }, 200 + (index * 80));
        });

        // Animate number counters
        this.animateStatCounters();
    }

    animateStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(element => {
            const text = element.textContent.replace(/,/g, '');
            const isKwacha = text.includes('K');
            const finalNumber = parseInt(text.replace(/[^0-9]/g, '')) || 0;
            
            if (finalNumber > 0) {
                let currentNumber = 0;
                const increment = Math.ceil(finalNumber / 60); // 60 frame animation
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        currentNumber = finalNumber;
                        clearInterval(timer);
                    }
                    
                    let displayNumber = currentNumber.toLocaleString();
                    if (isKwacha) {
                        displayNumber = 'K' + displayNumber;
                    }
                    element.textContent = displayNumber;
                }, 16); // ~60fps
            }
        });
        
        // Initialize progress bars
        this.animateProgressBars();
        
        // Initialize mini charts
        this.initializeMiniCharts();
        
        // Set up interactive stat card handlers
        this.setupStatCardInteractions();
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const targetProgress = parseInt(bar.getAttribute('data-progress')) || 0;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = targetProgress + '%';
            }, 500);
        });
    }
    
    initializeMiniCharts() {
        const charts = document.querySelectorAll('.mini-chart');
        
        charts.forEach(chart => {
            const chartType = chart.getAttribute('data-chart');
            this.createMiniChart(chart, chartType);
        });
    }
    
    createMiniChart(canvas, type) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2; // Retina display
        const height = canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = canvas.offsetWidth + 'px';
        canvas.style.height = canvas.offsetHeight + 'px';
        ctx.scale(2, 2);
        
        // Generate sample data based on chart type
        const data = this.generateChartData(type);
        
        // Draw the mini chart
        this.drawMiniChart(ctx, data, type, width/2, height/2);
    }
    
    generateChartData(type) {
        const baseData = {
            members: [1180, 1200, 1220, 1235, 1248],
            events: [18, 20, 21, 22, 23],
            resources: [780, 810, 830, 840, 847],
            donations: [12000, 13500, 14200, 15000, 15420]
        };
        
        return baseData[type] || baseData.members;
    }
    
    drawMiniChart(ctx, data, type, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 10;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const valueRange = maxValue - minValue;
        
        // Set chart colors based on type
        const colors = {
            members: '#3b82f6',
            events: '#10b981',
            resources: '#06b6d4',
            donations: '#f59e0b'
        };
        
        const color = colors[type] || colors.members;
        
        // Draw area chart
        ctx.beginPath();
        ctx.fillStyle = color + '20'; // 20% opacity
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Create path for area fill
        const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return { x, y };
        });
        
        // Draw area
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.lineTo(point.x, point.y);
            } else {
                // Smooth curves
                const prev = points[index - 1];
                const cp1x = prev.x + (point.x - prev.x) / 3;
                const cp1y = prev.y;
                const cp2x = point.x - (point.x - prev.x) / 3;
                const cp2y = point.y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
            }
        });
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                const prev = points[index - 1];
                const cp1x = prev.x + (point.x - prev.x) / 3;
                const cp1y = prev.y;
                const cp2x = point.x - (point.x - prev.x) / 3;
                const cp2y = point.y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
            }
        });
        ctx.stroke();
        
        // Draw data points
        points.forEach(point => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    setupStatCardInteractions() {
        const statCards = document.querySelectorAll('.stat-card.interactive');
        
        statCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                if (this.features.animations) {
                    card.style.transform = 'translateY(-2px) scale(1.02)';
                    card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (this.features.animations) {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            });
            
            // Set up action buttons
            const actionButtons = card.querySelectorAll('.stat-action-btn');
            actionButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    const statType = card.getAttribute('data-stat');
                    this.handleStatAction(statType, action);
                });
            });
            
            // Make entire card clickable for details
            card.addEventListener('click', () => {
                const statType = card.getAttribute('data-stat');
                this.showStatDetails(statType);
            });
        });
    }
    
    handleStatAction(statType, action) {
        switch (action) {
            case 'refresh':
                this.refreshStatData(statType);
                break;
            case 'details':
                this.showStatDetails(statType);
                break;
            default:
                console.log(`Unknown stat action: ${action}`);
        }
    }
    
    refreshStatData(statType) {
        const card = document.querySelector(`[data-stat="${statType}"]`);
        if (!card) return;
        
        const refreshBtn = card.querySelector('[data-action="refresh"]');
        const refreshIcon = refreshBtn.querySelector('i');
        
        // Show loading state
        refreshIcon.style.animation = 'spin 1s linear infinite';
        refreshBtn.disabled = true;
        
        // Simulate data refresh
        setTimeout(() => {
            // Update with new simulated data
            const statNumber = card.querySelector('.stat-number');
            const currentValue = parseInt(statNumber.textContent.replace(/[^0-9]/g, '')) || 0;
            const variance = Math.floor(Math.random() * 20) - 10; // Random change
            const newValue = Math.max(0, currentValue + variance);
            
            // Animate to new value
            this.animateNumberChange(statNumber, currentValue, newValue, statType === 'donations');
            
            // Update chart with new data
            const chart = card.querySelector('.mini-chart');
            if (chart) {
                this.updateMiniChart(chart, statType);
            }
            
            // Reset button state
            refreshIcon.style.animation = '';
            refreshBtn.disabled = false;
            
            this.showToastNotification(`${this.getStatTitle(statType)} data updated`, 'success');
        }, 1500);
    }
    
    animateNumberChange(element, fromValue, toValue, isKwacha = false) {
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(fromValue + (toValue - fromValue) * easeProgress);
            let displayValue = currentValue.toLocaleString();
            
            if (isKwacha) {
                displayValue = 'K' + displayValue;
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    updateMiniChart(canvas, type) {
        // Generate new data
        const newData = this.generateChartData(type).map(value => 
            value + (Math.random() * 40 - 20) // Add some variance
        );
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width / 2;
        const height = canvas.height / 2;
        
        this.drawMiniChart(ctx, newData, type, width, height);
    }
    
    getStatTitle(statType) {
        const titles = {
            members: 'Community Members',
            events: 'Events',
            resources: 'Resources',
            donations: 'Donations'
        };
        return titles[statType] || statType;
    }
    
    showStatDetails(statType) {
        const statData = this.getDetailedStatData(statType);
        this.showStatModal(statType, statData);
    }
    
    getDetailedStatData(statType) {
        const data = {
            members: {
                title: 'Community Members Analytics',
                current: 1248,
                goal: 1600,
                breakdown: [
                    { label: 'Active Members', value: 892, color: '#10b981' },
                    { label: 'New This Month', value: 156, color: '#3b82f6' },
                    { label: 'Inactive', value: 200, color: '#f59e0b' }
                ],
                trends: [
                    { period: 'This Week', change: '+23', positive: true },
                    { period: 'This Month', change: '+156', positive: true },
                    { period: 'This Quarter', change: '+324', positive: true }
                ]
            },
            events: {
                title: 'Events & Activities Analytics',
                current: 23,
                goal: 25,
                breakdown: [
                    { label: 'Workshops', value: 12, color: '#10b981' },
                    { label: 'Webinars', value: 7, color: '#3b82f6' },
                    { label: 'Community Meetings', value: 4, color: '#f59e0b' }
                ],
                trends: [
                    { period: 'This Week', change: '+2', positive: true },
                    { period: 'This Month', change: '+5', positive: true },
                    { period: 'Avg. Attendance', change: '89%', positive: true }
                ]
            },
            resources: {
                title: 'Resource Library Analytics',
                current: 847,
                goal: 1000,
                breakdown: [
                    { label: 'Medical Resources', value: 312, color: '#ef4444' },
                    { label: 'Educational Materials', value: 285, color: '#3b82f6' },
                    { label: 'Legal Guidance', value: 250, color: '#10b981' }
                ],
                trends: [
                    { period: 'Downloads This Week', change: '1,234', positive: true },
                    { period: 'New Resources', change: '+23', positive: true },
                    { period: 'User Rating', change: '4.8/5', positive: true }
                ]
            },
            donations: {
                title: 'Fundraising Analytics',
                current: 15420,
                goal: 25000,
                breakdown: [
                    { label: 'Individual Donors', value: 9250, color: '#10b981' },
                    { label: 'Corporate Sponsors', value: 4200, color: '#3b82f6' },
                    { label: 'Grants', value: 1970, color: '#f59e0b' }
                ],
                trends: [
                    { period: 'This Month', change: '+K1,200', positive: true },
                    { period: 'Avg. Donation', change: 'K45', positive: true },
                    { period: 'Donor Retention', change: '73%', positive: true }
                ]
            }
        };
        
        return data[statType] || data.members;
    }
    
    showStatModal(statType, data) {
        const modal = this.createStatModal(statType, data);
        this.showModal(modal);
    }
    
    createStatModal(statType, data) {
        const modal = document.createElement('div');
        modal.className = 'stat-modal';
        modal.innerHTML = `
            <div class="modal-overlay" data-modal-close></div>
            <div class="modal-content stat-modal-content" role="dialog" aria-labelledby="stat-modal-title">
                <div class="modal-header">
                    <h3 id="stat-modal-title" class="modal-title">${data.title}</h3>
                    <button type="button" class="modal-close" data-modal-close aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stat-modal-overview">
                        <div class="overview-card">
                            <div class="overview-number">${data.current.toLocaleString()}</div>
                            <div class="overview-label">Current Total</div>
                            <div class="overview-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(data.current / data.goal * 100)}%"></div>
                                </div>
                                <span class="progress-text">${Math.round(data.current / data.goal * 100)}% of goal</span>
                            </div>
                        </div>
                        <div class="overview-goal">
                            <div class="goal-number">${data.goal.toLocaleString()}</div>
                            <div class="goal-label">Target Goal</div>
                        </div>
                    </div>
                    
                    <div class="stat-modal-breakdown">
                        <h4>Breakdown</h4>
                        <div class="breakdown-chart">
                            ${data.breakdown.map(item => `
                                <div class="breakdown-item-detailed">
                                    <div class="breakdown-color" style="background-color: ${item.color}"></div>
                                    <div class="breakdown-info">
                                        <div class="breakdown-label">${item.label}</div>
                                        <div class="breakdown-value">${item.value.toLocaleString()}</div>
                                        <div class="breakdown-percentage">${Math.round(item.value / data.current * 100)}%</div>
                                    </div>
                                    <div class="breakdown-bar">
                                        <div class="breakdown-bar-fill" style="background-color: ${item.color}; width: ${item.value / data.current * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="stat-modal-trends">
                        <h4>Key Metrics</h4>
                        <div class="trends-grid">
                            ${data.trends.map(trend => `
                                <div class="trend-item ${trend.positive ? 'positive' : 'negative'}">
                                    <div class="trend-value">${trend.change}</div>
                                    <div class="trend-label">${trend.period}</div>
                                    <div class="trend-indicator">
                                        <i class="fas fa-arrow-${trend.positive ? 'up' : 'down'}"></i>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="modal-button secondary" data-modal-close>Close</button>
                    <button type="button" class="modal-button primary" onclick="afzMemberHub.exportStatData('${statType}')">Export Data</button>
                </div>
            </div>
        `;
        
        // Setup close handlers
        modal.querySelectorAll('[data-modal-close]').forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });
        
        return modal;
    }
    
    showModal(modal) {
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Focus management
        setTimeout(() => {
            const firstButton = modal.querySelector('button');
            if (firstButton) firstButton.focus();
        }, 100);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    exportStatData(statType) {
        const data = this.getDetailedStatData(statType);
        const csvContent = this.generateCSV(data, statType);
        this.downloadCSV(csvContent, `afz-${statType}-data.csv`);
        this.showToastNotification(`${this.getStatTitle(statType)} data exported successfully`, 'success');
    }
    
    generateCSV(data, statType) {
        let csv = `AFZ ${data.title}\n\n`;
        csv += `Current Total,${data.current}\n`;
        csv += `Goal,${data.goal}\n`;
        csv += `Progress,${Math.round(data.current / data.goal * 100)}%\n\n`;
        
        csv += `Breakdown\n`;
        csv += `Category,Value,Percentage\n`;
        data.breakdown.forEach(item => {
            csv += `${item.label},${item.value},${Math.round(item.value / data.current * 100)}%\n`;
        });
        
        csv += `\nKey Metrics\n`;
        csv += `Metric,Value\n`;
        data.trends.forEach(trend => {
            csv += `${trend.period},${trend.change}\n`;
        });
        
        return csv;
    }
    
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ============================================
    // EVENT LISTENERS & INTERACTIONS
    // ============================================

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Navigation links with smooth transitions
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Global search with advanced features
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleAdvancedSearch(e.target.value);
                }, 300); // Debounced search
            });

            searchInput.addEventListener('focus', () => {
                this.showSearchInterface();
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSearchInterface(), 150);
            });
        }

        // Theme toggle with smooth transitions
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Notification system
        const notificationBtn = document.getElementById('notifications-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // Mark all notifications as read
        const markAllRead = document.getElementById('mark-all-read');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this.markAllNotificationsRead();
            });
        }

        // User menu dropdown
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Quick action cards with enhanced interactions
        const quickActionCards = document.querySelectorAll('.quick-action-card');
        quickActionCards.forEach(card => {
            this.addCardInteractions(card);
        });

        // Global click handler for closing dropdowns
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Window resize handler for responsive behavior
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Scroll handling for parallax and animations
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScrollAnimations();
        }, 16));
    }

    // ============================================
    // SECTION MANAGEMENT & NAVIGATION
    // ============================================

    switchSection(sectionName) {
        if (this.currentSection === sectionName) return;

        this.announceToScreenReader(`Navigating to ${sectionName} section`);
        
        // Add to history
        this.sectionHistory.push(sectionName);
        if (this.sectionHistory.length > 10) {
            this.sectionHistory.shift();
        }

        // Update URL without page reload
        if (history.pushState) {
            history.pushState(null, null, `#${sectionName}`);
        }

        // Animate section transition
        this.animateSectionTransition(this.currentSection, sectionName);
        
        // Update navigation state
        this.updateNavigationState(sectionName);
        
        // Update breadcrumb
        this.updateBreadcrumb(sectionName);
        
        // Update current section
        this.currentSection = sectionName;
        
        // Load section content if needed
        this.loadSectionContent(sectionName);
        
        // Update document title
        document.title = `${this.getSectionTitle(sectionName)} - AFZ Member Hub`;
    }

    animateSectionTransition(fromSection, toSection) {
        const fromElement = document.getElementById(`section-${fromSection}`);
        const toElement = document.getElementById(`section-${toSection}`);
        
        if (!fromElement || !toElement) return;

        // Fade out current section
        fromElement.style.transition = 'all 0.3s ease-out';
        fromElement.style.opacity = '0';
        fromElement.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            fromElement.classList.remove('active');
            fromElement.style.display = 'none';
            
            // Prepare new section
            toElement.style.opacity = '0';
            toElement.style.transform = 'translateX(20px)';
            toElement.style.display = 'block';
            toElement.classList.add('active');
            
            // Fade in new section
            requestAnimationFrame(() => {
                toElement.style.transition = 'all 0.4s ease-out';
                toElement.style.opacity = '1';
                toElement.style.transform = 'translateX(0)';
            });
            
        }, 300);
    }

    updateNavigationState(sectionName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link.getAttribute('data-section') === sectionName) {
                item.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    updateBreadcrumb(sectionName) {
        const breadcrumbList = document.querySelector('.breadcrumb-list');
        if (!breadcrumbList) return;

        const sectionTitle = this.getSectionTitle(sectionName);
        breadcrumbList.innerHTML = `
            <li class="breadcrumb-item">
                <a href="#dashboard" data-section="dashboard">
                    <i class="fas fa-home"></i>
                    Home
                </a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">${sectionTitle}</li>
        `;
        
        // Add click handler to breadcrumb home link
        const homeLink = breadcrumbList.querySelector('[data-section="dashboard"]');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection('dashboard');
            });
        }
    }

    getSectionTitle(sectionName) {
        const titles = {
            'dashboard': 'Dashboard',
            'chat': 'Community Chat',
            'connections': 'My Network',
            'events': 'Events',
            'resources': 'Resource Library',
            'profile': 'My Profile',
            'admin-dashboard': 'Admin Dashboard',
            'member-management': 'Member Management',
            'event-management': 'Event Management',
            'analytics': 'Analytics',
            'content-curation': 'Content Curation'
        };
        return titles[sectionName] || sectionName;
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    handleAdvancedSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        this.showSearchSpinner();
        
        // Simulate API call with realistic delay
        setTimeout(() => {
            const results = this.performSearch(query);
            this.displaySearchResults(results);
        }, 200);
    }

    performSearch(query) {
        // Mock search data - in real app, this would come from API
        const searchData = [
            { type: 'member', title: 'Sarah Johnson', description: 'Community advocate, Lusaka', icon: 'fas fa-user', section: 'connections' },
            { type: 'event', title: 'Albinism Awareness Workshop', description: 'August 24, 2024', icon: 'fas fa-calendar', section: 'events' },
            { type: 'resource', title: 'Healthcare Access Guide', description: 'Educational resource', icon: 'fas fa-book', section: 'resources' },
            { type: 'member', title: 'Michael Banda', description: 'Education coordinator', icon: 'fas fa-user', section: 'connections' },
            { type: 'event', title: 'Healthcare Forum', description: 'August 30, 2024', icon: 'fas fa-calendar', section: 'events' }
        ];

        return searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        if (!searchResultsContainer) return;

        if (results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                </div>
            `;
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result-item" data-section="${result.section}" tabindex="0">
                    <div class="result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="result-content">
                        <h4 class="result-title">${result.title}</h4>
                        <p class="result-description">${result.description}</p>
                        <span class="result-type">${result.type}</span>
                    </div>
                </div>
            `).join('');
            
            searchResultsContainer.innerHTML = resultsHTML;

            // Add click handlers to results
            const resultItems = searchResultsContainer.querySelectorAll('.search-result-item');
            resultItems.forEach(item => {
                item.addEventListener('click', () => {
                    const section = item.getAttribute('data-section');
                    this.switchSection(section);
                    this.hideSearchResults();
                });
                
                item.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        item.click();
                    }
                });
            });
        }

        this.showSearchResults();
    }

    showSearchInterface() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.add('active');
        }
    }

    hideSearchInterface() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
        this.hideSearchResults();
    }

    showSearchSpinner() {
        const searchResultsContainer = document.getElementById('search-results');
        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = `
                <div class="search-loading">
                    <div class="loading-spinner"></div>
                    <p>Searching...</p>
                </div>
            `;
            this.showSearchResults();
        }
    }

    showSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'block';
            searchResults.classList.add('show');
        }
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.remove('show');
            setTimeout(() => {
                searchResults.style.display = 'none';
            }, 200);
        }
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transitioning');
        
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('afz-member-hub-theme', this.theme);
        
        this.updateThemeIcon();
        this.showToastNotification(`Switched to ${this.theme} theme`, 'success');
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('#theme-toggle .theme-icon');
        if (themeIcon) {
            themeIcon.className = this.theme === 'light' ? 'fas fa-moon theme-icon' : 'fas fa-sun theme-icon';
        }
    }

    // ============================================
    // ADVANCED NOTIFICATION SYSTEM
    // ============================================
    
    initNotificationSystem() {
        this.notificationQueue = this.loadStoredNotifications();
        this.setupNotificationSound();
        this.requestNotificationPermission();
        this.bindNotificationEvents();
        this.updateNotificationBadge();
        this.startNotificationPolling();
        
        // Initialize with some demo notifications if empty
        if (this.notificationQueue.length === 0) {
            this.generateInitialNotifications();
        }
    }
    
    setupNotificationSound() {
        // Create notification sound
        this.notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApaot7uurMqCkav5a6nWBYQWLLH9N2QQAoUXrTp66hVFApaot7uurMqCkav5a6nWBYQWLLH9N2QQAoUXrTp66hVFApaot7uurMqCkav5a6nWBYQWLLH9N2QQAoUXrTp66hVFApaot7uurMqCkav5a6nWBYQ');
        this.notificationSound.volume = 0.3;
    }
    
    async requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        }
    }
    
    bindNotificationEvents() {
        const notificationBtn = document.getElementById('notification-btn');
        const notificationPanel = document.getElementById('notification-panel');
        const markAllReadBtn = document.querySelector('.mark-read-btn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }
        
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsRead();
            });
        }
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterNotifications(btn.dataset.filter);
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationPanel?.contains(e.target) && !notificationBtn?.contains(e.target)) {
                this.hideNotificationPanel();
            }
        });
    }
    
    loadStoredNotifications() {
        const stored = localStorage.getItem('afz_notifications');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading stored notifications:', e);
                return [];
            }
        }
        return [];
    }
    
    saveNotifications() {
        localStorage.setItem('afz_notifications', JSON.stringify(this.notificationQueue));
    }
    
    generateInitialNotifications() {
        const initialNotifications = [
            {
                category: 'system',
                priority: 'normal',
                title: 'Welcome to AFZ Member Hub',
                message: 'Your account has been successfully created. Explore the features available to you.',
                avatar: '🏠',
                actionable: true,
                actions: [{ label: 'Get Started', action: 'view-profile' }]
            },
            {
                category: 'events',
                priority: 'high',
                title: 'Upcoming Event: Healthcare Forum',
                message: 'Join us for an important discussion about healthcare access. Register now!',
                avatar: '📅',
                actionable: true,
                actions: [
                    { label: 'View Event', action: 'view-event', data: {eventId: 'healthcare-forum'} },
                    { label: 'Register', action: 'register-event', data: {eventId: 'healthcare-forum'} }
                ]
            },
            {
                category: 'resources',
                priority: 'normal',
                title: 'New Resources Available',
                message: 'Educational materials have been added to your library.',
                avatar: '📚',
                actionable: true,
                actions: [{ label: 'Browse Library', action: 'browse-resources' }]
            }
        ];
        
        initialNotifications.forEach(notif => {
            this.addNotification(notif, false); // Don't play sound for initial notifications
        });
    }
    
    startNotificationPolling() {
        // Simulate real-time notifications for demo
        setInterval(() => {
            if (Math.random() > 0.97) { // 3% chance every 10 seconds
                this.generateDemoNotification();
            }
        }, 10000);
    }
    
    generateDemoNotification() {
        const demoNotifications = [
            {
                category: 'messages',
                priority: 'high',
                title: 'New Message from Support',
                message: 'Your recent resource request has been processed and is now available.',
                avatar: '💬',
                actionable: true,
                actions: [{ label: 'View Message', action: 'view-messages' }]
            },
            {
                category: 'connections',
                priority: 'normal',
                title: 'New Connection Request',
                message: 'A member wants to connect with you.',
                avatar: '🤝',
                actionable: true,
                actions: [
                    { label: 'View Profile', action: 'view-connections' },
                    { label: 'Accept', action: 'accept-connection' }
                ]
            },
            {
                category: 'system',
                priority: 'urgent',
                title: 'Security Alert',
                message: 'Your password will expire in 3 days. Please update it.',
                avatar: '🔐',
                actionable: true,
                actions: [{ label: 'Update Password', action: 'update-password' }]
            }
        ];
        
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
        this.addNotification(randomNotification);
    }
    
    addNotification(notification, playSound = true) {
        const newNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        
        this.notificationQueue.unshift(newNotification);
        
        // Keep only last 50 notifications
        if (this.notificationQueue.length > 50) {
            this.notificationQueue = this.notificationQueue.slice(0, 50);
        }
        
        if (playSound) {
            this.playNotificationSound();
            this.showDesktopNotification(newNotification);
        }
        
        this.renderNotifications();
        this.updateNotificationBadge();
        this.saveNotifications();
        
        return newNotification.id;
    }
    
    playNotificationSound() {
        if (this.notificationSound && !document.hidden) {
            this.notificationSound.currentTime = 0;
            this.notificationSound.play().catch(e => {
                console.log('Could not play notification sound:', e);
            });
        }
    }
    
    showDesktopNotification(notification) {
        if (Notification.permission === 'granted' && document.hidden) {
            const desktopNotif = new Notification(notification.title, {
                body: notification.message,
                icon: './images/afz-logo-small.png',
                badge: './images/afz-badge.png',
                tag: notification.id,
                requireInteraction: notification.priority === 'urgent'
            });
            
            desktopNotif.onclick = () => {
                window.focus();
                this.openNotification(notification.id);
                desktopNotif.close();
            };
            
            // Auto close after 10 seconds unless urgent
            if (notification.priority !== 'urgent') {
                setTimeout(() => desktopNotif.close(), 10000);
            }
        }
    }
    
    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            const isVisible = panel.classList.contains('show');
            if (isVisible) {
                this.hideNotificationPanel();
            } else {
                this.showNotificationPanel();
            }
        }
    }
    
    showNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.add('show');
            panel.setAttribute('aria-hidden', 'false');
            this.renderNotifications();
            // Mark visible notifications as read after 2 seconds
            setTimeout(() => {
                this.markVisibleNotificationsRead();
            }, 2000);
        }
    }
    
    hideNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.remove('show');
            panel.setAttribute('aria-hidden', 'true');
        }
    }
    
    renderNotifications(filter = 'all') {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;
        
        let notifications = this.notificationQueue;
        
        if (filter !== 'all') {
            notifications = notifications.filter(notif => {
                if (filter === 'unread') return !notif.read;
                return notif.category === filter;
            });
        }
        
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="notification-empty">
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔔</div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">No notifications</h3>
                        <p style="margin: 0; font-size: 0.875rem;">You're all caught up!</p>
                    </div>
                </div>
            `;
            return;
        }
        
        notificationList.innerHTML = notifications.map(notif => this.renderNotificationItem(notif)).join('');
        
        // Bind notification item events
        this.bindNotificationItemEvents();
    }
    
    renderNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.timestamp);
        const priorityClass = notification.priority === 'high' ? 'high-priority' : 
                            notification.priority === 'urgent' ? 'urgent-priority' : '';
        
        const actionsHtml = notification.actionable && notification.actions ? 
            notification.actions.map(action => 
                `<button class="notification-action-btn" 
                         data-action="${action.action}" 
                         data-notification-id="${notification.id}"
                         data-action-data='${JSON.stringify(action.data || {})}'>
                    ${action.label}
                </button>`
            ).join('') : '';
        
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${priorityClass}" 
                 data-notification-id="${notification.id}">
                ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
                <div class="notification-avatar">
                    ${notification.avatar || '🔔'}
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-meta">
                            <span class="notification-category">${notification.category}</span>
                            <span class="notification-time">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="notification-message">${notification.message}</div>
                    ${actionsHtml ? `<div class="notification-actions">${actionsHtml}</div>` : ''}
                </div>
                <div class="notification-controls">
                    <button class="notification-control-btn mark-read-btn" 
                            data-notification-id="${notification.id}"
                            title="${notification.read ? 'Mark as unread' : 'Mark as read'}">
                        ${notification.read ? '📭' : '📬'}
                    </button>
                    <button class="notification-control-btn delete-btn" 
                            data-notification-id="${notification.id}"
                            title="Delete notification">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }
    
    bindNotificationItemEvents() {
        // Notification action buttons
        document.querySelectorAll('.notification-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const notificationId = btn.dataset.notificationId;
                const actionData = JSON.parse(btn.dataset.actionData || '{}');
                this.handleNotificationAction(action, notificationId, actionData);
            });
        });
        
        // Mark read/unread buttons
        document.querySelectorAll('.notification-control-btn.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const notificationId = btn.dataset.notificationId;
                this.toggleNotificationReadStatus(notificationId);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.notification-control-btn.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const notificationId = btn.dataset.notificationId;
                this.deleteNotification(notificationId);
            });
        });
        
        // Notification item clicks
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const notificationId = item.dataset.notificationId;
                this.openNotification(notificationId);
            });
        });
    }
    
    handleNotificationAction(action, notificationId, data) {
        // Mark notification as read when action is taken
        this.markNotificationRead(notificationId);
        
        switch (action) {
            case 'view-event':
            case 'register-event':
                this.showSection('events');
                if (data.eventId) {
                    console.log('Opening event:', data.eventId);
                }
                break;
            case 'view-messages':
                this.showSection('chat');
                break;
            case 'view-connections':
            case 'accept-connection':
                this.showSection('connections');
                break;
            case 'browse-resources':
                this.showSection('resources');
                break;
            case 'view-profile':
                this.showSection('profile');
                break;
            case 'update-password':
                this.showSection('profile');
                break;
            default:
                console.log('Unknown notification action:', action);
        }
        
        this.hideNotificationPanel();
    }
    
    openNotification(notificationId) {
        const notification = this.notificationQueue.find(n => n.id === notificationId);
        if (notification) {
            this.markNotificationRead(notificationId);
            
            // Navigate based on category
            switch (notification.category) {
                case 'events':
                    this.showSection('events');
                    break;
                case 'messages':
                    this.showSection('chat');
                    break;
                case 'resources':
                    this.showSection('resources');
                    break;
                case 'connections':
                    this.showSection('connections');
                    break;
                case 'admin':
                    this.showSection('admin');
                    break;
                default:
                    this.showSection('overview');
            }
        }
    }
    
    markNotificationRead(notificationId) {
        const notification = this.notificationQueue.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateNotificationBadge();
            this.saveNotifications();
            this.renderNotifications();
        }
    }
    
    toggleNotificationReadStatus(notificationId) {
        const notification = this.notificationQueue.find(n => n.id === notificationId);
        if (notification) {
            notification.read = !notification.read;
            this.updateNotificationBadge();
            this.saveNotifications();
            this.renderNotifications();
        }
    }
    
    markAllNotificationsRead() {
        let hasChanges = false;
        this.notificationQueue.forEach(notif => {
            if (!notif.read) {
                notif.read = true;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.updateNotificationBadge();
            this.saveNotifications();
            this.renderNotifications();
            this.showToastNotification('All notifications marked as read', 'success');
        }
    }
    
    markVisibleNotificationsRead() {
        const visibleNotifications = document.querySelectorAll('.notification-item.unread');
        let hasChanges = false;
        
        visibleNotifications.forEach(item => {
            const notificationId = item.dataset.notificationId;
            const notification = this.notificationQueue.find(n => n.id === notificationId);
            if (notification && !notification.read) {
                notification.read = true;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.updateNotificationBadge();
            this.saveNotifications();
            this.renderNotifications();
        }
    }
    
    deleteNotification(notificationId) {
        const index = this.notificationQueue.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            this.notificationQueue.splice(index, 1);
            this.updateNotificationBadge();
            this.saveNotifications();
            this.renderNotifications();
            this.showToastNotification('Notification deleted', 'info');
        }
    }
    
    filterNotifications(filter) {
        this.renderNotifications(filter);
    }
    
    updateNotificationBadge() {
        const unreadCount = this.notificationQueue.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notifTime) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else {
            return notifTime.toLocaleDateString();
        }
    }
    
    // Public API methods
    addSystemNotification(title, message, options = {}) {
        return this.addNotification({
            title,
            message,
            category: 'system',
            priority: options.priority || 'normal',
            ...options
        });
    }
    
    getUnreadCount() {
        return this.notificationQueue.filter(n => !n.read).length;
    }
    
    clearAllNotifications() {
        this.notificationQueue = [];
        this.updateNotificationBadge();
        this.saveNotifications();
        this.renderNotifications();
        this.showToastNotification('All notifications cleared', 'info');
    }

    // ============================================
    // USER MENU MANAGEMENT
    // ============================================

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (!dropdown) return;

        const isVisible = dropdown.classList.contains('show');
        
        if (isVisible) {
            this.hideUserMenu();
        } else {
            this.showUserMenu();
        }
    }

    showUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.add('show');
            dropdown.setAttribute('aria-hidden', 'false');
        }
    }

    hideUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-hidden', 'true');
        }
    }

    // ============================================
    // MOBILE & RESPONSIVE FEATURES
    // ============================================

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.getElementById('mobile-menu');
        
        if (sidebar && mobileMenuBtn) {
            const isOpen = sidebar.classList.contains('mobile-open');
            
            if (isOpen) {
                sidebar.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            } else {
                sidebar.classList.add('mobile-open');
                mobileMenuBtn.classList.add('active');
                document.body.classList.add('mobile-menu-open');
            }
        }
    }

    handleWindowResize() {
        const width = window.innerWidth;
        
        // Close mobile menu on desktop
        if (width >= 768) {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.getElementById('mobile-menu');
            
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }

        // Adjust search interface
        this.adjustSearchInterface();
    }

    adjustSearchInterface() {
        const searchContainer = document.querySelector('.search-container');
        if (window.innerWidth < 768 && searchContainer) {
            searchContainer.classList.add('mobile');
        } else if (searchContainer) {
            searchContainer.classList.remove('mobile');
        }
    }

    // ============================================
    // ANIMATIONS & VISUAL EFFECTS
    // ============================================

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.stat-card, .widget, .quick-action-card');
        animatedElements.forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    addCardInteractions(card) {
        let isPressed = false;

        card.addEventListener('mousedown', () => {
            isPressed = true;
            card.style.transform = 'scale(0.98)';
        });

        card.addEventListener('mouseup', () => {
            if (isPressed) {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            }
            isPressed = false;
        });

        card.addEventListener('mouseleave', () => {
            if (isPressed) {
                card.style.transform = '';
                isPressed = false;
            }
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (this.features.animations) {
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                card.style.transform = 'translateY(-2px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (this.features.animations) {
                card.style.transform = '';
            }
        });
    }

    handleScrollAnimations() {
        // Parallax effect for header elements
        const scrollY = window.pageYOffset;
        const headerBg = document.querySelector('.section-header');
        
        if (headerBg && scrollY < 500) {
            headerBg.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    }

    // ============================================
    // ACCESSIBILITY FEATURES
    // ============================================

    setupAccessibility() {
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
        
        // High contrast mode detection
        this.detectHighContrastMode();
    }

    setupFocusManagement() {
        // Trap focus in modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
            
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const activeDropdown = document.querySelector('.notification-panel.show, .user-dropdown-menu.show');
        if (activeDropdown) {
            this.trapFocusInElement(activeDropdown, e);
        }
    }

    trapFocusInElement(element, e) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    setupScreenReaderSupport() {
        this.announcements = document.getElementById('sr-announcements');
        if (!this.announcements) {
            this.announcements = document.createElement('div');
            this.announcements.id = 'sr-announcements';
            this.announcements.className = 'sr-only';
            this.announcements.setAttribute('aria-live', 'polite');
            this.announcements.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.announcements);
        }
    }

    announceToScreenReader(message) {
        if (this.announcements) {
            this.announcements.textContent = message;
        }
    }

    detectHighContrastMode() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Alt + number keys for quick navigation
            if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                const sections = ['dashboard', 'chat', 'connections', 'events', 'resources', 'profile'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sections[sectionIndex]) {
                    this.switchSection(sections[sectionIndex]);
                }
            }

            // Escape to close dropdowns
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    closeAllDropdowns() {
        this.hideNotificationPanel();
        this.hideUserMenu();
        this.hideSearchInterface();
    }

    showToastNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon fas fa-${this.getToastIcon(type)}"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        const autoRemove = setTimeout(() => this.removeToast(toast), 4000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeToast(toast);
        });
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    checkBrowserCompatibility() {
        // Check for required features
        if (!window.fetch) {
            this.showToastNotification('Your browser may not support all features. Please update for the best experience.', 'warning');
        }
    }

    setupRealtimeFeatures() {
        // Simulate real-time updates
        setInterval(() => {
            if (!this.isLoading && this.currentSection === 'dashboard') {
                this.updateLiveStats();
            }
        }, 30000); // Update every 30 seconds
    }

    updateLiveStats() {
        // Simulate live stat updates
        const memberCount = document.querySelector('.stat-number');
        if (memberCount && memberCount.textContent.includes('1,248')) {
            const currentCount = parseInt(memberCount.textContent.replace(/,/g, ''));
            const newCount = currentCount + Math.floor(Math.random() * 3);
            memberCount.textContent = newCount.toLocaleString();
        }
    }

    loadUserData() {
        // Load user-specific data
        this.updateUserDisplay();
    }

    updateUserDisplay() {
        // Update user name in header
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            if (el.textContent === 'John Doe' || el.textContent === 'John') {
                el.textContent = this.currentUser.name.split(' ')[0];
            }
        });
    }

    loadSectionContent(sectionName) {
        // Load content for specific sections if needed
        const section = document.getElementById(`section-${sectionName}`);
        if (section && section.textContent.trim() === '') {
            this.loadDynamicContent(sectionName, section);
        }
    }

    loadDynamicContent(sectionName, container) {
        // Placeholder for dynamic content loading
        // In a real application, this would load content from an API
        console.log(`Loading content for section: ${sectionName}`);
    }

    // ============================================
    // MEMBER NETWORKING SYSTEM
    // ============================================
    
    initMemberNetworking() {
        this.connections = this.loadStoredConnections();
        this.memberDirectory = this.generateMemberDirectory();
        this.connectionRequests = this.loadStoredConnectionRequests();
        this.conversations = this.loadStoredConversations();
        
        this.bindNetworkingEvents();
        this.startNetworkingPolling();
    }
    
    loadStoredConnections() {
        const stored = localStorage.getItem('afz_connections');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading connections:', e);
                return [];
            }
        }
        return this.generateInitialConnections();
    }
    
    loadStoredConnectionRequests() {
        const stored = localStorage.getItem('afz_connection_requests');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading connection requests:', e);
                return [];
            }
        }
        return this.generateInitialConnectionRequests();
    }
    
    loadStoredConversations() {
        const stored = localStorage.getItem('afz_conversations');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading conversations:', e);
                return {};
            }
        }
        return {};
    }
    
    generateInitialConnections() {
        const connections = [
            {
                id: 'conn_001',
                memberId: 'member_sarah',
                name: 'Sarah Johnson',
                role: 'Community Advocate',
                location: 'Lusaka, Zambia',
                avatar: '👩‍⚕️',
                skills: ['Healthcare Advocacy', 'Community Outreach', 'Education'],
                connectionDate: '2024-01-15',
                lastActive: '2024-08-15',
                mutualConnections: 12,
                status: 'online'
            },
            {
                id: 'conn_002',
                memberId: 'member_michael',
                name: 'Michael Banda',
                role: 'Education Coordinator',
                location: 'Kitwe, Zambia',
                avatar: '👨‍🎓',
                skills: ['Education', 'Training', 'Curriculum Development'],
                connectionDate: '2024-02-20',
                lastActive: '2024-08-14',
                mutualConnections: 8,
                status: 'away'
            },
            {
                id: 'conn_003',
                memberId: 'member_grace',
                name: 'Grace Mwanza',
                role: 'Legal Advisor',
                location: 'Ndola, Zambia',
                avatar: '⚖️',
                skills: ['Legal Aid', 'Human Rights', 'Policy Advocacy'],
                connectionDate: '2024-03-10',
                lastActive: '2024-08-13',
                mutualConnections: 15,
                status: 'offline'
            }
        ];
        
        this.saveConnections(connections);
        return connections;
    }
    
    generateInitialConnectionRequests() {
        const requests = [
            {
                id: 'req_001',
                fromMemberId: 'member_james',
                fromName: 'James Phiri',
                fromRole: 'Medical Researcher',
                fromLocation: 'Livingstone, Zambia',
                fromAvatar: '👨‍⚕️',
                message: 'Hi! I would love to connect and collaborate on healthcare research initiatives.',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                mutualConnections: 3
            },
            {
                id: 'req_002',
                fromMemberId: 'member_mary',
                fromName: 'Mary Tembo',
                fromRole: 'Social Worker',
                fromLocation: 'Chipata, Zambia',
                fromAvatar: '👩‍💼',
                message: 'I\'m interested in connecting to share experiences in community support programs.',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                mutualConnections: 5
            }
        ];
        
        this.saveConnectionRequests(requests);
        return requests;
    }
    
    generateMemberDirectory() {
        return [
            {
                id: 'member_david',
                name: 'David Mulenga',
                role: 'Program Manager',
                location: 'Lusaka, Zambia',
                avatar: '👨‍💼',
                skills: ['Project Management', 'Strategic Planning', 'Team Leadership'],
                joinDate: '2023-08-15',
                lastActive: '2024-08-16',
                mutualConnections: 7,
                connectionStatus: 'none', // none, pending, connected
                bio: 'Dedicated program manager with 8+ years experience in community development and albinism advocacy.'
            },
            {
                id: 'member_patricia',
                name: 'Patricia Chanda',
                role: 'Counselor',
                location: 'Kabwe, Zambia',
                avatar: '👩‍⚕️',
                skills: ['Psychological Counseling', 'Family Support', 'Crisis Intervention'],
                joinDate: '2023-11-20',
                lastActive: '2024-08-15',
                mutualConnections: 4,
                connectionStatus: 'none',
                bio: 'Professional counselor specializing in supporting individuals and families affected by albinism.'
            },
            {
                id: 'member_robert',
                name: 'Robert Sikanyika',
                role: 'Community Mobilizer',
                location: 'Mongu, Zambia',
                avatar: '🎯',
                skills: ['Community Organizing', 'Event Planning', 'Public Speaking'],
                joinDate: '2024-01-10',
                lastActive: '2024-08-14',
                mutualConnections: 6,
                connectionStatus: 'none',
                bio: 'Passionate community mobilizer working to create awareness and support networks across rural Zambia.'
            },
            {
                id: 'member_elizabeth',
                name: 'Elizabeth Zimba',
                role: 'Research Coordinator',
                location: 'Solwezi, Zambia',
                avatar: '🔬',
                skills: ['Research', 'Data Analysis', 'Report Writing'],
                joinDate: '2023-06-05',
                lastActive: '2024-08-16',
                mutualConnections: 9,
                connectionStatus: 'none',
                bio: 'Research coordinator focusing on collecting and analyzing data to improve albinism support programs.'
            }
        ];
    }
    
    bindNetworkingEvents() {
        // Connection request buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.connect-btn')) {
                e.preventDefault();
                const memberId = e.target.dataset.memberId;
                this.showConnectionRequestModal(memberId);
            }
            
            if (e.target.matches('.accept-connection-btn')) {
                e.preventDefault();
                const requestId = e.target.dataset.requestId;
                this.acceptConnectionRequest(requestId);
            }
            
            if (e.target.matches('.decline-connection-btn')) {
                e.preventDefault();
                const requestId = e.target.dataset.requestId;
                this.declineConnectionRequest(requestId);
            }
            
            if (e.target.matches('.message-btn')) {
                e.preventDefault();
                const memberId = e.target.dataset.memberId;
                this.openConversation(memberId);
            }
            
            if (e.target.matches('.member-card')) {
                const memberId = e.target.dataset.memberId;
                this.showMemberProfile(memberId);
            }
        });
        
        // Search and filter events
        const memberSearch = document.getElementById('member-search');
        if (memberSearch) {
            memberSearch.addEventListener('input', (e) => {
                this.filterMembers(e.target.value);
            });
        }
        
        const skillFilter = document.getElementById('skill-filter');
        if (skillFilter) {
            skillFilter.addEventListener('change', (e) => {
                this.filterMembersBySkill(e.target.value);
            });
        }
    }
    
    startNetworkingPolling() {
        // Simulate new connection requests
        setInterval(() => {
            if (Math.random() > 0.98) { // 2% chance every 30 seconds
                this.generateRandomConnectionRequest();
            }
        }, 30000);
    }
    
    generateRandomConnectionRequest() {
        const potentialConnections = [
            {
                fromMemberId: 'member_new_' + Date.now(),
                fromName: 'Alice Mwale',
                fromRole: 'Nurse',
                fromLocation: 'Mansa, Zambia',
                fromAvatar: '👩‍⚕️',
                message: 'Hello! I\'m new to the platform and would love to connect with fellow advocates.',
                mutualConnections: Math.floor(Math.random() * 8) + 1
            },
            {
                fromMemberId: 'member_new_' + Date.now(),
                fromName: 'Peter Muyunda',
                fromRole: 'Teacher',
                fromLocation: 'Kasama, Zambia',
                fromAvatar: '👨‍🏫',
                message: 'I\'m interested in educational advocacy and would like to connect.',
                mutualConnections: Math.floor(Math.random() * 6) + 1
            }
        ];
        
        const randomRequest = potentialConnections[Math.floor(Math.random() * potentialConnections.length)];
        const newRequest = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...randomRequest
        };
        
        this.connectionRequests.unshift(newRequest);
        this.saveConnectionRequests(this.connectionRequests);
        
        // Send notification
        this.addNotification({
            category: 'connections',
            priority: 'normal',
            title: 'New Connection Request',
            message: `${newRequest.fromName} wants to connect with you.`,
            avatar: newRequest.fromAvatar,
            actionable: true,
            actions: [
                { label: 'View Request', action: 'view-connections' },
                { label: 'Accept', action: 'accept-connection', data: { requestId: newRequest.id } }
            ]
        });
        
        this.renderConnectionRequests();
    }
    
    showConnectionRequestModal(memberId) {
        const member = this.memberDirectory.find(m => m.id === memberId);
        if (!member) return;
        
        const modal = document.createElement('div');
        modal.className = 'connection-modal';
        modal.innerHTML = `
            <div class="modal-overlay" data-modal-close></div>
            <div class="modal-content connection-modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Send Connection Request</h3>
                    <button type="button" class="modal-close" data-modal-close>&times;</button>
                </div>
                <div class="modal-body">
                    <div class="connection-preview">
                        <div class="member-avatar large">${member.avatar}</div>
                        <div class="member-info">
                            <h4>${member.name}</h4>
                            <p class="member-role">${member.role}</p>
                            <p class="member-location">📍 ${member.location}</p>
                            <p class="mutual-connections">${member.mutualConnections} mutual connections</p>
                        </div>
                    </div>
                    <form id="connection-request-form">
                        <div class="form-group">
                            <label for="connection-message">Personal Message (Optional)</label>
                            <textarea id="connection-message" placeholder="Introduce yourself and explain why you'd like to connect..." rows="4"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-actions">
                    <button type="button" class="modal-button secondary" data-modal-close>Cancel</button>
                    <button type="button" class="modal-button primary" onclick="afzMemberHub.sendConnectionRequest('${memberId}')">Send Request</button>
                </div>
            </div>
        `;
        
        // Setup close handlers
        modal.querySelectorAll('[data-modal-close]').forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });
        
        this.showModal(modal);
    }
    
    sendConnectionRequest(memberId) {
        const messageInput = document.getElementById('connection-message');
        const message = messageInput ? messageInput.value.trim() : '';
        const member = this.memberDirectory.find(m => m.id === memberId);
        
        if (!member) return;
        
        // Update member status to pending
        member.connectionStatus = 'pending';
        
        // Simulate sending request (in real app, this would be an API call)
        setTimeout(() => {
            this.showToastNotification(`Connection request sent to ${member.name}`, 'success');
            this.renderMemberDirectory();
        }, 500);
        
        // Close modal
        const modal = document.querySelector('.connection-modal');
        if (modal) {
            this.closeModal(modal);
        }
    }
    
    acceptConnectionRequest(requestId) {
        const requestIndex = this.connectionRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return;
        
        const request = this.connectionRequests[requestIndex];
        
        // Add to connections
        const newConnection = {
            id: `conn_${Date.now()}`,
            memberId: request.fromMemberId,
            name: request.fromName,
            role: request.fromRole,
            location: request.fromLocation,
            avatar: request.fromAvatar,
            skills: ['Community Support'], // Default skills
            connectionDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            mutualConnections: request.mutualConnections,
            status: 'online'
        };
        
        this.connections.unshift(newConnection);
        this.saveConnections(this.connections);
        
        // Remove from requests
        this.connectionRequests.splice(requestIndex, 1);
        this.saveConnectionRequests(this.connectionRequests);
        
        // Show success message
        this.showToastNotification(`You are now connected with ${request.fromName}`, 'success');
        
        // Send notification to other user (simulated)
        this.addNotification({
            category: 'connections',
            priority: 'normal',
            title: 'Connection Accepted',
            message: `You are now connected with ${request.fromName}!`,
            avatar: request.fromAvatar,
            actionable: true,
            actions: [{ label: 'View Profile', action: 'view-connections' }]
        });
        
        // Re-render both sections
        this.renderConnections();
        this.renderConnectionRequests();
    }
    
    declineConnectionRequest(requestId) {
        const requestIndex = this.connectionRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return;
        
        const request = this.connectionRequests[requestIndex];
        
        // Remove from requests
        this.connectionRequests.splice(requestIndex, 1);
        this.saveConnectionRequests(this.connectionRequests);
        
        this.showToastNotification('Connection request declined', 'info');
        this.renderConnectionRequests();
    }
    
    openConversation(memberId) {
        // Find member info
        let member = this.connections.find(c => c.memberId === memberId);
        if (!member) {
            member = this.memberDirectory.find(m => m.id === memberId);
        }
        
        if (!member) return;
        
        // Initialize conversation if it doesn't exist
        if (!this.conversations[memberId]) {
            this.conversations[memberId] = {
                memberId,
                memberName: member.name,
                memberAvatar: member.avatar,
                messages: [],
                lastRead: new Date().toISOString()
            };
        }
        
        this.showConversationModal(memberId);
    }
    
    showConversationModal(memberId) {
        const conversation = this.conversations[memberId];
        if (!conversation) return;
        
        const modal = document.createElement('div');
        modal.className = 'conversation-modal';
        modal.innerHTML = `
            <div class="modal-overlay" data-modal-close></div>
            <div class="modal-content conversation-modal-content">
                <div class="modal-header conversation-header">
                    <div class="conversation-member">
                        <div class="member-avatar">${conversation.memberAvatar}</div>
                        <div class="member-info">
                            <h3 class="member-name">${conversation.memberName}</h3>
                            <p class="member-status">Online</p>
                        </div>
                    </div>
                    <button type="button" class="modal-close" data-modal-close>&times;</button>
                </div>
                <div class="modal-body conversation-body">
                    <div class="messages-container" id="messages-container">
                        ${this.renderMessages(conversation.messages)}
                    </div>
                </div>
                <div class="modal-footer conversation-footer">
                    <div class="message-input-container">
                        <textarea id="message-input" placeholder="Type your message..." rows="2"></textarea>
                        <button type="button" class="send-message-btn" onclick="afzMemberHub.sendMessage('${memberId}')">Send</button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup close handlers
        modal.querySelectorAll('[data-modal-close]').forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });
        
        // Setup enter key for sending messages
        setTimeout(() => {
            const messageInput = document.getElementById('message-input');
            if (messageInput) {
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage(memberId);
                    }
                });
            }
        }, 100);
        
        this.showModal(modal);
    }
    
    renderMessages(messages) {
        if (messages.length === 0) {
            return `
                <div class="empty-conversation">
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
                        <h3 style="margin: 0 0 0.5rem 0;">Start a conversation</h3>
                        <p style="margin: 0; font-size: 0.875rem;">Send a message to begin chatting</p>
                    </div>
                </div>
            `;
        }
        
        return messages.map(message => `
            <div class="message ${message.sender === 'me' ? 'sent' : 'received'}">
                <div class="message-content">${message.content}</div>
                <div class="message-time">${this.getTimeAgo(message.timestamp)}</div>
            </div>
        `).join('');
    }
    
    sendMessage(memberId) {
        const messageInput = document.getElementById('message-input');
        const messageContent = messageInput.value.trim();
        
        if (!messageContent) return;
        
        const conversation = this.conversations[memberId];
        if (!conversation) return;
        
        // Add message to conversation
        const newMessage = {
            id: `msg_${Date.now()}`,
            sender: 'me',
            content: messageContent,
            timestamp: new Date().toISOString()
        };
        
        conversation.messages.push(newMessage);
        conversation.lastRead = new Date().toISOString();
        
        // Simulate response after a delay
        setTimeout(() => {
            const responses = [
                'Thanks for reaching out!',
                'That\'s a great point.',
                'I\'d love to discuss this further.',
                'Let me get back to you on that.',
                'Absolutely, I agree.',
                'That sounds like a wonderful idea!'
            ];
            
            const response = {
                id: `msg_${Date.now() + 1}`,
                sender: 'them',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date().toISOString()
            };
            
            conversation.messages.push(response);
            this.saveConversations();
            
            // Update UI
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
                messagesContainer.innerHTML = this.renderMessages(conversation.messages);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
        
        // Save conversations
        this.saveConversations();
        
        // Clear input
        messageInput.value = '';
        
        // Update UI
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = this.renderMessages(conversation.messages);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    showMemberProfile(memberId) {
        let member = this.memberDirectory.find(m => m.id === memberId);
        if (!member) {
            member = this.connections.find(c => c.memberId === memberId);
        }
        
        if (!member) return;
        
        const modal = document.createElement('div');
        modal.className = 'member-profile-modal';
        modal.innerHTML = `
            <div class="modal-overlay" data-modal-close></div>
            <div class="modal-content member-profile-content">
                <div class="modal-header profile-header">
                    <div class="profile-basic-info">
                        <div class="member-avatar large">${member.avatar}</div>
                        <div class="member-details">
                            <h2>${member.name}</h2>
                            <p class="member-role">${member.role}</p>
                            <p class="member-location">📍 ${member.location}</p>
                            <div class="member-stats">
                                <span class="stat">${member.mutualConnections || 0} mutual connections</span>
                                <span class="stat">Member since ${member.joinDate ? new Date(member.joinDate).getFullYear() : '2023'}</span>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="modal-close" data-modal-close>&times;</button>
                </div>
                <div class="modal-body profile-body">
                    <div class="profile-section">
                        <h3>About</h3>
                        <p>${member.bio || 'No bio available.'}</p>
                    </div>
                    <div class="profile-section">
                        <h3>Skills & Expertise</h3>
                        <div class="skills-list">
                            ${(member.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    <div class="profile-section">
                        <h3>Activity</h3>
                        <p>Last active: ${member.lastActive ? this.getTimeAgo(member.lastActive) : 'Recently'}</p>
                    </div>
                </div>
                <div class="modal-actions profile-actions">
                    <button type="button" class="modal-button secondary" data-modal-close>Close</button>
                    ${this.getProfileActionButtons(member)}
                </div>
            </div>
        `;
        
        // Setup close handlers
        modal.querySelectorAll('[data-modal-close]').forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });
        
        this.showModal(modal);
    }
    
    getProfileActionButtons(member) {
        const isConnected = this.connections.some(c => c.memberId === member.id);
        const isPending = member.connectionStatus === 'pending';
        
        if (isConnected) {
            return `<button type="button" class="modal-button primary message-btn" data-member-id="${member.id}">Send Message</button>`;
        } else if (isPending) {
            return `<button type="button" class="modal-button disabled">Request Pending</button>`;
        } else {
            return `<button type="button" class="modal-button primary connect-btn" data-member-id="${member.id}">Connect</button>`;
        }
    }
    
    filterMembers(searchTerm) {
        const filteredMembers = this.memberDirectory.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        this.renderMemberDirectory(filteredMembers);
    }
    
    filterMembersBySkill(skill) {
        if (skill === 'all') {
            this.renderMemberDirectory();
            return;
        }
        
        const filteredMembers = this.memberDirectory.filter(member => 
            member.skills.includes(skill)
        );
        
        this.renderMemberDirectory(filteredMembers);
    }
    
    renderConnections(connections = this.connections) {
        const container = document.getElementById('connections-list');
        if (!container) return;
        
        if (connections.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🤝</div>
                        <h3 style="margin: 0 0 1rem 0;">No connections yet</h3>
                        <p style="margin: 0; font-size: 0.875rem;">Start connecting with other members to build your network</p>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = connections.map(connection => `
            <div class="connection-card" data-member-id="${connection.memberId}">
                <div class="connection-avatar">
                    ${connection.avatar}
                    <div class="status-indicator ${connection.status}"></div>
                </div>
                <div class="connection-info">
                    <h4 class="connection-name">${connection.name}</h4>
                    <p class="connection-role">${connection.role}</p>
                    <p class="connection-location">📍 ${connection.location}</p>
                    <div class="connection-meta">
                        <span class="connection-date">Connected ${this.getTimeAgo(connection.connectionDate)}</span>
                        <span class="mutual-connections">${connection.mutualConnections} mutual</span>
                    </div>
                </div>
                <div class="connection-actions">
                    <button class="action-btn message-btn" data-member-id="${connection.memberId}" title="Send Message">
                        💬
                    </button>
                    <button class="action-btn profile-btn member-card" data-member-id="${connection.memberId}" title="View Profile">
                        👤
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderConnectionRequests(requests = this.connectionRequests) {
        const container = document.getElementById('connection-requests-list');
        if (!container) return;
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📩</div>
                        <h3 style="margin: 0 0 0.5rem 0;">No pending requests</h3>
                        <p style="margin: 0; font-size: 0.875rem;">New connection requests will appear here</p>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = requests.map(request => `
            <div class="connection-request-card">
                <div class="request-avatar">${request.fromAvatar}</div>
                <div class="request-info">
                    <h4 class="request-name">${request.fromName}</h4>
                    <p class="request-role">${request.fromRole}</p>
                    <p class="request-location">📍 ${request.fromLocation}</p>
                    <p class="request-message">"${request.message}"</p>
                    <div class="request-meta">
                        <span class="request-time">${this.getTimeAgo(request.timestamp)}</span>
                        <span class="mutual-connections">${request.mutualConnections} mutual connections</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="action-btn accept-btn accept-connection-btn" data-request-id="${request.id}">
                        Accept
                    </button>
                    <button class="action-btn decline-btn decline-connection-btn" data-request-id="${request.id}">
                        Decline
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderMemberDirectory(members = this.memberDirectory) {
        const container = document.getElementById('member-directory-list');
        if (!container) return;
        
        container.innerHTML = members.map(member => `
            <div class="member-card" data-member-id="${member.id}">
                <div class="member-avatar">${member.avatar}</div>
                <div class="member-info">
                    <h4 class="member-name">${member.name}</h4>
                    <p class="member-role">${member.role}</p>
                    <p class="member-location">📍 ${member.location}</p>
                    <div class="member-skills">
                        ${member.skills.slice(0, 3).map(skill => `<span class="skill-tag small">${skill}</span>`).join('')}
                        ${member.skills.length > 3 ? `<span class="skill-more">+${member.skills.length - 3}</span>` : ''}
                    </div>
                    <div class="member-meta">
                        <span class="mutual-connections">${member.mutualConnections} mutual connections</span>
                        <span class="member-since">Joined ${new Date(member.joinDate).getFullYear()}</span>
                    </div>
                </div>
                <div class="member-actions">
                    ${this.getMemberActionButton(member)}
                </div>
            </div>
        `).join('');
    }
    
    getMemberActionButton(member) {
        switch (member.connectionStatus) {
            case 'connected':
                return `<button class="action-btn connected-btn" disabled>Connected</button>`;
            case 'pending':
                return `<button class="action-btn pending-btn" disabled>Pending</button>`;
            default:
                return `<button class="action-btn connect-btn" data-member-id="${member.id}">Connect</button>`;
        }
    }
    
    saveConnections(connections = this.connections) {
        localStorage.setItem('afz_connections', JSON.stringify(connections));
    }
    
    saveConnectionRequests(requests = this.connectionRequests) {
        localStorage.setItem('afz_connection_requests', JSON.stringify(requests));
    }
    
    saveConversations() {
        localStorage.setItem('afz_conversations', JSON.stringify(this.conversations));
    }
    
    // Public API methods
    getConnectionsCount() {
        return this.connections.length;
    }
    
    getPendingRequestsCount() {
        return this.connectionRequests.length;
    }
    
    refreshNetworkingData() {
        this.renderConnections();
        this.renderConnectionRequests();
        this.renderMemberDirectory();
    }
}

// Initialize the AFZ Member Hub when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.afzMemberHub = new AFZMemberHub();
    console.log('AFZ Member Hub initialized successfully');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AFZMemberHub;
}
