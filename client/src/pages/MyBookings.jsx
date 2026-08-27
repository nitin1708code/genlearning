import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://api.genlearning.in";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH MY BOOKINGS
  // =========================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/mentoring/my-bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to fetch your bookings."
        );
        return;
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("My bookings error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = String(time).split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // DURATION
  // =========================================================

  const getDurationLabel = (minutes) => {
    if (Number(minutes) === 2) {
      return "2 Minutes";
    }

    if (Number(minutes) === 60) {
      return "1 Hour";
    }

    if (Number(minutes) === 120) {
      return "2 Hours";
    }

    return `${minutes} Minutes`;
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatusLabel = (status) => {
    if (status === "confirmed") {
      return "Confirmed";
    }

    if (status === "pending") {
      return "Payment Pending";
    }

    if (status === "cancelled") {
      return "Cancelled";
    }

    return status || "Unknown";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="my-bookings-page">
        <section className="my-bookings-container">
          <div className="my-bookings-loading">
            Loading your bookings...
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="my-bookings-page">

      <section className="my-bookings-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="my-bookings-header">

          <div>
            <span className="section-eyebrow">
              MY BOOKINGS
            </span>

            <h1>
              Your mentoring
              <span> sessions.</span>
            </h1>

            <p>
              View your upcoming and previous 1:1
              mentoring sessions in one place.
            </p>
          </div>

          <Link
            to="/mentoring"
            className="my-bookings-new-button"
          >
            Book New Session →
          </Link>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="my-bookings-message error">
            {error}
          </div>
        )}


        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!error && bookings.length === 0 && (
          <div className="my-bookings-empty">

            <div className="my-bookings-empty-icon">
              ○
            </div>

            <h2>
              No bookings yet
            </h2>

            <p>
              You haven't booked a mentoring session yet.
            </p>

            <Link
              to="/mentoring"
              className="my-bookings-empty-button"
            >
              Book Your First Session
            </Link>

          </div>
        )}


        {/* =====================================================
            BOOKINGS
        ===================================================== */}

        {bookings.length > 0 && (
          <div className="my-bookings-list">

            {bookings.map((booking) => (

              <article
                className="my-booking-card"
                key={booking.id}
              >

                {/* TOP */}

                <div className="my-booking-top">

                  <div>
                    <span className="my-booking-label">
                      1:1 MENTORING
                    </span>

                    <h2>
                      Mentoring Session
                    </h2>
                  </div>

                  <span
                    className={`my-booking-status ${
                      booking.status || ""
                    }`}
                  >
                    <span className="my-booking-status-dot">
                      ●
                    </span>

                    {getStatusLabel(
                      booking.status
                    )}
                  </span>

                </div>


                {/* DETAILS */}

                <div className="my-booking-details">

                  <div className="my-booking-detail">

                    <span>
                      Duration
                    </span>

                    <strong>
                      {getDurationLabel(
                        booking.duration_minutes
                      )}
                    </strong>

                  </div>


                  <div className="my-booking-detail">

                    <span>
                      Date
                    </span>

                    <strong>
                      {formatDate(
                        booking.booking_date
                      )}
                    </strong>

                  </div>


                  <div className="my-booking-detail">

                    <span>
                      Time
                    </span>

                    <strong>
                      {formatTime(
                        booking.booking_time
                      )}
                    </strong>

                  </div>


                  <div className="my-booking-detail">

                    <span>
                      Amount
                    </span>

                    <strong>
                      ₹{booking.price}
                    </strong>

                  </div>

                </div>


                {/* PAYMENT */}

                {booking.razorpay_payment_id && (
                  <div className="my-booking-payment">

                    <span>
                      Payment ID
                    </span>

                    <code>
                      {booking.razorpay_payment_id}
                    </code>

                  </div>
                )}

              </article>

            ))}

          </div>
        )}

      </section>

    </main>
  );
};

export default MyBookings;