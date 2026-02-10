import React, { useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import { theme } from "../styles/theme";

export default function Login({ onGoToRegister, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password
      });

      onLoginSuccess(res.data.user.username);
      localStorage.setItem("username", res.data.user.username);
    } catch {
      setMessage("Invalid username or password");
    }
  };

  return (
    <PageWrapper width="360px">
      <h1 style={styles.appTitle}>Quiz Platform</h1>

      <form onSubmit={handleLogin}>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.subtitle}>Enter your credentials</p>

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.primary}>Login</button>

        {message && <p style={styles.message}>{message}</p>}

        <button
          type="button"
          style={styles.link}
          onClick={onGoToRegister}
        >
          Go to Register
        </button>
      </form>
    </PageWrapper>
  );
}

const styles = {
  appTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    color: theme.colors.text
  },
  title: {
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.muted
  },
  label: {
    display: "block",
    marginBottom: theme.spacing.xs,
    fontSize: "0.85rem"
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
    color: "#fff",
    cursor: "pointer"
  },
  message: {
    marginTop: theme.spacing.sm,
    textAlign: "center",
    color: theme.colors.danger
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
