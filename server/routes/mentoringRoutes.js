const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

const db = require("../config/db");
const protect = require("../middleware/authMiddleware");

// =========================================================
// RAZORPAY
// =========================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================================================
// EMAIL / NODEMAILER
// =========================================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// =========================================================
// GET MENTORING OPTIONS
// =========================================================

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

      {
        duration: 2,
        durationLabel: "2 Minutes",
        price: 10,
      },
    ],
  });
});

// =========================================================
// CREATE BOOKING + RAZORPAY ORDER
// =========================================================

router.post("/book", protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      duration_minutes,
      booking_date,
      booking_time,
    } = req.body;

    // -----------------------------------------------------
    // VALIDATE DURATION
    // -----------------------------------------------------

    if (
      duration_minutes !== 2 &&
      duration_minutes !== 60 &&
      duration_minutes !== 120
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentoring duration",
      });
    }

    // -----------------------------------------------------
    // VALIDATE DATE / TIME
    // -----------------------------------------------------

    if (!booking_date || !booking_time) {
      return res.status(400).json({
        success: false,
        message: "Booking date and time are required",
      });
    }

    // -----------------------------------------------------
    // BACKEND PRICE
    // NEVER TRUST FRONTEND PRICE
    // -----------------------------------------------------

    let price;

    if (duration_minutes === 2) {
      price = 10;
    } else if (duration_minutes === 60) {
      price = 199;
    } else {
      price = 349;
    }

    const amount = price * 100;

    // -----------------------------------------------------
    // CHECK SLOT
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // CREATE RAZORPAY ORDER
    // -----------------------------------------------------

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `mentor_${userId}_${Date.now()}`,
    });

    // -----------------------------------------------------
    // SAVE BOOKING
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Mentoring booking created",

      booking: {
        id: result.insertId,
        duration_minutes: duration_minutes,
        price: price,
        booking_date: booking_date,
        booking_time: booking_time,
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

    return res.status(500).json({
      success: false,
      message: "Failed to create mentoring payment",
    });
  }
});

// =========================================================
// VERIFY RAZORPAY PAYMENT
// =========================================================

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

      // ---------------------------------------------------
      // VALIDATE PAYMENT DETAILS
      // ---------------------------------------------------

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

      // ---------------------------------------------------
      // FIND BOOKING
      // ---------------------------------------------------

      const [bookings] = await db.query(
        `
        SELECT
          id,
          duration_minutes,
          price,
          booking_date,
          booking_time,
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

      // ---------------------------------------------------
      // DUPLICATE PAYMENT
      // ---------------------------------------------------

      if (booking.status === "confirmed") {
        return res.status(409).json({
          success: false,
          message: "Payment already verified",
        });
      }

      // ---------------------------------------------------
      // VERIFY RAZORPAY SIGNATURE
      // ---------------------------------------------------

      const generatedSignature = crypto
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

      // ---------------------------------------------------
      // CONFIRM BOOKING
      // ---------------------------------------------------

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

      // ---------------------------------------------------
      // GET USER DETAILS
      // ---------------------------------------------------

      const [users] = await db.query(
        `
        SELECT
          name,
          email
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [userId]
      );

      // ---------------------------------------------------
      // SEND CONFIRMATION EMAIL
      // ---------------------------------------------------

      if (users.length > 0 && users[0].email) {
        const user = users[0];

        let durationLabel;

        if (booking.duration_minutes === 2) {
          durationLabel = "2 Minutes";
        } else if (booking.duration_minutes === 60) {
          durationLabel = "1 Hour";
        } else {
          durationLabel = "2 Hours";
        }

        try {
          await transporter.sendMail({
            from:
              process.env.EMAIL_FROM ||
              process.env.SMTP_USER,

            to: user.email,

            subject:
              "Mentoring Session Confirmed - GenLearning",

            html: `
              <!DOCTYPE html>

              <html>

              <head>
                <meta charset="UTF-8">
                <title>Mentoring Booking Confirmed</title>
              </head>

              <body
                style="
                  margin:0;
                  padding:0;
                  background:#f5f5f5;
                  font-family:Arial,sans-serif;
                "
              >

                <div
                  style="
                    max-width:600px;
                    margin:40px auto;
                    background:#ffffff;
                    border-radius:12px;
                    overflow:hidden;
                    border:1px solid #e5e5e5;
                  "
                >

                  <!-- HEADER -->

                  <div
                    style="
                      padding:25px;
                      background:#111111;
                      color:white;
                    "
                  >

                    <h2 style="margin:0;">
                      GenLearning
                    </h2>

                    <p
                      style="
                        margin:8px 0 0;
                        color:#bbbbbb;
                      "
                    >
                      1:1 Mentoring
                    </p>

                  </div>


                  <!-- CONTENT -->

                  <div style="padding:30px;">

                    <h2>
                      Mentoring Session Confirmed 🎉
                    </h2>

                    <p>
                      Hi ${user.name || "there"},
                    </p>

                    <p>
                      Your mentoring session has been
                      successfully booked and payment
                      has been confirmed.
                    </p>


                    <!-- BOOKING DETAILS -->

                    <div
                      style="
                        margin:25px 0;
                        padding:20px;
                        background:#f7f7f7;
                        border-radius:10px;
                      "
                    >

                      <p>
                        <strong>Duration:</strong>
                        ${durationLabel}
                      </p>

                      <p>
                        <strong>Date:</strong>
                        ${booking.booking_date}
                      </p>

                      <p>
                        <strong>Time:</strong>
                        ${booking.booking_time}
                      </p>

                      <p>
                        <strong>Amount Paid:</strong>
                        ₹${booking.price}
                      </p>

                      <p>
                        <strong>Payment ID:</strong>
                        ${razorpay_payment_id}
                      </p>

                    </div>


                    <p>
                      Please keep this email for your
                      records.
                    </p>

                    <p>
                      Regards,<br>
                      <strong>GenLearning Team</strong>
                    </p>

                  </div>

                </div>

              </body>

              </html>
            `,
          });

          console.log(
            `Mentoring confirmation email sent to ${user.email}`
          );

        } catch (emailError) {

          // Payment remains successful even if email fails

          console.error(
            "Mentoring confirmation email failed:",
            emailError
          );
        }
      }

      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      return res.json({
        success: true,

        message:
          "Payment verified and mentoring session confirmed",

        booking: {
          id: booking.id,

          duration_minutes:
            booking.duration_minutes,

          price:
            booking.price,

          booking_date:
            booking.booking_date,

          booking_time:
            booking.booking_time,

          status: "confirmed",
        },
      });

    } catch (error) {

      console.error(
        "Mentoring payment verification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to verify mentoring payment",
      });
    }
  }
);

// =========================================================
// MY BOOKINGS
// =========================================================
 // =========================================================
// MY BOOKINGS
// =========================================================

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
        AND status = 'confirmed'
        ORDER BY booking_date DESC, booking_time DESC
        `,
        [userId]
      );

      return res.json({
        success: true,
        bookings,
      });

    } catch (error) {
      console.error(
        "Mentoring bookings fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch mentoring bookings",
      });
    }
  }
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;