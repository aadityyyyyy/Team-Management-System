# Team Management System

A full-stack web application designed for efficient team collaboration, project tracking, and task management. It allows administrators to create projects, add team members, and assign tasks, while team members can view their assignments and update task statuses.

## Features

* **User Roles:** Distinct roles for 'admin' (project and team management) and 'member' (task execution).
* **Project Management:** Admins can create, view, and close projects.
* **Task Tracking:** Assign tasks to specific team members with statuses (pending, in-progress, completed).
* **Authentication:** Secure user authentication using JWT and bcrypt.
* **Responsive UI:** Modern, clean interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
* React 19
* Vite
* Tailwind CSS
* React Router DOM
* Axios (for API requests)
* Lucide React (for icons)

### Backend
* Node.js & Express
* Prisma ORM
* MySQL Database
* JSON Web Tokens (JWT) for authentication
* bcrypt for password hashing

## Getting Started

### Prerequisites
* Node.js installed
* MySQL database running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadityyyyyy/Team-Management-System.git
   cd Team-Management-System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend` directory based on your environment:
     ```env
     DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
     JWT_SECRET="your_jwt_secret_key"
     PORT=5000
     ```
   * Push the database schema:
     ```bash
     npx prisma db push
     ```
   * Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   * Start the development server:
     ```bash
     npm run dev
     ```

## Usage

* The frontend will typically run on `http://localhost:5173`.
* The backend API will run on `http://localhost:5000`.
* Register an account and login to start managing your projects and tasks.
