
const jwt = require("jsonwebtoken");

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

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;
