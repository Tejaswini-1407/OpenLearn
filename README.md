# OpenLearn – Online Learning Platform

OpenLearn is a full-stack online learning platform built using the MERN stack. It allows students to register, explore courses, enroll in courses, watch lectures, and track their learning progress.

Faculty members can create and manage courses, modules, and lectures through their dashboard.

## Features

### Student

* Student registration and login
* Browse available courses
* Enroll in courses
* View course modules and lectures
* Watch lecture videos
* Mark lectures as completed
* Track course progress
* Student dashboard

### Faculty

* Faculty registration and login
* Create courses
* Add modules and lectures
* Edit and delete courses
* Manage course content
* Faculty dashboard

### Authentication

* JWT-based authentication
* Password hashing using bcrypt
* Student and Faculty roles
* Protected routes based on user role

## Tech Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

### Deployment

* Vercel – Frontend
* Render – Backend
* MongoDB Atlas – Database

## Project Structure

```text
OpenLearn/
├── frontend/
│   ├── src/
│   └── ...
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   └── ...
└── README.md
```

## How It Works

### Student Flow

```text
Register/Login
      ↓
Student Dashboard
      ↓
Browse Courses
      ↓
Enroll
      ↓
View Course
      ↓
Watch Lectures
      ↓
Mark Lectures Complete
      ↓
Track Progress
```

### Faculty Flow

```text
Register/Login
      ↓
Faculty Dashboard
      ↓
Create Course
      ↓
Add Modules
      ↓
Add Lectures
      ↓
Manage Course Content
```

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Tejaswini-1407/Online-Learning-Platform.git
cd Online-Learning-Platform
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

The application will be available at:

* Frontend: http://localhost:5173
* Backend: http://localhost:5000

## Live Demo

### Frontend

https://open-learn-silk.vercel.app

### Backend

https://openlearn-gh8w.onrender.com

## Future Improvements

* Course-level progress analytics
* Faculty performance statistics
* Search and filter courses
* Course ratings and reviews
* Certificate generation
* Better video learning experience
* Notifications

## Author

**Sai Lakshmi Tejaswini Kumbha**

