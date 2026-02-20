import React, { useState } from "react";

export default function Sidebar({
  username,
  role,
  onDashboard,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts,
  onMyQuizzes,
  onLogout
}) {
  const [hovered, setHovered] = useState(null);

  const getButtonStyle = (key) => ({
    ...baseButton,
    transform: hovered === key ? "translateX(4px)" : "translateX(0)",
    background:
      hovered === key
        ? "rgba(255,255,255,0.12)"
        : "rgba(255,255,255,0.05)",
    boxShadow:
      hovered === key
        ? "0 8px 20px rgba(0,0,0,0.25)"
        : "none"
  });

  return (
    <>
      {/* Profile */}
      <div style={styles.profile}>
        <div style={styles.avatar}>
          {(username && username[0]?.toUpperCase()) || "U"}
        </div>

        <div>
          <p style={styles.name}>{username}</p>
          <p style={styles.role}>
            {role === "creator" ? "Quiz Creator" : "Quiz Attempter"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {/* Common */}
        <button
          style={getButtonStyle("dashboard")}
          onMouseEnter={() => setHovered("dashboard")}
          onMouseLeave={() => setHovered(null)}
          onClick={onDashboard}
        >
          Dashboard
        </button>

        {/* Attempter Only */}
        {role === "attempter" && (
          <>
            <button
              style={getButtonStyle("attempt")}
              onMouseEnter={() => setHovered("attempt")}
              onMouseLeave={() => setHovered(null)}
              onClick={onAttemptQuiz}
            >
              Take Quiz
            </button>

            <button
              style={getButtonStyle("attempts")}
              onMouseEnter={() => setHovered("attempts")}
              onMouseLeave={() => setHovered(null)}
              onClick={onViewAttempts}
            >
              View Attempts
            </button>
          </>
        )}

        {/* Creator Only */}
        {role === "creator" && (
          <>
            <button
              style={getButtonStyle("myquizzes")}
              onMouseEnter={() => setHovered("myquizzes")}
              onMouseLeave={() => setHovered(null)}
              onClick={onMyQuizzes}
            >
              My Quizzes
            </button>

            <button
              style={getButtonStyle("analytics")}
              onMouseEnter={() => setHovered("analytics")}
              onMouseLeave={() => setHovered(null)}
              onClick={onViewAttempts}
            >
              Quiz Analytics
            </button>
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          style={{
            ...baseButton,
            background: "rgb(53, 46, 119)",
            border: "1px solid rgb(13, 55, 62)",
            color: "#fecaca",
            transition: "all 0.25s ease"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "rgba(255,0,0,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "rgba(255,0,0,0.1)")
          }
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}


const baseButton = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "0.95rem",
  transition: "all 0.25s ease"
};

const styles = {
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px"
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
  },

  name: {
    fontWeight: "600"
  },

  role: {
    fontSize: "0.8rem",
    opacity: 0.7
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1
  },

  footer: {
    borderTop: "1px solid rgba(255,255,255,0.15)",
    paddingTop: "16px"
  }
};
