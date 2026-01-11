const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization; // ✅ standard

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { verifyToken };
