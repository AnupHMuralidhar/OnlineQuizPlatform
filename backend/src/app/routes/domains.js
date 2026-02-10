const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const domainsPath = path.join(
  __dirname,
  "..",
  "..",
  "database",
  "data",
  "domains"
);

console.log("DOMAINS PATH:", domainsPath);


// GET all domains
router.get("/", (req, res) => {
  try {
    const files = fs.readdirSync(domainsPath);

    const domains = files.map((file) => {
      const data = JSON.parse(
        fs.readFileSync(path.join(domainsPath, file), "utf-8")
      );

      return {
        key: file.replace(".json", ""),
        name: data.domain
      };
    });

    res.json(domains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load domains" });
  }
});

// GET domain questions
router.get("/:domain", (req, res) => {
  const domainFile = path.join(
    domainsPath,
    `${req.params.domain}.json`
  );

  if (!fs.existsSync(domainFile)) {
    return res.status(404).json({ error: "Domain not found" });
  }

  const data = JSON.parse(fs.readFileSync(domainFile, "utf-8"));

  const shuffled = [...data.questions].sort(() => Math.random() - 0.5);

  res.json({
    domain: data.domain,
    questions: shuffled
  });
});

module.exports = router;
