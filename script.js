// Mock data
const mockContacts = [
    { id: 1, name: 'George Lobko', avatar: 'man (1).png', status: 'online', lastMessage: 'Thanks for the quick respons...', time: '09:41' },
    { id: 2, name: 'Amelia Korns', avatar: 'man (2).png', status: 'offline', lastMessage: 'I\'m stuck in traffic 🚗, bu...', time: '23:29' },
    { id: 3, name: 'Arnold Linkeln', avatar: 'man (3).png', status: 'online', lastMessage: 'Great job on the presenta...', time: '18:17' },
    { id: 4, name: 'Hasima Medvedeva', avatar: 'man.png', status: 'typing', lastMessage: 'typing...', time: '12:53' },
    { id: 5, name: 'Nistio Team', avatar: 'woman.png', status: 'typing', lastMessage: 'Daniel is typing...', time: '12:13' },
    { id: 6, name: 'Anatoly Ferusso', avatar: 'woman (1).png', status: 'online', lastMessage: 'Sorry for the delay. I\'ll b...', time: '11:53' }
];

const mockMessages = [
    { id: 1, sender: 'Daniel Garcia', content: 'Check out pls this initial sketch for our new project? 🤔', timestamp: '12:04', type: 'received', attachments: ['documents.png'] },
    { id: 2, sender: 'System', content: 'typography options for our website', timestamp: '11:45', type: 'system' },
    { id: 3, sender: 'Jordan Betord', content: 'Hi team 👋 Let\'s hop on call to discuss the new project.', timestamp: '12:11', type: 'received' },
    { id: 4, sender: 'You', content: 'Good Concepts!', timestamp: '12:13', type: 'sent' }
];

const mockGroups = [
    { id: 1, name: 'Design Team', avatar: 'web-design.png', description: 'UI/UX Design discussions', members: ['ux.png', 'ux-design (1).png', 'ux-design.png'] },
    { id: 2, name: 'Development', avatar: 'teamwork.png', description: 'Frontend & Backend team', members: ['team-building.png', 'project (3).png'] },
    { id: 3, name: 'Marketing', avatar: 'sales-agent.png', description: 'Marketing strategies', members: ['project (1).png', 'project (2).png', 'project.png', 'planning.png'] }
];

const mockFavorites = [
    { id: 1, name: 'Important Updates', avatar: 'software.png', message: 'Next week\'s sprint planning...', time: '2d ago' },
    { id: 2, name: 'Project Deadlines', avatar: 'deadline.png', message: 'Remember to submit the final...', time: '1w ago' },
    { id: 3, name: 'Team Meeting Notes', avatar: 'chat.png', message: 'Key points from today\'s...', time: '3d ago' }
];

// DOM Elements
const loadingScreen = document.querySelector('.loading-screen');
const loginContainer = document.querySelector('.login-container');
const chatContainer = document.querySelector('.chat-container');
const loginForm = document.getElementById('loginForm');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const contactsList = document.querySelector('.contacts-list');
const navItems = document.querySelectorAll('.sidebar-nav li');
const pages = document.querySelectorAll('.page-content');
const mobileChatsNav = document.querySelector('.mobile-chats');

// Chat state management
let currentChat = null;
let chatHistory = {};

// Initialize chat history with mock data
mockContacts.forEach(contact => {
    chatHistory[contact.id] = [
        {
            id: 1,
            sender: contact.name,
            content: `Hi! This is a mock conversation with ${contact.name}`,
            timestamp: '12:00',
            type: 'received'
        }
    ];
});

// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loginContainer.classList.add('show');
        }, 700);
    }, 3500);
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    
    // Create welcome message container
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = 'welcome-text';
    
    // Create typing text element
    const typingText = document.createElement('div');
    typingText.className = 'typing-text';
    typingText.textContent = '🚀 WELCOME TO MY CHAT APP .... 💬';
    welcomeContainer.appendChild(typingText);
    
    transition.appendChild(welcomeContainer);
    document.body.appendChild(transition);
    
    // Adjust emoji creation frequency based on screen size
    startEmojiAnimation();
    
    setTimeout(() => {
        transition.classList.add('active');
        
        // After 7 seconds, clean up and show chat
        setTimeout(() => {
            transition.remove();
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'grid';
            
            // Show navigation after welcome animation
            const mobileNav = document.querySelector('.mobile-nav');
            if (window.innerWidth <= 1024) {
                mobileNav.style.display = 'block';
                setTimeout(() => {
                    mobileNav.classList.add('show');
                    document.body.classList.add('has-nav');
                }, 100);
            }
            
            setTimeout(() => {
                initializeApp();
            }, 300);
        }, 7000);
    }, 100);
});

// Initialize App
function initializeApp() {
    initializeContacts();
    initializeMessages();
    initializeGroups();
    initializeFavorites();
}

// Initialize Contacts
function initializeContacts() {
    contactsList.innerHTML = mockContacts.map(contact => `
        <div class="contact-item" data-id="${contact.id}">
            <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
            <div class="contact-info">
                <div class="contact-header">
                    <h4>${contact.name}</h4>
                    <span class="contact-time">${contact.time}</span>
                </div>
                <p class="contact-status ${contact.status}">${contact.lastMessage}</p>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.contact-item').forEach(contact => {
        contact.addEventListener('click', () => {
            const chatId = parseInt(contact.dataset.id);
            switchChat(chatId);
            
            document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
            contact.classList.add('active');
        });
    });
}

// Initialize Messages
function initializeMessages(chatId = null) {
    if (!chatId && !currentChat) return;
    
    const targetChatId = chatId || currentChat;
    const messages = chatHistory[targetChatId] || [];
    
    messagesContainer.innerHTML = messages.map(message => {
        if (message.type === 'system') {
            return `
                <div class="message system">
                    <div class="message-content">
                        ${message.content}
                    </div>
                </div>
            `;
        }
        
        let attachmentHtml = '';
        if (message.attachments) {
            attachmentHtml = message.attachments.map(url => `
                <div class="message-attachment">
                    <img src="${url}" alt="Attachment">
                </div>
            `).join('');
        }
        
        return `
            <div class="message ${message.type}">
                <div class="message-content">
                    ${message.type === 'received' ? `<div class="message-sender">${message.sender}</div>` : ''}
                    ${message.content}
                    ${attachmentHtml}
                    <span class="message-time">${message.timestamp}</span>
                </div>
            </div>
        `;
    }).join('');
    
    scrollToBottom();
}

// Initialize Groups
function initializeGroups() {
    const groupsGrid = document.querySelector('.groups-grid');
    groupsGrid.innerHTML = mockGroups.map(group => `
        <div class="group-card">
            <div class="group-header">
                <img src="${group.avatar}" alt="${group.name}" class="group-avatar">
                <div class="group-info">
                    <h3>${group.name}</h3>
                    <p>${group.description}</p>
                </div>
            </div>
            <div class="group-members">
                ${group.members.map(member => `
                    <img src="${member}" alt="Member" class="member-avatar">
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Initialize Favorites
function initializeFavorites() {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = mockFavorites.map(favorite => `
        <div class="favorite-item">
            <img src="${favorite.avatar}" alt="${favorite.name}" class="contact-avatar">
            <div class="favorite-content">
                <div class="favorite-header">
                    <span class="favorite-name">${favorite.name}</span>
                    <span class="favorite-time">${favorite.time}</span>
                </div>
                <p class="favorite-message">${favorite.message}</p>
            </div>
        </div>
    `).join('');
}

// Switch active chat
function switchChat(chatId) {
    currentChat = chatId;
    const contact = mockContacts.find(c => c.id === chatId);
    
    // Update chat header
    const chatHeader = document.querySelector('.chat-info');
    chatHeader.innerHTML = `
        <img src="${contact.avatar}" alt="${contact.name}">
        <div class="chat-user-info">
            <h3>${contact.name}</h3>
            <span class="typing-status">online</span>
        </div>
    `;
    
    initializeMessages(chatId);
}

// Send Message with enhanced functionality
function sendMessage(content) {
    if (!content.trim() || !currentChat) return;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
        id: Date.now(),
        sender: 'You',
        content: content,
        timestamp: timestamp,
        type: 'sent'
    };
    
    // Add message to chat history
    if (!chatHistory[currentChat]) {
        chatHistory[currentChat] = [];
    }
    chatHistory[currentChat].push(newMessage);
    
    // Update UI
    addMessageToUI(newMessage);
    messageInput.value = '';
    
    // Show typing indicator
    startTypingAnimation();
    
    // Simulate reply after delay
    setTimeout(() => {
        stopTypingAnimation();
        
        const contact = mockContacts.find(c => c.id === currentChat);
        const replyMessage = {
            id: Date.now(),
            sender: contact.name,
            content: generateReply(content),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received'
        };
        
        chatHistory[currentChat].push(replyMessage);
        addMessageToUI(replyMessage);
    }, 2000);
}

// Generate contextual replies
function generateReply(message) {
    const replies = [
        "Thanks for your message! I'll look into it.",
        "Got it! I'll get back to you soon.",
        "Thanks for letting me know!",
        "Interesting point! Let me think about it.",
        "I see what you mean. How about we discuss this further?",
        "That's a great idea!",
        "I understand. Let me check and get back to you."
    ];
    
    // Add some context-based replies
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        replies.push("Hi there! How can I help you today?");
    }
    if (message.includes('?')) {
        replies.push("Good question! Let me find out for you.");
    }
    if (message.toLowerCase().includes('thanks') || message.toLowerCase().includes('thank you')) {
        replies.push("You're welcome! 😊");
    }
    
    return replies[Math.floor(Math.random() * replies.length)];
}

// Add Message to UI
function addMessageToUI(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            ${message.type === 'received' ? `<div class="message-sender">${message.sender}</div>` : ''}
            ${message.content}
            <span class="message-time">${message.timestamp}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// Scroll to Bottom
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event Listeners
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(messageInput.value);
    }
});

document.querySelector('.send-btn').addEventListener('click', () => {
    sendMessage(messageInput.value);
});

// Navigation Handling
function switchPage(pageId) {
    // Hide all pages first
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // Update active states in mobile nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        const itemPage = item.getAttribute('data-page');
        if (itemPage === pageId.replace('-page', '')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active states in sidebar nav
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        const itemPage = item.getAttribute('data-page');
        if (itemPage === pageId.replace('-page', '')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Special handling for messages page and chat area
    if (pageId === 'messages-page') {
        document.querySelector('.chat-area').style.display = 'flex';
    } else {
        document.querySelector('.chat-area').style.display = 'none';
    }

    // Store current page in localStorage
    localStorage.setItem('currentPage', pageId);
}

// Add click event listeners to mobile navigation
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = `${item.getAttribute('data-page')}-page`;
        switchPage(pageId);
    });
});

// Add click event listeners to sidebar navigation
document.querySelectorAll('.sidebar-nav li').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = `${item.getAttribute('data-page')}-page`;
        switchPage(pageId);
    });
});

// Initialize page from localStorage or default to messages
document.addEventListener('DOMContentLoaded', () => {
    // Set initial display states
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });

    const savedPage = localStorage.getItem('currentPage') || 'messages-page';
    switchPage(savedPage);

    // Initialize all functionalities
    initializeCalendar();
    initializeFiles();
    initializeSettings();
    initializeMobileChats();

    // Handle mobile view
    toggleMobileView();
});

// Update toggleMobileView function
function toggleMobileView() {
    const isMobile = window.innerWidth <= 1024;
    const chatContainer = document.querySelector('.chat-container');
    const mobileNav = document.querySelector('.mobile-nav');
    const currentPage = localStorage.getItem('currentPage') || 'messages-page';

    if (isMobile && chatContainer.style.display === 'grid') {
        chatContainer.classList.add('mobile-view');
        if (!mobileNav.classList.contains('show')) {
            mobileNav.style.display = 'block';
            setTimeout(() => {
                mobileNav.classList.add('show');
                document.body.classList.add('has-nav');
            }, 100);
        }
        
        if (currentChat) {
            showChatRoom();
        } else {
            showChatsList();
        }
    } else {
        chatContainer.classList.remove('mobile-view');
        mobileNav.classList.remove('show');
        document.body.classList.remove('has-nav');
        setTimeout(() => {
            mobileNav.style.display = 'none';
        }, 300);
        switchPage(currentPage);
    }
}

// Typing Animation
const typingIndicator = document.querySelector('.typing-status');
let typingInterval;

function startTypingAnimation() {
    typingIndicator.textContent = 'typing';
    let dots = '';
    typingInterval = setInterval(() => {
        dots = dots.length < 3 ? dots + '.' : '';
        typingIndicator.textContent = `typing${dots}`;
    }, 500);
}

function stopTypingAnimation() {
    clearInterval(typingInterval);
    typingIndicator.textContent = 'online';
}

// Responsive Sidebar Toggle
const collapseBtn = document.querySelector('.collapse-btn');
const leftSidebar = document.querySelector('.left-sidebar');

collapseBtn.addEventListener('click', () => {
    leftSidebar.classList.toggle('collapsed');
});

// Add hover effects to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

// Calendar functionality
function initializeCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const calendarMonth = document.querySelector('.calendar-header h3');
    const prevMonthBtn = document.querySelector('.calendar-nav:first-child');
    const nextMonthBtn = document.querySelector('.calendar-nav:last-child');
    const addEventBtn = document.querySelector('.add-event-btn');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;

    const events = {
        // Sample events data
        '2024-04-05': [
            { title: 'Team Meeting', time: '10:00 AM', color: '#4caf50' },
            { title: 'Project Review', time: '2:00 PM', color: '#2196f3' }
        ],
        '2024-04-10': [
            { title: 'Client Call', time: '11:30 AM', color: '#ff9800' }
        ],
        '2024-04-15': [
            { title: 'Deadline', time: '9:00 AM', color: '#f44336' }
        ],
        '2024-04-20': [
            { title: 'Workshop', time: '3:00 PM', color: '#9c27b0' }
        ]
    };

    function updateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarDays.innerHTML = '';

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let i = 1; i <= monthLength; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            // Check if it's today
            if (currentMonth === new Date().getMonth() && 
                currentYear === new Date().getFullYear() && 
                i === new Date().getDate()) {
                dayElement.classList.add('today');
            }

            // Check if this day has events
            if (events[dateString]) {
                dayElement.classList.add('has-event');
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                dayElement.appendChild(eventDot);
            }

            // Check if this is the selected date
            if (selectedDate && 
                selectedDate.getDate() === i && 
                selectedDate.getMonth() === currentMonth && 
                selectedDate.getFullYear() === currentYear) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', () => {
                // Remove selected class from previously selected day
                const previouslySelected = document.querySelector('.calendar-day.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }

                // Add selected class to clicked day
                dayElement.classList.add('selected');
                selectedDate = new Date(currentYear, currentMonth, i);
                
                // Show events for the selected day
                showEvents(dateString);
            });

            calendarDays.appendChild(dayElement);
        }
    }

    function showEvents(dateString) {
        const eventsList = document.querySelector('.events-list');
        eventsList.innerHTML = '';

        if (events[dateString]) {
            events[dateString].forEach(event => {
                eventsList.innerHTML += `
                    <div class="event-item">
                        <div class="event-color" style="background-color: ${event.color}"></div>
                        <div class="event-info">
                            <h5>${event.title}</h5>
                            <p>${event.time}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            eventsList.innerHTML = '<p class="no-events">No events scheduled for this day</p>';
        }
    }

    const eventModal = document.getElementById('eventModal');
    const eventForm = document.getElementById('eventForm');
    const cancelEventBtn = document.getElementById('cancelEventBtn');

    function showEventModal() {
        eventModal.classList.add('active');
    }

    function hideEventModal() {
        eventModal.classList.remove('active');
        eventForm.reset();
    }

    function addNewEvent() {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }
        showEventModal();
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateString = selectedDate.toISOString().split('T')[0];
        const eventTitle = document.getElementById('eventTitle').value;
        const eventTime = document.getElementById('eventTime').value;

        // Create events array for this date if it doesn't exist
        if (!events[dateString]) {
            events[dateString] = [];
        }

        // Add new event
        events[dateString].push({
            title: eventTitle,
            time: eventTime,
            color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
        });

        // Update calendar and hide modal
        updateCalendar();
        showEvents(dateString);
        hideEventModal();
    });

    cancelEventBtn.addEventListener('click', hideEventModal);
    addEventBtn.addEventListener('click', addNewEvent);

    // Close modal when clicking outside
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            hideEventModal();
        }
    });

    // Initialize the calendar
    updateCalendar();
}

// Files functionality
function initializeFiles() {
    const filesGrid = document.querySelector('.files-grid');
    const searchInput = document.querySelector('.files-search input');
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('fileUpload');

    const sampleFiles = [
        { name: 'Project Proposal.pdf', type: 'pdf', size: '2.5 MB', date: '2024-04-10' },
        { name: 'Meeting Notes.docx', type: 'doc', size: '1.2 MB', date: '2024-04-09' },
        { name: 'Presentation.pptx', type: 'ppt', size: '5.8 MB', date: '2024-04-08' },
        { name: 'Budget.xlsx', type: 'xls', size: '980 KB', date: '2024-04-07' },
        { name: 'Logo.png', type: 'image', size: '2.1 MB', date: '2024-04-06' },
        { name: 'Video Tutorial.mp4', type: 'video', size: '15.7 MB', date: '2024-04-05' }
    ];

    let files = [...sampleFiles];

    function getFileIcon(type) {
        const icons = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            ppt: 'fa-file-powerpoint',
            xls: 'fa-file-excel',
            image: 'fa-file-image',
            video: 'fa-file-video'
        };
        return icons[type] || 'fa-file';
    }

    function getFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const typeMap = {
            pdf: 'pdf',
            doc: 'doc', docx: 'doc',
            ppt: 'ppt', pptx: 'ppt',
            xls: 'xls', xlsx: 'xls',
            png: 'image', jpg: 'image', jpeg: 'image', gif: 'image',
            mp4: 'video', mov: 'video', avi: 'video'
        };
        return typeMap[extension] || 'file';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function displayFiles(filesToShow) {
        filesGrid.innerHTML = '';
        filesToShow.forEach(file => {
            filesGrid.innerHTML += `
                <div class="file-card">
                    <i class="fas ${getFileIcon(file.type)} fa-3x" style="color: #2b1255;"></i>
                    <h4 class="file-name">${file.name}</h4>
                    <p class="file-info">${file.size} • ${new Date(file.date).toLocaleDateString()}</p>
                </div>
            `;
        });
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFiles = files.filter(file => 
            file.name.toLowerCase().includes(searchTerm)
        );
        displayFiles(filteredFiles);
    });

    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            name: file.name,
            type: getFileType(file.name),
            size: formatFileSize(file.size),
            date: new Date().toISOString().split('T')[0]
        }));
        
        files = [...newFiles, ...files];
        displayFiles(files);
        fileInput.value = ''; // Reset file input
    });

    displayFiles(files);
}

// Settings functionality
function initializeSettings() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const body = document.body;

    // Initialize dark mode from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    body.classList.toggle('dark-mode', isDarkMode);
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }

    // Dark mode toggle handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            body.classList.toggle('dark-mode', e.target.checked);
            localStorage.setItem('darkMode', e.target.checked);
        });
    }

    // Initialize font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    if (fontSizeSelect) {
        fontSizeSelect.value = savedFontSize;
        document.documentElement.style.fontSize = getFontSizeValue(savedFontSize);
    }

    // Font size change handler
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', (e) => {
            const size = e.target.value;
            document.documentElement.style.fontSize = getFontSizeValue(size);
            localStorage.setItem('fontSize', size);
        });
    }
}

function getFontSizeValue(size) {
    const sizes = {
        'small': '14px',
        'medium': '16px',
        'large': '18px'
    };
    return sizes[size] || sizes.medium;
}

// Loading animation
function showLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-transition';
    loadingDiv.innerHTML = `
        <div class="loading-bubbles">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
    return loadingDiv;
}

function hideLoadingAnimation(loadingDiv) {
    loadingDiv.style.opacity = '0';
    setTimeout(() => {
        loadingDiv.remove();
    }, 200);
}

// Update login function to include loading animation
async function handleLogin(event) {
    event.preventDefault();
    const loadingDiv = showLoadingAnimation();
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const loginContainer = document.querySelector('.login-container');
    const chatContainer = document.querySelector('.chat-container');
    
    loginContainer.style.opacity = '0';
    setTimeout(() => {
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'grid';
        setTimeout(() => {
            chatContainer.style.opacity = '1';
            hideLoadingAnimation(loadingDiv);
        }, 50);
    }, 200);
}

// Mobile Chat State Management
const chatsPage = document.getElementById('chats-page');
const chatsList = document.querySelector('.chats-list');
const chatArea = document.querySelector('.chat-area');
const backToChatsBtn = document.querySelector('.back-to-chats');

// Initialize mobile chat list
function initializeMobileChats() {
    chatsList.innerHTML = '';
    mockContacts.forEach(contact => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.contactId = contact.id;
        chatItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="chat-avatar">
            <div class="chat-info">
                <div class="chat-header">
                    <h4 class="chat-name">${contact.name}</h4>
                    <span class="chat-time">${contact.time}</span>
                </div>
                <p class="chat-message">${contact.lastMessage}</p>
            </div>
        `;
        
        chatItem.addEventListener('click', () => {
            switchToChat(contact.id);
        });
        
        chatsList.appendChild(chatItem);
    });
}

// Show chat room view
function showChatRoom() {
    const chatArea = document.querySelector('.chat-area');
    const chatsPage = document.getElementById('chats-page');
    
    if (window.innerWidth <= 1024) {
        chatArea.classList.add('active');
        chatsPage.style.display = 'none';
        
        // Show messages page
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        document.getElementById('messages-page').style.display = 'block';
    }
}

// Show chats list
function showChatsList() {
    const chatArea = document.querySelector('.chat-area');
    const chatsPage = document.getElementById('chats-page');
    
    if (window.innerWidth <= 1024) {
        chatArea.classList.remove('active');
        chatArea.style.display = 'none';
        chatsPage.style.display = 'block';
        
        // Update mobile nav active state
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            if (item.getAttribute('data-page') === 'messages') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Handle back button click
backToChatsBtn.addEventListener('click', () => {
    showChatsList();
});

// Handle mobile chats navigation
mobileChatsNav.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
        showChatsList();
    }
});

// Update chat list when messages change
function updateChatList() {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        const contactId = item.dataset.contactId;
        const contact = mockContacts.find(c => c.id === contactId);
        if (contact) {
            item.querySelector('.chat-message').textContent = contact.lastMessage;
            item.querySelector('.chat-time').textContent = contact.time;
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        chatArea.classList.remove('active');
        chatsPage.style.display = 'none';
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('messages-page').classList.add('active');
    } else if (currentChat) {
        showChatRoom();
    }
});

// Initialize mobile chat on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileChats();
    const savedChat = localStorage.getItem('currentChat');
    if (savedChat && window.innerWidth <= 1024) {
        currentChat = savedChat;
        switchToChat(parseInt(savedChat));
        showChatRoom();
    }
});

// Mobile Navigation
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        
        // Update active state
        mobileNavItems.forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding page
        pages.forEach(page => {
            if (page.id === `${targetPage}-page`) {
                page.classList.add('active');
                if (targetPage === 'messages') {
                    chatArea.classList.add('active');
                } else {
                    chatArea.classList.remove('active');
                }
            } else {
                page.classList.remove('active');
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    toggleMobileView();
});

// Initialize view based on screen size
document.addEventListener('DOMContentLoaded', () => {
    toggleMobileView();
});

// Switch to specific chat
function switchToChat(chatId) {
    currentChat = chatId;
    const contact = mockContacts.find(c => c.id === parseInt(chatId));
    
    if (!contact) return;

    // Update chat header
    const chatHeader = document.querySelector('.chat-info');
    chatHeader.innerHTML = `
        <img src="${contact.avatar}" alt="${contact.name}">
        <div class="chat-user-info">
            <h3>${contact.name}</h3>
            <span class="typing-status">${contact.status}</span>
        </div>
    `;
    
    // Show chat area
    const chatArea = document.querySelector('.chat-area');
    chatArea.style.display = 'flex';
    
    // Update messages
    initializeMessages(chatId);
    
    // Update active states
    document.querySelectorAll('.chat-item').forEach(item => {
        if (item.dataset.contactId === chatId.toString()) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Store current chat in localStorage
    localStorage.setItem('currentChat', chatId);

    // On mobile, show the chat room
    if (window.innerWidth <= 1024) {
        showChatRoom();
    }
}

// Initialize mobile chat list
function initializeMobileChats() {
    const chatsList = document.querySelector('.chats-list');
    chatsList.innerHTML = '';
    
    mockContacts.forEach(contact => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.contactId = contact.id;
        chatItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="chat-avatar">
            <div class="chat-info">
                <div class="chat-header">
                    <h4 class="chat-name">${contact.name}</h4>
                    <span class="chat-time">${contact.time}</span>
                </div>
                <p class="chat-message">${contact.lastMessage}</p>
            </div>
        `;
        
        chatItem.addEventListener('click', () => {
            switchToChat(contact.id);
        });
        
        chatsList.appendChild(chatItem);
    });
}

// Show chat room view
function showChatRoom() {
    const chatArea = document.querySelector('.chat-area');
    const chatsPage = document.getElementById('chats-page');
    
    if (window.innerWidth <= 1024) {
        chatArea.classList.add('active');
        chatsPage.style.display = 'none';
        
        // Show messages page
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        document.getElementById('messages-page').style.display = 'block';
    }
}

// Show chats list
function showChatsList() {
    const chatArea = document.querySelector('.chat-area');
    const chatsPage = document.getElementById('chats-page');
    
    if (window.innerWidth <= 1024) {
        chatArea.classList.remove('active');
        chatArea.style.display = 'none';
        chatsPage.style.display = 'block';
        
        // Update mobile nav active state
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            if (item.getAttribute('data-page') === 'messages') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Initialize messages for a chat
function initializeMessages(chatId) {
    const messages = chatHistory[chatId] || [];
    const messagesContainer = document.getElementById('messagesContainer');
    
    messagesContainer.innerHTML = messages.map(message => {
        if (message.type === 'system') {
            return `
                <div class="message system">
                    <div class="message-content">
                        ${message.content}
                    </div>
                </div>
            `;
        }
        
        let attachmentHtml = '';
        if (message.attachments) {
            attachmentHtml = message.attachments.map(url => `
                <div class="message-attachment">
                    <img src="${url}" alt="Attachment">
                </div>
            `).join('');
        }
        
        return `
            <div class="message ${message.type}">
                <div class="message-content">
                    ${message.type === 'received' ? `<div class="message-sender">${message.sender}</div>` : ''}
                    ${message.content}
                    ${attachmentHtml}
                    <span class="message-time">${message.timestamp}</span>
                </div>
            </div>
        `;
    }).join('');
    
    scrollToBottom();
}

// Handle back button click
document.querySelector('.back-to-chats').addEventListener('click', () => {
    showChatsList();
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Hide mobile nav initially
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.style.display = 'none';
    mobileNav.classList.remove('show');
    document.body.classList.remove('has-nav');
    
    initializeMobileChats();
    
    // Restore previous chat if exists
    const savedChatId = localStorage.getItem('currentChat');
    if (savedChatId) {
        switchToChat(parseInt(savedChatId));
    }
    
    // Initialize message input handlers
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-btn');
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(messageInput.value);
        }
    });
    
    sendButton.addEventListener('click', () => {
        sendMessage(messageInput.value);
    });
});

function createFloatingEmoji() {
    const emojis = ['😊', '🌟', '💬', '🚀', '💡', '🎯', '✨', '💫'];
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Adjust position based on screen size
    const isMobile = window.innerWidth <= 480;
    const startX = isMobile ? 
        Math.random() * (window.innerWidth - 40) : 
        Math.random() * (window.innerWidth - 100);
    
    emoji.style.left = `${startX}px`;
    emoji.style.setProperty('--tx', `${(Math.random() - 0.5) * (isMobile ? 100 : 200)}px`);
    emoji.style.setProperty('--rot', `${(Math.random() - 0.5) * 30}deg`);
    
    document.querySelector('.page-transition').appendChild(emoji);
    
    // Remove emoji after animation
    setTimeout(() => {
        emoji.remove();
    }, 4000);
}

// Adjust emoji creation frequency based on screen size
function startEmojiAnimation() {
    const isMobile = window.innerWidth <= 480;
    const interval = isMobile ? 2000 : 1000; // Less frequent on mobile
    
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to create emoji
            createFloatingEmoji();
        }
    }, interval);
} 