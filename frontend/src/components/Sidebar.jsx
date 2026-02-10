import React from "react";
import { theme } from "../styles/theme";

export default function Sidebar({
  username,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts,
  onLogout
}) {
  return (
    <>
      <div style={styles.profile}>
        <div style={styles.avatar}>
        {(username && username[0]?.toUpperCase()) || "U"}
        </div>

        <div>
          <p style={styles.name}>{username}</p>
          <p style={styles.role}>Student</p>
        </div>
      </div>

      <nav style={styles.nav}>
        <button style={styles.navItem} onClick={onAttemptQuiz}>
          📝 Take Quiz
        </button>

        <button style={styles.navItem} onClick={onCreateQuiz}>
          ➕ Create Quiz
        </button>

        <button style={styles.navItem} onClick={onViewAttempts}>
          📊 View Attempts
        </button>
      </nav>

      <div style={styles.footer}>
        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>
    </>
  );
}

const styles = {
  profile: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: theme.colors.primarySoft,
    color: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600"
  },

  name: {
    fontWeight: "600",
    color: theme.colors.text
  },

  role: {
    fontSize: "0.8rem",
    color: theme.colors.muted
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    flex: 1
  },

  navItem: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: theme.radius.md,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: theme.transition
  },

  footer: {
    borderTop: `1px solid ${theme.colors.border}`,
    paddingTop: theme.spacing.md
  },

  logout: {
    background: "none",
    border: "none",
    color: theme.colors.danger,
    cursor: "pointer"
  }
};
