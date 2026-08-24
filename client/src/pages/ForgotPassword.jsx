import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  // ========================================
  // SEND OTP
  // ========================================

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.genlearning.in/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to send OTP."
        );
        return;
      }

      setMessage(
        "OTP sent successfully. Check your email."
      );

      setStep("otp");

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // VERIFY OTP
  // ========================================

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.genlearning.in/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid OTP."
        );
        return;
      }

      setMessage(
        "OTP verified successfully."
      );

      setStep("password");

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // RESET PASSWORD
  // ========================================

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.genlearning.in/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="forgot-password-page">

      <div className="forgot-password-container">

        {/* LOGO */}

        <Link
          to="/"
          className="forgot-password-logo"
        >
          <span className="forgot-password-logo-mark">
            G
          </span>

          <span>
            GEN Learning
          </span>
        </Link>


        {/* CARD */}

        <div className="forgot-password-card">

          {/* ================================
              EMAIL
          ================================= */}

          {step === "email" && (

            <>
              <div className="forgot-password-heading">

                <span className="section-eyebrow">
                  PASSWORD RECOVERY
                </span>

                <h1>
                  Forgot your
                  <span> password?</span>
                </h1>

                <p>
                  Enter your registered email and
                  we'll send you a verification code.
                </p>

              </div>


              <form
                className="forgot-password-form"
                onSubmit={handleSendOtp}
              >

                <div className="forgot-password-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    required
                  />

                </div>


                {error && (
                  <p className="forgot-password-error">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="forgot-password-success">
                    {message}
                  </p>
                )}


                <button
                  type="submit"
                  className="forgot-password-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Sending OTP..."
                    : "Send OTP"}

                  <span>→</span>
                </button>

              </form>
            </>
          )}


          {/* ================================
              OTP
          ================================= */}

          {step === "otp" && (

            <>
              <div className="forgot-password-heading">

                <span className="section-eyebrow">
                  EMAIL VERIFICATION
                </span>

                <h1>
                  Enter your
                  <span> OTP.</span>
                </h1>

                <p>
                  We sent a 6-digit code to:
                </p>

                <strong className="forgot-password-email">
                  {email}
                </strong>

              </div>


              <form
                className="forgot-password-form"
                onSubmit={handleVerifyOtp}
              >

                <div className="forgot-password-form-group">

                  <label htmlFor="otp">
                    Verification Code
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(event) => {

                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                      setError("");
                    }}
                    autoComplete="one-time-code"
                    required
                  />

                </div>


                {error && (
                  <p className="forgot-password-error">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="forgot-password-success">
                    {message}
                  </p>
                )}


                <button
                  type="submit"
                  className="forgot-password-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                  <span>→</span>
                </button>


                <button
                  type="button"
                  className="forgot-password-back-btn"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                >
                  ← Change email
                </button>

              </form>
            </>
          )}


          {/* ================================
              NEW PASSWORD
          ================================= */}

          {step === "password" && (

            <>
              <div className="forgot-password-heading">

                <span className="section-eyebrow">
                  NEW PASSWORD
                </span>

                <h1>
                  Create a
                  <span> new password.</span>
                </h1>

                <p>
                  Choose a new password for your
                  GEN Learning account.
                </p>

              </div>


              <form
                className="forgot-password-form"
                onSubmit={handleResetPassword}
              >

                <div className="forgot-password-form-group">

                  <label htmlFor="newPassword">
                    New Password
                  </label>

                  <div className="forgot-password-password">

                    <input
                      id="newPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(
                          event.target.value
                        );
                        setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                <div className="forgot-password-form-group">

                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                  />

                </div>


                {error && (
                  <p className="forgot-password-error">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="forgot-password-success">
                    {message}
                  </p>
                )}


                <button
                  type="submit"
                  className="forgot-password-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}

                  <span>→</span>
                </button>

              </form>
            </>
          )}


          {/* LOGIN */}

          <div className="forgot-password-login">

            <span>
              Remember your password?
            </span>

            <Link to="/login">
              Sign In
            </Link>

          </div>

        </div>


        <Link
          to="/"
          className="forgot-password-back"
        >
          ← Back to website
        </Link>

      </div>

    </main>
  );
};

export default ForgotPassword;