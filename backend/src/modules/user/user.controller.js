const service = require("./user.service");

function getUser(req, res) {
  const { username } = req.params;

  const user = service.getUser(username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
}

function updateUser(req, res) {
  const { username } = req.params;

  const updated = service.updateUser(username, req.body);

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updated);
}

function getAllUsers(req, res) {
  const users = service.getAllUsers();
  res.json(users);
}

module.exports = {
  getUser,
  updateUser,
  getAllUsers
};
