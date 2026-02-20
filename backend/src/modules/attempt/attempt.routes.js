const express = require("express");
const router = express.Router();
const controller = require("./attempt.controller");

// Save attempt
router.post("/", controller.saveAttempt);

// Get all attempts (for creator analytics)
router.get("/", controller.getAllAttempts);

// Get attempts by user
router.get("/user/:username", controller.getAttemptsByUser);

// Get attempts by quiz
router.get("/quiz/:quizTitle", controller.getAttemptsByQuiz);

module.exports = router;
