import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Mentoring.css";
const API_URL = import.meta.env.VITE_API_URL;

const PLANS = {
  "monthly-mentor": {
    name: "Monthly Mentor",
    kind: "monthly",
    durationLabel: "10 sessions · 1 hour each",
    period: "per month",
    prices: { "9-10": 2999, "11-12": 3999 },
  },
  "monthly-plus": {
    name: "Monthly Plus",
    kind: "monthly",
    durationLabel: "14 sessions · 1 hour each",
    period: "per month",
    prices: { "9-10": 3999, "11-12": 4999 },
  },
  "board-exam-prep": {
    name: "Board / Exam Prep",
    kind: "monthly",
    durationLabel: "24 sessions · 1 hour each",
    period: "for 3 months",
    prices: { "9-10": 8999, "11-12": 11999 },
  },
  "coding-monthly": {
    name: "Coding Monthly",
    kind: "monthly",
    durationLabel: "8 sessions · 1 hour each",
    period: "per month",
    prices: { college: 3999 },
  },
  "quick-doubt": {
    name: "Quick Doubt",
    kind: "contact",
    durationLabel: "30 minutes",
    period: "one-time",
    prices: { "9-10": 250, "11-12": 350 },
  },
  "single-session": {
    name: "Single Session",
    kind: "single",
    durationLabel: "1 hour",
    period: "one-time",
    prices: { "9-10": 399, "11-12": 499 },
  },
  "group-doubt-class": {
    name: "Group Doubt Class",
    kind: "contact",
    durationLabel: "1 hour · group of 4–5",
    period: "per student",
    prices: { "9-10": 200, "11-12": 250 },
  },
  "coding-1-1": {
    name: "Coding (1:1)",
    kind: "contact",
    durationLabel: "1 hour",
    period: "one-time",
    prices: { college: 600 },
  },
};

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const toPlanKey = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const MentoringBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestedPlan = searchParams.get("plan") || "";
  const requestedSession = searchParams.get("session") || "";
  const requestedDuration = Number(searchParams.get("duration"));

  const selectedKey = useMemo(() => {
    // Normalize URL slugs: older plan buttons may send repeated hyphens.
    const normalize = (value = "") =>
      value.toLowerCase().trim().replace(/&/g, "and").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const normalizedPlan = normalize(requestedPlan);
    const normalizedSession = normalize(requestedSession);

    if (PLANS[normalizedPlan]) return normalizedPlan;
    if (PLANS[normalizedSession]) return normalizedSession;

    const fromName = Object.keys(PLANS).find(
      (key) =>
        normalize(PLANS[key].name) === normalizedPlan ||
        normalize(PLANS[key].name) === normalizedSession
    );
    if (fromName) return fromName;

    if (normalizedPlan.includes("board") || normalizedPlan.includes("exam")) return "board-exam-prep";
    if (normalizedPlan.includes("group") || normalizedSession.includes("group")) return "group-doubt-class";
    if (normalizedPlan.includes("coding")) return "coding-monthly";
    if (normalizedPlan.includes("quick") || requestedDuration === 30) return "quick-doubt";
    if (requestedDuration === 120) return "single-session";
    return "single-session";
  }, [requestedPlan, requestedSession, requestedDuration]);

  const option = PLANS[selectedKey];
  const hasSchoolPrices =
    Object.prototype.hasOwnProperty.call(option.prices, "9-10") &&
    Object.prototype.hasOwnProperty.call(option.prices, "11-12");

  const [classLevel, setClassLevel] = useState(
    searchParams.get("classLevel") ||
      (option.prices.college ? "college" : "9-10")
  );
  const [duration, setDuration] = useState(
    option.durationLabel.includes("30 minutes") ? 30 : 60
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("online");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const requestSubmittingRef = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isMonthly = option.kind === "monthly";
  const isSingle = option.kind === "single";
  const needsFullDetails = isSingle || selectedKey === "coding-1-1";
  const isContactOnly = option.kind === "contact";
  const price = option.prices[classLevel] ?? 0;

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (window.Razorpay) return;
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const validateForm = () => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (phone.replace(/\D/g, "").length < 10)
      return "Please enter a valid phone number with at least 10 digits.";

    // Email is required by the mentoring request API for every plan.
    if (!email.trim()) return "Please enter your email address.";

    // Only 1:1 single-session bookings need schedule and subject details.
    if (!needsFullDetails) return "";
    if (!bookingDate || !bookingTime)
      return "Please select your preferred date and time.";
    if (!subject) return "Please select the subject or area you need help with.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent duplicate monthly/enquiry requests, including rapid double-clicks.
    if ((isMonthly || isContactOnly) && (submitted || requestSubmittingRef.current)) {
      return;
    }

    clearMessages();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const bookingDetails = {
      plan_key: selectedKey,
      plan_name: option.name,
      plan_type: option.kind,
      class_level: classLevel,
      amount_displayed: price,
      price_period: option.period,
      duration_label: option.durationLabel,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      booking_date: bookingDate,
      booking_time: bookingTime,
      subject,
      topic: topic.trim(),
      session_mode: mode,
      notes: notes.trim(),
    };

    // Monthly plans and enquiry options are saved through the mentoring request API.
    if (isMonthly || isContactOnly) {
      requestSubmittingRef.current = true;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/mentoring/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: bookingDetails.full_name,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            plan_key: bookingDetails.plan_key,
            class_level: bookingDetails.class_level,
            booking_date: bookingDetails.booking_date || null,
            booking_time: bookingDetails.booking_time || null,
            subject: bookingDetails.subject || null,
            topic: bookingDetails.topic || null,
            session_mode: bookingDetails.session_mode,
            notes: bookingDetails.notes || null,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to submit your mentoring request.");
        }

        setSubmitted(true);
        setMessage(
          "Your mentoring request has been submitted successfully. Our team will contact you soon."
        );
      } catch (requestError) {
        requestSubmittingRef.current = false;
        console.error("Mentoring request submission error:", requestError);
        setError(requestError.message || "Unable to submit your request. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Preserve the existing authenticated Razorpay flow for single sessions only.
    setLoading(true);
    try {
      const token =
        localStorage.getItem("genlearningToken") ||
        localStorage.getItem("companionhub_token") ||
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        navigate("/login", { state: { from: `/mentoring/book?session=${selectedKey}` } });
        return;
      }

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          );
          if (existingScript) {
            existingScript.addEventListener("load", resolve, { once: true });
            existingScript.addEventListener(
              "error",
              () => reject(new Error("Razorpay script failed to load")),
              { once: true }
            );
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Razorpay script failed to load"));
          document.body.appendChild(script);
        });
      }

      if (!window.Razorpay) throw new Error("Razorpay checkout is not available.");

      const response = await fetch(`${API_URL}/api/mentoring/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          duration_minutes: duration,
          class_level: classLevel,
          booking_date: bookingDate,
          booking_time: bookingTime,
          subject,
          custom_topic: subject === "Other" ? topic : topic || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to create mentoring booking.");
      }

      const razorpayData = data.razorpay;
      if (!razorpayData?.key_id || !razorpayData?.order_id || !razorpayData?.amount) {
        throw new Error("Payment could not be initialized by the server.");
      }

      const checkout = new window.Razorpay({
        key: razorpayData.key_id,
        amount: razorpayData.amount,
        currency: razorpayData.currency || "INR",
        name: "GENLearning",
        description: `${duration === 120 ? "2 Hour" : "1 Hour"} 1:1 Mentoring Session`,
        order_id: razorpayData.order_id,
        notes: {
          mentoring_duration: `${duration} minutes`,
          booking_date: bookingDate,
          booking_time: bookingTime,
          subject,
        },
        theme: { color: "#25d6a0" },
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
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok)
              throw new Error(verifyData.message || "Payment verification failed.");

            setMessage("Payment successful! Your mentoring session is confirmed.");
            setLoading(false);
            setTimeout(() => navigate("/my-bookings"), 1000);
          } catch (verificationError) {
            setError(
              verificationError.message ||
                "Payment was successful, but verification failed. Please contact support."
            );
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled.");
          },
        },
      });

      checkout.on("payment.failed", (responseData) => {
        setError(responseData?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      checkout.open();
    } catch (bookingError) {
      console.error("Mentoring booking error:", bookingError);
      setError(bookingError.message || "Unable to initialize booking. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="gm-page gm-page--book">
      <div className="gm-wrap gm-booking-layout">
        <section className="gm-booking-intro">
          <span className="gm-eyebrow">GENLEARNING · BOOKING</span>
          <h1 className="gm-title">
            Book your <span>mentoring.</span>
          </h1>
          <p className="gm-sub">
            Share your details and preferred schedule. Your selected plan and price are shown here.
          </p>

          <div className="gm-booking-summary">
            <span className="gm-summary-kicker">YOUR SELECTION</span>
            <h2>{option.name}</h2>
            <p>{option.durationLabel}</p>
            <div className="gm-summary-price">
              {formatINR(price)} <small>{option.period}</small>
            </div>

            {hasSchoolPrices && (
              <div className="gm-level-toggle" aria-label="Choose class level">
                <button
                  type="button"
                  className={classLevel === "9-10" ? "active" : ""}
                  aria-pressed={classLevel === "9-10"}
                  onClick={() => {
                    setClassLevel("9-10");
                    clearMessages();
                  }}
                >
                  <span>Classes 9–10</span>
                  <strong>{formatINR(option.prices["9-10"])}</strong>
                </button>
                <button
                  type="button"
                  className={classLevel === "11-12" ? "active" : ""}
                  aria-pressed={classLevel === "11-12"}
                  onClick={() => {
                    setClassLevel("11-12");
                    clearMessages();
                  }}
                >
                  <span>Classes 11–12</span>
                  <strong>{formatINR(option.prices["11-12"])}</strong>
                </button>
              </div>
            )}

            {!hasSchoolPrices && (
              <p className="gm-selected-level">
                {classLevel === "college" ? "College students / coding" : classLevel}
              </p>
            )}

            <button type="button" className="gm-book-back" onClick={() => navigate("/mentoring")}>
              ← Change plan
            </button>
          </div>
        </section>

        <section className="gm-booking-panel" id="mentoring-booking-form">
          <div className="gm-booking-panel-head">
            <h2>Booking details</h2>
            <p>Complete the form. Fields marked * are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="gm-booking-form">
            <div className="gm-form-grid">
              <label className="gm-form-field">
                <span>Full name *</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                />
              </label>

              <label className="gm-form-field">
                <span>Phone number *</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={15}
                  required
                  placeholder="Your mobile number"
                />
              </label>

              <label className="gm-form-field gm-form-field--full">
                <span>Email address *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </label>

              {needsFullDetails && (
                <>
              {hasSchoolPrices && (
                <label className="gm-form-field">
                  <span>Class level *</span>
                  <select
                    value={classLevel}
                    onChange={(event) => {
                      setClassLevel(event.target.value);
                      clearMessages();
                    }}
                  >
                    <option value="9-10">Classes 9–10</option>
                    <option value="11-12">Classes 11–12</option>
                  </select>
                </label>
              )}

              {isSingle && (
                <label className="gm-form-field">
                  <span>Session duration *</span>
                  <select
                    value={duration}
                    onChange={(event) => setDuration(Number(event.target.value))}
                  >
                    <option value={60}>1 hour</option>
                  </select>
                </label>
              )}

              <label className="gm-form-field">
                <span>Preferred date *</span>
                <input
                  type="date"
                  min={minDate}
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  required
                />
              </label>

              <label className="gm-form-field">
                <span>Preferred time *</span>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(event) => setBookingTime(event.target.value)}
                  required
                />
              </label>

              <label className="gm-form-field">
                <span>Subject / area *</span>
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Coding">Coding / Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Project Guidance">Project Guidance</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="gm-form-field">
                <span>Session mode *</span>
                <select value={mode} onChange={(event) => setMode(event.target.value)}>
                  <option value="online">Online</option>
                  <option value="in-person">In person (subject to availability)</option>
                </select>
              </label>

              <label className="gm-form-field gm-form-field--full">
                <span>Topic / what do you need help with?</span>
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. Algebra, React project, exam revision"
                />
              </label>

              <label className="gm-form-field gm-form-field--full">
                <span>Additional notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="Your goals, doubts, or mentor preferences"
                />
              </label>
                </>
              )}
            </div>

            <div className="gm-booking-total">
              <div>
                <span>Selected option</span>
                <strong>{option.name}</strong>
              </div>
              <div>
                <span>Selected class</span>
                <strong>
                  {classLevel === "9-10"
                    ? "Classes 9–10"
                    : classLevel === "11-12"
                    ? "Classes 11–12"
                    : "College / Coding"}
                </strong>
              </div>
              <div>
                <span>{selectedKey === "board-exam-prep" ? "Total for 3 months" : "Amount"}</span>
                <strong>{formatINR(price)}</strong>
              </div>
              <small>{option.period} · {option.durationLabel}</small>
            </div>

            {error && <p className="gm-form-error" role="alert">{error}</p>}

            {submitted && (isMonthly || isContactOnly) ? (
              <div
                className="gm-form-notice"
                role="status"
                aria-live="polite"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "18px 20px",
                  borderRadius: "14px",
                  marginTop: "12px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    flex: "0 0 28px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#25d6a0",
                    color: "#06251c",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
                <span>
                  <strong style={{ display: "block", marginBottom: "5px" }}>
                    Request submitted successfully!
                  </strong>
                  <span>
                    Thank you for choosing GENLearning. Our team will contact you soon.
                  </span>
                </span>
              </div>
            ) : (
              <>
                {message && <p className="gm-form-notice" role="status">{message}</p>}
                <button className="gm-booking-submit" type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : isMonthly
                    ? "Submit monthly plan request"
                    : isContactOnly
                    ? (selectedKey === "group-doubt-class" ? "Request group doubt class" : "Submit enquiry")
                    : `Continue to payment · ${formatINR(price)}`}
                </button>
              </>
            )}

            <p className="gm-booking-disclaimer">
              {isMonthly
                ? "Your monthly plan request will be saved securely. GENLearning will contact you to confirm the next steps. No payment is taken here."
                : isContactOnly
                ? "Your enquiry will be saved securely. Availability and next steps will be confirmed by GENLearning. No payment is taken here."
                : "Single-session payment uses the class-specific price calculated by the server. The amount shown by Razorpay checkout is authoritative."}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default MentoringBooking;
