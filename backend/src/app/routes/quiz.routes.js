const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");

router.post("/", quizController.createQuiz);
router.get("/", quizController.getQuizzes);

module.exports = router;
