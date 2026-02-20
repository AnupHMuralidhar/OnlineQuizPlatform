const repository = require("./user.repository");

function getUser(username) {
  const user = repository.findByUsername(username);

  if (!user) return null;

  // Hide password
  const { password, ...safeUser } = user;
  return safeUser;
}

function updateUser(username, data) {
  const updated = repository.updateUser(username, data);

  if (!updated) return null;

  const { password, ...safeUser } = updated;
  return safeUser;
}

function getAllUsers() {
  return repository.readUsers().map(u => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
}

module.exports = {
  getUser,
  updateUser,
  getAllUsers
};
