import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import { theme } from "../../styles/theme";

export default function QuizAnalytics({
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
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAttempt, setHoveredAttempt] = useState(null);
  const [hoveredBack, setHoveredBack] = useState(false);

  useEffect(() => {
    if (!username) return;

    fetch("http://localhost:5000/quizzes")
      .then(res => res.json())
      .then(data =>
        setQuizzes(data.filter(q => q.createdBy === username))
      )
      .catch(() => setQuizzes([]));

    fetch("http://localhost:5000/attempts")
      .then(res => res.json())
      .then(setAttempts)
      .catch(() => setAttempts([]));
  }, [username]);

  const quizAttempts = selectedQuiz
    ? attempts.filter(a => a.quizId === selectedQuiz.id)
    : [];

  const averageScore = quizAttempts.length
    ? (
        quizAttempts.reduce((sum, a) => sum + a.score, 0) /
        quizAttempts.length
      ).toFixed(2)
    : 0;

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
          onCreateQuiz={onCreateQuiz}
          onViewAttempts={onViewAttempts}
          onMyQuizzes={onMyQuizzes}
          onLogout={onLogout}
        />
      }
    >
      {/* ===================== */}
      {/* QUIZ OVERVIEW SCREEN  */}
      {/* ===================== */}

{!selectedQuiz && (
  <>
    <h2 style={styles.title}>Analytics Overview</h2>

    <div style={styles.grid}>
      {quizzes.map((quiz) => {
        const quizAttempts = attempts.filter(
          a => a.quizId === quiz.id
        );

        const totalAttempts = quizAttempts.length;

        const avg =
          totalAttempts > 0
            ? (
                quizAttempts.reduce(
                  (sum, a) => sum + a.score,
                  0
                ) / totalAttempts
              ).toFixed(2)
            : 0;

        const uniqueUsers = [
          ...new Set(
            quizAttempts.map(a => a.username)
          )
        ];

        return (
          <div
            key={quiz.id}
            style={{
              ...styles.analyticsCard,
              ...(hoveredCard === quiz.id &&
                styles.cardHover)
            }}
            onMouseEnter={() =>
              setHoveredCard(quiz.id)
            }
            onMouseLeave={() =>
              setHoveredCard(null)
            }
            onClick={() => {
              setSelectedQuiz(quiz);
              setSelectedAttempt(null);
            }}
          >
            <h3 style={styles.quizTitle}>
              {quiz.title}
            </h3>

            <div style={styles.analyticsStats}>
              {/* QUESTIONS */}
              <div style={styles.statBox}>
                <span style={styles.statNumberQuestions}>
                  {quiz.questions?.length || 0}
                </span>
                <span style={styles.statLabel}>
                  Questions
                </span>
              </div>

              {/* ATTEMPTS */}
              <div style={styles.statBox}>
                <span style={styles.statNumberAttempts}>
                  {totalAttempts}
                </span>
                <span style={styles.statLabel}>
                  Attempts
                </span>
              </div>

              {/* AVG SCORE */}
              <div style={styles.statBox}>
                <span style={styles.statNumberAverage}>
                  {avg}
                </span>
                <span style={styles.statLabel}>
                  Avg Score
                </span>
              </div>
            </div>

{uniqueUsers.length > 0 && (
  <div style={styles.userSection}>
    <span style={styles.userLabel}>Users:</span>

    <div style={styles.userList}>
      {uniqueUsers.map((u, i) => (
        <span key={i} style={styles.userBadge}>
          {u}
        </span>
      ))}
    </div>
  </div>
)}

          </div>
        );
      })}
    </div>
  </>
)}


      {/* ===================== */}
      {/* QUIZ DETAILS SCREEN  */}
      {/* ===================== */}

      {selectedQuiz && !selectedAttempt && (
        <>
          <button
            style={{
              ...styles.backBtn,
              ...(hoveredBack && styles.backHover)
            }}
            onMouseEnter={() =>
              setHoveredBack(true)
            }
            onMouseLeave={() =>
              setHoveredBack(false)
            }
            onClick={() => setSelectedQuiz(null)}
          >
            ← Back
          </button>

          <h2 style={styles.title}>
            {selectedQuiz.title}
          </h2>

          <div style={styles.summaryRow}>
            <div style={styles.summaryCard}>
              Total Attempts: {quizAttempts.length}
            </div>
            <div style={styles.summaryCard}>
              Average Score: {averageScore}
            </div>
          </div>

          {quizAttempts.map((attempt, index) => (
            <div
              key={index}
              style={{
                ...styles.attemptCard,
                ...(hoveredAttempt === index &&
                  styles.cardHover)
              }}
              onMouseEnter={() =>
                setHoveredAttempt(index)
              }
              onMouseLeave={() =>
                setHoveredAttempt(null)
              }
              onClick={() =>
                setSelectedAttempt(attempt)
              }
            >
              <div>
                <h4 style={styles.attemptUser}>
                  {attempt.username}
                </h4>
                <p style={styles.time}>
                  {new Date(
                    attempt.timestamp
                  ).toLocaleString()}
                </p>
              </div>

              <div style={styles.attemptScore}>
                {attempt.score}/{attempt.total}
              </div>
            </div>
          ))}
        </>
      )}

     {/* ===================== */}
{/* FULL ATTEMPT VIEW    */}
{/* ===================== */}

{selectedAttempt && (
  <>
    <button
      style={{
        ...styles.backBtn,
        ...(hoveredBack && styles.backHover)
      }}
      onMouseEnter={() => setHoveredBack(true)}
      onMouseLeave={() => setHoveredBack(false)}
      onClick={() => setSelectedAttempt(null)}
    >
      ← Back
    </button>

    <h2 style={styles.title}>
      {selectedAttempt.username}'s Attempt
    </h2>

    {(() => {
      const getQuestionType = (q) => {
        if (q.type) return q.type;
        if (q.correctIndex !== undefined) return "mcq";
        if (Array.isArray(q.correctAnswers)) {
          if (q.correctAnswers.length > 1) return "msq";
          return "mcq";
        }
        return "mcq";
      };

      const correctCount = selectedAttempt.questions.filter((q, i) => {
        const type = getQuestionType(q);
        if (type === "text") return false;

        const userAnswer = selectedAttempt.answers?.[i];

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

      const totalScored = selectedAttempt.questions.filter(
        q => getQuestionType(q) !== "text"
      ).length;

      return (
        <p style={styles.scoreHighlight}>
          Score: {correctCount}/{totalScored}
        </p>
      );
    })()}

    {selectedAttempt.questions.map((q, qi) => {
  const getQuestionType = (q) => {
    if (q.type) return q.type;
    if (q.correctIndex !== undefined) return "mcq";
    if (Array.isArray(q.correctAnswers)) {
      if (q.correctAnswers.length > 1) return "msq";
      return "mcq";
    }
    return "mcq";
  };

  const type = getQuestionType(q);
  const userAnswer = selectedAttempt.answers?.[qi];

  return (
    <div key={qi} style={styles.detailCard}>
      <p style={styles.questionText}>
        {qi + 1}. {q.text}
      </p>

      {/* QUESTION IMAGE */}
      {q.image && (
        <img
          src={formatImage(q.image)}
          alt="Question"
          style={styles.analyticsQuestionImage}
        />
      )}

      {/* TEXT TYPE */}
      {type === "text" && (
        <p>
          User Answer: {userAnswer || "Not answered"}
        </p>
      )}

      {/* MCQ + IMAGE TYPE */}
      {(type === "mcq" || type === "image") && (() => {
  const correctIndex =
    q.correctIndex !== undefined
      ? q.correctIndex
      : q.correctAnswers?.[0];

  const userOption =
    typeof userAnswer === "number"
      ? q.options?.[userAnswer]
      : null;

  const correctOption =
    typeof correctIndex === "number"
      ? q.options?.[correctIndex]
      : null;

  /* 🔥 SPECIAL HANDLING FOR IMAGE TYPE */
if (type === "image") {
  const isCorrect = userAnswer === correctIndex;

  return (
    <>
      {isCorrect ? (
        <>
          <p style={styles.correct}>User Answer:</p>
          {userOption?.image && (
            <img
              src={formatImage(userOption.image)}
              alt="User Option"
              style={styles.analyticsOptionImage}
            />
          )}
        </>
      ) : (
        <>
          <p style={styles.wrong}>User Answer:</p>
          {userOption?.image && (
            <img
              src={formatImage(userOption.image)}
              alt="User Option"
              style={styles.analyticsOptionImage}
            />
          )}

          <p style={styles.correct}>Correct Answer:</p>
          {correctOption?.image && (
            <img
              src={formatImage(correctOption.image)}
              alt="Correct Option"
              style={styles.analyticsOptionImage}
            />
          )}
        </>
      )}
    </>
  );
}

  /* 🔥 NORMAL MCQ (TEXT) */
  const isCorrect = userAnswer === correctIndex;

  const userText = userOption?.text || "";
  const correctText = correctOption?.text || "";

  return isCorrect ? (
    <p style={styles.correct}>
      User Answer: {userText}
    </p>
  ) : (
    <>
      <p style={styles.wrong}>
        User Answer: {userText}
      </p>
      <p style={styles.correct}>
        Correct Answer: {correctText}
      </p>
    </>
  );
})()}

      {/* MSQ TYPE */}
      {type === "msq" && (() => {
        const correctAnswers = q.correctAnswers || [];
        const userArray = userAnswer || [];

        const isCorrect =
          correctAnswers.length === userArray.length &&
          correctAnswers.every(index =>
            userArray.includes(index)
          );

        const userText = Array.isArray(userArray)
          ? userArray
              .map(index =>
                q.options?.[index]?.text || ""
              )
              .join(", ")
          : "Not answered";

        const correctText = correctAnswers
          .map(index =>
            q.options?.[index]?.text || ""
          )
          .join(", ");

        return isCorrect ? (
          <p style={styles.correct}>
            User Answer: {userText}
          </p>
        ) : (
          <>
            <p style={styles.wrong}>
              User Answer: {userText}
            </p>
            <p style={styles.correct}>
              Correct Answer: {correctText}
            </p>
          </>
        );
      })()}
    </div>
  );
})}
  </>
)}

    </DashboardLayout>
  );
}

const styles = {
  title: {
    marginBottom: theme.spacing.lg,
    fontSize: "1.8rem"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(320px,1fr))",
    gap: "28px"
  },

  analyticsCard: {
    padding: "24px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },

  attemptCard: {
    padding: "16px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
analyticsQuestionImage: {
  width: "160px",
  maxHeight: "110px",
  objectFit: "contain",
  borderRadius: "10px",
  marginBottom: "10px",
  display: "block"
},

analyticsOptionImage: {
  width: "120px",
  maxHeight: "90px",
  objectFit: "contain",
  borderRadius: "8px",
  marginBottom: "6px",
  display: "block"
},
  cardHover: {
    transform: "translateY(-6px)",
    boxShadow:
      "0 28px 70px rgba(0,0,0,0.45)"
  },

  backBtn: {
    marginBottom: "16px",
    padding: "8px 14px",
    borderRadius: "10px",
    border:
      "1px solid rgba(255,255,255,0.25)",
    background:
      "rgba(255,255,255,0.08)",
    cursor: "pointer",
    transition: "all 0.25s ease"
  },

  backHover: {
    transform: "translateY(-4px)",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.35)"
  },

  /* rest unchanged */

  analyticsStats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "14px"
  },

  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

statNumberQuestions: {
  fontSize: "1.6rem",
  fontWeight: 800,
    background: "linear-gradient(135deg, #c8f141d4, #16d9e7e3)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
},

statNumberAttempts: {
  fontSize: "1.6rem",
  fontWeight: 800,
  background: "linear-gradient(135deg, #cb4141, #0a0a09)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
},

statNumberAverage: {
  fontSize: "1.6rem",
  fontWeight: 800,
  background: "linear-gradient(135deg, #c7cd27, #10c121)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
},


  statLabel: {
    fontSize: "0.75rem",
    opacity: 0.7
  },

  userPreview: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },

userSection: {
  marginTop: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
},

userLabel: {
  fontSize: "0.8rem",
  opacity: 0.7,
  fontWeight: 500
},

userList: {
  display: "flex",
  flexWrap: "wrap",       // 🔥 allows wrapping automatically
  gap: "8px",
  maxWidth: "100%"        // prevents overflow outside card
},

userBadge: {
  padding: "6px 12px",
  borderRadius: "14px",
  background: "rgba(228, 228, 230, 0.15)",
  border: "1px solid rgba(250, 139, 161, 0.35)",
  color: "#070707",
  fontSize: "0.75rem",
  fontWeight: 500,
  whiteSpace: "nowrap"
},

answerLabel: {
  fontWeight: 600,
  marginTop: "8px",
  marginBottom: "6px",
  color: "#c4b5fd"
},
  moreUsers: {
    fontSize: "0.75rem",
    opacity: 0.7
  },

  summaryRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  },

  summaryCard: {
    padding: "16px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,0.08)"
  },

  attemptUser: {
    fontWeight: 600
  },

  attemptScore: {
    fontWeight: 700,
    color: "#34d399"
  },

  detailCard: {
    padding: "16px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,0.06)",
    marginBottom: "14px"
  },

  questionText: {
    marginBottom: "8px"
  },

  correct: {
    color: "#34d399",
    fontWeight: 600,
    textShadow: "0 0 4px rgba(52, 211, 153, 0.6)"
  },

  wrong: {
    color: "#a70808",
    fontWeight: 600,
    textShadow: "0 0 4px rgba(167, 8, 8, 0.6)"
  },

  scoreHighlight: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    color: "#c4b5fd"
  },

  time: {
    fontSize: "0.85rem",
    opacity: 0.8,
    color: "#000000"
  }
};
