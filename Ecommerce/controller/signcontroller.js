const Sign = require('../model/signmodel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "cdmi";

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await Sign.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully", data });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Sign.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "10d" }
    )

    res.status(200).json({
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
