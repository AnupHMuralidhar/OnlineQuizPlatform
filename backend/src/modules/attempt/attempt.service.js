const repository = require("./attempt.repository");
const quizRepository = require("../quiz/quiz.repository");
const domainRepository = require("../domain/domain.repository");

/* Normalize questions */
function normalizeQuestions(questions = []) {
  return questions.map(q => ({
    type: q.type || "mcq",
    text: q.text || "",
    image: q.image || null,
    difficulty: (q.difficulty || "easy").toString().toLowerCase(),
    options: (q.options || []).map(opt => {
      if (typeof opt === "string") {
        return { text: opt, image: null };
      }

      return {
        text: opt.text || "",
        image: opt.image || null
      };
    }),
    correctAnswers: q.correctAnswers || []
  }));
}

/* Score */
function calculateScore(questions, answers) {
  let score = 0;

  questions.forEach((q, index) => {
    const userAnswer = answers[index];
    if (!q.correctAnswers) return;

    if (q.type === "mcq" || q.type === "image") {
      if (
        userAnswer !== undefined &&
        q.correctAnswers.includes(userAnswer)
      ) score++;
    }

    else if (q.type === "msq") {
      if (
        Array.isArray(userAnswer) &&
        JSON.stringify([...userAnswer].sort()) ===
        JSON.stringify([...q.correctAnswers].sort())
      ) score++;
    }

    else if (q.type === "text") {
      if (
        typeof userAnswer === "string" &&
        userAnswer.trim().toLowerCase() ===
        (q.correctAnswers[0] || "").trim().toLowerCase()
      ) score++;
    }
  });

  return score;
}

function normalizeDifficulty(value) {
  if (!value) return "easy";
  const normalized = value.toString().toLowerCase();
  if (["easy", "medium", "hard"].includes(normalized)) {
    return normalized;
  }
  return "easy";
}

function saveAttempt(data) {

  let quizTitle = data.quizTitle;
  let difficulty = data.difficulty;

  // 🔥 USER CREATED QUIZ
  if (typeof data.quizId === "number") {
    const liveQuiz = quizRepository.findById(data.quizId);
    if (liveQuiz) {
      quizTitle = liveQuiz.title;
      difficulty = liveQuiz.difficulty;
    }
  }

  // 🔥 DOMAIN QUIZ
  if (typeof data.quizId === "string") {
    const domainData = domainRepository.readDomain(data.quizId);
    if (domainData) {
      quizTitle = domainData.domain;         // ✅ FORCE correct title
      difficulty = domainData.difficulty;    // ✅ FORCE correct difficulty
    }
  }

  const normalizedQuestions = normalizeQuestions(data.questions);

  const calculatedScore = calculateScore(
    normalizedQuestions,
    data.answers
  );

  const finalAttempt = {
    username: data.username,
    quizId: data.quizId ?? null,
    quizTitle: quizTitle || "Untitled Quiz",
    difficulty: normalizeDifficulty(difficulty),
    questions: normalizedQuestions,
    answers: data.answers,
    score: calculatedScore,
    total: normalizedQuestions.length,
    timestamp: new Date().toISOString()
  };

  repository.save(finalAttempt);
  return finalAttempt;
}

/* Hydration */
function hydrateAttempt(attempt) {

  if (typeof attempt.quizId === "number") {
    const liveQuiz = quizRepository.findById(attempt.quizId);
    if (!liveQuiz) return null;

    return {
      ...attempt,
      quizTitle: liveQuiz.title,
      difficulty: normalizeDifficulty(liveQuiz.difficulty),
      questions: liveQuiz.questions,
      score: calculateScore(liveQuiz.questions, attempt.answers),
      total: liveQuiz.questions.length
    };
  }

  if (typeof attempt.quizId === "string") {
    const domainData = domainRepository.readDomain(attempt.quizId);
    if (domainData) {
      return {
        ...attempt,
        quizTitle: domainData.domain,
        difficulty: normalizeDifficulty(domainData.difficulty)
      };
    }
  }

  return attempt;
}

function getAllAttempts() {
  return repository.findAll().map(hydrateAttempt).filter(Boolean);
}

function getAttemptsByUser(username) {
  return repository.findByUser(username).map(hydrateAttempt).filter(Boolean);
}

function getAttemptsByQuiz(quizTitle) {
  return repository.findByQuiz(quizTitle).map(hydrateAttempt).filter(Boolean);
}

module.exports = {
  saveAttempt,
  getAllAttempts,
  getAttemptsByUser,
  getAttemptsByQuiz
};
