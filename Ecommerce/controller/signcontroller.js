// controller/signcontroller.js
const Sign = require('../model/signmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "cdmi";

// REGISTER USER (for admin, you can manually set role: 'admin')
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await Sign.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Sign.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// LOGIN API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Sign.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '10d' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};


// REFRESH TOKEN
exports.refreshToken = (req, res) => {
  const { oldToken } = req.body;

  if (!oldToken)
    return res.status(401).json({ message: "Old token required" });

  jwt.verify(oldToken, SECRET_KEY, { ignoreExpiration: true }, (err, userData) => {
    if (!userData)
      return res.status(403).json({ message: "Invalid token" });

    const currentTime = Math.floor(Date.now() / 1000);
    if (userData.exp > currentTime) {
      return res.status(400).json({ message: "Token not expired yet" });
    }

    const newAccessToken = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role
      },
      SECRET_KEY,
      { expiresIn: "10d" }
    );

    res.json({
      message: "Token refreshed",
      token: newAccessToken
    });
  });
};
