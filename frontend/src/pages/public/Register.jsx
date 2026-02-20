import React, { useState } from "react";
import axios from "axios";

export default function Register({ role, onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!role) {
      setMessage("Role not selected. Please go back.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        password,
        role
      });

      setMessage(res.data.message || "Success! You can login now.");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">
          {role === "creator"
            ? "Creator Registration"
            : "Attempter Registration"}
        </div>

        <div className="auth-subtitle">
          Register as {role}
        </div>

        <form
          onSubmit={handleRegister}
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
            Create Account
          </button>

          {message && (
            <div
              className={`auth-message ${
                isSuccess ? "auth-success" : "auth-error"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            className="auth-switch"
            onClick={() => onGoToLogin(role)}
          >
            Already have an account? Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
