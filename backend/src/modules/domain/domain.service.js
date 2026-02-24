const repository = require("./domain.repository");

function getAllDomains() {
  const files = repository.getDomainFiles();

  return files.map(file => {
    const data = repository.readDomainFile(file);

    return {
      key: file.replace(".json", ""),
      name: data.domain,
      difficulty: "easy"
    };
  });
}

function getDomainQuestions(domainKey) {
  const data = repository.readDomain(domainKey);
  if (!data) return null;

  const shuffled = [...data.questions]
    .sort(() => Math.random() - 0.5)
    .map(q => ({
      type: "mcq",
      text: q.text,
      image: null,
      difficulty: "easy",
      options: (q.options || []).map(opt => ({
        text: opt,
        image: null
      })),
      correctAnswers:
        q.correctIndex !== undefined
          ? [q.correctIndex]
          : []
    }));

  return {
    id: domainKey,
    title: data.domain,
    difficulty: "easy",
    createdBy: "system",
    questions: shuffled
  };
}

module.exports = {
  getAllDomains,
  getDomainQuestions
};
