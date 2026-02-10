import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import AttemptQuiz from "./pages/AttemptQuiz";
import Attempts from "./pages/Attempts";

import "./styles/index.css";

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");

  // ✅ shared navigation props (THIS is the fix)
  const navProps = {
    username,
    onCreateQuiz: () => setPage("createQuiz"),
    onAttemptQuiz: () => setPage("attemptQuiz"),
    onViewAttempts: () => setPage("attempts"),
    onLogout: () => {
      setUsername("");
      setPage("login");
    }
  };

  if (page === "login") {
    return (
      <Login
        onGoToRegister={() => setPage("register")}
        onLoginSuccess={(name) => {
          setUsername(name);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "register") {
    return <Register onGoToLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return <Dashboard {...navProps} />;
  }

  if (page === "createQuiz") {
    return (
      <CreateQuiz
        {...navProps}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "attemptQuiz") {
    return (
      <AttemptQuiz
        {...navProps}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "attempts") {
    return <Attempts {...navProps} />;
  }

  return <div>Invalid state</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
