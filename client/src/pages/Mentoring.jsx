
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Mentoring.css";

const API_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

const plans = [
  {
    name: "Monthly Mentor",
    price: "₹2,999",
    priceValue: 2999,
    schoolPrice: "₹3,999",
    schoolPriceValue: 3999,
    period: "per month",
    sessions: "10 sessions · 1 hour each",
    perSession: "₹300 - 399/ session",
    features: [
      "10 one-to-one sessions",
      "WhatsApp doubt support",
      "Flexible time slots",
    ],
    button: "Continue with Monthly Mentor",
    popular: true,
  },
  {
    name: "Monthly Plus",
    price: "₹3,999",
    priceValue: 3999,
    schoolPrice: "₹4,999",
    schoolPriceValue: 4999,
    period: "per month",
    sessions: "14 sessions · 1 hour each",
    perSession: "₹286 - 358 / session",
    features: [
      "14 one-to-one sessions",
      "Weekly progress notes",
      "WhatsApp doubt support",
    ],
    button: "Continue with Monthly Plus",
    bestValue: true,
  },
  {
    name: "Board / Exam Prep",
    price: "₹8,999",
    priceValue: 8999,
    schoolPrice: "₹11,999",
    schoolPriceValue: 11999,
    period: "for 3 months",
    sessions: "24 sessions · 1 hour each",
    perSession: "₹375 - 499 / session",
    features: [
      "24 one-to-one sessions",
      "Chapter-wise tests",
      "Board exam-focused guidance",
    ],
    button: "Continue with Exam Prep",
  },
  {
    name: "Coding Monthly",
    price: "₹3,999",
    priceValue: 3999,
    schoolPrice: null,
    schoolPriceValue: null,
    period: "per month",
    sessions: "8 sessions · 1 hour each",
    perSession: "₹500 / session",
    features: [
      "8 coding sessions",
      "Project guidance",
      "Concepts and debugging support",
    ],
    button: "Explore Coding Plan",
  },
];

const sessionPlans = [
  {
    name: "Quick Doubt",
    duration: 30,
    durationLabel: "30 Minutes",
    price: "₹250",
    priceValue: 250,
    schoolPrice: "₹350",
    schoolPriceValue: 350,
    note: "One focused question or topic",
    button: "Ask About Quick Doubt",
    isContact: true,
  },
  {
    name: "Single Session",
    duration: 60,
    durationLabel: "1 Hour",
    price: "₹399",
    priceValue: 399,
    schoolPrice: "₹499",
    schoolPriceValue: 499,
    note: "One-to-one help for a subject or topic",
    button: "Book 1 Hour",
  },
  {
    name: "Group Doubt Class",
    duration: 60,
    durationLabel: "1 Hour",
    price: "₹200",
    priceValue: 200,
    schoolPrice: "₹250",
    schoolPriceValue: 250,
    note: "Price per student · Small group of 4–5 students",
    button: "Ask About Group Class",
    isContact: true,
  },
  {
    name: "Coding (1:1)",
    duration: 60,
    durationLabel: "1 Hour",
    price: "₹600",
    priceValue: 600,
    schoolPrice: null,
    note: "College & beyond · Coding, debugging, and project help",
    button: "Ask About Coding",
    isContact: true,
  },
];

const packageKeys = {
  "Monthly Mentor": "monthly-mentor",
  "Monthly Plus": "monthly-plus",
  "Board / Exam Prep": "board-exam-prep",
  "Coding Monthly": "coding-monthly",
};

const sessionKeys = {
  "Quick Doubt": "quick-doubt",
  "Single Session": "single-session",
  "Group Doubt Class": "group-doubt-class",
  "Coding (1:1)": "coding-1-1",
};

const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    let script = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT}"]`
    );

    if (script) {
      script.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );
      script.addEventListener(
        "error",
        () => reject(new Error("Razorpay script failed to load.")),
        { once: true }
      );

      // Handle an already-loaded script.
      if (window.Razorpay) resolve(true);
      return;
    }

    script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout."));

    document.body.appendChild(script);
  });
};

const Mentoring = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryDuration = Number(searchParams.get("duration"));
  const initialDuration =
    queryDuration === 120 ? 120 : 60;

  const [duration, setDuration] = useState(initialDuration);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [helpCategory, setHelpCategory] = useState("");
  const [otherTopic, setOtherTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedClasses, setSelectedClasses] = useState({});

  const price = duration === 60 ? 199 : 349;
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    loadRazorpay().catch((err) => {
      console.error("Razorpay loading error:", err);
    });
  }, []);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  // Existing single-session payment checkout.
  const openRazorpay = (razorpayData, token) => {
    if (
      !razorpayData?.key_id ||
      !razorpayData?.order_id ||
      !razorpayData?.amount
    ) {
      setError("Payment could not be initialized.");
      setLoading(false);
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay checkout is not loaded. Please try again.");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayData.key_id,
      amount: razorpayData.amount,
      currency: razorpayData.currency || "INR",
      name: "GEN Learning",
      description:
        duration === 60
          ? "1 Hour 1:1 Mentoring Session"
          : "2 Hours 1:1 Mentoring Session",
      order_id: razorpayData.order_id,

      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await fetch(
            `${API_URL}/api/mentoring/verify-payment`,
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

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            setError(
              verifyData.message ||
                "Payment verification failed."
            );
            setLoading(false);
            return;
          }

          setError("");
          setMessage(
            "Payment successful! Your mentoring session is confirmed."
          );
          setBookingDate("");
          setBookingTime("");
          setLoading(false);

          setTimeout(() => navigate("/my-bookings"), 1000);
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

      notes: {
        mentoring_duration: `${duration} minutes`,
        booking_date: bookingDate,
        booking_time: bookingTime,
      },

      theme: { color: "#25d6a0" },

      modal: {
        ondismiss: () => {
          setLoading(false);
          setMessage("");
          setError("Payment was cancelled.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error("Razorpay payment failed:", response);
      setError(
        response?.error?.description ||
          "Payment failed. Please try again."
      );
      setLoading(false);
    });

    razorpay.open();
  };

  // Existing single-session booking flow.
  const handleBooking = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        setLoading(false);
        navigate("/login", {
          state: { from: "/mentoring" },
        });
        return;
      }

      if (!bookingDate || !bookingTime) {
        setError("Please select date and time.");
        setLoading(false);
        return;
      }

      await loadRazorpay();

      const response = await fetch(
        `${API_URL}/api/mentoring/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            duration_minutes: duration,
            booking_date: bookingDate,
            booking_time: bookingTime,
            subject: helpCategory,
            custom_topic:
              helpCategory === "Other" ? otherTopic : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create mentoring booking."
        );
        setLoading(false);
        return;
      }

      if (
        !data.razorpay?.key_id ||
        !data.razorpay?.order_id ||
        !data.razorpay?.amount
      ) {
        console.error(
          "Missing Razorpay information:",
          data
        );
        setError("Payment could not be initialized.");
        setLoading(false);
        return;
      }

      openRazorpay(data.razorpay, token);
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

  // Existing single-session plan selection.
  const selectSession = (selectedDuration, session = null) => {
    const classLevel = session?.schoolPrice
      ? selectedClasses[session.name] || "9-10"
      : "college";

    const selectedPrice = session?.schoolPrice
      ? classLevel === "11-12"
        ? session.schoolPriceValue
        : session.priceValue
      : session?.priceValue;

    const sessionKey =
      sessionKeys[session?.name] || "single-session";

    navigate(
      `/mentoring/book?plan=${sessionKey}&duration=${selectedDuration}&classLevel=${encodeURIComponent(
        classLevel
      )}${
        selectedPrice ? `&price=${selectedPrice}` : ""
      }`
    );
  };

  // Monthly package payment: create order, open Razorpay,
  // verify payment, and activate the purchased package.
  const selectPackage = async (plan) => {
    clearMessages();

    const token = localStorage.getItem("genlearningToken");

    if (!token) {
      navigate("/login", {
        state: { from: "/mentoring" },
      });
      return;
    }

    const planKey = packageKeys[plan.name];

    if (!planKey) {
      setError("Invalid mentoring package selected.");
      return;
    }

    const classLevel = plan.schoolPrice
      ? selectedClasses[plan.name] || "9-10"
      : "college";

    setLoading(true);

    try {
      await loadRazorpay();

      // Create package order on the backend.
      const orderResponse = await fetch(
        `${API_URL}/api/mentoring/packages/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_key: planKey,
            class_level: classLevel,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
            "Unable to create package payment order."
        );
      }

      const razorpayData = orderData.razorpay || orderData;

      if (
        !razorpayData.key_id ||
        !razorpayData.order_id ||
        !razorpayData.amount
      ) {
        throw new Error(
          "Payment details are missing from the server."
        );
      }

      const options = {
        key: razorpayData.key_id,
        amount: razorpayData.amount,
        currency: razorpayData.currency || "INR",
        name: "GEN Learning",
        description: `${plan.name} - Full Package Payment`,
        order_id: razorpayData.order_id,
        prefill: orderData.prefill || {},
        theme: {
          color: "#25d6a0",
        },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${API_URL}/api/mentoring/packages/verify-payment`,
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

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                  "Package payment verification failed."
              );
            }

            setError("");
            setMessage(
              `${plan.name} purchased successfully! Your package is now active.`
            );
            setLoading(false);

            setTimeout(() => {
              navigate("/my-packages");
            }, 1200);
          } catch (verificationError) {
            console.error(
              "Package verification error:",
              verificationError
            );
            setError(
              verificationError.message ||
                "Payment verification failed. Please contact support."
            );
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage("");
            setError("Package payment was cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error(
          "Package payment failed:",
          response
        );
        setError(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (packageError) {
      console.error(
        "Package checkout error:",
        packageError
      );
      setError(
        packageError.message ||
          "Unable to start package payment. Please try again."
      );
      setLoading(false);
    }
  };

  const chooseClass = (planName, classLevel) => {
    setSelectedClasses((current) => ({
      ...current,
      [planName]: classLevel,
    }));
  };

  return (
    <main className="gm-page">
      <div className="gm-wrap">
        <header className="gm-head">
          <span className="gm-eyebrow">
            GENLEARNING · 1:1 MENTORING
          </span>

          <h1 className="gm-title">
            Learn with a mentor.
          </h1>

          <p className="gm-sub">
            Choose a monthly plan for consistent progress,
            or book a single session when you need help.
          </p>
        </header>

        <section
          className="gm-group gm-group--monthly"
          aria-labelledby="monthly-plans-title"
        >
          <div className="gm-group-title gm-group-title--featured">
            <div>
              <span className="gm-section-kicker">
                RECOMMENDED FOR CONSISTENT PROGRESS
              </span>

              <h2 id="monthly-plans-title">
                Monthly mentoring plans
              </h2>

              <p>
                Regular sessions, ongoing support, and clear
                pricing by class level.
              </p>
            </div>

            <span className="gm-price-caption">
              Monthly plans are the main focus
            </span>
          </div>

          <div className="gm-cards gm-cards--monthly">
            {plans.map((plan) => {
              const selectedClass =
                plan.schoolPrice
                  ? selectedClasses[plan.name] || "9-10"
                  : "college";

              return (
                <article
                  key={plan.name}
                  className={`gm-card gm-monthly-card${
                    plan.popular ? " is-featured" : ""
                  }${
                    plan.bestValue ? " is-best-value" : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="gm-badge">
                      MOST POPULAR
                    </span>
                  )}

                  {plan.bestValue && (
                    <span className="gm-badge gm-badge--value">
                      BEST PER-SESSION PRICE
                    </span>
                  )}

                  <div className="gm-card-topline">
                    <p className="gm-name">{plan.name}</p>
                    <span className="gm-plan-period">
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className="gm-price-pair"
                    role="group"
                    aria-label={`${plan.name} class level and price`}
                  >
                    <button
                      type="button"
                      className={`gm-price-option gm-price-select${
                        selectedClass === "9-10"
                          ? " is-selected"
                          : ""
                      }`}
                      aria-pressed={
                        selectedClass === "9-10"
                      }
                      onClick={() =>
                        plan.schoolPrice &&
                        chooseClass(plan.name, "9-10")
                      }
                    >
                      <span className="gm-price-label">
                        {plan.schoolPrice
                          ? "Classes 9–10"
                          : "College & beyond"}
                      </span>

                      <span className="gm-price">
                        {plan.price}
                      </span>

                      <span className="gm-price-unit">
                        {plan.period === "for 3 months"
                          ? "total for 3 months"
                          : "per month"}
                      </span>

                      {plan.schoolPrice && (
                        <span className="gm-select-hint">
                          {selectedClass === "9-10"
                            ? "✓ Selected"
                            : "Select this price"}
                        </span>
                      )}
                    </button>

                    {plan.schoolPrice && (
                      <button
                        type="button"
                        className={`gm-price-option gm-price-option--alt gm-price-select${
                          selectedClass === "11-12"
                            ? " is-selected"
                            : ""
                        }`}
                        aria-pressed={
                          selectedClass === "11-12"
                        }
                        onClick={() =>
                          chooseClass(plan.name, "11-12")
                        }
                      >
                        <span className="gm-price-label">
                          Classes 11–12
                        </span>

                        <span className="gm-price">
                          {plan.schoolPrice}
                        </span>

                        <span className="gm-price-unit">
                          {plan.period === "for 3 months"
                            ? "total for 3 months"
                            : "per month"}
                        </span>

                        <span className="gm-select-hint">
                          {selectedClass === "11-12"
                            ? "✓ Selected"
                            : "Select this price"}
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="gm-sessions">
                    {plan.sessions}
                  </p>

                  <p className="gm-persession">
                    {plan.perSession}
                  </p>

                  <ul className="gm-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`gm-btn${
                      plan.popular || plan.bestValue
                        ? " is-primary"
                        : ""
                    }`}
                    onClick={() => selectPackage(plan)}
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : `Pay Now · ${selectedClass}`}
                  </button>
                </article>
              );
            })}
          </div>

          <p className="gm-pricing-footnote">
            Monthly packages are paid fully upfront.
            Your package is activated after successful
            payment verification.
          </p>
        </section>

        <section
          className="gm-group gm-group--single"
          aria-labelledby="single-session-title"
        >
          <div className="gm-group-title">
            <div>
              <span className="gm-section-kicker">
                FLEXIBLE ALTERNATIVES
              </span>

              <h2 id="single-session-title">
                Single sessions & other options
              </h2>

              <p>
                For one-off doubts, group learning, or coding
                support.
              </p>
            </div>
          </div>

          <div className="gm-cards gm-cards--single">
            {sessionPlans.map((session) => (
              <article
                key={session.name}
                className="gm-card gm-single-card"
              >
                <p className="gm-name">{session.name}</p>

                <span className="gm-duration">
                  {session.durationLabel}
                </span>

                {session.schoolPrice ? (
                  <div
                    className="gm-price-pair gm-price-pair--single"
                    role="group"
                    aria-label={`${session.name} class level and price`}
                  >
                    <button
                      type="button"
                      className={`gm-price-option gm-price-select${
                        (selectedClasses[session.name] ||
                          "9-10") === "9-10"
                          ? " is-selected"
                          : ""
                      }`}
                      aria-pressed={
                        (selectedClasses[session.name] ||
                          "9-10") === "9-10"
                      }
                      onClick={() =>
                        chooseClass(session.name, "9-10")
                      }
                    >
                      <span className="gm-price-label">
                        Classes 9–10
                      </span>

                      <span className="gm-price">
                        {session.price}
                      </span>

                      <span className="gm-price-unit">
                        per session
                      </span>

                      <span className="gm-select-hint">
                        {(selectedClasses[session.name] ||
                          "9-10") === "9-10"
                          ? "✓ Selected"
                          : "Select"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`gm-price-option gm-price-option--alt gm-price-select${
                        selectedClasses[session.name] ===
                        "11-12"
                          ? " is-selected"
                          : ""
                      }`}
                      aria-pressed={
                        selectedClasses[session.name] ===
                        "11-12"
                      }
                      onClick={() =>
                        chooseClass(session.name, "11-12")
                      }
                    >
                      <span className="gm-price-label">
                        Classes 11–12
                      </span>

                      <span className="gm-price">
                        {session.schoolPrice}
                      </span>

                      <span className="gm-price-unit">
                        per session
                      </span>

                      <span className="gm-select-hint">
                        {selectedClasses[session.name] ===
                        "11-12"
                          ? "✓ Selected"
                          : "Select"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="gm-price">
                    {session.price}
                  </div>
                )}

                <p className="gm-single-note">
                  {session.note}
                </p>

                <button
                  type="button"
                  className={`gm-btn${
                    session.name === "Single Session"
                      ? " is-primary"
                      : ""
                  }`}
                  onClick={() =>
                    selectSession(session.duration, session)
                  }
                  disabled={loading}
                >
                  {session.button}
                </button>
              </article>
            ))}
          </div>

          {message && (
            <p className="gm-inline-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="gm-inline-error" role="alert">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Mentoring;
