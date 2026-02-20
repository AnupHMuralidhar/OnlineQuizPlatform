const repository = require("./auth.repository");

function registerUser(username, password, role) {
  if (!["creator", "attempter"].includes(role)) {
    return { error: "Invalid role" };
  }

  const exists = repository.findByUsername(username);
  if (exists) {
    return { error: "User already exists" };
  }

  const newUser = {
    id: repository.getNextId(),
    username,
    password,
    role,
    createdAt: new Date().toISOString()
  };

  repository.save(newUser);

  return { user: newUser };
}

function loginUser(username, password) {
  const user = repository.findByUsername(username);

  if (!user || user.password !== password) {
    return { error: "Invalid username or password" };
  }

  return { user };
}

module.exports = {
  registerUser,
  loginUser
};
