const express = require("express");
const router = express.Router();
const controller = require("./quiz.controller");

router.post("/", controller.createQuiz);

router.get("/", controller.getQuizzes);

// IMPORTANT: before /:id
router.get("/creator/:username", controller.getQuizzesByCreator);

router.get("/:id", controller.getQuizById);

/* 🔥 NEW UPDATE ROUTE */
router.put("/:id", controller.updateQuiz);

/* 🔥 DELETE ROUTE */
router.delete("/:id", controller.deleteQuiz);

module.exports = router;
