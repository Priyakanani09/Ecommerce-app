const Sign = require('../model/signmodel');

exports.register = async (req, res) => {
  try 
  {
    const { name, email, password } = req.body;
    const data = await Sign.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully", data });
  }
   catch (error) {
    console.log(error);
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
    res.status(200).json({ message: "Login successful", user });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};