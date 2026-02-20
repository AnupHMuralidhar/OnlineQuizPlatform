const service = require("./attempt.service");

function saveAttempt(req, res) {
  const saved = service.saveAttempt(req.body);

  res.status(201).json({
    message: "Attempt saved",
    data: saved
  });
}

function getAllAttempts(req, res) {
  const attempts = service.getAllAttempts();
  res.json(attempts);
}

function getAttemptsByUser(req, res) {
  const { username } = req.params;
  const attempts = service.getAttemptsByUser(username);
  res.json(attempts);
}

function getAttemptsByQuiz(req, res) {
  const { quizTitle } = req.params;
  const attempts = service.getAttemptsByQuiz(quizTitle);
  res.json(attempts);
}

module.exports = {
  saveAttempt,
  getAllAttempts,
  getAttemptsByUser,
  getAttemptsByQuiz
};
