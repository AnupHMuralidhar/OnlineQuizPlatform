import React, { useState } from "react";
import axios from "axios";

export default function Login({ role, onGoToRegister, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Role not selected. Please go back.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password
      });

      const user = res.data.user;

      // Safety check
      if (!user.role) {
        setError("Invalid user role returned from server.");
        return;
      }

      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      onLoginSuccess(user.username, user.role);
    } catch (err) {
      setError(
        err.response?.data?.message || "Wrong username or password"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">
          {role === "creator" ? "Creator Login" : "Attempter Login"}
        </div>

        <div className="auth-subtitle">
          Sign in as {role}
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Sign In
          </button>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="auth-switch"
            onClick={() => onGoToRegister(role)}
          >
            Don’t have an account? Create one
          </button>
        </form>
      </div>
    </div>
  );
}
