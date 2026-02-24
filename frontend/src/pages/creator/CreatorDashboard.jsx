import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function Dashboard({
  username,
  onDashboard,
  onCreateQuiz,
  onViewAttempts,
  onMyQuizzes,
  onLogout
}) {
  const role = "creator";

  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/quizzes")
      .then(res => res.json())
      .then(data =>
        setQuizzes(data.filter(q => q.createdBy === username))
      );

    fetch("http://localhost:5000/attempts")
      .then(res => res.json())
      .then(setAttempts);
  }, [username]);

  const myQuizIds = quizzes.map(q => q.id);
  const myAttempts = attempts.filter(a =>
    myQuizIds.includes(a.quizId)
  );

  const totalAttempts = myAttempts.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          myAttempts.reduce((sum, a) => sum + a.score, 0) /
            totalAttempts
        )
      : 0;

  const circumference = 440;

  /* ================= DIFFICULTY ANALYTICS ================= */

  const difficultyStats = {
    easy: { questions: 0, attempts: 0, correct: 0 },
    medium: { questions: 0, attempts: 0, correct: 0 },
    hard: { questions: 0, attempts: 0, correct: 0 }
  };

  quizzes.forEach(quiz => {

    // 🔥 FIXED: Proper normalization (no forced medium fallback)
    let level = "easy";

    if (quiz.difficulty) {
      const normalized = quiz.difficulty.toString().toLowerCase();
      if (["easy", "medium", "hard"].includes(normalized)) {
        level = normalized;
      }
    }

    difficultyStats[level].questions +=
      quiz.questions?.length || 0;

    const quizAttempts = myAttempts.filter(
      a => a.quizId === quiz.id
    );

    difficultyStats[level].attempts +=
      quizAttempts.length;

    difficultyStats[level].correct +=
      quizAttempts.reduce((sum, a) => sum + a.score, 0);
  });

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          username={username}
          role={role}
          onDashboard={onDashboard}
          onCreateQuiz={onCreateQuiz}
          onViewAttempts={onViewAttempts}
          onMyQuizzes={onMyQuizzes}
          onLogout={onLogout}
        />
      }
    >
      <h1 style={styles.heading}>Creator Analytics</h1>

      <p style={styles.subText}>
        This dashboard provides insights into the performance of quizzes
        you have created, including engagement and user performance metrics.
      </p>

      <div style={styles.kpiRow}>
        <KpiCard
          title="Quizzes Created"
          value={quizzes.length}
          numberStyle={styles.statNumberQuestions}
        />

        <KpiCard
          title="Total Attempts"
          value={totalAttempts}
          numberStyle={styles.statNumberAttempts}
        />

        <KpiCard
          title="Average Score"
          value={`${averageScore}%`}
          numberStyle={styles.statNumberAverage}
        />
      </div>

      <div style={styles.chartCard}>
        <h3>Average Performance</h3>

        <p style={styles.chartSubText}>
          Represents the average percentage score achieved by users
          across all your quizzes.
        </p>

        <svg width="200" height="200">
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="14"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="url(#grad1)"
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * averageScore) / 100
            }
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c7cd27" />
              <stop offset="100%" stopColor="#10c121" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="8px"
            fill="white"
            fontSize="28"
            fontWeight="600"
          >
            {averageScore}%
          </text>
        </svg>
      </div>

      {/* ================= DIFFICULTY ANALYTICS ================= */}

      <div style={styles.difficultyCard}>
        <h3 style={styles.diffHeading}>Difficulty Analytics</h3>

        <p style={styles.diffSubText}>
          Performance breakdown based on quiz difficulty level.
        </p>

        <div style={styles.difficultyGrid}>
          {["easy", "medium", "hard"].map(level => {
            const data = difficultyStats[level];

            return (
              <div
                key={level}
                style={{
                  ...styles.diffStatCard,
                  ...(level === "easy"
                    ? styles.easyCard
                    : level === "medium"
                    ? styles.mediumCard
                    : styles.hardCard)
                }}
              >
                <div style={styles.diffTopRow}>
                  <span style={styles.diffBadge}>
                    {level.toUpperCase()}
                  </span>
                </div>

                <div style={styles.diffMetrics}>
                  <Metric label="Total Questions" value={data.questions} />
                  <Metric label="Total Attempts" value={data.attempts} />
                  <Metric label="Correct Answers" value={data.correct} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </DashboardLayout>
  );
}

function KpiCard({ title, value, numberStyle }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiTitle}>{title}</p>
      <p style={{ ...styles.kpiValue, ...numberStyle }}>
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={styles.metricRow}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={styles.metricValue}>{value}</span>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: "1.9rem",
    marginBottom: "10px"
  },

  subText: {
    opacity: 0.75,
    marginBottom: "30px",
    maxWidth: "600px",
    lineHeight: "1.6"
  },

  /* ================= KPI ================= */

  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "28px",
    marginBottom: "40px"
  },

  kpiCard: {
    padding: "24px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease"
  },

  kpiTitle: {
    fontSize: "0.85rem",
    opacity: 0.7,
    marginBottom: "8px",
    letterSpacing: "0.5px"
  },

  statNumberQuestions: {
    fontSize: "1.6rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #c8f141d4, #16d9e7e3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  statNumberAttempts: {
    fontSize: "1.6rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #cb4141, #0a0a09)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  statNumberAverage: {
    fontSize: "1.6rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #c7cd27, #10c121)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  /* ================= CHART ================= */

  chartCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    marginBottom: "50px",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 30px 70px rgba(0,0,0,0.35)"
  },

  chartSubText: {
    opacity: 0.75,
    fontSize: "0.95rem",
    marginBottom: "25px",
    lineHeight: "1.5"
  },

  /* ================= DIFFICULTY SECTION ================= */

  difficultyCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 30px 70px rgba(0,0,0,0.35)"
  },

  diffHeading: {
    marginBottom: "8px",
    fontSize: "1.3rem",
    fontWeight: 600
  },

  diffSubText: {
    opacity: 0.75,
    fontSize: "0.95rem",
    marginBottom: "30px"
  },

  difficultyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "28px"
  },

  diffStatCard: {
    padding: "26px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease"
  },

  /* Colored Left Accent */

  easyCard: {
    borderLeft: "5px solid #22c55e"
  },

  mediumCard: {
    borderLeft: "5px solid #facc15"
  },

  hardCard: {
    borderLeft: "5px solid #ef4444"
  },

  diffTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  diffBadge: {
    padding: "6px 14px",
    borderRadius: "18px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
    background: "rgba(255,255,255,0.15)"
  },

  diffMetrics: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  metricLabel: {
    fontSize: "0.85rem",
    opacity: 0.8
  },

  metricValue: {
    fontWeight: 700,
    fontSize: "1.05rem"
  }
};
