const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../../database/dynamic/attempts.json"
);

function readAttempts() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeAttempts(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function save(attempt) {
  const attempts = readAttempts();
  attempts.push(attempt);
  writeAttempts(attempts);
}

function findAll() {
  return readAttempts();
}

function findByUser(username) {
  return readAttempts().filter(a => a.username === username);
}

function findByQuiz(quizTitle) {
  return readAttempts().filter(a => a.quizTitle === quizTitle);
}

module.exports = {
  save,
  findAll,
  findByUser,
  findByQuiz
};
