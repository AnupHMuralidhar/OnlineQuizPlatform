# API Design

## Overview
The backend exposes RESTful APIs that allow the frontend to interact with the system.

All APIs communicate using JSON.

---

## Authentication APIs
- POST /login  
  Authenticates a user using username and password.

- POST /register  
  Creates a new user account.

---

## Quiz APIs
- POST /quizzes  
  Create a new quiz.

- GET /quizzes  
  Fetch all available quizzes.

---

## Question APIs
- POST /quizzes/{quizId}/questions  
  Add questions to a quiz.

---

## Quiz Attempt APIs
- POST /quizzes/{quizId}/attempt  
  Submit quiz answers and calculate score.

- GET /attempts  
  Retrieve past quiz attempts for a user.

---

## Notes
- Authentication is intentionally simple in version 1.
- APIs are designed to be extended in future versions.
