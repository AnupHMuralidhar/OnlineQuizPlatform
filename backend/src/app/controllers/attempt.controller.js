const service = require("../services/attempt.service");

function saveAttempt(req, res) {
  const attempt = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  service.saveAttempt(attempt);
  res.status(201).json({ message: "Attempt saved" });
}

function getAttempts(req, res) {
  const { username } = req.params;
  const attempts = service.getAttemptsByUser(username);
  res.json(attempts);
}

module.exports = {
  saveAttempt,
  getAttempts
};
