const service = require("./creator.service");

function getCreatorQuizzes(req, res) {
  const { username } = req.params;

  const quizzes = service.getCreatorQuizzes(username);
  res.json(quizzes);
}

function updateQuiz(req, res) {
  const { id } = req.params;
  const { username } = req.body;

  const result = service.updateCreatorQuiz(id, req.body, username);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json(result.quiz);
}

function deleteQuiz(req, res) {
  const { id } = req.params;
  const { username } = req.body;

  const result = service.deleteCreatorQuiz(id, username);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json({ message: "Quiz deleted successfully" });
}

function getAnalytics(req, res) {
  const { username } = req.params;

  const analytics = service.getCreatorAnalytics(username);
  res.json(analytics);
}

module.exports = {
  getCreatorQuizzes,
  updateQuiz,
  deleteQuiz,
  getAnalytics
};
