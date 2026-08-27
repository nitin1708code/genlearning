import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "https://api.genlearning.in";
 
const Mentoring = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // =====================================================
  // INITIAL DURATION
  // =====================================================

  const queryDuration = Number(
    searchParams.get("duration")
  );
const initialDuration =
  queryDuration === 2
    ? 2
    : queryDuration === 120
      ? 120
      : 60;

  const [duration, setDuration] =
    useState(initialDuration);

  const [bookingDate, setBookingDate] =
    useState("");

  const [bookingTime, setBookingTime] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // PRICE
  // =====================================================

  const price =
  duration === 2
    ? 10
    : duration === 60
      ? 199
      : 349;

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);
  }, []);

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  // =====================================================
  // OPEN RAZORPAY
  // =====================================================

  const openRazorpay = (
    razorpayData,
    token
  ) => {

    if (
      !razorpayData ||
      !razorpayData.key_id ||
      !razorpayData.order_id ||
      !razorpayData.amount
    ) {
      console.error(
        "Invalid Razorpay data:",
        razorpayData
      );

      setError(
        "Payment could not be initialized."
      );

      setLoading(false);

      return;
    }

    if (!window.Razorpay) {
      setError(
        "Razorpay checkout is not loaded. Please refresh and try again."
      );

      setLoading(false);

      return;
    }

    // ===================================================
    // RAZORPAY OPTIONS
    // ===================================================

    const options = {

      key: razorpayData.key_id,

      amount: razorpayData.amount,

      currency:
        razorpayData.currency || "INR",

      name: "GEN Learning",
description:
  duration === 2
    ? "2 Minutes 1:1 Mentoring Session"
    : duration === 60
      ? "1 Hour 1:1 Mentoring Session"
      : "2 Hours 1:1 Mentoring Session",

      order_id:
        razorpayData.order_id,

      handler: async (paymentResponse) => {

        try {

          console.log(
            "Razorpay payment response:",
            paymentResponse
          );

          // =============================================
          // VERIFY PAYMENT
          // =============================================

          const verifyResponse =
            await fetch(
              `${API_URL}/api/mentoring/verify-payment`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

          const verifyData =
            await verifyResponse.json();

          console.log(
            "Payment verification:",
            verifyData
          );

          if (!verifyResponse.ok) {

            setError(
              verifyData.message ||
                "Payment verification failed."
            );

            setLoading(false);

            return;
          }

          // =============================================
          // SUCCESS
          // =============================================

          setError("");

setMessage(
  "Payment successful! Your mentoring session is confirmed."
);

setBookingDate("");
setBookingTime("");

setLoading(false);

// Redirect to My Bookings
setTimeout(() => {
  navigate("/my-bookings");
}, 1000);

        } catch (verificationError) {

          console.error(
            "Payment verification error:",
            verificationError
          );

          setError(
            "Payment was successful, but verification failed. Please contact support."
          );

          setLoading(false);
        }
      },

      prefill: {
        name: "",
        email: "",
        contact: "",
      },

      notes: {
        mentoring_duration:
          `${duration} minutes`,

        booking_date:
          bookingDate,

        booking_time:
          bookingTime,
      },

      theme: {
        color: "#111111",
      },

      modal: {
        ondismiss: () => {
          setLoading(false);

          setMessage("");

          setError(
            "Payment was cancelled."
          );
        },
      },
    };

    // ===================================================
    // CREATE RAZORPAY INSTANCE
    // ===================================================

    const razorpay =
      new window.Razorpay(options);

    // ===================================================
    // PAYMENT FAILED
    // ===================================================

    razorpay.on(
      "payment.failed",
      (response) => {

        console.error(
          "Razorpay payment failed:",
          response
        );

        setError(
          response?.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      }
    );

    // ===================================================
    // OPEN CHECKOUT
    // ===================================================

    razorpay.open();
  };

  // =====================================================
  // HANDLE BOOKING
  // =====================================================

  const handleBooking = async (event) => {

    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {

      // =================================================
      // TOKEN
      // =================================================

      const token =
        localStorage.getItem(
          "genlearningToken"
        );

      if (!token) {

        setError(
          "Please login before booking a mentoring session."
        );

        setLoading(false);

        return;
      }

      // =================================================
      // DATE / TIME
      // =================================================

      if (
        !bookingDate ||
        !bookingTime
      ) {

        setError(
          "Please select date and time."
        );

        setLoading(false);

        return;
      }

      // =================================================
      // RAZORPAY SCRIPT
      // =================================================

      if (!window.Razorpay) {

        await new Promise(
          (resolve, reject) => {

            const existingScript =
              document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
              );

            if (existingScript) {

              existingScript.addEventListener(
                "load",
                resolve,
                { once: true }
              );

              existingScript.addEventListener(
                "error",
                reject,
                { once: true }
              );

              return;
            }

            const script =
              document.createElement("script");

            script.src =
              "https://checkout.razorpay.com/v1/checkout.js";

            script.async = true;

            script.onload = resolve;

            script.onerror = () =>
              reject(
                new Error(
                  "Razorpay script failed to load"
                )
              );

            document.body.appendChild(
              script
            );
          }
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout is not available"
        );
      }

      // =================================================
      // CREATE BOOKING + RAZORPAY ORDER
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/mentoring/book`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              duration_minutes:
                duration,

              booking_date:
                bookingDate,

              booking_time:
                bookingTime,

            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Mentoring booking response:",
        data
      );

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (!response.ok) {

        setError(
          data.message ||
            "Unable to create mentoring booking."
        );

        setLoading(false);

        return;
      }

      // =================================================
      // RAZORPAY DATA
      // =================================================

      if (
        !data.razorpay ||
        !data.razorpay.key_id ||
        !data.razorpay.order_id ||
        !data.razorpay.amount
      ) {

        console.error(
          "Missing Razorpay information:",
          data
        );

        setError(
          "Payment could not be initialized."
        );

        setLoading(false);

        return;
      }

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      openRazorpay(
        data.razorpay,
        token
      );

    } catch (bookingError) {

      console.error(
        "Mentoring booking error:",
        bookingError
      );

      setError(
        bookingError.message ||
          "Unable to initialize payment. Please try again."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="mentoring-page">

      <section className="mentoring-hero">

        <div className="mentoring-container">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="mentoring-content">

            <span className="section-eyebrow">
              1:1 MENTORING
            </span>

            <h1>
              Learn directly
              <span>
                with guidance.
              </span>
            </h1>

            <p>
              Get focused one-on-one guidance
              for coding, projects, technical
              problems, and your learning journey.
            </p>

          </div>

          {/* =================================================
              BOOKING CARD
          ================================================= */}

          <div className="mentoring-card">

            <div className="mentoring-card-header">

              <h2>
                Book a Session
              </h2>

              <p>
                Choose your preferred duration
                and time.
              </p>

            </div>

            <form onSubmit={handleBooking}>

              {/* =================================================
                  DURATION
              ================================================= */}

              <div className="mentoring-field">

                <label>
                  Session Duration
                </label>

                <div className="mentoring-options">

                  <button
                    type="button"
                    className={
                      duration === 60
                        ? "mentoring-option active"
                        : "mentoring-option"
                    }
                    onClick={() => {
                      setDuration(60);
                      clearMessages();
                    }}
                  >
                    <span>
                      1 Hour
                    </span>

                    <strong>
                      ₹199
                    </strong>
                  </button>

                  <button
                    type="button"
                    className={
                      duration === 120
                        ? "mentoring-option active"
                        : "mentoring-option"
                    }
                    onClick={() => {
                      setDuration(120);
                      clearMessages();
                    }}
                  >
                    <span>
                      2 Hours
                    </span>

                    <strong>
                      ₹349
                    </strong>
                  </button>
                  <button
  type="button"
  className={
    duration === 2
      ? "mentoring-option active"
      : "mentoring-option"
  }
  onClick={() => {
    setDuration(2);
    clearMessages();
  }}
>
  <span>2 Minutes</span>
  <strong>₹10</strong>
</button>

                </div>

              </div>

              {/* =================================================
                  DATE
              ================================================= */}

              <div className="mentoring-field">

                <label htmlFor="booking-date">
                  Date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  value={bookingDate}
                  min={today}
                  onChange={(event) => {
                    setBookingDate(
                      event.target.value
                    );

                    clearMessages();
                  }}
                  required
                />

              </div>

              {/* =================================================
                  TIME
              ================================================= */}

              <div className="mentoring-field">

                <label htmlFor="booking-time">
                  Time
                </label>

                <input
                  id="booking-time"
                  type="time"
                  value={bookingTime}
                  onChange={(event) => {
                    setBookingTime(
                      event.target.value
                    );

                    clearMessages();
                  }}
                  required
                />

              </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="mentoring-summary">

                <span>
                  Total
                </span>

                <strong>
                  ₹{price}
                </strong>

              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <p className="mentoring-error">
                  {error}
                </p>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {message && (
                <p className="mentoring-success">
                  {message}
                </p>
              )}

              {/* =================================================
                  PAYMENT BUTTON
              ================================================= */}

              <button
                type="submit"
                className="mentoring-submit"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${price} & Book`}
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Mentoring;