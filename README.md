# Personal Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript, featuring Firebase integration for the contact form and admin panel.

## Features

- Responsive design that works on all devices
- Smooth scrolling navigation
- Interactive UI elements with animations
- Contact form with Firebase integration
- Admin panel for message management
- Real-time message notifications
- Secure admin authentication
- Message timeout handling (10-second limit)
- Automatic message refresh in admin panel

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase (Firestore)
- Font Awesome Icons
- Google Fonts

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Rudranarayan-Saho0/Personal-Portfolio.git
   ```

2. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Replace the Firebase config in `script.js` and `admin.js` with your configuration

3. Update Admin Credentials:
   - Open `admin.js`
   - Update the `ADMIN_USERNAME` and `ADMIN_PASSWORD` constants with your desired credentials

4. Deploy to GitHub Pages:
   - Push your changes to GitHub
   - Enable GitHub Pages in your repository settings
   - Your site will be available at `https://[username].github.io/Personal-Portfolio`

## Features in Detail

### Contact Form
- Real-time form validation
- Loading animation during submission
- Success/error notifications
- 10-second timeout for message sending
- Automatic form reset after successful submission

### Admin Panel
- Secure login system
- Real-time message display
- Message deletion functionality
- Automatic refresh every 30 seconds
- Responsive message cards with hover effects
- Timestamp display for each message
- Loading states and error handling

### UI/UX Features
- Smooth scrolling navigation
- Mobile-responsive design
- Interactive hover effects
- Loading animations
- Notification system
- Clean and modern interface

## Security Features

- Secure admin authentication
- Firebase security rules
- Protected admin routes
- Secure message handling
- Timeout protection for message sending

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Rudranarayan Saho - [GitHub](https://github.com/Rudranarayan-Saho0)

Project Link: [https://github.com/Rudranarayan-Saho0/Personal-Portfolio](https://github.com/Rudranarayan-Saho0/Personal-Portfolio) 