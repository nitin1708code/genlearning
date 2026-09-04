const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rateLimit = require("express-rate-limit");
const db = require("./config/db");
const coursesRoutes = require("./routes/courses");
const authRoutes = require("./routes/authRoutes");
const enrollmentRoutes = require("./routes/enrollments");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mentoringRoutes = require("./routes/mentoringRoutes");


const app = express();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://genlearning.in"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use("/api/courses", coursesRoutes);
app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/enrollments",
  enrollmentRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use("/api/mentoring", 
  mentoringRoutes
);

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GEN Learning API is running",
  });
});


// ========================================
// DATABASE TEST
// ========================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "MySQL connected successfully",
      data: rows,
    });

  } catch (error) {

    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});


// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `GEN Learning server running on port ${PORT}`
  );
});