# Personal Portfolio with Contact Form and Admin Panel

This is a personal portfolio website with a contact form that stores messages in a Firebase Firestore database. The admin panel allows you to view and manage these messages.

## Features

- Responsive design
- Contact form that stores messages in Firebase
- Admin panel with secure login
- Message management (view and delete)

## Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Set up Firestore security rules to allow read/write access to the messages collection
4. Get your Firebase configuration from Project Settings > General > Your Apps > Web App

### 2. Update Firebase Configuration

Replace the placeholder values in `script.js` and `admin.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Admin Login

The admin login credentials are:
- Username: Rudra
- Password: Rudra22005

These credentials are stored in the `admin.js` file. In a production environment, you should use a more secure authentication method.

### 4. Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to the repository settings
3. Scroll down to the GitHub Pages section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Click Save

Your site will be available at `https://yourusername.github.io/repository-name/`

## Security Considerations

- The current implementation uses client-side authentication which is not secure for production use
- For a production site, consider using Firebase Authentication or a server-side authentication system
- Implement proper security rules in Firebase to restrict access to your data

## License

This project is open source and available under the [MIT License](LICENSE). 