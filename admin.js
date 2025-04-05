// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDod5DJP4KAruPlB2v",
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

// Load messages from Firestore
async function loadMessages() {
    try {
        const snapshot = await db.collection('messages').orderBy('timestamp', 'desc').get();
        messagesList.innerHTML = '';
        
        if (snapshot.empty) {
            messagesList.innerHTML = '<p class="no-messages">No messages yet</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = createMessageElement(doc.id, message);
            messagesList.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = '<p class="error-message">Error loading messages</p>';
    }
}

// Create message element
function createMessageElement(id, message) {
    const div = document.createElement('div');
    div.className = 'message-card';
    div.innerHTML = `
        <h3>${message.name}</h3>
        <div class="email">${message.email}</div>
        <div class="date">${message.timestamp ? new Date(message.timestamp.toDate()).toLocaleString() : 'No date'}</div>
        <div class="content">${message.message}</div>
        <button class="delete-btn" onclick="deleteMessage('${id}')">Delete</button>
    `;
    return div;
}

// Delete message
async function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await db.collection('messages').doc(id).delete();
            loadMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', checkLoginStatus); 