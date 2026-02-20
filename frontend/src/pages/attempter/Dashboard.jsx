import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function Dashboard({
  username,
  onDashboard,
  onAttemptQuiz,
  onViewAttempts,
  onLogout
}) {
  const role = "attempter";

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          username={username}
          role={role}
          onDashboard={onDashboard}
          onAttemptQuiz={onAttemptQuiz}
          onViewAttempts={onViewAttempts}
          onLogout={onLogout}
        />
      }
    >
      <h1 style={styles.heading}>Dashboard</h1>

      <p style={styles.welcome}>
        Welcome back, <strong>{username}</strong>.
        Choose an action from the left to continue.
      </p>

      <div style={styles.card}>
        <p style={styles.cardTitle}>What’s next?</p>
        <ul style={styles.list}>
          <li>Attempt system-provided quizzes</li>
          <li>Track your performance</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}


const styles = {
  heading: {
    fontSize: "1.9rem",
    marginBottom: "16px"
  },

  welcome: {
    opacity: 0.8,
    marginBottom: "32px"
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
  },

  cardTitle: {
    fontWeight: "600",
    marginBottom: "12px"
  },

  list: {
    paddingLeft: "20px",
    opacity: 0.85
  }
};
