const express = require("express");
const loginLimiter = require("../middleware/loginLimiter");
const otpLimiter = require("../middleware/otpLimiter");
const resetLimiter = require("../middleware/resetLimiter");

const router = express.Router();



const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  loginUser,
  googleLogin,
  getMe,
} = require("../controllers/authController");


// ========================================
// REGISTER
// ========================================

router.post(
  "/register",
  registerUser
);


// ========================================
// VERIFY EMAIL
// ========================================

router.post(
  "/verify-email",
  verifyEmail
);


// ========================================
// LOGIN
// ========================================
router.post("/login", loginLimiter, loginUser);

router.post("/google", googleLogin);


// FORGOT PASSWORD
router.post("/forgot-password", otpLimiter, forgotPassword);

// VERIFY RESET OTP
router.post("/verify-reset-otp", resetLimiter, verifyResetOtp);

router.post("/reset-password", resetLimiter, resetPassword);

// ========================================
// CURRENT USER
// ========================================

router.get(
  "/me",
  protect,
  getMe
);


module.exports = router;