import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function MyQuizzes({
  username,
  onDashboard,
  onCreateQuiz,
  onViewAttempts,
  onLogout
}) {
  const role = "creator";
  const [quizzes, setQuizzes] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [hoveredCta, setHoveredCta] = useState(false);
const [hoveredCancel, setHoveredCancel] = useState(false);
const [hoveredDelete, setHoveredDelete] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/quizzes/creator/${username}`)
      .then(res => res.json())
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, [username]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await fetch(
        `http://localhost:5000/quizzes/${deleteTarget}`,
        { method: "DELETE" }
      );

      setQuizzes(prev =>
        prev.filter(q => q.id !== deleteTarget)
      );

      setDeleteTarget(null);
    } catch {
      alert("Failed to delete quiz.");
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes subtleGradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <DashboardLayout
        sidebar={
          <Sidebar
            username={username}
            role={role}
            onDashboard={onDashboard}
            onCreateQuiz={onCreateQuiz}
            onViewAttempts={onViewAttempts}
            onLogout={onLogout}
          />
        }
      >
        <h2 style={styles.pageTitle}>My Quizzes</h2>

        <div style={styles.section}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Your Created Quizzes</h3>

            {quizzes.length === 0 && (
              <p style={styles.emptyText}>
                You haven't created any quizzes yet.
              </p>
            )}

            <div style={styles.grid}>
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    ...styles.quizCard,
                    ...(hovered === quiz.id && styles.quizCardHover)
                  }}
                  onMouseEnter={() => setHovered(quiz.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={styles.cardGradient} />

                  <div style={styles.cardHeader}>
                    <h4 style={styles.cardTitle}>{quiz.title}</h4>
                  </div>

                  <div style={styles.cardStats}>
                    <div style={styles.statItem}>
                      <div style={styles.statNumber}>
                        {quiz.questions?.length || 0}
                      </div>
                      <div style={styles.statText}>Questions</div>
                    </div>

                    <div style={styles.statDivider} />

                    <div style={styles.difficultyTag}>
                      {quiz.difficulty || "Medium"}
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    {/* 🔥 EDIT BUTTON UPDATED */}
                    <button
                      style={styles.actionBtnPrimary}
                      onClick={() => onCreateQuiz(quiz.id)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.actionBtnSecondary}
                      onClick={() => setDeleteTarget(quiz.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionCard}>
            <div style={styles.createSection}>
              <div style={styles.createCard}>
                <h3 style={styles.createHeading}>
                  Ready to build something new?
                </h3>
                <p style={styles.createSubtext}>
                  Design custom quizzes with MCQs, MSQs, text-based or image-based questions.
                </p>

                <button
                  style={{
                    ...styles.ctaButton,
                    ...(hoveredCta && styles.ctaHover)
                  }}
                  onMouseEnter={() => setHoveredCta(true)}
                  onMouseLeave={() => setHoveredCta(false)}
                  onClick={() => onCreateQuiz()}
                >
                  + Create New Quiz
                </button>

              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {deleteTarget && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>
              Delete this quiz?
            </h3>

            <p style={styles.modalText}>
              This action cannot be undone.
            </p>

<div style={styles.modalActions}>
  <button
    style={{
      ...styles.modalCancel,
      ...(hoveredCancel && styles.modalCancelHover)
    }}
    onMouseEnter={() => setHoveredCancel(true)}
    onMouseLeave={() => setHoveredCancel(false)}
    onClick={() => setDeleteTarget(null)}
  >
    Keep Quiz
  </button>

  <button
    style={{
      ...styles.modalDelete,
      ...(hoveredDelete && styles.modalDeleteHover)
    }}
    onMouseEnter={() => setHoveredDelete(true)}
    onMouseLeave={() => setHoveredDelete(false)}
    onClick={confirmDelete}
  >
    Yes, Delete
  </button>
</div>

          </div>
        </div>
      )}
    </>
  );
}


const styles = {
  pageTitle: {
    fontSize: "2.2rem",
    fontWeight: 700,
    marginBottom: "40px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },

  section: {
    marginBottom: "64px"
  },

  sectionCard: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)"
  },

  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "28px",
    color: "rgba(255, 255, 255, 0.92)",
    letterSpacing: "-0.02em"
  },

  emptyText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "1.1rem",
    textAlign: "center",
    padding: "48px 24px",
    margin: 0
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "28px"
  },

quizCard: {
  position: "relative",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  borderRadius: "20px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "240px",
  display: "flex",
  flexDirection: "column",
  outline: "none"   // ✅ ADD THIS
},


  quizCardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.4)",
    borderColor: "rgba(167, 139, 250, 0.4)"
  },


  cardHeader: {
    padding: "28px 28px 0 28px",
    flex: 1
  },

  cardTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

  cardStats: {
    padding: "0 28px 24px 28px",
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1
  },

  statNumber: {
    fontSize: "2.1rem",
    fontWeight: 800,
    color: "#4877e4",
    lineHeight: 1,
    background: "linear-gradient(135deg, #c8f141d4, #16d9e7e3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },

  statText: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginTop: "2px"
  },

  statDivider: {
    width: "1px",
    height: "32px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "1px"
  },

  difficultyTag: {
    padding: "8px 16px",
  background: "rgba(228, 228, 230, 0.15)",
  border: "1px solid rgba(250, 139, 161, 0.35)",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: 600,
  color: "#070707",
    letterSpacing: "0.3px",
    backdropFilter: "blur(12px)",
    whiteSpace: "nowrap"
  },

  cardActions: {
    padding: "0 28px 28px 28px",
    display: "flex",
    gap: "12px"
  },

actionBtnPrimary: {
  flex: 1,
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(1, 0, 0, 0.08)",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s ease"
},

actionBtnSecondary: {
  flex: 1,
  padding: "12px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#ff4d6d,#ff1e56)",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 15px 40px rgba(255,77,109,0.4)",
  transition: "all 0.25s ease"
},

actionBtnPrimaryHover: {
  transform: "translateY(-4px)",
  background: "rgba(255,255,255,0.18)",
  boxShadow: "0 14px 35px rgba(255,255,255,0.2)"
},

actionBtnSecondaryHover: {
  transform: "translateY(-4px)",
  boxShadow: "0 20px 50px rgba(255,77,109,0.6)"
},


  createSection: {
    display: "flex",
    justifyContent: "center",
    padding: "24px 0"
  },

  createCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "28px",
    padding: "48px 40px",
    textAlign: "center",
    maxWidth: "680px",
    width: "100%",
    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.3)"
  },

  createHeading: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "16px",
    lineHeight: 1.3
  },

  createSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1.05rem",
    lineHeight: 1.6,
    marginBottom: "32px"
  },
ctaHover: {
  transform: "translateY(-6px)",
  boxShadow: "0 30px 70px rgba(249, 115, 22, 0.45)"
},


ctaButton: {
  padding: "16px 40px",
  borderRadius: "20px",
  border: "none",
  background: "linear-gradient(120deg, #3ef50b9d, #beeb1c, #e99d2b, #f5510b)",
  backgroundSize: "400% 400%",
  animation: "subtleGradientFlow 14s ease infinite",
  color: "#080808",
  fontSize: "1.05rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 20px 50px rgba(249, 115, 22, 0.35)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  letterSpacing: "0.5px"
},

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },

  modalCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
    textAlign: "center",
    color: "white"
  },

  modalTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "12px"
  },

  modalText: {
    opacity: 0.75,
    marginBottom: "28px"
  },

  modalActions: {
    display: "flex",
    gap: "14px"
  },

modalCancel: {
  flex: 1,
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.25s ease"
},

modalDelete: {
  flex: 1,
  padding: "12px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#ff4d6d,#ff1e56)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 15px 40px rgba(255,77,109,0.4)",
  transition: "all 0.25s ease"
},

modalCancelHover: {
  transform: "translateY(-4px)",
  background: "rgba(255,255,255,0.18)",
  boxShadow: "0 14px 35px rgba(255,255,255,0.2)"
},

modalDeleteHover: {
  transform: "translateY(-4px)",
  boxShadow: "0 20px 50px rgba(255,77,109,0.6)"
}

};
