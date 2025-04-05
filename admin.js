// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });

// Admin credentials
const ADMIN_USERNAME = "Rudra";
const ADMIN_PASSWORD = "Rudra@2005";

// JSONbin.io configuration
const JSONBIN_API_KEY = '$2a$10$YOUR_API_KEY'; // Replace with your actual API key
const JSONBIN_BIN_ID = 'YOUR_BIN_ID'; // Replace with your actual bin ID

// DOM elements
const loginSection = document.getElementById('login-section');
const messagesSection = document.getElementById('messages-section');
const loginForm = document.getElementById('login-form');
const messagesList = document.getElementById('messages-list');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showMessages();
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    loginSection.classList.remove('hidden');
    messagesSection.classList.add('hidden');
}

// Show messages section
function showMessages() {
    loginSection.classList.add('hidden');
    messagesSection.classList.remove('hidden');
    loadMessages();
}

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showMessages();
    } else {
        alert('Invalid username or password');
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    showLogin();
});

// Function to load messages
async function loadMessages() {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = '<div class="loading">Loading messages...</div>';

    try {
        // Try to get messages from JSONbin.io first
        let messages = [];
        
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                messages = result.record.messages || [];
            }
        } catch (error) {
            console.error('Error fetching from JSONbin:', error);
            // Fall back to local storage if JSONbin fails
            messages = JSON.parse(localStorage.getItem('messages') || '[]');
        }
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">No messages found</div>';
            return;
        }

        // Sort messages by timestamp (newest first)
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
        // Get messages from JSONbin.io
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        
        const result = await response.json();
        let messages = result.record.messages || [];
        
        // Filter out the message to delete
        messages = messages.filter(message => message.id !== messageId);
        
        // Update JSONbin.io
        const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ messages })
        });
        
        if (!updateResponse.ok) {
            throw new Error('Failed to update messages');
        }
        
        // Also update local storage
        const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const updatedLocalMessages = localMessages.filter(message => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(updatedLocalMessages));
        
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
    checkLoginStatus();
    // Refresh messages every 30 seconds if logged in
    setInterval(() => {
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            loadMessages();
        }
    }, 30000);
}); 