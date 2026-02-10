import React, { useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import { theme } from "../styles/theme";

export default function Register({ onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", {
        username,
        password
      });
      setMessage("Registered successfully!");
    } catch {
      setMessage("User already exists");
    }
  };

  return (
    <PageWrapper width="360px">
      <h1 style={styles.appTitle}>Quiz Platform</h1>

      <form onSubmit={handleRegister}>
        <h2>Register</h2>

        <label style={styles.label}>Username</label>
        <input style={styles.input} value={username}
          onChange={(e) => setUsername(e.target.value)} />

        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button style={styles.primary}>Register</button>

        {message && <p style={styles.message}>{message}</p>}

        <button
          type="button"
          style={styles.link}
          onClick={onGoToLogin}
        >
          Go to Login
        </button>
      </form>
    </PageWrapper>
  );
}

const styles = {
  appTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.lg
  },
  label: {
    display: "block",
    marginBottom: theme.spacing.xs
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`
  },
  primary: {
    width: "100%",
    padding: "11px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff"
  },
  message: {
    textAlign: "center",
    marginTop: theme.spacing.sm
  },
  link: {
    marginTop: theme.spacing.md,
    background: "none",
    border: "none",
    color: theme.colors.primary,
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
};
