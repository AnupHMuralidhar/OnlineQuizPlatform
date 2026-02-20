const repository = require("./attempt.repository");
const quizRepository = require("../quiz/quiz.repository");

/* 🔥 Normalize question structure before saving */
function normalizeQuestions(questions = []) {
  return questions.map(q => ({
    type: q.type || "mcq",
    text: q.text || "",
    image: q.image || null,
    difficulty: q.difficulty || "medium",
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

/* 🔥 Smart Scoring Engine */
function calculateScore(questions, answers) {
  let score = 0;

  questions.forEach((q, index) => {
    const userAnswer = answers[index];
    if (!q.correctAnswers) return;

    if (q.type === "mcq" || q.type === "image") {
      if (
        userAnswer !== undefined &&
        q.correctAnswers.includes(userAnswer)
      ) {
        score++;
      }
    }

    else if (q.type === "msq") {
      if (
        Array.isArray(userAnswer) &&
        JSON.stringify([...userAnswer].sort()) ===
          JSON.stringify([...q.correctAnswers].sort())
      ) {
        score++;
      }
    }

    else if (q.type === "text") {
      if (
        typeof userAnswer === "string" &&
        userAnswer.trim().toLowerCase() ===
          (q.correctAnswers[0] || "").trim().toLowerCase()
      ) {
        score++;
      }
    }
  });

  return score;
}

function saveAttempt(data) {
  const normalizedQuestions = normalizeQuestions(data.questions);

  const calculatedScore = calculateScore(
    normalizedQuestions,
    data.answers
  );

  const finalAttempt = {
    username: data.username,
    quizId: data.quizId ?? null, // 🔥 important
    quizTitle: data.quizTitle,
    questions: normalizedQuestions,
    answers: data.answers,
    score: calculatedScore,
    total: normalizedQuestions.length,
    timestamp: new Date().toISOString()
  };

  repository.save(finalAttempt);
  return finalAttempt;
}

/* 🔥 Hydration Logic */

function hydrateAttempt(attempt) {

  // 🔥 DOMAIN QUIZ (no quizId)
  if (!attempt.quizId) {
    return attempt; // keep stored version as-is
  }

  const liveQuiz = quizRepository.findById(attempt.quizId);

  // 🔥 If creator quiz deleted → remove attempt
  if (!liveQuiz) return null;

  return {
    ...attempt,
    quizTitle: liveQuiz.title,
    questions: liveQuiz.questions,
    score: calculateScore(liveQuiz.questions, attempt.answers),
    total: liveQuiz.questions.length
  };
}

function getAllAttempts() {
  return repository
    .findAll()
    .map(hydrateAttempt)
    .filter(Boolean);
}

function getAttemptsByUser(username) {
  return repository
    .findByUser(username)
    .map(hydrateAttempt)
    .filter(Boolean);
}

function getAttemptsByQuiz(quizTitle) {
  return repository
    .findByQuiz(quizTitle)
    .map(hydrateAttempt)
    .filter(Boolean);
}

module.exports = {
  saveAttempt,
  getAllAttempts,
  getAttemptsByUser,
  getAttemptsByQuiz
};
