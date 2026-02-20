import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function AttemptQuiz({
  username,
  onDashboard,
  onAttemptQuiz,
  onViewAttempts,
  onLogout,
  onBack
}) {
  const role = "attempter";

  const [domains, setDomains] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const getQuestionType = (q) => {
    if (q.type) return q.type;

    if (q.correctIndex !== undefined) return "mcq";
    if (Array.isArray(q.correctAnswers)) {
      if (q.correctAnswers.length > 1) return "msq";
      return "mcq";
    }

    return "mcq";
  };

  const formatImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    const clean = img.startsWith("/") ? img : `/${img}`;
    return `http://localhost:5000${clean}`;
  };

  const calculateScore = () => {
    let correct = 0;

    selectedSource.questions.forEach((q, i) => {
      const type = getQuestionType(q);
      const userAnswer = answers[i];

      if (type === "mcq" || type === "image") {
       const correctIndex =
  q.correctIndex !== undefined
    ? q.correctIndex
    : Array.isArray(q.correctAnswers)
      ? q.correctAnswers[0]
      : undefined;

        if (userAnswer === correctIndex) correct++;
      }

      else if (type === "msq") {
        const correctAnswers = q.correctAnswers || [];
        if (
          Array.isArray(userAnswer) &&
          correctAnswers.length === userAnswer.length &&
          correctAnswers.every(index =>
            userAnswer.includes(index)
          )
        ) {
          correct++;
        }
      }
    });

    return correct;
  };

  const submitQuiz = async () => {
    const localScore = calculateScore();
    setScore(localScore);

    try {
      await fetch("http://localhost:5000/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          quizId: selectedSource.id,
          quizTitle: selectedSource.title,
          questions: selectedSource.questions,
          answers
        })
      });
    } catch {
      console.log("Attempt save failed");
    }
  };

  const getDomainImage = (key) => {
    if (key === "aptitude")
      return "http://localhost:5000/images/static/domain_imgs/domain_1.png";
    if (key === "cs")
      return "http://localhost:5000/images/static/domain_imgs/domain_2.png";
    if (key === "gk")
      return "http://localhost:5000/images/static/domain_imgs/domain_3.png";
    return "";
  };

  const userQuizImage =
    "http://localhost:5000/images/dynamic/user_imgs/userimg.png";

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

      {!selectedSource && (
        <>
          <h2 style={styles.title}>Select a Quiz</h2>

          <h3 style={styles.sectionTitle}>Predefined Domains</h3>
          <div style={styles.grid}>
            {domains.map((d) => (
              <div
                key={d.key}
                style={{
                  ...styles.card,
                  ...(hoveredCard === `domain-${d.key}` && styles.cardHover)
                }}
                onMouseEnter={() => setHoveredCard(`domain-${d.key}`)}
                onMouseLeave={() => setHoveredCard(null)}
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
                <img
                  src={getDomainImage(d.key)}
                  alt={d.name}
                  style={styles.image}
                />
                <p style={styles.cardTitle}>{d.name}</p>
              </div>
            ))}
          </div>

          <h3 style={styles.sectionTitle}>User Created Quizzes</h3>
          <div style={styles.grid}>
            {quizzes.map((q) => (
              <div
                key={q.id}
                style={{
                  ...styles.card,
                  ...(hoveredCard === `quiz-${q.id}` && styles.cardHover)
                }}
                onMouseEnter={() => setHoveredCard(`quiz-${q.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  setSelectedSource(q);
                  setAnswers({});
                  setScore(null);
                }}
              >
                <img
                  src={userQuizImage}
                  alt="User Quiz"
                  style={styles.image}
                />
                <p style={styles.cardTitle}>{q.title}</p>
                <p style={styles.creatorText}>
                  Created by: {q.createdBy}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

{selectedSource && score === null && (
  <>
    <h2 style={styles.title}>{selectedSource.title}</h2>

    {selectedSource.questions.map((q, qi) => {
      const type = getQuestionType(q);

      return (
        <div key={qi} style={styles.questionCard}>
          <p style={styles.questionText}>
            {qi + 1}. {q.text}
          </p>

          {q.image && (
            <>
              <div style={styles.imageLabel}>Question Image</div>
              <img
                src={formatImage(q.image)}
                alt="Question"
                style={styles.questionImage}
              />
            </>
          )}

          {(type === "mcq" || type === "image") && (
            <>
              <div style={styles.optionsHeader}>
  <div style={styles.optionsLabel}>Options</div>
  <div style={styles.questionTypeBadge}>
    {type.toUpperCase()}
  </div>
</div>
              <div style={styles.optionsWrapper}>
                {q.options.map((opt, oi) => {
                  const optionText =
                    typeof opt === "object" ? opt.text : opt;
                  const optionImage =
                    typeof opt === "object" ? opt.image : null;

                  const isSelected = answers[qi] === oi;

                  return (
                    <div
                      key={oi}
                      onClick={() =>
                        setAnswers({ ...answers, [qi]: oi })
                      }
                      style={{
                        ...styles.optionCard,
                        ...(isSelected && styles.optionSelected)
                      }}
                    >
                      {optionText}

                      {optionImage && (
                        <img
                          src={formatImage(optionImage)}
                          alt="Option"
                          style={styles.optionImage}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {type === "msq" && (
            <>
              <div style={styles.optionsHeader}>
  <div style={styles.optionsLabel}>Options</div>
  <div style={styles.questionTypeBadge}>
    {type.toUpperCase()}
  </div>
</div>
              <div style={styles.optionsWrapper}>
                {q.options.map((opt, oi) => {
                  const optionText =
                    typeof opt === "object" ? opt.text : opt;
                  const optionImage =
                    typeof opt === "object" ? opt.image : null;

                  const selectedArray = answers[qi] || [];
                  const isSelected = selectedArray.includes(oi);

                  return (
                    <div
                      key={oi}
                      onClick={() => {
                        let updated = [...selectedArray];

                        if (isSelected) {
                          updated = updated.filter(i => i !== oi);
                        } else {
                          updated.push(oi);
                        }

                        setAnswers({
                          ...answers,
                          [qi]: updated
                        });
                      }}
                      style={{
                        ...styles.optionCard,
                        ...(isSelected && styles.optionSelected)
                      }}
                    >
                      {optionText}

                      {optionImage && (
                        <img
                          src={formatImage(optionImage)}
                          alt="Option"
                          style={styles.optionImage}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

{type === "text" && (
  <>
    <div style={styles.optionsHeader}>
      <div />
      <div style={styles.questionTypeBadge}>
        TEXT
      </div>
    </div>

    <input
      type="text"
      placeholder="Enter your answer"
      value={answers[qi] || ""}
      onChange={(e) =>
        setAnswers({
          ...answers,
          [qi]: e.target.value
        })
      }
      style={{
        padding: "12px",
        borderRadius: "12px",
        border:
          "1px solid rgba(255,255,255,0.25)",
        background:
          "rgba(255,255,255,0.08)",
        color: "white",
        width: "100%",
        marginTop: "10px"
      }}
    />
  </>
)}
        </div>
      );
    })}

    <button style={styles.primary} onClick={submitQuiz}>
      Submit Quiz
    </button>
  </>
)}

{selectedSource && score !== null && (
  <>
    <h2>Quiz Completed</h2>

    <p style={styles.score}>
      Your Score: {score}/
      {
        selectedSource.questions.filter(
          q => getQuestionType(q) !== "text"
        ).length
      }
    </p>

    <p style={{ opacity: 0.8, marginTop: "8px" }}>
      * Text-based questions are not auto-scored
    </p>

    <button
      style={styles.primary}
      onClick={onBack}
    >
      Back to Dashboard
    </button>
  </>
)}

    </DashboardLayout>
  );
}

const styles = {
  title: {
    marginBottom: "24px"
  },
  sectionTitle: {
    marginTop: "32px",
    marginBottom: "16px",
    fontWeight: "600",
    fontSize: "1.1rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "20px"
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
  },

cardHover: {
  transform: "translateY(-6px)",
  boxShadow: "0 28px 65px rgba(0,0,0,0.35)"
},

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover"
  },
  cardTitle: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "600"
  },
  creatorText: {
    fontSize: "0.8rem",
    textAlign: "center",
    paddingBottom: "12px",
    opacity: 0.8
  },
  questionCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },
  questionText: {
    marginBottom: "16px",
    fontWeight: "600",
    fontSize: "1rem"
  },

  questionImage: {
  width: "100%",
  maxHeight: "280px",
  objectFit: "contain",
  marginBottom: "16px",
  borderRadius: "12px"
},

optionImage: {
  width: "100%",
  maxHeight: "200px",
  objectFit: "contain",
  marginTop: "10px",
  borderRadius: "10px"
},
  optionsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

imageLabel: {
  fontSize: "0.75rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: "6px",
  fontWeight: "600"
},

optionsLabel: {
  fontSize: "0.75rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: "10px",
  marginTop: "10px",
  fontWeight: "600"
},

  optionCard: {
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    transition: "all 0.25s ease"
  },
  optionSelected: {
    border: "1px solid #1be461",
    background: "rgba(91, 51, 236, 0.15)",
    boxShadow: "0 0 15px rgba(30, 255, 0, 0.6)"
  },
  primary: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
    color: "#fff",
    cursor: "pointer"
  },
  score: {
    fontSize: "1.2rem",
    marginTop: "16px"
  },
  optionsHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  marginTop: "10px"
},

questionTypeBadge: {
  fontSize: "0.75rem",
  letterSpacing: "1px",
  padding: "4px 10px",
  borderRadius: "20px",
  background: "rgba(32, 17, 79, 0.2)",
  border: "1px solid rgba(167, 139, 250, 0.6)",
  color: "#d2c3c3",
  fontWeight: "600"
}
};
