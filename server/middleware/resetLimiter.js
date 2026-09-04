const rateLimit = require("express-rate-limit");

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = resetLimiter;
