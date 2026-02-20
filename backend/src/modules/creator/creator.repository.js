const fs = require("fs");
const path = require("path");

const QUIZ_FILE = path.join(
  __dirname,
  "../../database/dynamic/quizzes.json"
);

const ATTEMPT_FILE = path.join(
  __dirname,
  "../../database/dynamic/attempts.json"
);

function readQuizzes() {
  if (!fs.existsSync(QUIZ_FILE)) {
    fs.mkdirSync(path.dirname(QUIZ_FILE), { recursive: true });
    fs.writeFileSync(QUIZ_FILE, "[]");
  }

  return JSON.parse(fs.readFileSync(QUIZ_FILE, "utf-8"));
}

function writeQuizzes(data) {
  fs.writeFileSync(QUIZ_FILE, JSON.stringify(data, null, 2));
}

function readAttempts() {
  if (!fs.existsSync(ATTEMPT_FILE)) {
    fs.mkdirSync(path.dirname(ATTEMPT_FILE), { recursive: true });
    fs.writeFileSync(ATTEMPT_FILE, "[]");
  }

  return JSON.parse(fs.readFileSync(ATTEMPT_FILE, "utf-8"));
}

function findQuizzesByCreator(username) {
  return readQuizzes().filter(q => q.createdBy === username);
}

function findQuizById(id) {
  return readQuizzes().find(q => q.id === parseInt(id));
}

function updateQuiz(id, updatedData) {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(q => q.id === parseInt(id));

  if (index === -1) return null;

  quizzes[index] = { ...quizzes[index], ...updatedData };
  writeQuizzes(quizzes);

  return quizzes[index];
}

function deleteQuiz(id) {
  const quizzes = readQuizzes();
  const filtered = quizzes.filter(q => q.id !== parseInt(id));
  writeQuizzes(filtered);
}

function getAttemptsForCreator(username) {
  const quizzes = findQuizzesByCreator(username);
  const attempts = readAttempts();

  const quizTitles = quizzes.map(q => q.title);

  return attempts.filter(a =>
    quizTitles.includes(a.quizTitle)
  );
}

module.exports = {
  findQuizzesByCreator,
  findQuizById,
  updateQuiz,
  deleteQuiz,
  getAttemptsForCreator
};
