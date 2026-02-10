import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Sidebar from "../components/Sidebar";
import { theme } from "../styles/theme";

export default function AttemptQuiz({
  username,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts,
  onLogout,
  onBack
}) {
  // NEW: domains + existing quizzes
  const [domains, setDomains] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [selectedSource, setSelectedSource] = useState(null); // { type, data }
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Load domains + user-created quizzes
  useEffect(() => {
    fetch("http://localhost:5000/domains")
      .then(res => res.json())
      .then(setDomains)
      .catch(() => setDomains([]));

    fetch("http://localhost:5000/quizzes")
      .then(res => res.json())
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, []);

  const submitQuiz = async () => {
    let correct = 0;

    selectedSource.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    setScore(correct);

    await fetch("http://localhost:5000/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        quizTitle: selectedSource.title,
        score: correct,
        total: selectedSource.questions.length,
        questions: selectedSource.questions,
        answers
      })
    });
  };

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
      {/* STEP 1: SELECT DOMAIN / QUIZ */}
      {!selectedSource && (
        <>
          <h2 style={styles.title}>Select a Quiz</h2>

          <h3 style={styles.sectionTitle}>Domains</h3>
          {domains.map((d) => (
            <button
              key={d.key}
              style={styles.quizButton}
              onClick={async () => {
                const res = await fetch(
                  `http://localhost:5000/domains/${d.key}`
                );
                const data = await res.json();

                setSelectedSource({
                  title: data.domain,
                  questions: data.questions
                });
                setAnswers({});
                setScore(null);
              }}
            >
              {d.name}
            </button>
          ))}

          <h3 style={styles.sectionTitle}>Your Quizzes</h3>
          {quizzes.map((q) => (
            <button
              key={q.id}
              style={styles.quizButton}
              onClick={() => {
                setSelectedSource(q);
                setAnswers({});
                setScore(null);
              }}
            >
              {q.title}
            </button>
          ))}
        </>
      )}

      {/* STEP 2: ATTEMPT QUIZ */}
      {selectedSource && score === null && (
        <>
          <h2 style={styles.title}>{selectedSource.title}</h2>

          {selectedSource.questions.map((q, qi) => (
            <div key={qi} style={styles.question}>
              <p>{qi + 1}. {q.text}</p>

              {q.options.map((opt, oi) => (
                <label key={oi} style={styles.option}>
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() =>
                      setAnswers({ ...answers, [qi]: oi })
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button style={styles.primary} onClick={submitQuiz}>
            Submit Quiz
          </button>
        </>
      )}

      {/* STEP 3: RESULT */}
      {selectedSource && score !== null && (
        <>
          <h2>Quiz Completed 🎉</h2>
          <p style={styles.score}>
            Your Score: {score}/{selectedSource.questions.length}
          </p>

          <button style={styles.primary} onClick={onBack}>
            Back to Dashboard
          </button>
        </>
      )}
    </DashboardLayout>
  );
}

const styles = {
  title: {
    marginBottom: theme.spacing.md
  },
  sectionTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    color: theme.colors.muted
  },
  quizButton: {
    width: "100%",
    padding: "12px",
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: "#f9fafb",
    cursor: "pointer",
    textAlign: "left"
  },
  question: {
    marginBottom: theme.spacing.md
  },
  option: {
    display: "block",
    marginBottom: theme.spacing.xs
  },
  primary: {
    marginTop: theme.spacing.md,
    padding: "12px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer"
  },
  score: {
    fontSize: "1.2rem",
    marginTop: theme.spacing.md
  }
};
