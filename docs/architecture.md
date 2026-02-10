# System Architecture

## Overview
The application follows a client–server architecture and runs locally on a Windows machine.

The system is divided into three main layers:
1. Frontend (User Interface)
2. Backend (Application Logic)
3. Database (Data Persistence)

---

## Architecture Diagram (Conceptual)

Frontend (React)
        |
        | HTTP (REST API)
        v
Backend (Node.js + Express)
        |
        v
Database (SQLite via Prisma)

---

## Frontend
- Built using React.
- Responsible for displaying pages such as login, quiz list, quiz attempt, and results.
- Communicates with the backend using HTTP requests.

---

## Backend
- Built using Node.js and Express.
- Handles all business logic such as quiz creation, quiz attempts, and score calculation.
- Exposes RESTful API endpoints for frontend consumption.

---

## Database
- SQLite is used for version 1.
- Stores users, quizzes, questions, options, and quiz attempts.
- Accessed through Prisma ORM.

---

## Design Principles
- Separation of concerns
- Simplicity and clarity
- Future extensibility without rewriting core logic
