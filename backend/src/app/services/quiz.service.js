const fs = require("fs");
const path = require("path");

const QUIZ_FILE = path.join(
  __dirname,
  "../../database/data/quizzes.json"
);

function readQuizzes() {
  const data = fs.readFileSync(QUIZ_FILE, "utf-8");
  return JSON.parse(data);
}

function writeQuizzes(quizzes) {
  fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizzes, null, 2));
}

function createQuiz(title, questions) {
  const quizzes = readQuizzes();

  const newQuiz = {
    id: quizzes.length + 1,
    title,
    questions
  };

  quizzes.push(newQuiz);
  writeQuizzes(quizzes);

  return newQuiz;
}

function getAllQuizzes() {
  return readQuizzes();
}

module.exports = {
  createQuiz,
  getAllQuizzes
};
