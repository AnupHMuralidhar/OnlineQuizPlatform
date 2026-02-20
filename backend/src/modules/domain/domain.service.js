const repository = require("./domain.repository");

function getAllDomains() {
  const files = repository.getDomainFiles();

  return files.map(file => {
    const data = repository.readDomainFile(file);

    return {
      key: file.replace(".json", ""),
      name: data.domain
    };
  });
}

function getDomainQuestions(domainKey) {
  const data = repository.readDomain(domainKey);

  if (!data) return null;

  const shuffled = [...data.questions]
    .sort(() => Math.random() - 0.5)
    .map(q => ({
      type: "mcq",                      // 🔥 ensure type exists
      text: q.text,
      image: null,
      difficulty: "medium",

      options: (q.options || []).map(opt => ({
        text: opt,
        image: null
      })),

      // 🔥 convert correctIndex to correctAnswers
      correctAnswers:
        q.correctIndex !== undefined
          ? [q.correctIndex]
          : []
    }));

  return {
    domain: data.domain,
    questions: shuffled
  };
}

module.exports = {
  getAllDomains,
  getDomainQuestions
};
