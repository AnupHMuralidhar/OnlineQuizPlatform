const authService = require("../services/auth.service");

function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const result = authService.registerUser(username, password);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: result.user.id,
      username: result.user.username
    }
  });
}

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const result = authService.loginUser(username, password);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  res.json({
    message: "Login successful",
    user: {
      id: result.user.id,
      username: result.user.username
    }
  });
}

module.exports = {
  register,
  login
};
