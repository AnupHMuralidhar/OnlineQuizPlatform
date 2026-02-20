const repository = require("./creator.repository");

function getCreatorQuizzes(username) {
  return repository.findQuizzesByCreator(username);
}

function updateCreatorQuiz(id, data, username) {
  const quiz = repository.findQuizById(id);

  if (!quiz) {
    return { error: "Quiz not found" };
  }

  if (quiz.createdBy !== username) {
    return { error: "Unauthorized" };
  }

  const updated = repository.updateQuiz(id, data);
  return { quiz: updated };
}

function deleteCreatorQuiz(id, username) {
  const quiz = repository.findQuizById(id);

  if (!quiz) {
    return { error: "Quiz not found" };
  }

  if (quiz.createdBy !== username) {
    return { error: "Unauthorized" };
  }

  repository.deleteQuiz(id);
  return { success: true };
}

function getCreatorAnalytics(username) {
  const attempts = repository.getAttemptsForCreator(username);

  return attempts;
}

module.exports = {
  getCreatorQuizzes,
  updateCreatorQuiz,
  deleteCreatorQuiz,
  getCreatorAnalytics
};
