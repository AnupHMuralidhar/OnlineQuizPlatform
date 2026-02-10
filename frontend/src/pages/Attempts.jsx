import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Sidebar from "../components/Sidebar";
import { theme } from "../styles/theme";

export default function Attempts({
  username,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts,
  onLogout
}) {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/attempts/${username}`)
      .then((res) => res.json())
      .then((data) => setAttempts(data))
      .catch(() => setAttempts([]));
  }, [username]);

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          username={username}
          onCreateQuiz={onCreateQuiz}
          onAttemptQuiz={onAttemptQuiz}
          onViewAttempts={onViewAttempts}
          onLogout={onLogout}
        />
      }
    >
      <h2 style={styles.title}>Past Attempts</h2>

      {attempts.length === 0 && (
        <p style={styles.empty}>No attempts yet.</p>
      )}

      {attempts.map((a, i) => (
        <div key={i} style={styles.card}>
          <h3>{a.quizTitle}</h3>

          <p style={styles.score}>
            Score: {a.score}/{a.total}
          </p>

          <p style={styles.time}>
            {new Date(a.timestamp).toLocaleString()}
          </p>

          {a.questions &&
            a.questions.map((q, qi) => {
              const userPick = a.answers?.[qi];

              return (
                <div key={qi} style={styles.question}>
                  <p style={styles.questionText}>
                    {qi + 1}. {q.text}
                  </p>

                  <p
                    style={
                      userPick === q.correctIndex
                        ? styles.correct
                        : styles.wrong
                    }
                  >
                    Your answer:{" "}
                    {userPick !== undefined
                      ? q.options[userPick]
                      : "Not answered"}
                  </p>

                  {userPick !== q.correctIndex && (
                    <p style={styles.correct}>
                      Correct answer: {q.options[q.correctIndex]}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </DashboardLayout>
  );
}

const styles = {
  title: {
    marginBottom: theme.spacing.lg
  },
  empty: {
    color: theme.colors.muted
  },
  card: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  score: {
    fontWeight: "500"
  },
  time: {
    fontSize: "0.85rem",
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm
  },
  question: {
    marginTop: theme.spacing.sm
  },
  questionText: {
    fontWeight: "500"
  },
  correct: {
    color: theme.colors.success
  },
  wrong: {
    color: theme.colors.danger
  }
};
