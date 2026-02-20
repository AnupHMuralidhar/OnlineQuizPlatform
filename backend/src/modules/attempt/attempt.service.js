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
        return {
          text: opt,
          image: null
        };
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
    quizId: data.quizId,
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

/* 🔥 IMPORTANT UPDATE STARTS HERE */

/* 
   When fetching attempts:
   - Remove attempts if quiz no longer exists
   - Replace stored questions with latest quiz questions
   - Update title if changed
*/
function hydrateAttempt(attempt) {
  const liveQuiz = quizRepository.findById(attempt.quizId);

  // 🔥 If quiz deleted → do not show this attempt
  if (!liveQuiz) return null;

  return {
    ...attempt,
    quizTitle: liveQuiz.title,     // 🔥 reflect updated title
    questions: liveQuiz.questions  // 🔥 reflect updated questions/options/images
  };
}

function getAllAttempts() {
  const attempts = repository.findAll();

  return attempts
    .map(hydrateAttempt)
    .filter(Boolean); // remove deleted quiz attempts
}

function getAttemptsByUser(username) {
  const attempts = repository.findByUser(username);

  return attempts
    .map(hydrateAttempt)
    .filter(Boolean);
}

function getAttemptsByQuiz(quizTitle) {
  const attempts = repository.findByQuiz(quizTitle);

  return attempts
    .map(hydrateAttempt)
    .filter(Boolean);
}

module.exports = {
  saveAttempt,
  getAllAttempts,
  getAttemptsByUser,
  getAttemptsByQuiz
};