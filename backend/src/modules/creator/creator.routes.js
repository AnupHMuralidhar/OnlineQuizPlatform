const express = require("express");
const router = express.Router();
const controller = require("./creator.controller");

// Get quizzes created by user
router.get("/:username/quizzes", controller.getCreatorQuizzes);

// Update quiz
router.put("/quizzes/:id", controller.updateQuiz);

// Delete quiz
router.delete("/quizzes/:id", controller.deleteQuiz);

// Get analytics for creator
router.get("/:username/analytics", controller.getAnalytics);

module.exports = router;
