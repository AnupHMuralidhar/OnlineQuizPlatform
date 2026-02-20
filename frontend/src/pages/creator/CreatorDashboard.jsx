import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function Dashboard({
  username,
  onDashboard,
  onCreateQuiz,
  onViewAttempts,
  onMyQuizzes,   // 🔥 NEW PROP ADDED
  onLogout
}) {
  const role = "creator";

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          username={username}
          role={role}
          onDashboard={onDashboard}
          onCreateQuiz={onCreateQuiz}
          onViewAttempts={onViewAttempts}
          onMyQuizzes={onMyQuizzes}   // 🔥 FORWARDED HERE
          onLogout={onLogout}
        />
      }
    >
      <h1 style={styles.heading}>Creator Dashboard</h1>

      <p style={styles.welcome}>
        Welcome back, <strong>{username}</strong>.
        Manage your quizzes and view analytics.
      </p>

      <div style={styles.card}>
        <p style={styles.cardTitle}>What can you do?</p>
        <ul style={styles.list}>
          <li>Create new quizzes</li>
          <li>Manage existing quizzes</li>
          <li>View user performance analytics</li>
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
