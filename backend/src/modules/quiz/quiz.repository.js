const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../../database/dynamic/quizzes.json"
);

function ensureFile() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, "[]");
  }
}

function readQuizzes() {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeQuizzes(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function save(quiz) {
  const quizzes = readQuizzes();
  quizzes.push(quiz);
  writeQuizzes(quizzes);
}

function findAll() {
  return readQuizzes();
}

function findById(id) {
  return readQuizzes().find(q => q.id === parseInt(id));
}

function findByCreator(username) {
  return readQuizzes().filter(q => q.createdBy === username);
}

function getNextId() {
  const quizzes = readQuizzes();
  return quizzes.length
    ? Math.max(...quizzes.map(q => q.id)) + 1
    : 1;
}

// 🔥 Reserved
function updateQuiz(id, updatedQuiz) {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(q => q.id === parseInt(id));

  if (index === -1) return null;

  quizzes[index] = { ...quizzes[index], ...updatedQuiz };
  writeQuizzes(quizzes);
  return quizzes[index];
}

// 🔥 UPDATED DELETE
function deleteQuiz(id) {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(q => q.id === parseInt(id));

  if (index === -1) return false;

  quizzes.splice(index, 1);
  writeQuizzes(quizzes);
  return true;
}

module.exports = {
  save,
  findAll,
  findById,
  findByCreator,
  getNextId,
  updateQuiz,
  deleteQuiz
};
