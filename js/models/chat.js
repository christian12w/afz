/**
 * AFZ Member Hub - Chat Interface Module
 * Real-time messaging with emoji support, file sharing, and chat rooms
 */

class ChatInterface {
    constructor() {
        this.currentRoom = 'general';
        this.currentUser = {
            id: 'user_123',
            name: 'John Doe',
            avatar: 'assets/avatars/john-doe.jpg',
            status: 'online'
        };
        
        this.chatRooms = [
            { id: 'general', name: 'General Discussion', members: 156, type: 'public' },
            { id: 'healthcare', name: 'Healthcare Support', members: 89, type: 'public' },
            { id: 'advocacy', name: 'Advocacy & Rights', members: 124, type: 'public' },
            { id: 'events', name: 'Events & Meetups', members: 67, type: 'public' },
            { id: 'youth', name: 'Youth Support', members: 45, type: 'private' }
        ];
        
        this.messages = [];
        this.onlineUsers = [];
        this.typingUsers = [];
        this.messageHistory = new Map();
        
        this.init();
    }

    init() {
        this.setupChatInterface();
        this.loadInitialData();
        this.setupEventListeners();
        this.startRealtimeUpdates();
        this.setupEmojiPicker();
        this.setupFileUpload();
    }

    setupChatInterface() {
        const chatContainer = document.getElementById('section-chat');
        if (!chatContainer) return;

        chatContainer.innerHTML = `
            <div class="chat-interface">
                <!-- Chat Header -->
                <div class="chat-header">
                    <div class="chat-room-info">
                        <div class="room-avatar">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="room-details">
                            <h3 class="room-name">${this.getCurrentRoomName()}</h3>
                            <p class="room-members">${this.getCurrentRoomMembers()} members • <span class="online-count">12 online</span></p>
                        </div>
                    </div>
                    <div class="chat-actions">
                        <button class="action-btn" id="chat-search-btn" title="Search Messages">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="action-btn" id="chat-info-btn" title="Room Info">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="action-btn mobile-menu-toggle" id="chat-rooms-toggle">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>

                <div class="chat-body">
                    <!-- Chat Sidebar -->
                    <div class="chat-sidebar" id="chat-sidebar">
                        <div class="sidebar-section">
                            <h4>Chat Rooms</h4>
                            <div class="chat-rooms-list" id="chat-rooms-list">
                                ${this.renderChatRooms()}
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h4>Online Members</h4>
                            <div class="online-users-list" id="online-users-list">
                                ${this.renderOnlineUsers()}
                            </div>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div class="chat-messages-container">
                        <div class="messages-area" id="messages-area">
                            ${this.renderMessages()}
                        </div>
                        
                        <!-- Typing Indicator -->
                        <div class="typing-indicator" id="typing-indicator" style="display: none;">
                            <div class="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span class="typing-text">Someone is typing...</span>
                        </div>
                        
                        <!-- Message Input -->
                        <div class="message-input-container">
                            <div class="message-input-wrapper">
                                <button class="input-action-btn" id="attach-file-btn" title="Attach File">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <div class="message-input-area">
                                    <textarea 
                                        id="message-input" 
                                        placeholder="Type your message..."
                                        rows="1"
                                        maxlength="2000"
                                    ></textarea>
                                    <div class="input-actions">
                                        <button class="input-action-btn" id="emoji-btn" title="Add Emoji">
                                            <i class="fas fa-smile"></i>
                                        </button>
                                        <button class="send-btn" id="send-message-btn" disabled>
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="message-input-footer">
                                <span class="char-count">0/2000</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- File Upload Modal -->
                <div class="file-upload-modal" id="file-upload-modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Share File</h3>
                            <button class="modal-close" id="close-file-modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="file-drop-zone" id="file-drop-zone">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Drop files here or click to browse</p>
                                <input type="file" id="file-input" multiple accept="image/*,video/*,.pdf,.doc,.docx,.txt">
                            </div>
                            <div class="file-preview" id="file-preview" style="display: none;"></div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="cancel-upload">Cancel</button>
                            <button class="btn btn-primary" id="confirm-upload" disabled>Send Files</button>
                        </div>
                    </div>
                </div>

                <!-- Emoji Picker -->
                <div class="emoji-picker" id="emoji-picker" style="display: none;">
                    <div class="emoji-categories">
                        <button class="emoji-category active" data-category="recent">⏰</button>
                        <button class="emoji-category" data-category="people">😀</button>
                        <button class="emoji-category" data-category="nature">🌿</button>
                        <button class="emoji-category" data-category="food">🍎</button>
                        <button class="emoji-category" data-category="activity">⚽</button>
                        <button class="emoji-category" data-category="travel">🚗</button>
                        <button class="emoji-category" data-category="objects">💼</button>
                        <button class="emoji-category" data-category="symbols">❤️</button>
                        <button class="emoji-category" data-category="flags">🏳️</button>
                    </div>
                    <div class="emoji-grid" id="emoji-grid">
                        ${this.renderEmojiGrid('recent')}
                    </div>
                </div>
            </div>
        `;

        this.injectChatStyles();
    }

    renderChatRooms() {
        return this.chatRooms.map(room => `
            <div class="chat-room-item ${room.id === this.currentRoom ? 'active' : ''}" data-room-id="${room.id}">
                <div class="room-icon">
                    <i class="fas fa-${room.type === 'private' ? 'lock' : 'hashtag'}"></i>
                </div>
                <div class="room-info">
                    <span class="room-name">${room.name}</span>
                    <span class="room-members">${room.members} members</span>
                </div>
                ${room.id !== this.currentRoom ? '<div class="unread-badge">3</div>' : ''}
            </div>
        `).join('');
    }

    renderOnlineUsers() {
        const mockUsers = [
            { id: 1, name: 'Sarah Williams', avatar: 'assets/avatars/sarah.jpg', status: 'online' },
            { id: 2, name: 'Michael Johnson', avatar: 'assets/avatars/michael.jpg', status: 'online' },
            { id: 3, name: 'Emma Davis', avatar: 'assets/avatars/emma.jpg', status: 'away' },
            { id: 4, name: 'James Wilson', avatar: 'assets/avatars/james.jpg', status: 'online' }
        ];

        return mockUsers.map(user => `
            <div class="online-user-item" data-user-id="${user.id}">
                <div class="user-avatar">
                    <img src="${user.avatar}" alt="${user.name}">
                    <div class="status-dot ${user.status}"></div>
                </div>
                <div class="user-info">
                    <span class="user-name">${user.name}</span>
                    <span class="user-status">${user.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderMessages() {
        const mockMessages = [
            {
                id: 1,
                user: { name: 'Sarah Williams', avatar: 'assets/avatars/sarah.jpg' },
                content: 'Welcome everyone to the healthcare support room! 👋',
                timestamp: new Date(Date.now() - 3600000),
                type: 'text'
            },
            {
                id: 2,
                user: { name: 'Michael Johnson', avatar: 'assets/avatars/michael.jpg' },
                content: 'Thanks Sarah! Great to be here. I have some questions about sun protection.',
                timestamp: new Date(Date.now() - 3500000),
                type: 'text'
            },
            {
                id: 3,
                user: { name: 'Emma Davis', avatar: 'assets/avatars/emma.jpg' },
                content: 'I just uploaded a helpful guide about skincare routines.',
                timestamp: new Date(Date.now() - 3400000),
                type: 'file',
                file: { name: 'skincare-guide.pdf', size: '2.3 MB', type: 'application/pdf' }
            },
            {
                id: 4,
                user: { name: 'James Wilson', avatar: 'assets/avatars/james.jpg' },
                content: 'That sounds really useful Emma! Can\'t wait to read it 📖',
                timestamp: new Date(Date.now() - 3300000),
                type: 'text'
            }
        ];

        return mockMessages.map(msg => this.renderMessage(msg)).join('');
    }

    renderMessage(message) {
        const timeStr = this.formatTime(message.timestamp);
        const isOwn = message.user.name === this.currentUser.name;
        
        let contentHtml = '';
        if (message.type === 'text') {
            contentHtml = `<div class="message-text">${this.formatMessageText(message.content)}</div>`;
        } else if (message.type === 'file') {
            contentHtml = `
                <div class="message-file">
                    <div class="file-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="file-info">
                        <span class="file-name">${message.file.name}</span>
                        <span class="file-size">${message.file.size}</span>
                    </div>
                    <button class="file-download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
        }

        return `
            <div class="message-item ${isOwn ? 'own' : ''}" data-message-id="${message.id}">
                <div class="message-avatar">
                    <img src="${message.user.avatar}" alt="${message.user.name}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author">${message.user.name}</span>
                        <span class="message-time">${timeStr}</span>
                    </div>
                    ${contentHtml}
                </div>
                <div class="message-actions">
                    <button class="message-action-btn" title="React">
                        <i class="fas fa-smile"></i>
                    </button>
                    <button class="message-action-btn" title="Reply">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="message-action-btn" title="More">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderEmojiGrid(category) {
        const emojiData = {
            recent: ['😀', '😂', '❤️', '👍', '👏', '🎉', '🔥', '💯'],
            people: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'],
            nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
            food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐'],
            activity: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌'],
            travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄'],
            objects: ['💼', '🎒', '👝', '👛', '👜', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈'],
            flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿']
        };

        const emojis = emojiData[category] || emojiData.recent;
        return emojis.map(emoji => `
            <button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
        `).join('');
    }

    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message-btn');
        const charCount = document.querySelector('.char-count');

        if (messageInput) {
            messageInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = `${length}/2000`;
                sendBtn.disabled = length === 0;
                
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                
                this.handleTyping();
            });

            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Room switching
        const chatRoomsList = document.getElementById('chat-rooms-list');
        if (chatRoomsList) {
            chatRoomsList.addEventListener('click', (e) => {
                const roomItem = e.target.closest('.chat-room-item');
                if (roomItem) {
                    const roomId = roomItem.dataset.roomId;
                    this.switchRoom(roomId);
                }
            });
        }

        // Emoji picker
        const emojiBtn = document.getElementById('emoji-btn');
        const emojiPicker = document.getElementById('emoji-picker');
        
        if (emojiBtn && emojiPicker) {
            emojiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleEmojiPicker();
            });
        }

        // File upload
        const attachFileBtn = document.getElementById('attach-file-btn');
        if (attachFileBtn) {
            attachFileBtn.addEventListener('click', () => this.showFileUploadModal());
        }

        // Mobile sidebar toggle
        const chatRoomsToggle = document.getElementById('chat-rooms-toggle');
        const chatSidebar = document.getElementById('chat-sidebar');
        
        if (chatRoomsToggle && chatSidebar) {
            chatRoomsToggle.addEventListener('click', () => {
                chatSidebar.classList.toggle('show');
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.emoji-picker') && !e.target.closest('#emoji-btn')) {
                this.hideEmojiPicker();
            }
        });
    }

    setupEmojiPicker() {
        const emojiCategories = document.querySelectorAll('.emoji-category');
        const emojiGrid = document.getElementById('emoji-grid');

        emojiCategories.forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryName = e.target.dataset.category;
                
                emojiCategories.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                
                emojiGrid.innerHTML = this.renderEmojiGrid(categoryName);
                this.setupEmojiSelection();
            });
        });

        this.setupEmojiSelection();
    }

    setupEmojiSelection() {
        const emojiButtons = document.querySelectorAll('.emoji-btn');
        emojiButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emoji = e.target.dataset.emoji;
                this.insertEmoji(emoji);
            });
        });
    }

    setupFileUpload() {
        const fileInput = document.getElementById('file-input');
        const fileDropZone = document.getElementById('file-drop-zone');
        const fileUploadModal = document.getElementById('file-upload-modal');
        const closeFileModal = document.getElementById('close-file-modal');
        const cancelUpload = document.getElementById('cancel-upload');
        const confirmUpload = document.getElementById('confirm-upload');

        if (fileDropZone) {
            fileDropZone.addEventListener('click', () => fileInput.click());
            
            fileDropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileDropZone.classList.add('dragover');
            });
            
            fileDropZone.addEventListener('dragleave', () => {
                fileDropZone.classList.remove('dragover');
            });
            
            fileDropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
                this.handleFileSelection(e.dataTransfer.files);
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });
        }

        if (closeFileModal) {
            closeFileModal.addEventListener('click', () => this.hideFileUploadModal());
        }

        if (cancelUpload) {
            cancelUpload.addEventListener('click', () => this.hideFileUploadModal());
        }

        if (confirmUpload) {
            confirmUpload.addEventListener('click', () => this.uploadFiles());
        }
    }

    loadInitialData() {
        // Load message history for current room
        this.loadMessageHistory(this.currentRoom);
        
        // Update online users
        this.updateOnlineUsers();
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const content = messageInput.value.trim();
        
        if (!content) return;

        const message = {
            id: Date.now(),
            user: this.currentUser,
            content: content,
            timestamp: new Date(),
            type: 'text'
        };

        this.addMessage(message);
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        const charCount = document.querySelector('.char-count');
        charCount.textContent = '0/2000';
        
        const sendBtn = document.getElementById('send-message-btn');
        sendBtn.disabled = true;

        // Simulate message delivery
        setTimeout(() => {
            this.simulateResponse();
        }, 1000 + Math.random() * 2000);
    }

    addMessage(message) {
        const messagesArea = document.getElementById('messages-area');
        const messageHtml = this.renderMessage(message);
        messagesArea.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
    }

    simulateResponse() {
        const responses = [
            'That\'s really helpful, thank you!',
            'I completely agree with that point.',
            'Thanks for sharing your experience.',
            'That\'s exactly what I was looking for!',
            'Great advice, I\'ll definitely try that.',
            'I had a similar experience.',
            'That resource looks very useful.'
        ];

        const users = [
            { name: 'Sarah Williams', avatar: 'assets/avatars/sarah.jpg' },
            { name: 'Michael Johnson', avatar: 'assets/avatars/michael.jpg' },
            { name: 'Emma Davis', avatar: 'assets/avatars/emma.jpg' }
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const message = {
            id: Date.now(),
            user: randomUser,
            content: randomResponse,
            timestamp: new Date(),
            type: 'text'
        };

        this.addMessage(message);
    }

    switchRoom(roomId) {
        this.currentRoom = roomId;
        
        // Update UI
        const roomItems = document.querySelectorAll('.chat-room-item');
        roomItems.forEach(item => {
            item.classList.toggle('active', item.dataset.roomId === roomId);
        });

        // Update header
        const roomName = document.querySelector('.room-name');
        const roomMembers = document.querySelector('.room-members');
        
        const room = this.chatRooms.find(r => r.id === roomId);
        if (room && roomName && roomMembers) {
            roomName.textContent = room.name;
            roomMembers.innerHTML = `${room.members} members • <span class="online-count">12 online</span>`;
        }

        // Load room messages
        this.loadMessageHistory(roomId);
        
        // Close mobile sidebar
        const chatSidebar = document.getElementById('chat-sidebar');
        if (chatSidebar) {
            chatSidebar.classList.remove('show');
        }
    }

    loadMessageHistory(roomId) {
        const messagesArea = document.getElementById('messages-area');
        if (!messagesArea) return;

        // Clear current messages
        messagesArea.innerHTML = '';

        // Load appropriate messages for room
        setTimeout(() => {
            messagesArea.innerHTML = this.renderMessages();
            this.scrollToBottom();
        }, 300);
    }

    toggleEmojiPicker() {
        const emojiPicker = document.getElementById('emoji-picker');
        if (emojiPicker) {
            const isVisible = emojiPicker.style.display !== 'none';
            emojiPicker.style.display = isVisible ? 'none' : 'block';
        }
    }

    hideEmojiPicker() {
        const emojiPicker = document.getElementById('emoji-picker');
        if (emojiPicker) {
            emojiPicker.style.display = 'none';
        }
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            const start = messageInput.selectionStart;
            const end = messageInput.selectionEnd;
            const text = messageInput.value;
            
            messageInput.value = text.substring(0, start) + emoji + text.substring(end);
            messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
            
            // Update character count
            const charCount = document.querySelector('.char-count');
            charCount.textContent = `${messageInput.value.length}/2000`;
            
            // Enable send button if there's content
            const sendBtn = document.getElementById('send-message-btn');
            sendBtn.disabled = messageInput.value.trim().length === 0;
            
            messageInput.focus();
        }
        
        this.hideEmojiPicker();
    }

    showFileUploadModal() {
        const modal = document.getElementById('file-upload-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideFileUploadModal() {
        const modal = document.getElementById('file-upload-modal');
        const filePreview = document.getElementById('file-preview');
        const confirmBtn = document.getElementById('confirm-upload');
        
        if (modal) {
            modal.style.display = 'none';
        }
        
        if (filePreview) {
            filePreview.style.display = 'none';
            filePreview.innerHTML = '';
        }
        
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
    }

    handleFileSelection(files) {
        if (!files || files.length === 0) return;

        const filePreview = document.getElementById('file-preview');
        const confirmBtn = document.getElementById('confirm-upload');
        
        if (!filePreview || !confirmBtn) return;

        filePreview.innerHTML = '';
        filePreview.style.display = 'block';

        Array.from(files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-preview-item';
            
            let preview = '';
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    fileItem.innerHTML = `
                        <div class="file-thumbnail">
                            <img src="${e.target.result}" alt="${file.name}">
                        </div>
                        <div class="file-details">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${this.formatFileSize(file.size)}</span>
                        </div>
                        <button class="remove-file" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                fileItem.innerHTML = `
                    <div class="file-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button class="remove-file" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }

            filePreview.appendChild(fileItem);
        });

        confirmBtn.disabled = false;
    }

    uploadFiles() {
        // Simulate file upload
        this.hideFileUploadModal();
        
        const message = {
            id: Date.now(),
            user: this.currentUser,
            content: 'File shared',
            timestamp: new Date(),
            type: 'file',
            file: { 
                name: 'example-file.pdf', 
                size: '1.2 MB', 
                type: 'application/pdf' 
            }
        };

        this.addMessage(message);
        
        // Show success notification
        if (window.afzDashboard) {
            window.afzDashboard.showNotification('File uploaded successfully!', 'success');
        }
    }

    handleTyping() {
        // Show typing indicator to other users
        clearTimeout(this.typingTimeout);
        
        this.typingTimeout = setTimeout(() => {
            // Stop showing typing indicator
        }, 2000);
    }

    updateOnlineUsers() {
        // Update online users list periodically
    }

    startRealtimeUpdates() {
        // Simulate real-time message updates
        setInterval(() => {
            // Check for new messages
        }, 5000);

        // Update online status
        setInterval(() => {
            this.updateOnlineUsers();
        }, 30000);
    }

    scrollToBottom() {
        const messagesArea = document.getElementById('messages-area');
        if (messagesArea) {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Now';
    }

    formatMessageText(text) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getCurrentRoomName() {
        const room = this.chatRooms.find(r => r.id === this.currentRoom);
        return room ? room.name : 'General Discussion';
    }

    getCurrentRoomMembers() {
        const room = this.chatRooms.find(r => r.id === this.currentRoom);
        return room ? room.members : 0;
    }

    injectChatStyles() {
        if (document.getElementById('chat-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'chat-styles';
        styles.textContent = `
            .chat-interface {
                height: 100%;
                display: flex;
                flex-direction: column;
                background: var(--surface-color);
                border-radius: 16px;
                overflow: hidden;
            }

            .chat-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .chat-room-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .room-avatar {
                width: 48px;
                height: 48px;
                background: var(--primary-color);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
            }

            .room-details h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .room-details p {
                margin: 4px 0 0;
                font-size: 14px;
                color: var(--text-secondary);
            }

            .online-count {
                color: var(--success-color);
            }

            .chat-actions {
                display: flex;
                gap: 8px;
            }

            .action-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: var(--surface-hover);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-secondary);
            }

            .action-btn:hover {
                background: var(--primary-color);
                color: white;
            }

            .chat-body {
                flex: 1;
                display: flex;
                min-height: 0;
            }

            .chat-sidebar {
                width: 280px;
                background: var(--surface-color);
                border-right: 1px solid var(--border-color);
                padding: 20px;
                overflow-y: auto;
                transition: transform 0.3s ease;
            }

            .sidebar-section {
                margin-bottom: 32px;
            }

            .sidebar-section h4 {
                margin: 0 0 16px;
                font-size: 14px;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .chat-room-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .chat-room-item:hover {
                background: var(--surface-hover);
            }

            .chat-room-item.active {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            .room-icon {
                width: 32px;
                height: 32px;
                background: var(--surface-hover);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }

            .chat-room-item.active .room-icon {
                background: var(--primary-color);
                color: white;
            }

            .room-info {
                flex: 1;
            }

            .room-name {
                display: block;
                font-weight: 500;
                color: var(--text-primary);
                margin-bottom: 2px;
            }

            .room-members {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .unread-badge {
                background: var(--primary-color);
                color: white;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
            }

            .online-user-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .online-user-item:hover {
                background: var(--surface-hover);
            }

            .user-avatar {
                position: relative;
                width: 32px;
                height: 32px;
            }

            .user-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .status-dot {
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid var(--surface-color);
            }

            .status-dot.online {
                background: var(--success-color);
            }

            .status-dot.away {
                background: var(--warning-color);
            }

            .user-info {
                flex: 1;
            }

            .user-name {
                display: block;
                font-weight: 500;
                color: var(--text-primary);
                font-size: 13px;
            }

            .user-status {
                font-size: 11px;
                color: var(--text-secondary);
                text-transform: capitalize;
            }

            .chat-messages-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .messages-area {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                scroll-behavior: smooth;
            }

            .message-item {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                position: relative;
            }

            .message-item:hover .message-actions {
                opacity: 1;
            }

            .message-avatar img {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                object-fit: cover;
            }

            .message-content {
                flex: 1;
                max-width: calc(100% - 60px);
            }

            .message-header {
                display: flex;
                align-items: baseline;
                gap: 8px;
                margin-bottom: 4px;
            }

            .message-author {
                font-weight: 600;
                color: var(--text-primary);
                font-size: 14px;
            }

            .message-time {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .message-text {
                color: var(--text-primary);
                line-height: 1.5;
                word-wrap: break-word;
            }

            .message-text a {
                color: var(--primary-color);
                text-decoration: none;
            }

            .message-text a:hover {
                text-decoration: underline;
            }

            .message-file {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: var(--surface-hover);
                border-radius: 8px;
                border: 1px solid var(--border-color);
                max-width: 300px;
            }

            .file-icon {
                width: 40px;
                height: 40px;
                background: var(--primary-color);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }

            .file-info {
                flex: 1;
            }

            .file-name {
                display: block;
                font-weight: 500;
                color: var(--text-primary);
                margin-bottom: 2px;
            }

            .file-size {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .file-download {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: var(--text-secondary);
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .file-download:hover {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            .message-actions {
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s ease;
                background: var(--surface-color);
                padding: 4px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .message-action-btn {
                background: none;
                border: none;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 4px;
                transition: background 0.2s ease;
                color: var(--text-secondary);
            }

            .message-action-btn:hover {
                background: var(--surface-hover);
            }

            .typing-indicator {
                padding: 8px 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .typing-dots {
                display: flex;
                gap: 2px;
            }

            .typing-dots span {
                width: 6px;
                height: 6px;
                background: var(--text-secondary);
                border-radius: 50%;
                animation: typing-pulse 1.4s infinite ease-in-out;
            }

            .typing-dots span:nth-child(1) {
                animation-delay: -0.32s;
            }

            .typing-dots span:nth-child(2) {
                animation-delay: -0.16s;
            }

            .typing-text {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .message-input-container {
                padding: 20px;
                border-top: 1px solid var(--border-color);
                background: var(--surface-color);
            }

            .message-input-wrapper {
                display: flex;
                gap: 12px;
                align-items: flex-end;
            }

            .input-action-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: var(--surface-hover);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-secondary);
                flex-shrink: 0;
            }

            .input-action-btn:hover {
                background: var(--primary-light);
                color: var(--primary-color);
            }

            .message-input-area {
                flex: 1;
                position: relative;
            }

            .message-input-area textarea {
                width: 100%;
                background: var(--surface-hover);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 12px 60px 12px 16px;
                font-family: inherit;
                font-size: 14px;
                color: var(--text-primary);
                resize: none;
                outline: none;
                transition: all 0.2s ease;
                min-height: 44px;
                max-height: 120px;
            }

            .message-input-area textarea:focus {
                border-color: var(--primary-color);
                background: var(--surface-color);
            }

            .input-actions {
                position: absolute;
                right: 8px;
                bottom: 8px;
                display: flex;
                gap: 4px;
            }

            .send-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .send-btn:disabled {
                background: var(--border-color);
                cursor: not-allowed;
            }

            .send-btn:not(:disabled):hover {
                background: var(--primary-dark);
                transform: scale(1.05);
            }

            .message-input-footer {
                display: flex;
                justify-content: flex-end;
                margin-top: 8px;
            }

            .char-count {
                font-size: 12px;
                color: var(--text-secondary);
            }

            .emoji-picker {
                position: absolute;
                bottom: 120px;
                right: 20px;
                width: 320px;
                height: 400px;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                overflow: hidden;
            }

            .emoji-categories {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                background: var(--surface-hover);
            }

            .emoji-category {
                flex: 1;
                background: none;
                border: none;
                padding: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 16px;
            }

            .emoji-category:hover {
                background: var(--surface-color);
            }

            .emoji-category.active {
                background: var(--primary-light);
            }

            .emoji-grid {
                padding: 16px;
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 8px;
                height: calc(100% - 60px);
                overflow-y: auto;
            }

            .emoji-btn {
                background: none;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s ease;
                font-size: 18px;
            }

            .emoji-btn:hover {
                background: var(--surface-hover);
            }

            .file-upload-modal {
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

            .file-upload-modal .modal-content {
                background: var(--surface-color);
                border-radius: 16px;
                width: 100%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .file-upload-modal .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px;
                border-bottom: 1px solid var(--border-color);
            }

            .file-upload-modal h3 {
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

            .file-upload-modal .modal-body {
                padding: 24px;
            }

            .file-drop-zone {
                border: 2px dashed var(--border-color);
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--surface-hover);
            }

            .file-drop-zone:hover, .file-drop-zone.dragover {
                border-color: var(--primary-color);
                background: var(--primary-light);
            }

            .file-drop-zone i {
                font-size: 48px;
                color: var(--text-secondary);
                margin-bottom: 16px;
            }

            .file-drop-zone p {
                margin: 0;
                color: var(--text-secondary);
            }

            .file-drop-zone input {
                display: none;
            }

            .file-preview {
                margin-top: 20px;
            }

            .file-preview-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                margin-bottom: 8px;
            }

            .file-thumbnail {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                overflow: hidden;
                flex-shrink: 0;
            }

            .file-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .file-details {
                flex: 1;
            }

            .remove-file {
                background: var(--error-light);
                color: var(--error-color);
                border: none;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .remove-file:hover {
                background: var(--error-color);
                color: white;
            }

            .file-upload-modal .modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                padding: 24px;
                border-top: 1px solid var(--border-color);
            }

            @keyframes typing-pulse {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .chat-sidebar {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    z-index: 100;
                    transform: translateX(-100%);
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
                }

                .chat-sidebar.show {
                    transform: translateX(0);
                }

                .mobile-menu-toggle {
                    display: flex;
                }

                .emoji-picker {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }

            @media (min-width: 769px) {
                .mobile-menu-toggle {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in main dashboard
window.ChatInterface = ChatInterface;
