const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../../database/dynamic/users.json"
);

function ensureFile() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, "[]");
  }
}

function readUsers() {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeUsers(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function findByUsername(username) {
  return readUsers().find(u => u.username === username);
}

function save(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

function getNextId() {
  const users = readUsers();
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

module.exports = {
  readUsers,
  findByUsername,
  save,
  getNextId
};
