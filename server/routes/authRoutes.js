const express = require("express");

const loginLimiter = require("../middleware/loginLimiter");
const otpLimiter = require("../middleware/otpLimiter");
const resetLimiter = require("../middleware/resetLimiter");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  registerUser,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  loginUser,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// ========================================
// REGISTER
// ========================================

router.post("/register", registerUser);

// ========================================
// VERIFY EMAIL
// ========================================

router.post("/verify-email", verifyEmail);

// ========================================
// LOGIN
// ========================================

router.post("/login", loginLimiter, loginUser);

router.post("/google", googleLogin);

// ========================================
// FORGOT PASSWORD
// ========================================

router.post("/forgot-password", otpLimiter, forgotPassword);

// ========================================
// VERIFY RESET OTP
// ========================================

router.post("/verify-reset-otp", resetLimiter, verifyResetOtp);

// ========================================
// RESET PASSWORD
// ========================================

router.post("/reset-password", resetLimiter, resetPassword);

// ========================================
// CURRENT USER
// ========================================

router.get("/me", protect, getMe);

// ========================================
// UPDATE PROFILE
// ========================================

router.put("/profile", protect, updateProfile);

// ========================================
// CHANGE PASSWORD
// ========================================

router.put("/change-password", protect, changePassword);

module.exports = router;