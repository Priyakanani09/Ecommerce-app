const jwt = require("jsonwebtoken");
const SECRET_KEY = "cdmi";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

   if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;