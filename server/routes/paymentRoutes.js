
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();
const db = require("../config/db");
const protect = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const isPositiveInteger = (value) =>
  (typeof value === "number" || typeof value === "string") &&
  String(value).trim() !== "" &&
  Number.isSafeInteger(Number(value)) &&
  Number(value) > 0;

const safeCompareHex = (actual, expected) => {
  if (
    typeof actual !== "string" ||
    typeof expected !== "string" ||
    !/^[a-f0-9]{64}$/i.test(actual) ||
    !/^[a-f0-9]{64}$/i.test(expected)
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(actual, "hex"),
    Buffer.from(expected, "hex")
  );
};

// ========================================
// CREATE PAYMENT ORDER
// ========================================

router.post("/create-order", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

    if (!isPositiveInteger(courseId)) {
      return res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.error("Razorpay credentials are not configured.");

      return res.status(500).json({
        success: false,
        message: "Payment service is unavailable.",
      });
    }

    const [courses] = await db.query(
      `SELECT id, title, price
       FROM courses
       WHERE id = ?
       LIMIT 1`,
      [Number(courseId)]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const course = courses[0];
    const price = Number(course.price);

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price.",
      });
    }

    const amount = Math.round(price * 100);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course amount.",
      });
    }

    const [existing] = await db.query(
      `SELECT id
       FROM enrollments
       WHERE user_id = ? AND course_id = ?
       LIMIT 1`,
      [userId, course.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course.",
      });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `course_${course.id}_user_${userId}`,
    });

    await db.query(
      `INSERT INTO payments
       (user_id, course_id, razorpay_order_id, amount, status)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, course.id, order.id, price, "created"]
    );

    return res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      course: {
        id: course.id,
        title: course.title,
        price,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
    });
  }
});

// ========================================
// VERIFY PAYMENT
// ========================================

router.post("/verify-payment", protect, async (req, res) => {
  let connection;
  let transactionStarted = false;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user.userId;

    if (
      typeof razorpay_order_id !== "string" ||
      !razorpay_order_id.trim() ||
      typeof razorpay_payment_id !== "string" ||
      !razorpay_payment_id.trim() ||
      typeof razorpay_signature !== "string" ||
      !isPositiveInteger(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid payment details are required.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("Razorpay secret is not configured.");

      return res.status(500).json({
        success: false,
        message: "Payment service is unavailable.",
      });
    }

    // 1. Verify Razorpay's order/payment signature.
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeCompareHex(razorpay_signature, expectedSignature)) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // 2. Fetch payment directly from Razorpay.
    // Never trust the frontend's payment status.
    const razorpayPayment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.status !== "captured" ||
      razorpayPayment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details could not be verified.",
      });
    }

    // 3. Lock the payment record and update everything atomically.
    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    const [payments] = await connection.query(
      `SELECT id, amount, status
       FROM payments
       WHERE razorpay_order_id = ?
         AND user_id = ?
         AND course_id = ?
       LIMIT 1
       FOR UPDATE`,
      [razorpay_order_id, userId, Number(courseId)]
    );

    if (payments.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    const payment = payments[0];

    if (payment.status === "paid") {
      await connection.rollback();
      transactionStarted = false;

      return res.status(409).json({
        success: false,
        message: "Payment already verified.",
      });
    }

    if (payment.status !== "created") {
      await connection.rollback();
      transactionStarted = false;

      return res.status(409).json({
        success: false,
        message: "Payment is not eligible for verification.",
      });
    }

    const expectedAmount = Math.round(Number(payment.amount) * 100);

    if (
      !Number.isSafeInteger(expectedAmount) ||
      expectedAmount <= 0 ||
      razorpayPayment.amount !== expectedAmount
    ) {
      await connection.rollback();
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch.",
      });
    }

    // 4. Mark payment as paid only after all checks pass.
    await connection.query(
      `UPDATE payments
       SET razorpay_payment_id = ?,
           razorpay_signature = ?,
           status = 'paid'
       WHERE id = ? AND status = 'created'`,
      [razorpay_payment_id, razorpay_signature, payment.id]
    );

    // 5. Create enrollment within the same transaction.
    const [existingEnrollment] = await connection.query(
      `SELECT id
       FROM enrollments
       WHERE user_id = ? AND course_id = ?
       LIMIT 1
       FOR UPDATE`,
      [userId, Number(courseId)]
    );

    if (existingEnrollment.length === 0) {
      await connection.query(
        `INSERT INTO enrollments
         (user_id, course_id, progress)
         VALUES (?, ?, 0)`,
        [userId, Number(courseId)]
      );
    }

    await connection.commit();
    transactionStarted = false;

    return res.json({
      success: true,
      message: "Payment verified and course enrolled successfully.",
    });
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Payment rollback failed:", rollbackError.message);
      }
    }

    console.error("Payment verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment. Please contact support if money was deducted.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
