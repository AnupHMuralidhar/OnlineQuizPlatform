import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { theme } from "../styles/theme";

export default function Dashboard({
  username,
  onLogout,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts
}) {
  return (
    <DashboardLayout
      sidebar={
        <>
          <div style={styles.profile}>
            <div style={styles.avatar}>
              {username[0]?.toUpperCase()}
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
      }
    >
      <h1 style={styles.heading}>Dashboard</h1>

      <p style={styles.welcome}>
        Welcome back, <strong>{username}</strong>.  
        Choose an action from the left to get started.
      </p>

      <div style={styles.placeholder}>
        <p style={styles.placeholderTitle}>What’s next?</p>
        <ul style={styles.list}>
          <li>Attempt system-provided quizzes</li>
          <li>Create your own quizzes</li>
          <li>Track your performance</li>
        </ul>
      </div>
    </DashboardLayout>
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
  },

  heading: {
    fontSize: "1.8rem",
    marginBottom: theme.spacing.md
  },

  welcome: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xl
  },

  placeholder: {
    background: theme.colors.card,
    border: `1px dashed ${theme.colors.border}`,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg
  },

  placeholderTitle: {
    fontWeight: "600",
    marginBottom: theme.spacing.sm
  },

  list: {
    paddingLeft: theme.spacing.lg,
    color: theme.colors.muted
  }
};
