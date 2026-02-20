const quizService = require("./quiz.service");

function createQuiz(req, res) {
  const { title, questions, createdBy } = req.body;

  if (!title || !questions || !questions.length || !createdBy) {
    return res.status(400).json({
      message: "Invalid quiz data"
    });
  }

  const quiz = quizService.createQuiz(req.body);
  res.status(201).json(quiz);
}

function getQuizzes(req, res) {
  const quizzes = quizService.getAllQuizzes();
  res.json(quizzes);
}

function getQuizById(req, res) {
  const { id } = req.params;

  const quiz = quizService.getQuizById(id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json(quiz);
}

function getQuizzesByCreator(req, res) {
  const { username } = req.params;
  const quizzes = quizService.getQuizzesByCreator(username);
  res.json(quizzes);
}

/* 🔥 NEW — UPDATE QUIZ */
function updateQuiz(req, res) {
  const { id } = req.params;

  const updated = quizService.updateQuiz(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json(updated);
}

/* 🔥 DELETE QUIZ */
function deleteQuiz(req, res) {
  const { id } = req.params;

  const deleted = quizService.deleteQuiz(id);

  if (!deleted) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json({ message: "Quiz deleted successfully" });
}

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  getQuizzesByCreator,
  updateQuiz,      // 🔥 added
  deleteQuiz
};
