# Database Design

## Purpose of the Database
The database is used to store persistent data required for the quiz platform, including:
- User accounts
- Quiz content
- Quiz attempts and scores

The database ensures data is not lost when the application restarts.

---

## Core Entities (v1)

1. User  
   Stores basic user information for login and identification.

2. Quiz  
   Stores quiz metadata such as title and description.

3. Question  
   Stores questions associated with a quiz.

4. Option  
   Stores multiple-choice options for each question.

5. QuizAttempt  
   Stores records of user attempts and scores.

---

## Design Notes
- The design is intentionally minimal.
- Only essential fields are included.
- The schema can be extended later to support domains, difficulty levels, and analytics.

---

## Database Technology
- SQLite (file-based, local database)
- Prisma ORM for schema management and queries
