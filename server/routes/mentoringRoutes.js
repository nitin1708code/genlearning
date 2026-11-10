const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Resend } = require("resend");

const router = express.Router();
const db = require("../config/db");
const protect = require("../middleware/authMiddleware");
const publicFormLimiter = require("../middleware/publicFormLimiter");

const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));

// ---------------------------------------------------------
// OPTIONAL SERVICES
// ---------------------------------------------------------
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM =
  process.env.EMAIL_FROM || "GenLearning <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ---------------------------------------------------------
// SERVER-SIDE PLAN CATALOG
// Never accept prices from the frontend.
// ---------------------------------------------------------
const PLANS = {
  "monthly-mentor": {
    name: "Monthly Mentor",
    type: "monthly",
    duration: "10 sessions · 1 hour each",
    period: "per month",
    prices: { "9-10": 2999, "11-12": 3999 },
  },
  "monthly-plus": {
    name: "Monthly Plus",
    type: "monthly",
    duration: "14 sessions · 1 hour each",
    period: "per month",
    prices: { "9-10": 3999, "11-12": 4999 },
  },
  "board-exam-prep": {
    name: "Board / Exam Prep",
    type: "monthly",
    duration: "24 sessions · 1 hour each",
    period: "for 3 months",
    prices: { "9-10": 8999, "11-12": 11999 },
  },
  "coding-monthly": {
    name: "Coding Monthly",
    type: "monthly",
    duration: "8 sessions · 1 hour each",
    period: "per month",
    prices: { college: 3999 },
  },
  "quick-doubt": {
    name: "Quick Doubt",
    type: "contact",
    duration: "30 minutes",
    period: "one-time",
    prices: { "9-10": 250, "11-12": 350 },
  },
  "single-session": {
    name: "Single Session",
    type: "single",
    duration: "1 hour",
    period: "one-time",
    prices: { "9-10": 399, "11-12": 499 },
  },
  "group-doubt-class": {
    name: "Group Doubt Class",
    type: "contact",
    duration: "1 hour · group of 4–5",
    period: "per student",
    prices: { "9-10": 200, "11-12": 250 },
  },
  "coding-1-1": {
    name: "Coding (1:1)",
    type: "contact",
    duration: "1 hour",
    period: "one-time",
    prices: { college: 600 },
  },
};

const validClassLevels = ["9-10", "11-12", "college"];

// Session entitlement and validity are controlled by the backend.
const PACKAGE_CONFIG = {
  "monthly-mentor": { totalSessions: 10, validityMonths: 1 },
  "monthly-plus": { totalSessions: 14, validityMonths: 1 },
  "board-exam-prep": { totalSessions: 24, validityMonths: 3 },
  "coding-monthly": { totalSessions: 8, validityMonths: 1 },
};

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function addMonths(date, months) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

// ---------------------------------------------------------
// OPTIONAL EMAIL NOTIFICATION
// ---------------------------------------------------------
async function sendNotificationEmail(to, subject, html) {
  if (!resend || !to) return;

  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  } catch (error) {
    console.error("Mentoring email error:", error);
  }
}

// ---------------------------------------------------------
// GET AVAILABLE OPTIONS
// GET /api/mentoring/options
// ---------------------------------------------------------
router.get("/options", (req, res) => {
  res.json({
    success: true,
    options: Object.entries(PLANS).map(([key, plan]) => ({
      plan_key: key,
      plan_name: plan.name,
      plan_type: plan.type,
      duration_label: plan.duration,
      price_period: plan.period,
      prices: plan.prices,
    })),
  });
});
// ---------------------------------------------------------
// SUBMIT MONTHLY PLAN / ENQUIRY REQUEST (NO PAYMENT)
// POST /api/mentoring/request
// ---------------------------------------------------------
router.post("/request", publicFormLimiter, async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      plan_key,
      class_level,
      booking_date,
      booking_time,
      subject,
      topic,
      session_mode,
      notes,
    } = req.body;

    if (!full_name?.trim() || !phone?.trim() || !plan_key || !class_level) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, plan and class level are required.",
      });
    }

    if (typeof full_name !== "string" || typeof phone !== "string" ||
        [full_name, phone, email, subject, topic, notes].some((value) => value != null && (typeof value !== "string" || value.length > 2000))) {
      return res.status(400).json({ success: false, message: "One or more fields are invalid or too long." });
    }

    if (phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (email && !validEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const plan = PLANS[plan_key];

    if (!plan || plan.type === "single") {
      return res.status(400).json({
        success: false,
        message: "Invalid request plan.",
      });
    }

    if (!validClassLevels.includes(class_level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class level.",
      });
    }

    const amount = plan.prices[class_level];

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "This plan is not available for the selected class level.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO mentoring_requests (
        user_id, full_name, email, phone, plan_key, plan_name, plan_type,
        class_level, amount, price_period, duration_label, booking_date,
        booking_time, subject, topic, session_mode, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        null,
        full_name.trim(),
        email?.trim() || null,
        phone.trim(),
        plan_key,
        plan.name,
        plan.type,
        class_level,
        amount,
        plan.period,
        plan.duration,
        booking_date || null,
        booking_time || null,
        subject || null,
        topic || null,
        session_mode || "online",
        notes || null,
        "pending",
      ]
    );

    sendNotificationEmail(
      ADMIN_EMAIL,
      "New Mentoring Request - GenLearning",
      `<h2>New Mentoring Request</h2>
       <p><strong>Name:</strong> ${escapeHtml(full_name)}</p>
       <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
       <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
       <p><strong>Plan:</strong> ${plan.name}</p>
       <p><strong>Class:</strong> ${class_level}</p>
       <p><strong>Amount:</strong> ₹${amount}</p>
       <p><strong>Subject:</strong> ${escapeHtml(subject || "Not specified")}</p>`
    );

    return res.status(201).json({
      success: true,
      message: "Your mentoring request has been submitted successfully.",
      request: {
        id: result.insertId,
        plan_name: plan.name,
        amount,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Mentoring request error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit mentoring request.",
    });
  }
});

// ---------------------------------------------------------
// CREATE MONTHLY PACKAGE + RAZORPAY ORDER
// POST /api/mentoring/packages/create-order
// Login required.
// ---------------------------------------------------------
router.post("/packages/create-order", protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured.",
      });
    }

    const userId = req.user.userId;
    const { plan_key, class_level } = req.body;
    const plan = PLANS[plan_key];
    const config = PACKAGE_CONFIG[plan_key];

    if (!plan || plan.type !== "monthly" || !config) {
      return res.status(400).json({
        success: false,
        message: "Invalid monthly package.",
      });
    }

    if (!validClassLevels.includes(class_level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class level.",
      });
    }

    const amount = plan.prices[class_level];

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Package is unavailable for the selected class level.",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `pkg_${userId}_${Date.now()}`,
      notes: {
        user_id: String(userId),
        plan_key,
        class_level,
      },
    });

    const [result] = await db.query(
      `INSERT INTO mentoring_package_purchases (
        user_id, package_code, package_name, class_level, amount,
        currency, total_sessions, status, razorpay_order_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        plan_key,
        plan.name,
        class_level,
        amount,
        "INR",
        config.totalSessions,
        "pending",
        order.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Package order created.",
      purchase_id: result.insertId,
      package: {
        name: plan.name,
        class_level,
        amount,
        currency: "INR",
        total_sessions: config.totalSessions,
        validity_months: config.validityMonths,
      },
      razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Package order error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create package payment.",
    });
  }
});
// ---------------------------------------------------------
// VERIFY MONTHLY PACKAGE PAYMENT
// POST /api/mentoring/packages/verify-payment
// Login required.
// ---------------------------------------------------------
router.post("/packages/verify-payment", protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured.",
      });
    }

    const userId = req.user.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT * FROM mentoring_package_purchases
       WHERE razorpay_order_id = ? AND user_id = ? LIMIT 1`,
      [razorpay_order_id, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Package purchase not found.",
      });
    }

    const purchase = rows[0];

    if (purchase.status === "active") {
      if (purchase.razorpay_payment_id === razorpay_payment_id) {
        return res.json({
          success: true,
          message: "Package payment already verified.",
          purchase_id: purchase.id,
          status: "active",
        });
      }

      return res.status(409).json({
        success: false,
        message: "This package already has a verified payment.",
      });
    }

    if (purchase.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "This package order is not pending.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.amount !== Math.round(Number(purchase.amount) * 100) ||
      payment.currency !== purchase.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or payment details do not match.",
      });
    }

    const config = PACKAGE_CONFIG[purchase.package_code];

    if (!config) {
      return res.status(400).json({
        success: false,
        message: "Package configuration not found.",
      });
    }

    const purchasedAt = new Date();
    const expiresAt = addMonths(purchasedAt, config.validityMonths);

    const [updateResult] = await db.query(
      `UPDATE mentoring_package_purchases
       SET razorpay_payment_id = ?, razorpay_signature = ?,
           status = 'active', purchased_at = ?, expires_at = ?
       WHERE id = ? AND user_id = ? AND status = 'pending'`,
      [
        razorpay_payment_id,
        razorpay_signature,
        purchasedAt,
        expiresAt,
        purchase.id,
        userId,
      ]
    );

    if (!updateResult.affectedRows) {
      return res.status(409).json({
        success: false,
        message: "Package status changed. Please refresh your purchases.",
      });
    }

    const [users] = await db.query(
      "SELECT name, email FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length && users[0].email) {
      sendNotificationEmail(
        users[0].email,
        "Monthly Mentoring Package Confirmed - GenLearning",
        `<h2>Your mentoring package is active!</h2>
         <p>Hello ${users[0].name || "there"},</p>
         <p><strong>Package:</strong> ${purchase.package_name}</p>
         <p><strong>Class:</strong> ${purchase.class_level}</p>
         <p><strong>Amount paid:</strong> ₹${purchase.amount}</p>
         <p><strong>Sessions:</strong> ${purchase.total_sessions}</p>
         <p><strong>Valid until:</strong> ${expiresAt.toLocaleDateString("en-IN")}</p>
         <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
         <p>Regards,<br>GenLearning Team</p>`
      );
    }

    sendNotificationEmail(
      ADMIN_EMAIL,
      "New Paid Mentoring Package - GenLearning",
      `<h2>New Paid Mentoring Package</h2>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Package:</strong> ${purchase.package_name}</p>
       <p><strong>Class:</strong> ${purchase.class_level}</p>
       <p><strong>Amount:</strong> ₹${purchase.amount}</p>
       <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>`
    );

    return res.json({
      success: true,
      message: "Package payment verified successfully.",
      purchase: {
        id: purchase.id,
        package_name: purchase.package_name,
        class_level: purchase.class_level,
        amount: purchase.amount,
        total_sessions: purchase.total_sessions,
        used_sessions: purchase.used_sessions,
        status: "active",
        purchased_at: purchasedAt,
        expires_at: expiresAt,
        razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error("Package payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify package payment.",
    });
  }
});
// ---------------------------------------------------------
// CREATE SINGLE SESSION + RAZORPAY ORDER
// POST /api/mentoring/book
// Login required.
// ---------------------------------------------------------
router.post("/book", protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured.",
      });
    }

    const userId = req.user.userId;
    const {
      duration_minutes,
      booking_date,
      booking_time,
      subject,
      custom_topic,
      class_level,
    } = req.body;

    if (duration_minutes !== 60) {
      return res.status(400).json({
        success: false,
        message: "Only the 1-hour single session is currently available.",
      });
    }

    if (!["9-10", "11-12"].includes(class_level)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid class level.",
      });
    }

    if (!booking_date || !booking_time || !subject) {
      return res.status(400).json({
        success: false,
        message: "Date, time and subject are required.",
      });
    }

    const price = PLANS["single-session"].prices[class_level];

    const [existing] = await db.query(
      `SELECT id FROM mentoring_bookings
       WHERE booking_date = ? AND booking_time = ?
       AND status IN ('pending', 'confirmed') LIMIT 1`,
      [booking_date, booking_time]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
      receipt: `mentor_${userId}_${Date.now()}`,
    });

    const [result] = await db.query(
      `INSERT INTO mentoring_bookings (
        user_id, duration_minutes, price, booking_date, booking_time,
        status, razorpay_order_id, subject, custom_topic
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        60,
        price,
        booking_date,
        booking_time,
        "pending",
        order.id,
        subject,
        custom_topic || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Mentoring booking created.",
      booking: {
        id: result.insertId,
        duration_minutes: 60,
        price,
        booking_date,
        booking_time,
        status: "pending",
      },
      razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Mentoring booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create mentoring payment.",
    });
  }
});

// ---------------------------------------------------------
// VERIFY SINGLE-SESSION RAZORPAY PAYMENT
// POST /api/mentoring/verify-payment
// ---------------------------------------------------------
router.post("/verify-payment", protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured.",
      });
    }

    const userId = req.user.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required.",
      });
    }

    const [bookings] = await db.query(
      `SELECT * FROM mentoring_bookings
       WHERE razorpay_order_id = ? AND user_id = ? LIMIT 1`,
      [razorpay_order_id, userId]
    );

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "Mentoring booking not found.",
      });
    }

    const booking = bookings[0];

    if (booking.status === "confirmed") {
      return res.status(409).json({
        success: false,
        message: "Payment already verified.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.amount !== Math.round(Number(booking.price) * 100) ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or payment details do not match.",
      });
    }

    const [updateResult] = await db.query(
      `UPDATE mentoring_bookings
       SET razorpay_payment_id = ?, razorpay_signature = ?, status = 'confirmed'
       WHERE id = ? AND user_id = ? AND status = 'pending'`,
      [razorpay_payment_id, razorpay_signature, booking.id, userId]
    );

    if (!updateResult.affectedRows) {
      return res.status(409).json({
        success: false,
        message: "Booking status changed. Please refresh your bookings.",
      });
    }

    const [users] = await db.query(
      "SELECT name, email FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length && users[0].email) {
      const user = users[0];

      sendNotificationEmail(
        user.email,
        "Mentoring Session Confirmed - GenLearning",
        `<h2>Your mentoring session is confirmed!</h2>
         <p>Hello ${user.name || "there"},</p>
         <p><strong>Duration:</strong> 1 Hour</p>
         <p><strong>Subject:</strong> ${booking.subject || "Not specified"}</p>
         <p><strong>Date:</strong> ${booking.booking_date}</p>
         <p><strong>Time:</strong> ${booking.booking_time}</p>
         <p><strong>Amount:</strong> ₹${booking.price}</p>
         <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
         <p>Regards,<br>GenLearning Team</p>`
      );
    }

    sendNotificationEmail(
      ADMIN_EMAIL,
      "New Paid Mentoring Booking - GenLearning",
      `<h2>New Paid Mentoring Booking</h2>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Amount:</strong> ₹${booking.price}</p>
       <p><strong>Date:</strong> ${booking.booking_date}</p>
       <p><strong>Time:</strong> ${booking.booking_time}</p>
       <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>`
    );

    return res.json({
      success: true,
      message: "Payment verified and mentoring session confirmed.",
      booking: {
        id: booking.id,
        duration_minutes: booking.duration_minutes,
        price: booking.price,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: "confirmed",
      },
    });
  } catch (error) {
    console.error("Mentoring verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify mentoring payment.",
    });
  }
});
// ---------------------------------------------------------
// MY CONFIRMED BOOKINGS
// GET /api/mentoring/my-bookings
// ---------------------------------------------------------
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT id, duration_minutes, price, booking_date, booking_time,
              status, razorpay_order_id, razorpay_payment_id, created_at
       FROM mentoring_bookings
       WHERE user_id = ? AND status = 'confirmed'
       ORDER BY booking_date DESC, booking_time DESC`,
      [req.user.userId]
    );

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("My mentoring bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentoring bookings.",
    });
  }
});

// ---------------------------------------------------------
// MY MONTHLY PACKAGES
// GET /api/mentoring/my-packages
// ---------------------------------------------------------
router.get("/my-packages", protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    await db.query(
      `UPDATE mentoring_package_purchases
       SET status = 'expired'
       WHERE user_id = ? AND status = 'active'
       AND expires_at IS NOT NULL AND expires_at <= NOW()`,
      [userId]
    );

    const [packages] = await db.query(
      `SELECT id, package_code, package_name, class_level, amount, currency,
              total_sessions, used_sessions,
              (total_sessions - used_sessions) AS remaining_sessions,
              status, purchased_at, expires_at, razorpay_payment_id, created_at
       FROM mentoring_package_purchases
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({ success: true, packages });
  } catch (error) {
    console.error("My packages error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your packages.",
    });
  }
});

module.exports = router;
