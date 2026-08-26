import React, {
  useEffect,
  useState,
} from "react";


const Mentoring = () => {

  const [duration, setDuration] =
    useState(60);

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


  const price =
    duration === 60
      ? 199
      : 349;


  // ========================================
  // LOAD RAZORPAY SCRIPT
  // ========================================

  useEffect(() => {

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


  // ========================================
  // VERIFY PAYMENT
  // ========================================

  const verifyPayment = async (
    paymentResponse,
    token
  ) => {

    try {

      const response = await fetch(
        "https://api.genlearning.in/api/mentoring/verify-payment",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
            "Payment verification failed."
        );

        return;
      }


      setMessage(
        "Payment successful! Your mentoring session is confirmed."
      );

      setBookingDate("");
      setBookingTime("");


    } catch (error) {

      console.error(
        "Payment verification error:",
        error
      );

      setError(
        "Payment completed, but verification failed. Please contact support."
      );
    }
  };


  // ========================================
  // CREATE BOOKING + OPEN RAZORPAY
  // ========================================

  const handleBooking = async (
    event
  ) => {

    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");


    try {

      const token =
        localStorage.getItem(
          "genlearningToken"
        );


      // ========================================
      // LOGIN CHECK
      // ========================================

      if (!token) {

        setError(
          "Please login before booking a mentoring session."
        );

        return;
      }


      // ========================================
      // DATE / TIME CHECK
      // ========================================

      if (
        !bookingDate ||
        !bookingTime
      ) {

        setError(
          "Please select date and time."
        );

        return;
      }


      // ========================================
      // CHECK RAZORPAY
      // ========================================

      if (
        !window.Razorpay
      ) {

        setError(
          "Payment system is loading. Please try again."
        );

        return;
      }


      // ========================================
      // CREATE BOOKING + RAZORPAY ORDER
      // ========================================

      const response =
        await fetch(
          "https://api.genlearning.in/api/mentoring/book",
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


      if (!response.ok) {

        setError(
          data.message ||
            "Unable to create mentoring booking."
        );

        return;
      }


      // ========================================
      // RAZORPAY OPTIONS
      // ========================================

      const options = {

        key:
          data.razorpay.key_id,

        amount:
          data.razorpay.amount,

        currency:
          data.razorpay.currency,

        name:
          "GEN Learning",

        description:
          `${duration === 60 ? "1 Hour" : "2 Hours"} Mentoring Session`,

        order_id:
          data.razorpay.order_id,


        theme: {
          color: "#111111",
        },


        handler:
          async function (
            paymentResponse
          ) {

            await verifyPayment(
              paymentResponse,
              token
            );

          },


        modal: {

          confirm_close: true,

          ondismiss:
            function () {

              setError(
                "Payment was cancelled. Your booking is still pending."
              );

            },

        },

      };


      // ========================================
      // OPEN RAZORPAY
      // ========================================

      const razorpay =
        new window.Razorpay(
          options
        );


      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            "Razorpay payment failed:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

        }
      );


      razorpay.open();


    } catch (error) {

      console.error(
        "Mentoring booking error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // DATE LIMIT
  // ========================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // ========================================
  // UI
  // ========================================

  return (

    <main className="mentoring-page">

      <section className="mentoring-hero">

        <div className="mentoring-container">


          {/* ========================================
              LEFT CONTENT
          ======================================== */}

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
              Get focused one-on-one guidance for
              coding, projects, technical problems,
              and your learning journey.
            </p>

          </div>


          {/* ========================================
              BOOKING CARD
          ======================================== */}

          <div className="mentoring-card">

            <div className="mentoring-card-header">

              <h2>
                Book a Session
              </h2>

              <p>
                Choose your preferred duration and time.
              </p>

            </div>


            <form
              onSubmit={handleBooking}
            >


              {/* ========================================
                  SESSION DURATION
              ======================================== */}

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

                      setError("");

                      setMessage("");

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

                      setError("");

                      setMessage("");

                    }}
                  >

                    <span>
                      2 Hours
                    </span>

                    <strong>
                      ₹349
                    </strong>

                  </button>

                </div>

              </div>


              {/* ========================================
                  DATE
              ======================================== */}

              <div className="mentoring-field">

                <label
                  htmlFor="booking-date"
                >
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

                    setError("");

                    setMessage("");

                  }}

                  required
                />

              </div>


              {/* ========================================
                  TIME
              ======================================== */}

              <div className="mentoring-field">

                <label
                  htmlFor="booking-time"
                >
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

                    setError("");

                    setMessage("");

                  }}

                  required
                />

              </div>


              {/* ========================================
                  SUMMARY
              ======================================== */}

              <div className="mentoring-summary">

                <span>
                  Total
                </span>

                <strong>
                  ₹{price}
                </strong>

              </div>


              {/* ========================================
                  ERROR
              ======================================== */}

              {error && (

                <p className="mentoring-error">
                  {error}
                </p>

              )}


              {/* ========================================
                  SUCCESS
              ======================================== */}

              {message && (

                <p className="mentoring-success">
                  {message}
                </p>

              )}


              {/* ========================================
                  BOOK / PAY BUTTON
              ======================================== */}

              <button
                type="submit"

                className="mentoring-submit"

                disabled={loading}
              >

                {loading
                  ? "Preparing Payment..."
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