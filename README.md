
# JobBoardX – A Full-Stack Job Board Platform

## 🚀 Overview

**JobBoardX** is a modern, full-stack job board application that connects Job Seekers and Employers in one platform. Inspired by professional platforms like LinkedIn and AngelList, this project allows users to create profiles, post and apply to jobs, and manage applications – all while learning and working with popular web development technologies.

---

## 🎯 Project Goals

- Develop a scalable and type-safe frontend with React + TypeScript
- Implement a RESTful backend API using Node.js, Express, and MongoDB
- Enable full CRUD operations for jobs, user profiles, and applications
- Secure the app using JWT-based authentication and role-based access
- Gain hands-on experience building and deploying a real-world full-stack app

---

## 🧰 Tech Stack

### 🔹 Frontend

- React.js (v18+)
- TypeScript
- React Router v6
- Material-UI (MUI)
- Formik + Yup
- styled-components
- Axios

### 🔸 Backend

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv

---

## 👥 User Roles & Features

### 👨‍💼 Job Seeker
- Register / Login
- Create and manage profile (name, bio, skills, resume link, etc.)
- Browse job listings with filters (location, company, keyword)
- View job details and apply
- View status of submitted applications

### 🏢 Employer
- Register / Login
- Post new job listings
- Edit or delete existing job posts
- View list of applicants per job

---

## 🔐 Authentication & Authorization

- JWT-based session management (tokens stored in localStorage or httpOnly cookies)
- Role-based access control (Job Seeker vs Employer)
- Protected API routes

---

## 🧾 Core Features

### ✅ Profile Management
- Managed with Formik + Yup
- Data stored in MongoDB
- Editable user profile (skills, experience, bio, resume)

### 💼 Job Management (Employer)
- Create, edit, delete job postings
- View applicants per job post

### 📄 Job Listings (Job Seeker)
- View job board with filters
- View individual job details (dynamic routing)
- Submit application via form

### 📨 Applications
- Apply to jobs with resume link & cover letter
- View application history and status (Job Seeker)
- View applicant details (Employer)

---

## 🌐 API Structure

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | `/api/auth/register`          | Register a new user                  |
| POST   | `/api/auth/login`             | Login and receive JWT                |
| GET    | `/api/profile/me`             | Fetch current user's profile         |
| PUT    | `/api/profile`                | Update current user's profile        |
| GET    | `/api/jobs`                   | Get all jobs                         |
| POST   | `/api/jobs`                   | Create new job (Employer only)       |
| PUT    | `/api/jobs/:id`               | Edit a job (Employer only)           |
| DELETE | `/api/jobs/:id`               | Delete a job                         |
| POST   | `/api/applications`           | Apply to a job                       |
| GET    | `/api/applications/me`        | View my applications (Job Seeker)    |
| GET    | `/api/applications/job/:id`  | View applicants for a job (Employer) |

---

## 📁 Suggested Project Structure

### Frontend (`/client`)
```
/src
 ├── /components        # Reusable UI components
 ├── /pages             # Route-level components
 ├── /hooks             # Custom hooks
 ├── /services          # API services (Axios)
 ├── /styles            # styled-components theme and global styles
 └── /routes            # React Router routes
```

### Backend (`/server`)
```
/server
 ├── /controllers       # Request handlers
 ├── /models            # Mongoose models
 ├── /routes            # Express routes
 ├── /middlewares       # Auth, error handlers, etc.
 ├── /utils             # Helper functions
 └── server.js          # Entry point
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js and npm
- MongoDB instance (local or cloud like MongoDB Atlas)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/JobBoardX.git
   cd JobBoardX
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Environment Variables**

   Create a `.env` file in the `/server` directory with the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLIENT_NAME=your_client_name
   CLOUDINARY_CLIENT_API=your_CLIENT_API
   CLOUDINARY_CLIENT_SECRET=your_CLIENT_SECRET
   FRONTEND_URL=http://localhost:5173
   JWT_EXPIRE=days
   COOKIE_EXPIRE=days

   ```

---

## 🌍 Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Heroku / Cyclic
- Make sure to update API URLs and environment variables in production

---

## 🧹 Code Quality

- Clean, modular code structure
- Type-safety with TypeScript
- Linting & formatting (Prettier + ESLint)
- Git commits follow conventional standards

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Authors

Built with ❤️ by Intern Developers

---

## 📎 Useful Links

- [React Docs](https://react.dev)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Material UI](https://mui.com/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)

