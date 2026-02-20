import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";

export default function CreateQuiz({
  username,
  onDashboard,
  onCreateQuiz,
  onViewAttempts,
  onLogout,
  onBack,
  editingQuizId
}) {
  const role = "creator";

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    createNewQuestion()
  ]);

  const isEditMode = !!editingQuizId;

  function createNewQuestion() {
    return {
      type: "mcq",
      text: "",
      imageFile: null,
      options: ["", ""],
      optionImages: [],
      correctAnswers: []
    };
  }

function transformQuestion(q) {
  const formatPath = (img) => {
    if (!img) return null;

    // If already full URL
    if (img.startsWith("http")) return img;

    // Ensure it starts with /
    const cleanPath = img.startsWith("/")
      ? img
      : `/${img}`;

    return `http://localhost:5000${cleanPath}`;
  };

  return {
    type: q.type || "mcq",
    text: q.text || "",

    // 🔥 FIXED
    imageFile: formatPath(q.image),

    options: (q.options || []).map(opt =>
      typeof opt === "string" ? opt : opt.text || ""
    ),

    // 🔥 FIXED
    optionImages: (q.options || []).map(opt =>
      formatPath(opt.image)
    ),

    correctAnswers: q.correctAnswers || []
  };
}

  useEffect(() => {
    if (!editingQuizId) return;

    fetch(`http://localhost:5000/quizzes/${editingQuizId}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || "");
        setQuestions(
          data.questions
            ? data.questions.map(transformQuestion)
            : [createNewQuestion()]
        );
      })
      .catch(() => alert("Failed to load quiz"));
  }, [editingQuizId]);

  const updateQuestion = (index, field, value) => {
    const copy = [...questions];
    copy[index][field] = value;
    setQuestions(copy);
  };

  const updateOption = (qi, oi, value) => {
    const copy = [...questions];
    copy[qi].options[oi] = value;
    setQuestions(copy);
  };

  const toggleCorrectAnswer = (qi, oi) => {
    const copy = [...questions];

    if (copy[qi].type === "mcq" || copy[qi].type === "image") {
      copy[qi].correctAnswers = [oi];
    } else {
      const correct = copy[qi].correctAnswers;
      if (correct.includes(oi)) {
        copy[qi].correctAnswers = correct.filter(i => i !== oi);
      } else {
        copy[qi].correctAnswers.push(oi);
      }
    }

    setQuestions(copy);
  };

  const addOption = (qi) => {
    const copy = [...questions];
    copy[qi].options.push("");
    setQuestions(copy);
  };

  const removeOption = (qi, oi) => {
    const copy = [...questions];
    copy[qi].options.splice(oi, 1);
    copy[qi].correctAnswers =
      copy[qi].correctAnswers.filter(i => i !== oi);
    setQuestions(copy);
  };

  const deleteQuestion = (qi) => {
    const copy = [...questions];
    copy.splice(qi, 1);
    setQuestions(copy.length ? copy : [createNewQuestion()]);
  };

  const addQuestion = () => {
    setQuestions([...questions, createNewQuestion()]);
  };

  const handleImageUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Quiz title required");

    try {
      const url = isEditMode
        ? `http://localhost:5000/quizzes/${editingQuizId}`
        : "http://localhost:5000/quizzes";

      const method = isEditMode ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          questions,
          createdBy: username
        })
      });

      setTitle("");
      setQuestions([createNewQuestion()]);
      onBack();
    } catch {
      alert("Failed to save quiz");
    }
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
          onLogout={onLogout}
        />
      }
    >
      <h2 style={styles.heading}>
        {isEditMode ? "Edit Quiz" : "Create Quiz"}
      </h2>

      <input
        style={styles.titleInput}
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {questions.map((q, qi) => (
        <div key={qi} style={styles.card}>
          <div style={styles.cardHeader}>
            <h4 style={styles.questionTitle}>
              Question {qi + 1}
            </h4>

            <select
              value={q.type}
              onChange={(e) =>
                updateQuestion(qi, "type", e.target.value)
              }
              style={styles.select}
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="msq">Multiple Select (MSQ)</option>
              <option value="text">Text Answer</option>
              <option value="image">Image Based</option>
            </select>
          </div>

          <input
            style={styles.input}
            placeholder="Enter question text"
            value={q.text}
            onChange={(e) =>
              updateQuestion(qi, "text", e.target.value)
            }
          />

{q.type === "image" && (
  <div style={styles.imageWrapper}>
    <label style={styles.imageUploadBox}>
      {q.imageFile ? (
        <img
          src={q.imageFile}
          alt="Preview"
          style={styles.imagePreview}
        />
      ) : (
        <span style={styles.imageUploadText}>
          Click to upload image
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) =>
          handleImageUpload(
            e.target.files[0],
            (base64) => {
              const copy = [...questions];
              copy[qi].imageFile = base64;
              setQuestions(copy);
            }
          )
        }
      />
    </label>
  </div>
)}

{(q.type === "mcq" ||
  q.type === "msq" ||
  q.type === "image") &&
  q.options.map((opt, oi) => (
    <div
      key={oi}
      style={{
        ...styles.optionRow,
        ...(q.correctAnswers.includes(oi)
          ? styles.optionRowSelected
          : {})
      }}
    >
      {/* 🔥 TOP ROW (TEXT + SELECTOR + DELETE) */}
      <div style={styles.optionTopRow}>
        <input
          style={styles.optionInput}
          placeholder={`Option ${oi + 1}`}
          value={opt}
          onChange={(e) =>
            updateOption(qi, oi, e.target.value)
          }
        />

        <div
          style={{
            ...styles.correctSelector,
            ...(q.correctAnswers.includes(oi)
              ? styles.correctSelected
              : {})
          }}
          onClick={() =>
            toggleCorrectAnswer(qi, oi)
          }
        >
          {q.correctAnswers.includes(oi) && (
            <div style={styles.correctDot} />
          )}
        </div>

        {q.options.length > 2 && (
          <button
            style={styles.removeBtn}
            onClick={() =>
              removeOption(qi, oi)
            }
          >
            ✕
          </button>
        )}
      </div>

      {/* 🔥 IMAGE PREVIEW BELOW TEXT (IMAGE TYPE ONLY) */}
      {q.type === "image" && q.optionImages?.[oi] && (
        <img
          src={q.optionImages[oi]}
          alt="Option Preview"
          style={styles.smallOptionPreview}
        />
      )}

      {/* 🔥 IMAGE UPLOAD BUTTON BELOW TEXT IF NO IMAGE */}
      {q.type === "image" && !q.optionImages?.[oi] && (
        <label style={styles.smallUploadBox}>
          <span style={styles.optionImageText}>
            Upload Image
          </span>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              handleImageUpload(
                e.target.files[0],
                (base64) => {
                  const copy = [...questions];
                  if (!copy[qi].optionImages)
                    copy[qi].optionImages = [];
                  copy[qi].optionImages[oi] = base64;
                  setQuestions(copy);
                }
              )
            }
          />
        </label>
      )}
    </div>
))}

          {(q.type === "mcq" ||
            q.type === "msq" ||
            q.type === "image") && (
            <div style={styles.questionControls}>
              <button
                style={styles.addOptionBtn}
                onClick={() => addOption(qi)}
              >
                Add Option
              </button>

              <button
                style={styles.deleteQuestionBtn}
                onClick={() => deleteQuestion(qi)}
              >
                Delete Question
              </button>
            </div>
          )}
        </div>
      ))}

      <div style={styles.actions}>
        <button style={styles.secondary} onClick={addQuestion}>
          Add Question
        </button>

        <button style={styles.primary} onClick={handleSave}>
          {isEditMode ? "Update Quiz" : "Save Quiz"}
        </button>
      </div>
    </DashboardLayout>
  );
}


const styles = {
  heading: {
    marginBottom: "24px",
    fontSize: "1.9rem",
    fontWeight: "600",
    color: "white"
  },

  questionTitle: {
    color: "white",
    fontWeight: "600"
  },

  titleInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    marginBottom: "30px"
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    color: "white"
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  },

  select: {
  padding: "8px 12px",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  color: "#111827",
  border: "1px solid rgba(255,255,255,0.3)",
  outline: "none",
  fontWeight: "500"
},


  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    marginBottom: "12px"
  },

optionRow: {
  display: "flex",
  flexDirection: "column",   // 🔥 stack vertically
  gap: "8px",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  border: "1px solid transparent"
},
optionRowSelected: {
    border: "1px solid #1be461",
    background: "rgba(91, 51, 236, 0.15)",
    boxShadow: "0 0 15px rgba(30, 255, 0, 0.6)"
},

  optionInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "white"
  },

optionTopRow: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%"
},

smallOptionPreview: {
  width: "160px",
  maxHeight: "120px",
  objectFit: "contain",
  borderRadius: "8px"
},

smallUploadBox: {
  width: "160px",
  height: "80px",
  borderRadius: "8px",
  border: "1px dashed rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: "rgba(255,255,255,0.05)"
},

  imageWrapper: {
  marginBottom: "16px",
  display: "flex",
  justifyContent: "center"
},

imagePreview: {
  maxWidth: "220px",
  maxHeight: "140px",
  objectFit: "contain",
  borderRadius: "10px",
  display: "block",
  margin: "0 auto"
},

optionImageUpload: {
  width: "55px",
  height: "55px",
  borderRadius: "10px",
  border: "1px dashed rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden",
  background: "rgba(255,255,255,0.06)"
},

optionImagePreview: {
  width: "100%",
  height: "100%",
  objectFit: "cover"
},

optionImageText: {
  fontSize: "18px",
  opacity: 0.7
},


  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "16px"
  },

  textNote: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)"
  },

  actions: {
    display: "flex",
    gap: "16px",
    marginTop: "30px"
  },

  primary: {
    padding: "12px 20px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
  },

  secondary: {
    padding: "12px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer"
  },

  correctSelector: {
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  border: "2px solid rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease"
},

correctSelected: {
  border: "2px solid #ea1f0491",
  boxShadow: "0 0 12px rgba(12, 220, 43, 0.6)"
},

correctDot: {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#a78bfa,#f472b6)"
},

imageUploadBox: {
  border: "2px dashed rgba(255,255,255,0.3)",
  borderRadius: "14px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  background: "rgba(255,255,255,0.05)",
  transition: "all 0.2s ease",
  marginBottom: "12px"
},

imageUploadText: {
  opacity: 0.7
},

imagePreview: {
  maxWidth: "100%",
  borderRadius: "12px"
},

questionControls: {
  display: "flex",
  gap: "12px",
  marginTop: "10px"
},

  addOptionBtn: {
    marginTop: "8px",
    padding: "8px 12px",
    borderRadius: "10px",
  border: "1px solid rgba(9, 199, 113, 0.81)",
  background: "rgba(14, 148, 43, 0.5)",
  color: "#000000",
    cursor: "pointer"
  },

deleteQuestionBtn: {
    marginTop: "8px",
    padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(248,113,113,0.5)",
  background: "rgba(248,113,113,0.15)",
  color: "#000000",
  cursor: "pointer"
}
};
