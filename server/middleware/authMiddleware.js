
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }

  const authHeader = req.headers.authorization;

  if (
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    db.query("SELECT token_version FROM users WHERE id = ? LIMIT 1", [decoded.userId])
      .then(([users]) => {
        if (!users.length || Number(users[0].token_version || 0) !== Number(decoded.tokenVersion || 0)) {
          return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
        req.user = decoded;
        return next();
      })
      .catch((error) => {
        console.error("Token user lookup failed:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
      });
    return;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;
