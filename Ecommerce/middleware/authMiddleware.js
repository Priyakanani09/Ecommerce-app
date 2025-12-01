const jwt = require('jsonwebtoken');


const SECRET_KEY = "cdmi"; // Use .env in production


// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  // Get token from headers
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Token missing" });

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => { //The secret key used to sign and verify JWT tokens.
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }
    // Save user info in request object
    req.user = decoded;
    next(); // Proceed to the next route
  });
};

module.exports = authenticateToken;