const express = require("express");
const domainService = require("./domain.service");

const router = express.Router();

// GET all domains
router.get("/", (req, res) => {
  try {
    const domains = domainService.getAllDomains();
    res.json(domains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load domains" });
  }
});

// GET domain questions
router.get("/:domain", (req, res) => {
  try {
    const result = domainService.getDomainQuestions(req.params.domain);

    if (!result) {
      return res.status(404).json({ error: "Domain not found" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load domain" });
  }
});

module.exports = router;
