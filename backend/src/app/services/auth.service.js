const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(
  __dirname,
  "../../database/data/users.json"
);

function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function registerUser(username, password) {
  const users = readUsers();

  const exists = users.find((u) => u.username === username);
  if (exists) {
    return { error: "User already exists" };
  }

  const newUser = {
    id: users.length + 1,
    username,
    password
  };

  users.push(newUser);
  writeUsers(users);

  return { user: newUser };
}

function loginUser(username, password) {
  const users = readUsers();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { error: "Invalid username or password" };
  }

  return { user };
}

module.exports = {
  registerUser,
  loginUser
};
