# Portfolio Contact Form Server

This is a Node.js server that handles the contact form submissions for your portfolio website. It stores messages in a MySQL database.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. **Install MySQL Server**
   - Download and install MySQL Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - During installation, set a root password
   - Create a new database named `portfolio_db`

2. **Configure Environment Variables**
   - Open the `.env` file in the server directory
   - Update the database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=portfolio_db
     PORT=3000
     ```
   - Replace `your_password` with your MySQL root password

3. **Install Dependencies**
   - Open a terminal in the server directory
   - Run the following command:
     ```
     npm install
     ```

4. **Start the Server**
   - Run the following command:
     ```
     npm start
     ```
   - The server will start on port 3000 (or the port specified in your .env file)

## API Endpoints

- **GET /api/messages** - Get all messages
- **POST /api/messages** - Add a new message
- **DELETE /api/messages/:id** - Delete a message by ID

## Troubleshooting

- If you encounter connection issues, make sure MySQL is running
- Check that your database credentials in the .env file are correct
- Ensure the database `portfolio_db` exists
- Check the server logs for detailed error messages

## Development

For development with auto-restart on file changes:
```
npm run dev
``` 