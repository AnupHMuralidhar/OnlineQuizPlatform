import React, { useEffect, useState } from "react";
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

  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    fullyCorrect: 0,
    withMistakes: 0
  });

  const [questionStats, setQuestionStats] = useState({
    totalQuestions: 0,
    totalCorrect: 0,
    totalWrong: 0
  });

  const [difficultyStats, setDifficultyStats] = useState({
    easy: { attempted: 0, correct: 0 },
    medium: { attempted: 0, correct: 0 },
    hard: { attempted: 0, correct: 0 }
  });

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/attempts/user/${username}`)
      .then(res => res.json())
      .then(data => {

        let totalQuizzes = data.length;
        let fullyCorrect = 0;
        let withMistakes = 0;

        let totalQuestions = 0;
        let totalCorrect = 0;

        const diff = {
          easy: { attempted: 0, correct: 0 },
          medium: { attempted: 0, correct: 0 },
          hard: { attempted: 0, correct: 0 }
        };

        data.forEach(a => {
          const correct = a.score || 0;
          const total = a.total || 0;

          totalCorrect += correct;
          totalQuestions += total;

          if (correct === total && total > 0) {
            fullyCorrect++;
          } else if (total > 0) {
            withMistakes++;
          }

a.questions?.forEach((q, qi) => {
  // ✅ Use QUIZ difficulty, not question difficulty
  const difficulty = (a.difficulty || "medium").toLowerCase();
  const userAnswer = a.answers?.[qi];

  if (!diff[difficulty]) return;

  diff[difficulty].attempted++;

  if (q.correctAnswers?.includes(userAnswer)) {
    diff[difficulty].correct++;
  }
});
        });

        setQuizStats({
          totalQuizzes,
          fullyCorrect,
          withMistakes
        });

        setQuestionStats({
          totalQuestions,
          totalCorrect,
          totalWrong: totalQuestions - totalCorrect
        });

        setDifficultyStats(diff);
      });
  }, [username]);

  const quizPercentage =
    quizStats.totalQuizzes > 0
      ? Math.round(
          (quizStats.fullyCorrect /
            quizStats.totalQuizzes) *
            100
        )
      : 0;

  const questionPercentage =
    questionStats.totalQuestions > 0
      ? Math.round(
          (questionStats.totalCorrect /
            questionStats.totalQuestions) *
            100
        )
      : 0;

  const circumference = 440;

  const getAccuracy = (attempted, correct) =>
    attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

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
      <h1 style={styles.heading}>Dashboard Overview</h1>

      <p style={styles.subText}>
        Track your quiz activity and monitor your performance trends.
        Use the analytics below to understand your strengths and improve accuracy.
      </p>

      {/* KPI */}
      <div style={styles.kpiRow}>
        <KpiCard
          title="Quizzes Attempted"
          value={quizStats.totalQuizzes}
          numberStyle={styles.primaryNumber}
        />
        <KpiCard
          title="Total Questions"
          value={questionStats.totalQuestions}
          numberStyle={styles.secondaryNumber}
        />
      </div>

      {/* Charts */}
      <div style={styles.chartRow}>
        <ChartCard
          title="Quiz Performance"
          percentage={quizPercentage}
          correct={quizStats.fullyCorrect}
          wrong={quizStats.withMistakes}
          correctLabel="Fully Correct"
          wrongLabel="With Mistakes"
          color="#8b5cf6"
        />

        <ChartCard
          title="Question Accuracy"
          percentage={questionPercentage}
          correct={questionStats.totalCorrect}
          wrong={questionStats.totalWrong}
          correctLabel="Correct"
          wrongLabel="Wrong"
          color="#34d399"
        />
      </div>

      {/* Difficulty Breakdown */}
      <div style={styles.difficultyCard}>
        <h3 style={styles.diffHeading}>Difficulty Breakdown</h3>
        <p style={styles.diffSubText}>
          Performance segmented by question difficulty.
        </p>

        <div style={styles.difficultyGrid}>
          {["easy", "medium", "hard"].map(level => {
            const stats = difficultyStats[level];
            const accuracy = getAccuracy(
              stats.attempted,
              stats.correct
            );

            return (
              <div
                key={level}
                style={{
                  ...styles.diffStatCard,
                  ...styles[`${level}Card`]
                }}
              >
                <div style={styles.diffTopRow}>
                  <span style={styles.diffBadge}>
                    {level.toUpperCase()}
                  </span>
                  <span style={styles.metricValue}>
                    {accuracy}%
                  </span>
                </div>

                <div style={styles.diffMetrics}>
                  <div style={styles.metricRow}>
                    <span style={styles.metricLabel}>
                      Attempted
                    </span>
                    <span style={styles.metricValue}>
                      {stats.attempted}
                    </span>
                  </div>

                  <div style={styles.metricRow}>
                    <span style={styles.metricLabel}>
                      Correct
                    </span>
                    <span style={styles.metricValue}>
                      {stats.correct}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* Components unchanged */
function KpiCard({ title, value, numberStyle }) {
  return (
    <div style={styles.kpiCard}>
      <span style={{ ...styles.kpiValue, ...numberStyle }}>
        {value}
      </span>
      <span style={styles.kpiTitle}>{title}</span>
    </div>
  );
}

function ChartCard({
  title,
  percentage,
  correct,
  wrong,
  correctLabel,
  wrongLabel,
  color
}) {
  const circumference = 440;

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>

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
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference - (circumference * percentage) / 100
          }
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="8px"
          fill="white"
          fontSize="26"
          fontWeight="700"
        >
          {percentage}%
        </text>
      </svg>

      <div style={styles.chartLegend}>
        <span style={{ color: "#34d399" }}>
          ● {correctLabel}: {correct}
        </span>
        <span style={{ color: "#a70808" }}>
          ● {wrongLabel}: {wrong}
        </span>
      </div>
    </div>
  );
}
/* ================= STYLES ================= */

const styles = {
  /* ================= HEADER ================= */

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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "50px"
  },

  kpiCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    borderRadius: "22px",
    padding: "32px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease"
  },

  kpiTitle: {
    fontSize: "0.85rem",
    opacity: 0.75,
    marginTop: "10px",
    letterSpacing: "0.5px"
  },

  kpiValue: {
    fontSize: "2.4rem",
    fontWeight: 800
  },

  primaryNumber: {
    background: "linear-gradient(135deg,#95e433,#22c55e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  secondaryNumber: {
    background: "linear-gradient(135deg,#67e8f9,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  /* ================= CHARTS ================= */

  chartRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    marginBottom: "50px"
  },

  chartCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 30px 70px rgba(0,0,0,0.35)"
  },

  chartTitle: {
    marginBottom: "22px",
    fontWeight: 600,
    fontSize: "1.1rem"
  },

  chartLegend: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-around",
    fontSize: "0.9rem",
    opacity: 0.9
  },

  /* ================= DIFFICULTY SECTION ================= */

  difficultyCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 30px 70px rgba(0,0,0,0.35)"
  },

  diffHeading: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "6px"
  },

  diffSubText: {
    opacity: 0.75,
    marginBottom: "30px",
    fontSize: "0.95rem"
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

  /* Difficulty accent borders */

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
