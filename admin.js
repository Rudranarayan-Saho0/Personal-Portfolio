// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ",
    authDomain: "personal-portfolio-12345.firebaseapp.com",
    projectId: "personal-portfolio-12345",
    storageBucket: "personal-portfolio-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Admin credentials (in a real app, this would be stored securely on the server)
const ADMIN_USERNAME = "Rudra";
const ADMIN_PASSWORD = "Rudra@2005";

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
        const snapshot = await db.collection('messages')
            .orderBy('timestamp', 'desc')
            .get();

        if (snapshot.empty) {
            messagesContainer.innerHTML = '<div class="no-messages">No messages found</div>';
            return;
        }

        let messagesHTML = '';
        snapshot.forEach(doc => {
            const message = doc.data();
            const timestamp = message.timestamp ? message.timestamp.toDate().toLocaleString() : 'No timestamp';
            messagesHTML += `
                <div class="message-card">
                    <div class="message-header">
                        <h3>${message.name}</h3>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <p class="email">${message.email}</p>
                    <p class="message-content">${message.message}</p>
                    <button class="delete-btn" onclick="deleteMessage('${doc.id}')">Delete</button>
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
        await db.collection('messages').doc(messageId).delete();
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
    loadMessages();
    // Refresh messages every 30 seconds
    setInterval(loadMessages, 30000);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', checkLoginStatus); 