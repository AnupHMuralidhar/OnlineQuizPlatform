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

  const shuffled = [...data.questions].sort(
    () => Math.random() - 0.5
  );

  return {
    domain: data.domain,
    questions: shuffled
  };
}

module.exports = {
  getAllDomains,
  getDomainQuestions
};
