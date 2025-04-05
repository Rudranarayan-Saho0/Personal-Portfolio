// Admin credentials
const ADMIN_USERNAME = "Rudra";
const ADMIN_PASSWORD = "Rudra@2005";

// Server configuration
const SERVER_URL = 'http://localhost:3000/api';

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

    try {
        // Try to get messages from SQL server
        let messages = [];
        
        try {
            console.log('Fetching from SQL server...');
            const response = await fetch(`${SERVER_URL}/messages`);
            
            console.log('Server response status:', response.status);
            
            if (response.ok) {
                messages = await response.json();
                console.log('Messages loaded from SQL server:', messages);
            } else {
                console.warn('SQL server fetch failed:', response.status, response.statusText);
                // Fall back to local storage
                messages = JSON.parse(localStorage.getItem('messages') || '[]');
                console.log('Falling back to local storage:', messages);
            }
        } catch (error) {
            console.warn('Error fetching from SQL server:', error);
            // Fall back to local storage
            messages = JSON.parse(localStorage.getItem('messages') || '[]');
            console.log('Error occurred, using local storage:', messages);
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
        // Try to delete from SQL server
        try {
            console.log('Deleting from SQL server...');
            const response = await fetch(`${SERVER_URL}/messages/${messageId}`, {
                method: 'DELETE'
            });
            
            console.log('Delete response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('SQL server delete failed:', response.status, errorText);
                throw new Error(`Server error: ${response.status}`);
            }
            
            console.log('Successfully deleted from SQL server');
        } catch (serverError) {
            console.error('SQL server error:', serverError);
            // Continue with local storage deletion
        }
        
        // Also delete from local storage
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages = messages.filter(message => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(messages));
        console.log('Deleted from local storage');
        
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