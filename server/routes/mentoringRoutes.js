const express = require("express");

const router = express.Router();

const db = require("../config/db");
const protect = require("../middleware/authMiddleware");


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
// CREATE MENTORING BOOKING
// ========================================

router.post("/book", protect, async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      duration_minutes,
      booking_date,
      booking_time,
    } = req.body;


    // Validate duration

    if (
      duration_minutes !== 60 &&
      duration_minutes !== 120
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid mentoring duration",
      });

    }


    // Validate date and time

    if (!booking_date || !booking_time) {

      return res.status(400).json({
        success: false,
        message: "Booking date and time are required",
      });

    }


    // Determine price from backend

    const price =
      duration_minutes === 60
        ? 199
        : 349;


    // Check whether slot is already booked

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


    // Create booking

    const [result] = await db.query(
      `
      INSERT INTO mentoring_bookings
      (
        user_id,
        duration_minutes,
        price,
        booking_date,
        booking_time,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        duration_minutes,
        price,
        booking_date,
        booking_time,
        "pending",
      ]
    );


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

    });


  } catch (error) {

    console.error(
      "Mentoring booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create mentoring booking",
    });

  }

});


// ========================================
// GET MY BOOKINGS
// ========================================

router.get("/my-bookings", protect, async (req, res) => {

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

});


module.exports = router;