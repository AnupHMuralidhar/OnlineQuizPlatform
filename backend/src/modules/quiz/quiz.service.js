const repository = require("./quiz.repository");
const fs = require("fs");
const path = require("path");

const IMAGE_DIR = path.join(
  __dirname,
  "../../database/dynamic/quizimgs"
);

function ensureImageDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
}

function sanitizeTitle(title) {
  return title.replace(/[^a-zA-Z0-9]/g, "_");
}

function saveBase64Image(base64, filename) {
  if (!base64 || !base64.startsWith("data:image")) return null;

  ensureImageDir();

  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");

  const finalName = `${filename}.${ext}`;
  const filePath = path.join(IMAGE_DIR, finalName);

  fs.writeFileSync(filePath, buffer);

  return `quizimgs/${finalName}`;
}

/* 🔥 Normalize Question Before Saving */
function normalizeQuestion(q, quizTitle, questionIndex) {
  const safeTitle = sanitizeTitle(quizTitle);
  const qNumber = questionIndex + 1;

  // Save Question Image
  let savedQuestionImage = null;
  if (q.imageFile && q.imageFile.startsWith("data:image")) {
    savedQuestionImage = saveBase64Image(
      q.imageFile,
      `${safeTitle}_q${qNumber}`
    );
  } else {
    savedQuestionImage = q.imageFile || null;
  }

  const options = (q.options || []).map((opt, index) => {
    let optionImage = null;

    if (
      q.optionImages &&
      q.optionImages[index] &&
      q.optionImages[index].startsWith("data:image")
    ) {
      optionImage = saveBase64Image(
        q.optionImages[index],
        `${safeTitle}_q${qNumber}_opt${index + 1}`
      );
    } else if (q.optionImages && q.optionImages[index]) {
      optionImage = q.optionImages[index];
    }

    return {
      text: typeof opt === "string" ? opt : opt?.text || "",
      image: optionImage || null
    };
  });

  return {
    type: q.type || "mcq",
    text: q.text || "",
    image: savedQuestionImage,
    difficulty: q.difficulty || "medium",
    options,
    correctAnswers: Array.isArray(q.correctAnswers)
      ? q.correctAnswers
      : []
  };
}

function createQuiz(data) {
  const { title, questions, difficulty, createdBy } = data;

  const newQuiz = {
    id: repository.getNextId(),
    title,
    difficulty: difficulty || "medium",
    createdBy,
    createdAt: new Date().toISOString(),
    questions: questions.map((q, index) =>
      normalizeQuestion(q, title, index)
    )
  };

  repository.save(newQuiz);
  return newQuiz;
}

function getAllQuizzes() {
  return repository.findAll();
}

function getQuizById(id) {
  return repository.findById(id);
}

function getQuizzesByCreator(username) {
  return repository.findByCreator(username);
}

function updateQuiz(id, updatedData) {
  if (updatedData.questions) {
    const existing = repository.findById(id);
    const quizTitle = updatedData.title || existing.title;

    updatedData.questions = updatedData.questions.map(
      (q, index) =>
        normalizeQuestion(q, quizTitle, index)
    );
  }

  return repository.updateQuiz(id, updatedData);
}

function deleteQuiz(id) {
  return repository.deleteQuiz(id);
}

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizzesByCreator,
  updateQuiz,
  deleteQuiz
};