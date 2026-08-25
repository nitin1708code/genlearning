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


// ========================================
// CREATE PAYMENT ORDER
// ========================================

router.post("/create-order", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Get course price from DATABASE
    const [courses] = await db.query(
      `
      SELECT id, title, price
      FROM courses
      WHERE id = ?
      LIMIT 1
      `,
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = courses[0];

    // Check existing enrollment
    const [existing] = await db.query(
      `
      SELECT id
      FROM enrollments
      WHERE user_id = ?
      AND course_id = ?
      LIMIT 1
      `,
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    const amount = Math.round(Number(course.price) * 100);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `course_${courseId}_user_${userId}`,
    });

    // Save payment record
    await db.query(
      `
      INSERT INTO payments
      (
        user_id,
        course_id,
        razorpay_order_id,
        amount,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        courseId,
        order.id,
        course.price,
        "created",
      ]
    );

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      course: {
        id: course.id,
        title: course.title,
        price: course.price,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create Razorpay order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
});


// ========================================
// VERIFY PAYMENT
// ========================================

router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user.userId;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Find payment record
    const [payments] = await db.query(
      `
      SELECT id, amount, status
      FROM payments
      WHERE razorpay_order_id = ?
      AND user_id = ?
      AND course_id = ?
      LIMIT 1
      `,
      [
        razorpay_order_id,
        userId,
        courseId,
      ]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const payment = payments[0];

    // Prevent duplicate verification
    if (payment.status === "paid") {
      return res.status(409).json({
        success: false,
        message: "Payment already verified",
      });
    }

    // Update payment
    await db.query(
      `
      UPDATE payments
      SET
        razorpay_payment_id = ?,
        razorpay_signature = ?,
        status = 'paid'
      WHERE id = ?
      `,
      [
        razorpay_payment_id,
        razorpay_signature,
        payment.id,
      ]
    );

    // Check enrollment again
    const [existingEnrollment] = await db.query(
      `
      SELECT id
      FROM enrollments
      WHERE user_id = ?
      AND course_id = ?
      LIMIT 1
      `,
      [userId, courseId]
    );

    // Create enrollment
    if (existingEnrollment.length === 0) {
      await db.query(
        `
        INSERT INTO enrollments
        (user_id, course_id, progress)
        VALUES (?, ?, 0)
        `,
        [userId, courseId]
      );
    }

    res.json({
      success: true,
      message: "Payment verified and course enrolled successfully",
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});


module.exports = router;