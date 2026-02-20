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

function updateUser(username, updatedData) {
  const users = readUsers();
  const index = users.findIndex(u => u.username === username);

  if (index === -1) return null;

  users[index] = { ...users[index], ...updatedData };
  writeUsers(users);

  return users[index];
}

module.exports = {
  readUsers,
  findByUsername,
  updateUser
};
