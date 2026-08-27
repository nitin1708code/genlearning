import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        setError("Please login to view your bookings.");
        return;
      }

      const response = await fetch(
        "https://api.genlearning.in/api/mentoring/my-bookings",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("My bookings error:", error);

      setError(
        error.message ||
          "Unable to load your mentoring bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getDurationLabel = (minutes) => {
    if (Number(minutes) === 2) return "2 Minutes";
    if (Number(minutes) === 60) return "1 Hour";
    if (Number(minutes) === 120) return "2 Hours";

    return `${minutes} Minutes`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = String(time)
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <main className="my-bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="my-bookings-header">

        <div className="my-bookings-container">

          <span className="section-eyebrow">
            MY BOOKINGS
          </span>

          <h1>
            Your mentoring
            <span> sessions.</span>
          </h1>

          <p>
            View your upcoming and previous
            1:1 mentoring sessions in one place.
          </p>

        </div>

      </section>


      {/* =================================================
          BOOKINGS
      ================================================= */}

      <section className="my-bookings-main">

        <div className="my-bookings-container">

          {/* ERROR */}

          {error && (
            <div className="my-bookings-message error">
              {error}
            </div>
          )}


          {/* LOADING */}

          {loading ? (
            <div className="my-bookings-empty">
              <div className="my-bookings-loader"></div>

              <p>
                Loading your bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (

            /* EMPTY */

            <div className="my-bookings-empty">

              <div className="my-bookings-empty-icon">
                ◷
              </div>

              <h2>
                No mentoring sessions yet.
              </h2>

              <p>
                Book your first 1:1 mentoring
                session and start learning directly
                with guidance.
              </p>

              <Link
                to="/mentoring"
                className="my-bookings-primary-btn"
              >
                Book a Session
                <span>→</span>
              </Link>

            </div>

          ) : (

            /* BOOKINGS */

            <div className="my-bookings-list">

              <div className="my-bookings-list-header">

                <div>
                  <span className="section-eyebrow">
                    BOOKING HISTORY
                  </span>

                  <h2>
                    Your sessions
                  </h2>
                </div>

                <Link
                  to="/mentoring"
                  className="my-bookings-secondary-btn"
                >
                  Book another
                </Link>

              </div>


              {bookings.map((booking) => {

                const confirmed =
                  booking.status === "confirmed";

                return (
                  <article
                    key={booking.id}
                    className="my-booking-card"
                  >

                    {/* TOP */}

                    <div className="my-booking-card-top">

                      <div>

                        <span className="my-booking-label">
                          1:1 MENTORING
                        </span>

                        <h3>
                          {getDurationLabel(
                            booking.duration_minutes
                          )}
                        </h3>

                      </div>

                      <span
                        className={
                          confirmed
                            ? "my-booking-status confirmed"
                            : "my-booking-status pending"
                        }
                      >
                        {confirmed
                          ? "Confirmed"
                          : "Pending"}
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div className="my-booking-details">

                      <div className="my-booking-detail">

                        <span>
                          DATE
                        </span>

                        <strong>
                          {formatDate(
                            booking.booking_date
                          )}
                        </strong>

                      </div>


                      <div className="my-booking-detail">

                        <span>
                          TIME
                        </span>

                        <strong>
                          {formatTime(
                            booking.booking_time
                          )}
                        </strong>

                      </div>


                      <div className="my-booking-detail">

                        <span>
                          AMOUNT
                        </span>

                        <strong>
                          ₹{booking.price}
                        </strong>

                      </div>

                    </div>


                    {/* PAYMENT */}

                    {confirmed &&
                      booking.razorpay_payment_id && (
                        <div className="my-booking-payment">

                          <span>
                            PAYMENT ID
                          </span>

                          <strong>
                            {booking.razorpay_payment_id}
                          </strong>

                        </div>
                      )}

                  </article>
                );
              })}

            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default MyBookings;