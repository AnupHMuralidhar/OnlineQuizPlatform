import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import { theme } from "../../styles/theme";

export default function Attempts({
  username,
  onDashboard,
  onAttemptQuiz,
  onViewAttempts,
  onLogout
}) {
  const role = "attempter";
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/attempts/user/${username}`)
      .then((res) => res.json())
      .then((data) => setAttempts(data))
      .catch(() => setAttempts([]));
  }, [username]);

  const getQuestionType = (q) => {
    if (q.type) return q.type;

    if (q.correctIndex !== undefined) return "mcq";
    if (Array.isArray(q.correctAnswers)) {
      if (q.correctAnswers.length > 1) return "msq";
      return "mcq";
    }

    return "mcq";
  };

  // 🔥 image helper (same logic as AttemptQuiz)
  const formatImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    const clean = img.startsWith("/") ? img : `/${img}`;
    return `http://localhost:5000${clean}`;
  };

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
      <h2 style={styles.title}>Past Attempts</h2>

      {attempts.length === 0 && (
        <p style={styles.empty}>No attempts yet.</p>
      )}

      {attempts.map((a, index) => {

        const correctCount = a.questions.filter((q, i) => {
          const type = getQuestionType(q);
          if (type === "text") return false;

          const userAnswer = a.answers?.[i];

          if (type === "mcq" || type === "image") {
            const correctIndex =
              q.correctIndex !== undefined
                ? q.correctIndex
                : q.correctAnswers?.[0];

            return userAnswer === correctIndex;
          }

          if (type === "msq") {
            const correctAnswers = q.correctAnswers || [];
            return (
              Array.isArray(userAnswer) &&
              correctAnswers.length === userAnswer.length &&
              correctAnswers.every(index =>
                userAnswer.includes(index)
              )
            );
          }

          return false;
        }).length;

        const totalScored = a.questions.filter(
          q => getQuestionType(q) !== "text"
        ).length;

        return (
          <div key={index} style={styles.rowWrapper}>
            
            <div style={styles.attemptNumber}>
              {index + 1}
            </div>

            <div style={styles.card}>
              <h3 style={styles.quizTitle}>{a.quizTitle}</h3>

              <p style={styles.score}>
                Score: {correctCount}/{totalScored}
              </p>

              <p style={styles.time}>
                {new Date(a.timestamp).toLocaleString()}
              </p>

              {a.questions?.map((q, qi) => {
                const type = getQuestionType(q);
                const userAnswer = a.answers?.[qi];

                return (
                  <div key={qi} style={styles.question}>
                    <p style={styles.questionText}>
                      {qi + 1}. {q.text}
                    </p>

                    {/* 🔥 QUESTION IMAGE */}
                    {q.image && (
                      <img
                        src={formatImage(q.image)}
                        alt="Question"
                        style={styles.questionImage}
                      />
                    )}

                    {/* TEXT */}
                    {type === "text" && (
                      <p>
                        Your Answer: {userAnswer || "Not answered"}
                      </p>
                    )}

                    {/* MCQ + IMAGE */}
                    {(type === "mcq" || type === "image") && (() => {
                      const correctIndex =
                        q.correctIndex !== undefined
                          ? q.correctIndex
                          : q.correctAnswers?.[0];

                      const isCorrect =
                        userAnswer === correctIndex;

                      const userOption =
                        q.options?.[userAnswer];

                      const correctOption =
                        q.options?.[correctIndex];

                      return (
                        <>
                          {/* USER ANSWER */}
                          {userOption && (
                            <>
                              <p style={isCorrect ? styles.correct : styles.wrong}>
                                Your Answer:
                              </p>

                              {userOption.text && (
                                <p>{userOption.text}</p>
                              )}

                              {userOption.image && (
                                <img
                                  src={formatImage(userOption.image)}
                                  alt="User Option"
                                  style={styles.optionImage}
                                />
                              )}
                            </>
                          )}

                          {/* CORRECT ANSWER */}
                          {!isCorrect && correctOption && (
                            <>
                              <p style={styles.correct}>
                                Correct Answer:
                              </p>

                              {correctOption.text && (
                                <p>{correctOption.text}</p>
                              )}

                              {correctOption.image && (
                                <img
                                  src={formatImage(correctOption.image)}
                                  alt="Correct Option"
                                  style={styles.optionImage}
                                />
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}

                    {/* MSQ */}
                    {type === "msq" && (() => {
                      const correctAnswers =
                        q.correctAnswers || [];
                      const userArray =
                        userAnswer || [];

                      const isCorrect =
                        correctAnswers.length ===
                          userArray.length &&
                        correctAnswers.every(index =>
                          userArray.includes(index)
                        );

                      return (
                        <>
                          <p style={isCorrect ? styles.correct : styles.wrong}>
                            Your Answer:
                          </p>

                          {Array.isArray(userArray) &&
                            userArray.map((idx, i) => {
                              const opt = q.options[idx];
                              return (
                                <div key={i}>
                                  {opt?.text && <p>{opt.text}</p>}
                                  {opt?.image && (
                                    <img
                                      src={formatImage(opt.image)}
                                      alt="User Option"
                                      style={styles.optionImage}
                                    />
                                  )}
                                </div>
                              );
                            })}

                          {!isCorrect && (
                            <>
                              <p style={styles.correct}>
                                Correct Answer:
                              </p>

                              {correctAnswers.map((idx, i) => {
                                const opt = q.options[idx];
                                return (
                                  <div key={i}>
                                    {opt?.text && <p>{opt.text}</p>}
                                    {opt?.image && (
                                      <img
                                        src={formatImage(opt.image)}
                                        alt="Correct Option"
                                        style={styles.optionImage}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "20px 20px 20px 70px",  // ← extra left padding for number badge
    marginBottom: "16px",
    marginLeft: "0px",              // ← no left margin
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    position: "relative"            // ← anchors the number badge
  },

  quizTitle: {
    color: "#67e8f9",
    fontWeight: "600",
    marginBottom: "6px"
  },

  score: {
    color: "#c4b5fd",
    fontWeight: "600",
    marginBottom: "6px"
  },

  /* 🔥 Darker timestamp */
  time: {
    fontSize: "0.85rem",
    color: "#151517",   // darker gray for visibility
    marginBottom: theme.spacing.sm
  },

  question: {
    marginTop: theme.spacing.sm
  },

  questionText: {
    fontWeight: "500"
  },
questionImage: {
  width: "220px",
  maxHeight: "160px",
  objectFit: "contain",
  borderRadius: "8px",
  marginBottom: "8px"
},

optionImage: {
  width: "160px",
  maxHeight: "120px",
  objectFit: "contain",
  borderRadius: "6px",
  marginTop: "6px",
  marginBottom: "6px"
},
  correct: {
    color: "#34d399",
    fontWeight: "600",
    textShadow: "0 0 4px rgba(52, 211, 153, 0.6)"
  },

  wrong: {
    color: "#a70808",
    fontWeight: "600",
    textShadow: "0 0 4px rgba(167, 8, 8, 0.6)"
  },

  rowWrapper: {
    position: "relative",
    marginBottom: "28px"
  },

  attemptNumber: {
    position: "absolute",
    left: "12px",                   // ← moved right inside big card
    top: "20px",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#a78bfa,#f472b6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1rem",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    zIndex: 2                       // ← stays above everything
  }
};
