const express = require("express");
const router = express.Router();
const controller = require("./user.controller");

router.get("/", controller.getAllUsers);
router.get("/:username", controller.getUser);
router.put("/:username", controller.updateUser);

module.exports = router;
