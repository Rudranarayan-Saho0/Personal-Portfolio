// Admin credentials
const ADMIN_USERNAME = "Rudra";
const ADMIN_PASSWORD = "Rudra@2005";

// JSONbin.io configuration
const JSONBIN_API_KEY = '$2a$10$XGwPbUeqH1q6l4qk9iwB0eeMYLhC3oZu9/oNvvHZtHAD212nVBY46';
const JSONBIN_BIN_ID = '67f159d98960c979a57ecc76';
const USE_JSONBIN = true; // Enable JSONbin.io integration

// DOM elements
const loginSection = document.getElementById('login-section');
const messagesSection = document.getElementById('messages-section');
const loginForm = document.getElementById('login-form');
const messagesList = document.getElementById('messages-list');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is already logged in
function checkLoginStatus() {
    console.log('Checking login status...');
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    console.log('Is logged in:', isLoggedIn);
    if (isLoggedIn === 'true') {
        showMessages();
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    console.log('Showing login form');
    loginSection.classList.remove('hidden');
    messagesSection.classList.add('hidden');
}

// Show messages section
function showMessages() {
    console.log('Showing messages section');
    loginSection.classList.add('hidden');
    messagesSection.classList.remove('hidden');
    loadMessages();
}

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    console.log('Login attempt - Username:', username);
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        console.log('Login successful');
        sessionStorage.setItem('adminLoggedIn', 'true');
        showMessages();
    } else {
        console.log('Login failed');
        alert('Invalid username or password');
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    console.log('Logging out');
    sessionStorage.removeItem('adminLoggedIn');
    showLogin();
});

// Function to load messages
async function loadMessages() {
    console.log('Loading messages...');
    const messagesContainer = document.getElementById('messages-container');
    
    if (!messagesContainer) {
        console.error('Messages container not found!');
        return;
    }
    
    messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';
    
    console.log('USE_JSONBIN:', USE_JSONBIN);
    console.log('JSONBIN_API_KEY:', JSONBIN_API_KEY);
    console.log('JSONBIN_BIN_ID:', JSONBIN_BIN_ID);

    try {
        // Try to get messages from JSONbin.io first if enabled
        let messages = [];
        
        if (USE_JSONBIN) {
            try {
                console.log('Fetching from JSONbin.io...');
                const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'GET',
                    headers: {
                        'X-Master-Key': JSONBIN_API_KEY
                    }
                });
                
                console.log('JSONbin.io response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('JSONbin.io response:', result);
                    
                    if (result.record && result.record.messages) {
                        messages = result.record.messages;
                        console.log('Messages loaded from JSONbin.io:', messages);
                    } else {
                        console.warn('No messages array found in JSONbin.io response');
                        // Initialize the messages array in JSONbin.io
                        const initResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Master-Key': JSONBIN_API_KEY
                            },
                            body: JSON.stringify({ messages: [] })
                        });
                        console.log('Initialized messages array in JSONbin.io:', initResponse.status);
                    }
                } else {
                    console.warn('JSONbin.io fetch failed:', response.status, response.statusText);
                    // Fall back to local storage
                    messages = JSON.parse(localStorage.getItem('messages') || '[]');
                    console.log('Falling back to local storage:', messages);
                }
            } catch (error) {
                console.warn('Error fetching from JSONbin:', error);
                // Fall back to local storage
                messages = JSON.parse(localStorage.getItem('messages') || '[]');
                console.log('Error occurred, using local storage:', messages);
            }
        } else {
            // Use local storage directly
            messages = JSON.parse(localStorage.getItem('messages') || '[]');
            console.log('Using local storage directly:', messages);
        }
        
        if (messages.length === 0) {
            console.log('No messages found');
            messagesContainer.innerHTML = '<div class="no-messages">No messages found</div>';
            return;
        }

        // Sort messages by timestamp (newest first)
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        console.log('Sorted messages:', messages);

        let messagesHTML = '';
        messages.forEach(message => {
            const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp';
            messagesHTML += `
                <div class="message-card">
                    <div class="message-header">
                        <h3>${message.name}</h3>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <p class="email">${message.email}</p>
                    <p class="message-content">${message.message}</p>
                    <button class="delete-btn" onclick="deleteMessage('${message.id}')">Delete</button>
                </div>
            `;
        });

        console.log('Generated HTML:', messagesHTML);
        messagesContainer.innerHTML = messagesHTML;
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<div class="error">Failed to load messages. Please try again.</div>';
    }
}

// Function to delete a message
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }

    try {
        // Get messages from local storage first
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        
        // Filter out the message to delete
        messages = messages.filter(message => message.id !== messageId);
        
        // Update local storage
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // Try to update JSONbin.io if enabled
        if (USE_JSONBIN) {
            try {
                const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    body: JSON.stringify({ messages })
                });
                
                if (!updateResponse.ok) {
                    console.warn('JSONbin.io update failed:', updateResponse.status, updateResponse.statusText);
                }
            } catch (error) {
                console.warn('Error updating JSONbin:', error);
            }
        }
        
        showNotification('Message deleted successfully', 'success');
        loadMessages(); // Reload messages after deletion
    } catch (error) {
        console.error('Error deleting message:', error);
        showNotification('Failed to delete message', 'error');
    }
}

// Add notification function for admin page
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Load messages when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking login status');
    checkLoginStatus();
    // Refresh messages every 30 seconds if logged in
    setInterval(() => {
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            loadMessages();
        }
    }, 30000);
}); 