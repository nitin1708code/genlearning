
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

const API_URL = import.meta.env.VITE_API_URL;

const MyPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        setError("Please login to view your packages.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/mentoring/my-packages`,
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
          data.message || "Failed to load packages."
        );
      }

      setPackages(data.packages || []);
    } catch (err) {
      console.error("My packages error:", err);
      setError(
        err.message || "Unable to load your packages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return date;

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const getStatus = (status) => {
    const value = String(status || "").toLowerCase();

    const labels = {
      active: "Active",
      pending: "Payment Pending",
      failed: "Payment Failed",
      cancelled: "Cancelled",
      expired: "Expired",
    };

    return labels[value] || status || "Unknown";
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "active") return "confirmed";
    if (value === "pending") return "pending";

    return "cancelled";
  };

  const getRemainingSessions = (item) => {
    const total = Number(item.total_sessions || 0);
    const used = Number(item.used_sessions || 0);

    return Math.max(total - used, 0);
  };

  return (
    <main className="my-bookings-page">
      {/* HERO */}

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
              MY PACKAGES
            </div>

            <h1>
              Your mentoring
              <span> packages.</span>
            </h1>

            <p>
              Track your purchased mentoring plans,
              remaining sessions, and package validity
              in one place.
            </p>

            <Link
              to="/mentoring"
              className="my-bookings-hero-btn"
            >
              Explore Plans
              <span>↗</span>
            </Link>
          </InView>
        </div>
      </section>

      {/* CONTENT */}

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
            >
              <div className="my-bookings-alert-icon">
                !
              </div>

              <div>
                <strong>
                  Something went wrong
                </strong>
                <p>{error}</p>
              </div>
            </InView>
          )}

          {/* LOADING */}

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
            >
              <div className="my-bookings-spinner"></div>

              <p>Loading your packages...</p>
            </InView>
          ) : packages.length === 0 ? (

            /* EMPTY STATE */

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
            >
              <div className="my-bookings-empty-icon">
                ◷
              </div>

              <div className="my-bookings-eyebrow">
                NO PACKAGES
              </div>

              <h2>
                No active packages yet.
              </h2>

              <p>
                Purchase a mentoring package to start
                learning with a dedicated mentor.
              </p>

              <Link
                to="/mentoring"
                className="my-bookings-primary-btn"
              >
                Explore Packages
                <span>→</span>
              </Link>
            </InView>

          ) : (

            /* PACKAGE LIST */

            <div className="my-bookings-wrapper">

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
              >
                <div>
                  <div className="my-bookings-eyebrow">
                    PACKAGE HISTORY
                  </div>

                  <h2>Your packages</h2>

                  <p>
                    {packages.length}{" "}
                    {packages.length === 1
                      ? "package"
                      : "packages"}{" "}
                    found
                  </p>
                </div>

                <Link
                  to="/mentoring"
                  className="my-bookings-secondary-btn"
                >
                  Buy another
                  <span>↗</span>
                </Link>
              </InView>

              <div className="my-bookings-list">

                {packages.map((item, index) => {
                  const remaining =
                    getRemainingSessions(item);

                  const total = Number(
                    item.total_sessions || 0
                  );

                  const used = Number(
                    item.used_sessions || 0
                  );

                  const progress =
                    total > 0
                      ? Math.min((used / total) * 100, 100)
                      : 0;

                  const statusClass =
                    getStatusClass(item.status);

                  return (
                    <InView
                      key={item.id}
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
                    >

                      {/* CARD TOP */}

                      <div className="my-booking-card-top">
                        <div className="my-booking-title-area">
                          <div className="my-booking-label">
                            GENLEARNING PACKAGE
                          </div>

                          <h3>
                            {item.package_name}
                          </h3>
                        </div>

                        <div
                          className={`my-booking-status ${statusClass}`}
                        >
                          <span className="status-dot"></span>
                          {getStatus(item.status)}
                        </div>
                      </div>

                      <div className="my-booking-divider"></div>

                      {/* DETAILS */}

                      <div className="my-booking-details">

                        <div className="my-booking-detail">
                          <span>CLASS LEVEL</span>
                          <strong>
                            {item.class_level === "college"
                              ? "College"
                              : `Classes ${item.class_level}`}
                          </strong>
                        </div>

                        <div className="my-booking-detail">
                          <span>TOTAL SESSIONS</span>
                          <strong>{total}</strong>
                        </div>

                        <div className="my-booking-detail">
                          <span>REMAINING</span>
                          <strong>{remaining}</strong>
                        </div>

                        <div className="my-booking-detail">
                          <span>AMOUNT PAID</span>
                          <strong>
                            {formatAmount(item.amount)}
                          </strong>
                        </div>

                      </div>

                      {/* SESSION PROGRESS */}

                      <div className="my-booking-payment">
                        <span>SESSION PROGRESS</span>

                        <strong>
                          {used} of {total} sessions used
                        </strong>

                        <div
                          style={{
                            width: "100%",
                            height: "8px",
                            marginTop: "12px",
                            borderRadius: "20px",
                            background: "rgba(128,128,128,0.2)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${progress}%`,
                              height: "100%",
                              borderRadius: "20px",
                              background: "#25d6a0",
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* PURCHASE DETAILS */}

                      <div className="my-booking-details">

                        <div className="my-booking-detail">
                          <span>PURCHASED ON</span>
                          <strong>
                            {formatDate(item.purchased_at)}
                          </strong>
                        </div>

                        <div className="my-booking-detail">
                          <span>VALID UNTIL</span>
                          <strong>
                            {formatDate(item.expires_at)}
                          </strong>
                        </div>

                      </div>

                      {/* PAYMENT ID */}

                      {item.razorpay_payment_id && (
                        <div className="my-booking-payment">
                          <span>PAYMENT ID</span>
                          <strong>
                            {item.razorpay_payment_id}
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

export default MyPackages;
