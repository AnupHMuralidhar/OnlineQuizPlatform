const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../../database/data/attempts.json"
);

function readAttempts() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeAttempts(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function saveAttempt(attempt) {
  const attempts = readAttempts();
  attempts.push(attempt);
  writeAttempts(attempts);
}

function getAttemptsByUser(username) {
  return readAttempts().filter(
    (a) => a.username === username
  );
}

module.exports = {
  saveAttempt,
  getAttemptsByUser
};
