const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const transporter = require("../config/mailer");

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


// ========================================
// REGISTER - SEND OTP
// ========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Hash password before storing temporarily
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 10 minutes
    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove previous pending verification
    await db.query(
      "DELETE FROM email_verifications WHERE email = ?",
      [cleanEmail]
    );

    // Store pending registration
    await db.query(
      `
      INSERT INTO email_verifications
      (
        name,
        email,
        password,
        otp,
        otp_expires_at
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        otp,
        otpExpiresAt,
      ]
    );
 
  const { data, error } = await transporter.emails.send({
  from: "GEN Learning <noreply@genlearning.in>",
  to: [cleanEmail],
  subject: "GEN Learning - Email Verification OTP",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
      
      <h2 style="margin-bottom: 10px;">
        Welcome to GEN Learning
      </h2>

      <p>
        Hi ${cleanName},
      </p>

      <p>
        Use the OTP below to verify your email address.
      </p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        padding: 20px;
        background: #f5f5f5;
        text-align: center;
        margin: 25px 0;
      ">
        ${otp}
      </div>

      <p>
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

      <p>
        If you did not create a GEN Learning account,
        you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>GEN Learning</strong>
      </p>

    </div>
  `,
});



console.log("REGISTER RESEND DATA:", data);
console.log("REGISTER RESEND ERROR:", error);
console.log("REGISTER OTP EMAIL SENT:", cleanEmail);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    });

  } catch (error) {

    console.error(
      "Register OTP error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to send verification OTP.",
    });
  }
};


// ========================================
// VERIFY EMAIL OTP
// ========================================

const verifyEmail = async (req, res) => {
  try {

    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find pending registration
    const [pendingUsers] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        otp,
        otp_expires_at
      FROM email_verifications
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (pendingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found. Please register again.",
      });
    }

    const pendingUser = pendingUsers[0];

    // Check OTP
    if (pendingUser.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check expiry
    if (
      new Date(pendingUser.otp_expires_at) <
      new Date()
    ) {
      await db.query(
        "DELETE FROM email_verifications WHERE email = ?",
        [cleanEmail]
      );

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please register again.",
      });
    }

    // Create actual user
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
      `,
      [
        pendingUser.name,
        pendingUser.email,
        pendingUser.password,
      ]
    );

    // Delete pending verification
    await db.query(
      "DELETE FROM email_verifications WHERE email = ?",
      [cleanEmail]
    );

    // Create JWT
    const token = jwt.sign(
      {
        userId: result.insertId,
        email: pendingUser.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Email verified and account created successfully.",
      token,
      user: {
        id: result.insertId,
        name: pendingUser.name,
        email: pendingUser.email,
        role: "student",
      },
    });

  } catch (error) {

    console.error(
      "Email verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to verify email.",
    });
  }
};


// ========================================
// LOGIN
// ========================================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role
      FROM users
      WHERE email = ?
      `,
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email.toLowerCase();
    const name = payload.name || "GEN Learning User";

    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      [email]
    );

    let user;

    if (users.length === 0) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10
      );

      const [result] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, randomPassword]
      );

      user = {
        id: result.insertId,
        name,
        email,
        role: "student",
      };
    } else {
      user = users[0];
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Google login successful.",
      token,
      user,
    });

  } catch (error) {
    console.error("Google login error:", error);

    res.status(401).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};

// ========================================
// FORGOT PASSWORD - SEND OTP
// ========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user exists
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const user = users[0];

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 10 minutes
    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove previous reset request
    await db.query(
      "DELETE FROM password_resets WHERE email = ?",
      [cleanEmail]
    );

    // Store new OTP
    await db.query(
      `
      INSERT INTO password_resets
      (
        email,
        otp,
        otp_expires_at
      )
      VALUES (?, ?, ?)
      `,
      [
        cleanEmail,
        otp,
        otpExpiresAt,
      ]
    );

    // Send email
    await transporter.emails.send({
  from: "GEN Learning <noreply@genlearning.in>",
  to: [cleanEmail],
  subject: "GEN Learning - Password Reset OTP",

  html: `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
    ">

      <h2>
        Reset your GEN Learning password
      </h2>

      <p>
        Hi ${user.name},
      </p>

      <p>
        Use the OTP below to reset your password.
      </p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        padding: 20px;
        background: #f5f5f5;
        text-align: center;
        margin: 25px 0;
      ">
        ${otp}
      </div>

      <p>
        This OTP will expire in
        <strong>10 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset,
        you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>GEN Learning</strong>
      </p>

    </div>
  `,
});
    res.json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to send password reset OTP.",
    });
  }
};


// ========================================
// VERIFY PASSWORD RESET OTP
// ========================================

const verifyResetOtp = async (req, res) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [resets] = await db.query(
      `
      SELECT
        id,
        email,
        otp,
        otp_expires_at
      FROM password_resets
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (resets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reset request not found. Please request a new OTP.",
      });
    }

    const reset = resets[0];

    // Check OTP
    if (reset.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check expiry
    if (
      new Date(reset.otp_expires_at) <
      new Date()
    ) {
      await db.query(
        "DELETE FROM password_resets WHERE email = ?",
        [cleanEmail]
      );

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    console.error(
      "Reset OTP verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
};


// ========================================
// RESET PASSWORD
// ========================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find reset request
    const [resets] = await db.query(
      `
      SELECT
        id,
        email,
        otp,
        otp_expires_at
      FROM password_resets
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (resets.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Password reset request not found.",
      });
    }

    const reset = resets[0];

    // Verify OTP again
    if (reset.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check expiry again
    if (
      new Date(reset.otp_expires_at) <
      new Date()
    ) {
      await db.query(
        "DELETE FROM password_resets WHERE email = ?",
        [cleanEmail]
      );

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // Update password
    await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE email = ?
      `,
      [
        hashedPassword,
        cleanEmail,
      ]
    );

    // Delete used OTP
    await db.query(
      "DELETE FROM password_resets WHERE email = ?",
      [cleanEmail]
    );

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });

  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to reset password.",
    });
  }
};
// ========================================
// GET CURRENT USER
// ========================================

const getMe = async (req, res) => {
  try {

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = ?
      `,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user: users[0],
    });

  } catch (error) {

    console.error(
      "Get current user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
};


module.exports = {
  registerUser,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  loginUser,
  googleLogin,
  getMe,
};