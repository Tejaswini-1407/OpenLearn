# Online Learning Platform (LMS)

A beginner-friendly MERN stack starter for an Online Learning Platform. The platform supports student/faculty authentication, faculty course management, student enrollment, lecture viewing, and lecture-level progress tracking.

## Tech stack

- Frontend: React, Vite, React Router, CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Planned authentication: JWT and bcrypt

## Project structure

```
online-learning-platform/
├── frontend/                 # React + Vite application
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Page-level components
│       ├── routes/           # Route configuration
│       ├── services/         # API request functions
│       ├── App.jsx
│       └── main.jsx
├── backend/                  # Express + MongoDB API
│   └── src/
│       ├── config/           # Database configuration
│       ├── controllers/      # Request handling logic
│       ├── middleware/       # Express middleware
│       ├── models/           # Mongoose models
│       ├── routes/           # API routes
│       ├── utils/            # Helper functions
│       ├── app.js
│       └── server.js
└── README.md
```

## Prerequisites

Install these before starting:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- MongoDB locally, or a free MongoDB Atlas database

## Install dependencies

From the project root, run:

```bash
npm run install:all
```

Or install each application separately:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Configure environment variables

1. In the `backend` folder, copy `.env.example` to a new file named `.env`.
2. Set `MONGODB_URI` to your MongoDB connection string.
3. Replace `JWT_SECRET` with a long, private random value.

Example local MongoDB URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/online-learning-platform
```

## Run the backend

```bash
cd backend
npm run dev
```

The API starts at `http://localhost:5000`. Test it at `http://localhost:5000/api/health`.

## Run the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will show the local application URL, usually `http://localhost:5173`.

## Current features

- Student and faculty registration/login with JWT + bcrypt
- Role-protected student and faculty dashboards
- Faculty course, module, and lecture CRUD with ownership checks
- Student course catalog and enrollment/unenrollment
- Enrolled-course library with progress percentages
- Lecture viewer with YouTube/direct-video support
- Lecture completion/incompletion tracking
- Course progress API and visual progress bars
- Course/module/lecture cleanup when faculty deletes content

## Authentication features

- Separate student and faculty registration endpoints and pages
- bcrypt password hashing; password fields are excluded from API responses
- JWT login tokens containing the user ID and role
- Protected `GET /api/auth/me` endpoint and role authorization middleware
- Persistent frontend session using browser local storage, automatic session validation, and logout
- Separate role-protected dashboards at `/student/dashboard` and `/faculty/dashboard`

## Authentication environment variables

In `backend/.env`, configure:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/online-learning-platform
JWT_SECRET=use_a_long_private_random_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

Copy `backend/.env.example` to `backend/.env` before running the API. Never commit `.env`.

## Create accounts and test login

1. Start MongoDB, then start the backend and frontend as described above.
2. Open the frontend URL shown by Vite (usually `http://localhost:5173`).
3. Register a student at `/register/student` or faculty member at `/register/faculty` with a name, a unique email, and a password of at least six characters.
4. Registration signs the user in and directs students to `/student/dashboard` and faculty to `/faculty/dashboard`.
5. Log out, then use `/login` with the same email and password to test login.

The authentication API endpoints are:

- `POST /api/auth/register/student`
- `POST /api/auth/register/faculty`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

## Course content

Faculty can create, edit, and delete only their own courses, modules, and lectures. Students can browse courses, view course content, and open URL-based lectures. Course, module, and lecture endpoints are protected by JWT authentication; write endpoints require the faculty role and ownership.

### Course API

- `GET /api/courses`
- `GET /api/courses/mine` (faculty)
- `GET /api/courses/:id`
- `POST`, `PUT`, `DELETE /api/courses/:id` (faculty; `POST` is `/api/courses`)
- `POST /api/courses/:courseId/modules` (faculty)
- `PUT`, `DELETE /api/modules/:id` (faculty)
- `POST /api/modules/:moduleId/lectures` (faculty)
- `PUT`, `DELETE /api/lectures/:id` (faculty)

## Deployment configuration

For Vercel, set `VITE_API_URL` to your deployed backend URL followed by `/api`. For Render, set `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` (the deployed frontend URL). The backend uses `PORT` supplied by the host and restricts CORS to `CLIENT_URL`.

Lecture-progress tracking is implemented through `/api/progress/:courseId` and the student learning UI.

## Enrollment

Students can enroll in a course from its detail page, view only their own enrolled courses at `/my-courses`, continue learning, or leave a course. Course lectures are unlocked for students only after enrollment. Faculty cannot use these student enrollment endpoints.

- `POST /api/enrollments/:courseId` — enroll in a course
- `GET /api/enrollments/my-courses` — list the current student's enrolled courses
- `GET /api/enrollments/:courseId/status` — get current student's enrollment status
- `DELETE /api/enrollments/:courseId` — leave a course

The Enrollment collection has a compound unique index on `student` and `course`, preventing duplicate enrollment.


## Production deployment

### Frontend — Vercel

Set the Vercel project root directory to `frontend`.

Build command:
```bash
npm run build
```

Output directory:
```text
dist
```

Environment variable:
```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

`frontend/vercel.json` contains the SPA rewrite required so React Router routes work after refreshing a deep URL.

### Backend — Render

Create a Web Service with the root directory set to `backend`.

Build command:
```bash
npm install
```

Start command:
```bash
npm start
```

Set:
```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-FRONTEND.vercel.app
```

The health check is:
```text
/api/health
```

After deployment, update `VITE_API_URL` on Vercel with the final Render API URL and redeploy the frontend.

### Security before deployment

- Never upload `backend/.env` to GitHub.
- Rotate any MongoDB database password that has already been exposed.
- Replace the JWT secret with a long random production secret.
- Use a MongoDB user with only the permissions this application needs.
