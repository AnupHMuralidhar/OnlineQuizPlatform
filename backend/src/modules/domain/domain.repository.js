const fs = require("fs");
const path = require("path");

const DOMAIN_PATH = path.join(
  __dirname,
  "../../database/static/domains"
);

function getDomainFiles() {
  return fs.readdirSync(DOMAIN_PATH);
}

function readDomainFile(file) {
  const filePath = path.join(DOMAIN_PATH, file);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function readDomain(domainKey) {
  const filePath = path.join(
    DOMAIN_PATH,
    `${domainKey}.json`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

module.exports = {
  getDomainFiles,
  readDomainFile,
  readDomain
};
