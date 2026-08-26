const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const db = require("../config/db");
const protect = require("../middleware/authMiddleware");


// ========================================
// RAZORPAY
// ========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ========================================
// GET MENTORING OPTIONS
// ========================================

router.get("/options", (req, res) => {

  res.json({
    success: true,

    options: [
      {
        duration: 60,
        durationLabel: "1 Hour",
        price: 199,
      },
      {
        duration: 120,
        durationLabel: "2 Hours",
        price: 349,
      },
    ],
  });

});


// ========================================
// CREATE MENTORING BOOKING + RAZORPAY ORDER
// ========================================

router.post("/book", protect, async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      duration_minutes,
      booking_date,
      booking_time,
    } = req.body;


    // ========================================
    // VALIDATE DURATION
    // ========================================

    if (
      duration_minutes !== 60 &&
      duration_minutes !== 120
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid mentoring duration",
      });

    }


    // ========================================
    // VALIDATE DATE / TIME
    // ========================================

    if (!booking_date || !booking_time) {

      return res.status(400).json({
        success: false,
        message: "Booking date and time are required",
      });

    }


    // ========================================
    // PRICE FROM BACKEND
    // ========================================

    const price =
      duration_minutes === 60
        ? 199
        : 349;


    // ========================================
    // CHECK SLOT
    // ========================================

    const [existing] = await db.query(
      `
      SELECT id
      FROM mentoring_bookings
      WHERE booking_date = ?
      AND booking_time = ?
      AND status IN ('pending', 'confirmed')
      LIMIT 1
      `,
      [
        booking_date,
        booking_time,
      ]
    );


    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });

    }


    // ========================================
    // CREATE RAZORPAY ORDER
    // ========================================

    const amount = price * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `mentor_${userId}_${Date.now()}`,
    });


    // ========================================
    // SAVE BOOKING
    // ========================================

    const [result] = await db.query(
      `
      INSERT INTO mentoring_bookings
      (
        user_id,
        duration_minutes,
        price,
        booking_date,
        booking_time,
        status,
        razorpay_order_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        duration_minutes,
        price,
        booking_date,
        booking_time,
        "pending",
        order.id,
      ]
    );


    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({

      success: true,

      message: "Mentoring booking created",

      booking: {
        id: result.insertId,
        duration_minutes,
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

    console.error(
      "Mentoring booking / Razorpay error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create mentoring payment",
    });

  }

});


// ========================================
// VERIFY MENTORING PAYMENT
// ========================================

router.post(
  "/verify-payment",
  protect,
  async (req, res) => {

    try {

      const userId = req.user.userId;

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;


      // ========================================
      // VALIDATE
      // ========================================

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {

        return res.status(400).json({
          success: false,
          message: "Payment details are required",
        });

      }


      // ========================================
      // FIND BOOKING
      // ========================================

      const [bookings] = await db.query(
        `
        SELECT
          id,
          price,
          status
        FROM mentoring_bookings
        WHERE razorpay_order_id = ?
        AND user_id = ?
        LIMIT 1
        `,
        [
          razorpay_order_id,
          userId,
        ]
      );


      if (bookings.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Mentoring booking not found",
        });

      }


      const booking = bookings[0];


      // ========================================
      // PREVENT DUPLICATE PAYMENT
      // ========================================

      if (booking.status === "confirmed") {

        return res.status(409).json({
          success: false,
          message: "Payment already verified",
        });

      }


      // ========================================
      // VERIFY RAZORPAY SIGNATURE
      // ========================================

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");


      if (
        generatedSignature !==
        razorpay_signature
      ) {

        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });

      }


      // ========================================
      // UPDATE BOOKING
      // ========================================

      await db.query(
        `
        UPDATE mentoring_bookings
        SET
          razorpay_payment_id = ?,
          status = 'confirmed'
        WHERE id = ?
        `,
        [
          razorpay_payment_id,
          booking.id,
        ]
      );


      // ========================================
      // SUCCESS
      // ========================================

      res.json({

        success: true,

        message:
          "Payment verified and mentoring session confirmed",

      });


    } catch (error) {

      console.error(
        "Mentoring payment verification error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to verify payment",
      });

    }

  }
);


// ========================================
// GET MY BOOKINGS
// ========================================

router.get(
  "/my-bookings",
  protect,
  async (req, res) => {

    try {

      const userId = req.user.userId;

      const [bookings] = await db.query(
        `
        SELECT
          id,
          duration_minutes,
          price,
          booking_date,
          booking_time,
          status,
          razorpay_order_id,
          razorpay_payment_id,
          created_at
        FROM mentoring_bookings
        WHERE user_id = ?
        ORDER BY booking_date DESC, booking_time DESC
        `,
        [userId]
      );


      res.json({
        success: true,
        bookings,
      });


    } catch (error) {

      console.error(
        "Mentoring bookings fetch error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch mentoring bookings",
      });

    }

  }
);


module.exports = router;