// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Notification function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// JSONbin.io configuration
const JSONBIN_API_KEY = '$2a$10$XGwPbUeqH1q6l4qk9iwB0eeMYLhC3oZu9/oNvvHZtHAD212nVBY46';
const JSONBIN_BIN_ID = '67f159d98960c979a57ecc76';
const USE_JSONBIN = true; // Enable JSONbin.io integration

// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('USE_JSONBIN:', USE_JSONBIN);
    console.log('JSONBIN_API_KEY:', JSONBIN_API_KEY);
    console.log('JSONBIN_BIN_ID:', JSONBIN_BIN_ID);
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent || 'Send Message';
    submitBtn.textContent = '';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    const formData = new FormData(contactForm);
    const data = {
        id: Date.now().toString(), // Generate a unique ID
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    console.log('Form data:', data);

    try {
        if (USE_JSONBIN) {
            try {
                // First, get existing messages from JSONbin.io
                console.log('Fetching existing messages from JSONbin.io...');
                const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'GET',
                    headers: {
                        'X-Master-Key': JSONBIN_API_KEY
                    }
                });
                
                console.log('JSONbin.io fetch response status:', response.status);
                
                let messages = [];
                if (response.ok) {
                    const result = await response.json();
                    console.log('JSONbin.io fetch response:', result);
                    messages = result.record && result.record.messages ? result.record.messages : [];
                } else {
                    console.warn('JSONbin.io fetch failed, creating new messages array');
                }
                
                // Add new message
                messages.push(data);
                console.log('Updated messages for JSONbin.io:', messages);
                
                // Update JSONbin.io with new messages
                console.log('Updating JSONbin.io with new messages...');
                const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    body: JSON.stringify({ messages })
                });
                
                console.log('JSONbin.io update response status:', updateResponse.status);
                
                if (!updateResponse.ok) {
                    throw new Error('Failed to update JSONbin.io');
                }
                
                console.log('Successfully updated JSONbin.io');
            } catch (jsonbinError) {
                console.error('JSONbin.io error:', jsonbinError);
                throw jsonbinError; // Re-throw to show error to user
            }
        }
        
        // Also save to local storage as backup
        const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        localMessages.push(data);
        localStorage.setItem('messages', JSON.stringify(localMessages));
        console.log('Saved to local storage:', localMessages);
        
        // Clear form
        contactForm.reset();
        
        // Show success notification
        showNotification('Message sent successfully!', 'success');
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Add animation to skill cards on scroll
const skillCards = document.querySelectorAll('.skill-card');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
}); 