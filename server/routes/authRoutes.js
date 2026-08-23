const express = require("express");

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

router.post(
  "/login",
  loginUser
);

router.post("/google", googleLogin);


// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);

// VERIFY RESET OTP
router.post(
  "/verify-reset-otp",
  verifyResetOtp
);

// RESET PASSWORD
router.post(
  "/reset-password",
  resetPassword
);

// ========================================
// CURRENT USER
// ========================================

router.get(
  "/me",
  protect,
  getMe
);


module.exports = router;