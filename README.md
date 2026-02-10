# Online Quiz & Assessment Platform

This is a full-stack **Online Quiz & Assessment Platform** built as an academic project using **React (frontend)** and **Node.js + Express (backend)**.

The application runs completely on a **local machine**, uses **file-based JSON storage**, and does **not require any database server** or paid services.

---

## What This Project Does

- Allows users to **register and log in** with a username and password
- Provides a clean, dashboard-style interface
- Users can:
  - Take quizzes from predefined domains  
    (Computer Science, General Knowledge, Aptitude)
  - Create their own quizzes
  - Attempt quizzes and get scores automatically
  - View past quiz attempts with answers and timestamps
- Quiz questions are **shuffled randomly** on each attempt
- All data (users, quizzes, attempts) is stored locally in JSON files

This project is designed to be **simple, correct, and extensible**, with scope for future features like difficulty levels, analytics, and adaptive quizzes.

---

## Tech Stack

### Frontend
- React (Vite)
- Plain CSS with a custom theme system
- Runs in the browser

### Backend
- Node.js
- Express
- File-based JSON storage (no database server required)

---

## 🚀 How to Run This Project Locally

> ⚠️ The backend and frontend must be run in **separate terminals**.

### 📦 Setup & Run Commands (copy-paste once)

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>

# Backend setup
cd backend
npm install
node src/server.js

# IMPORTANT:
# node src/server.js blocks the terminal.
# Open a NEW terminal before running the commands below.

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

```
## Local URLs

### Backend: http://localhost:5000

### Backend health check: http://localhost:5000/health

### Frontend: http://localhost:5173

Open the frontend URL in your browser to use the application.