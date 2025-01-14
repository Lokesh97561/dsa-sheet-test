# DSA Sheet Project

This project is a web application to help students track their progress on Data Structures and Algorithms (DSA) topics and problems.

## Features
- User authentication (Register/Login).
- List of DSA topics and subtopics with difficulty levels.
- Track progress using checkboxes.
- Links to YouTube tutorials, LeetCode problems, and articles for each topic.

## Installation

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## Usage
1. Register a new user.
2. Login with the registered credentials.
3. View and track your progress