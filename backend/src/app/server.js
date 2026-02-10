const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const attemptRoutes = require("./routes/attempt.routes");

require("dotenv").config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());

const domainRoutes = require("./routes/domains");
app.use("/domains", domainRoutes);


app.use("/auth", authRoutes);
app.use("/quizzes", quizRoutes);
app.use("/attempts", attemptRoutes);


// --------------------
// Test Route (Health Check)
// --------------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running"
  });
});

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
