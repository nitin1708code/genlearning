import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "genlearningToken"
      );

      if (!token) {
        setError("Please login to view your bookings.");
        setLoading(false);
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


  // =====================================================
  // DURATION
  // =====================================================

  const getDurationLabel = (minutes) => {
    const value = Number(minutes);

    if (value === 2) return "2 Minutes";
    if (value === 60) return "1 Hour";
    if (value === 120) return "2 Hours";

    return `${value} Minutes`;
  };


  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // =====================================================
  // TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const parts = String(time).split(":");

    if (parts.length < 2) {
      return time;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

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


  // =====================================================
  // STATUS
  // =====================================================

  const getStatusLabel = (status) => {
    if (status === "confirmed") {
      return "Confirmed";
    }

    if (status === "pending") {
      return "Payment Pending";
    }

    return status || "Pending";
  };


  return (
    <main className="my-bookings-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="my-bookings-hero">

        <div className="my-bookings-container">

          <InView
            variants={{
              hidden: {
                opacity: 0,
                y: 35,
                filter: "blur(4px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >
            <div className="my-bookings-eyebrow">
              MY BOOKINGS
            </div>

            <h1>
              Your mentoring
              <span> sessions.</span>
            </h1>

            <p>
              View your upcoming and previous
              1:1 mentoring sessions in one place.
            </p>

            <Link
              to="/mentoring"
              className="my-bookings-hero-btn"
            >
              Book New Session
              <span>↗</span>
            </Link>
          </InView>

        </div>

      </section>


      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="my-bookings-content">

        <div className="my-bookings-container">

          {/* ERROR */}

          {error && (
            <InView
              className="my-bookings-alert"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 25,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.9,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -60px 0px",
              }}
            >
              <div className="my-bookings-alert-icon">
                !
              </div>

              <div>
                <strong>
                  Something went wrong
                </strong>

                <p>
                  {error}
                </p>
              </div>
            </InView>
          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <InView
              className="my-bookings-loading"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 25,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.9,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -60px 0px",
              }}
            >
              <div className="my-bookings-spinner"></div>

              <p>
                Loading your bookings...
              </p>

            </InView>

          ) : bookings.length === 0 ? (

            /* =================================================
                EMPTY STATE
            ================================================= */

            <InView
              className="my-bookings-empty"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
              <div className="my-bookings-empty-icon">
                ◷
              </div>

              <div className="my-bookings-eyebrow">
                NO BOOKINGS
              </div>

              <h2>
                No mentoring sessions yet.
              </h2>

              <p>
                Book your first 1:1 mentoring
                session and start learning
                directly with guidance.
              </p>

              <Link
                to="/mentoring"
                className="my-bookings-primary-btn"
              >
                Book a Session
                <span>→</span>
              </Link>

            </InView>

          ) : (

            /* =================================================
                BOOKINGS
            ================================================= */

            <div className="my-bookings-wrapper">

              {/* HEADER */}

              <InView
                className="my-bookings-list-header"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 25,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  },
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
                <div>

                  <div className="my-bookings-eyebrow">
                    BOOKING HISTORY
                  </div>

                  <h2>
                    Your sessions
                  </h2>

                  <p>
                    {bookings.length}{" "}
                    {bookings.length === 1
                      ? "session"
                      : "sessions"}{" "}
                    found
                  </p>

                </div>

                <Link
                  to="/mentoring"
                  className="my-bookings-secondary-btn"
                >
                  Book another
                  <span>↗</span>
                </Link>

              </InView>


              {/* CARDS */}

              <div className="my-bookings-list">

                {bookings.map((booking, index) => {

                  const confirmed =
                    booking.status === "confirmed";

                  return (

                    <InView
                      key={booking.id}
                      className="my-booking-card"
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 35,
                          scale: 0.97,
                          filter: "blur(4px)",
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        },
                      }}
                      transition={{
                        duration: 0.9,
                        delay: index * 0.12,
                        ease: "easeInOut",
                      }}
                      viewOptions={{
                        margin: "0px 0px -70px 0px",
                      }}
                    >

                      {/* CARD TOP */}

                      <div className="my-booking-card-top">

                        <div className="my-booking-title-area">

                          <div className="my-booking-label">
                            1:1 MENTORING
                          </div>

                          <h3>
                            {getDurationLabel(
                              booking.duration_minutes
                            )}
                          </h3>

                        </div>


                        <div
                          className={
                            confirmed
                              ? "my-booking-status confirmed"
                              : "my-booking-status pending"
                          }
                        >
                          <span className="status-dot"></span>

                          {getStatusLabel(
                            booking.status
                          )}
                        </div>

                      </div>


                      {/* DIVIDER */}

                      <div className="my-booking-divider"></div>


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
                            ₹
                            {Number(
                              booking.price
                            ).toFixed(2)}
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
                              {
                                booking.razorpay_payment_id
                              }
                            </strong>

                          </div>

                        )}

                    </InView>

                  );

                })}

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default MyBookings;