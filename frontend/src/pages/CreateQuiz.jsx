import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Sidebar from "../components/Sidebar";
import { theme } from "../styles/theme";

export default function CreateQuiz({
  username,
  onCreateQuiz,
  onAttemptQuiz,
  onViewAttempts,
  onLogout,
  onBack
}) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctIndex: 0 }
    ]);
  };

  const updateQuestionText = (i, value) => {
    const copy = [...questions];
    copy[i].text = value;
    setQuestions(copy);
  };

  const updateOption = (qi, oi, value) => {
    const copy = [...questions];
    copy[qi].options[oi] = value;
    setQuestions(copy);
  };

  const updateCorrect = (qi, oi) => {
    const copy = [...questions];
    copy[qi].correctIndex = oi;
    setQuestions(copy);
  };

  const handleSave = async () => {
    await fetch("http://localhost:5000/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, questions })
    });
    onBack();
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
      <h2 style={styles.title}>Create Quiz</h2>

      <input
        style={styles.input}
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {questions.map((q, qi) => (
        <div key={qi} style={styles.question}>
          <input
            style={styles.input}
            placeholder={`Question ${qi + 1}`}
            value={q.text}
            onChange={(e) => updateQuestionText(qi, e.target.value)}
          />

          {q.options.map((opt, oi) => (
            <div key={oi} style={styles.optionRow}>
              <input
                style={styles.option}
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
              />
              <input
                type="radio"
                name={`correct-${qi}`}
                checked={q.correctIndex === oi}
                onChange={() => updateCorrect(qi, oi)}
              />
            </div>
          ))}
        </div>
      ))}

      <div style={styles.actions}>
        <button style={styles.secondary} onClick={addQuestion}>
          + Add Question
        </button>

        <button style={styles.primary} onClick={handleSave}>
          Save Quiz
        </button>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  title: { marginBottom: theme.spacing.md },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.sm
  },
  question: {
    borderTop: `1px solid ${theme.colors.border}`,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md
  },
  optionRow: {
    display: "flex",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs
  },
  option: {
    flex: 1,
    padding: "8px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`
  },
  actions: {
    display: "flex",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  primary: {
    padding: "10px 16px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer"
  },
  secondary: {
    padding: "10px 16px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: "#f9fafb",
    cursor: "pointer"
  }
};
