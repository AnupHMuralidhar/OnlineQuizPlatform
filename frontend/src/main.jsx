import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Attempter
import Dashboard from "./pages/attempter/Dashboard";
import AttemptQuiz from "./pages/attempter/AttemptQuiz";
import Attempts from "./pages/attempter/Attempts";

// Creator
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreateQuiz from "./pages/creator/CreateQuiz";
import QuizAnalytics from "./pages/creator/QuizAnalytics";
import MyQuizzes from "./pages/creator/MyQuizzes";

import "./styles/index.css";

function App() {
  const [page, setPage] = useState("landing");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);

  // 🔥 NEW — track edit mode
  const [editingQuizId, setEditingQuizId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUsername(storedUser);
      setRole(storedRole);
      setPage("dashboard");
    }
  }, []);

  const navProps = {
    username,
    role,
    onDashboard: () => {
      setEditingQuizId(null);
      setPage("dashboard");
    },
    onCreateQuiz: (quizId = null) => {
      setEditingQuizId(quizId);   // 🔥 set edit mode if ID passed
      setPage("createQuiz");
    },
    onAttemptQuiz: () => setPage("attemptQuiz"),
    onViewAttempts: () => setPage("attempts"),
    onMyQuizzes: () => {
      setEditingQuizId(null);
      setPage("myQuizzes");
    },
    onLogout: () => {
      localStorage.clear();
      setUsername("");
      setRole(null);
      setEditingQuizId(null);
      setPage("landing");
    }
  };

  // -----------------------------
  // PUBLIC PAGES
  // -----------------------------

  if (page === "landing") {
    return (
      <Landing
        onSelectRole={(selectedRole) => {
          setRole(selectedRole);
          setPage("login");
        }}
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        role={role}
        onGoToRegister={() => setPage("register")}
        onLoginSuccess={(name, userRole) => {
          setUsername(name);
          setRole(userRole);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        role={role}
        onGoToLogin={() => setPage("login")}
      />
    );
  }

  // -----------------------------
  // PROTECTED ROUTES
  // -----------------------------

  if (!username || !role) {
    return (
      <Landing
        onSelectRole={(r) => {
          setRole(r);
          setPage("login");
        }}
      />
    );
  }

  // -----------------------------
  // DASHBOARD
  // -----------------------------

  if (page === "dashboard") {
    return role === "creator"
      ? <CreatorDashboard {...navProps} />
      : <Dashboard {...navProps} />;
  }

  // -----------------------------
  // CREATOR ROUTES
  // -----------------------------

  if (page === "myQuizzes" && role === "creator") {
    return <MyQuizzes {...navProps} />;
  }

  if (page === "createQuiz" && role === "creator") {
    return (
      <CreateQuiz
        {...navProps}
        editingQuizId={editingQuizId}   // 🔥 PASS ID
        onBack={() => {
          setEditingQuizId(null);
          setPage("myQuizzes");
        }}
      />
    );
  }

  if (page === "attempts" && role === "creator") {
    return <QuizAnalytics {...navProps} />;
  }

  // -----------------------------
  // ATTEMPTER ROUTES
  // -----------------------------

  if (page === "attemptQuiz" && role === "attempter") {
    return (
      <AttemptQuiz
        {...navProps}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "attempts" && role === "attempter") {
    return <Attempts {...navProps} />;
  }

  return <div>Invalid state</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
