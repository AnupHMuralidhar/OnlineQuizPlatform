const express = require("express");
const router = express.Router();
const controller = require("../controllers/attempt.controller");

router.post("/", controller.saveAttempt);
router.get("/:username", controller.getAttempts);

module.exports = router;
