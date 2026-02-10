const quizService = require("../services/quiz.service");

function createQuiz(req, res) {
  const { title, questions } = req.body;

  if (!title || !questions || !questions.length) {
    return res.status(400).json({
      message: "Invalid quiz data"
    });
  }

  const quiz = quizService.createQuiz(title, questions);
  res.status(201).json(quiz);
}

function getQuizzes(req, res) {
  const quizzes = quizService.getAllQuizzes();
  res.json(quizzes);
}

module.exports = {
  createQuiz,
  getQuizzes
};
