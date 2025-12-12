const Sign = require('../model/signmodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = "cdmi";

// REGISTER API
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Sign.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed", error });
  }
};


// LOGIN API (ONLY Access Token Return)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Sign.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    // Access Token (10 days)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "10d" }
    );

    res.json({
      message: "Login successful",
      accessToken
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// REFRESH TOKEN API (ONLY CALL WHEN ACCESS TOKEN EXPIRED)
exports.refreshToken = (req, res) => {
  const { oldToken } = req.body;

  if (!oldToken)
    return res.status(401).json({ message: "Old token required" });

  // Decode even if expired
  jwt.verify(oldToken, SECRET_KEY, { ignoreExpiration: true }, (err, userData) => {
    if (!userData)
      return res.status(403).json({ message: "Invalid token" });

    // Check if token is actually expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (userData.exp > currentTime) {
      return res.status(400).json({ message: "Token not expired yet" });
    }

    // Create NEW access token
    const newAccessToken = jwt.sign(
      { id: userData.id, email: userData.email },
      SECRET_KEY,
      { expiresIn: "10d" }
    );

    res.json({
      message: "Token refreshed",
      accessToken: newAccessToken
    });
  });
};
