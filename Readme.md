
# YouTube Backend API

This project is a fully-featured backend for a YouTube-like platform, built using **Node.js**, **Express**, **MongoDB**, and **JWT** for authentication. The API provides user registration, login, profile management, and a comprehensive watch history system.

## Features

### User Authentication
- **JWT-based Authentication**: Secure token-based authentication using access and refresh tokens.
- **Password Hashing**: User passwords are hashed before saving for enhanced security.
- **Token Refresh**: Automatic access token renewal using refresh tokens.

### User Management
- **Register Users**: Users can register with a username, email, and password.
- **Login**: Users can log in using their username or email, with secure password validation.
- **Logout**: Clears user tokens and logs them out safely.
- **Change Password**: Allows users to update their current password securely.

### Profile Management
- **Update Account Details**: Modify email, full name, and other account information.
- **Avatar and Cover Image Uploads**: Users can upload and update their avatar and cover image, with images stored via cloud services (e.g., Cloudinary).
- **Get User Channel Profile**: Fetch user’s channel profile details such as subscriber count, channels they’ve subscribed to, etc.

### Watch History
- **Retrieve Watch History**: Fetches the user's watch history, including details of the videos watched and video owners.

## Routes Overview

- **Authentication**:
  - `POST /register`: Register a new user.
  - `POST /login`: Login a user and issue tokens.
  - `POST /logout`: Logout the current user.
  - `POST /refresh-token`: Refresh the user's access token.

- **User Profile**:
  - `GET /me`: Fetch the currently logged-in user's profile.
  - `PUT /update-account`: Update user's account details (name, email).
  - `PUT /update-avatar`: Update user's avatar image.
  - `PUT /update-cover-image`: Update user's cover image.

- **Password Management**:
  - `POST /change-password`: Change the current user's password.

- **Channel**:
  - `GET /channels/:username`: Fetch a user's YouTube channel profile.
  
- **Watch History**:
  - `GET /watch-history`: Retrieve the user's video watch history.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/youtube-backend.git
   cd youtube-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add your environment variables:
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. Start the development server:
   ```bashHere’s a draft for your **YouTube Backend** project's README file:
   npm run dev
