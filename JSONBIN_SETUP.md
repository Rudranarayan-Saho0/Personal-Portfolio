# Setting Up JSONbin.io for Message Storage

This guide will help you set up JSONbin.io to store messages from your contact form. JSONbin.io is a free service that allows you to store JSON data in the cloud without setting up a server.

## Current Implementation

The current implementation uses local storage as the primary storage method. JSONbin.io is optional and can be enabled when you have valid API credentials.

## Step 1: Create a JSONbin.io Account

1. Go to [JSONbin.io](https://jsonbin.io/) and sign up for a free account
2. After signing up, you'll be taken to your dashboard

## Step 2: Create a New Bin

1. Click on "Create Bin" button
2. In the JSON editor, enter the following JSON:
   ```json
   {
     "messages": []
   }
   ```
3. Click "Create" to save the bin

## Step 3: Get Your API Key and Bin ID

1. After creating the bin, you'll be redirected to the bin page
2. Copy the "BIN ID" from the URL (it will look something like `$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
3. Go to your account settings (click on your username in the top right)
4. Find your "API Key" and copy it

## Step 4: Update Your Code

1. Open `script.js` and replace the following lines with your actual values:
   ```javascript
   const JSONBIN_API_KEY = '$2a$10$YOUR_API_KEY'; // Replace with your actual API key
   const JSONBIN_BIN_ID = 'YOUR_BIN_ID'; // Replace with your actual bin ID
   const USE_JSONBIN = true; // Set to true to enable JSONbin.io
   ```

2. Open `admin.js` and replace the same lines with your actual values:
   ```javascript
   const JSONBIN_API_KEY = '$2a$10$YOUR_API_KEY'; // Replace with your actual API key
   const JSONBIN_BIN_ID = 'YOUR_BIN_ID'; // Replace with your actual bin ID
   const USE_JSONBIN = true; // Set to true to enable JSONbin.io
   ```

## Step 5: Test Your Setup

1. Open your website and submit a message through the contact form
2. Log in to the admin panel with username "Rudra" and password "Rudra@2005"
3. You should see your message displayed in the admin panel

## Troubleshooting

If messages are not appearing in the admin panel:

1. Check the browser console (F12 > Console) for any error messages
2. Verify that your API key and bin ID are correct
3. Make sure your JSONbin.io account is active
4. Try submitting a new message to see if it appears
5. If JSONbin.io is not working, messages will still be saved to local storage

## Security Considerations

- The free tier of JSONbin.io has some limitations on the number of requests
- For a production site, consider upgrading to a paid plan or using a more robust solution
- The API key is visible in your code, so be aware that anyone can access your data
- For better security, consider using a backend server with proper authentication 