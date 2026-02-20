const express = require("express");
const cors = require("cors");
const path = require("path");

// 🔥 Modular Routes
const authRoutes = require("./modules/auth/auth.routes");
const quizRoutes = require("./modules/quiz/quiz.routes");
const attemptRoutes = require("./modules/attempt/attempt.routes");
const creatorRoutes = require("./modules/creator/creator.routes");
const domainRoutes = require("./modules/domain/domain.routes");
const userRoutes = require("./modules/user/user.routes");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --------------------
// Static Files (Domain Images)
// --------------------
app.use(
  "/images",
  express.static(
    path.join(__dirname, "database")
  )
);

// 🔥 NEW — Static Files for Quiz Images
app.use(
  "/quizimgs",
  express.static(
    path.join(__dirname, "database/dynamic/quizimgs")
  )
);

// --------------------
// Routes
// --------------------
app.use("/auth", authRoutes);
app.use("/quizzes", quizRoutes);
app.use("/attempts", attemptRoutes);
app.use("/creator", creatorRoutes);
app.use("/domains", domainRoutes);
app.use("/users", userRoutes);

// --------------------
// Health Check
// --------------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running"
  });
});

module.exports = app;