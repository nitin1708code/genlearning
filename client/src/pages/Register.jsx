import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  // ========================================
  // CHECK IF ALREADY LOGGED IN
  // ========================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("genlearningUser");

    const storedToken =
      localStorage.getItem("genlearningToken");

    if (storedUser && storedToken) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setMessage("");
  };


  // ========================================
  // NORMAL REGISTRATION
  // ========================================

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");


    // Password match
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    // Password length
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }


    // Terms
    if (!formData.agree) {
      setError(
        "Please accept the terms to continue."
      );

      return;
    }


    try {
      setLoading(true);

      const response = await fetch(
        "https://genlearning.in/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
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

      console.error(
        "Registration error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // GOOGLE REGISTER / LOGIN
  // ========================================

  const handleGoogleRegister = async (
    credentialResponse
  ) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://genlearning.in/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential:
              credentialResponse.credential,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        setError(
          data.message ||
          "Google login failed."
        );

        return;
      }


      // SAVE AUTH SESSION

      localStorage.setItem(
        "genlearningToken",
        data.token
      );

      localStorage.setItem(
        "genlearningUser",
        JSON.stringify(data.user)
      );


      // GO TO DASHBOARD

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Google registration error:",
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
  // GOOGLE LOGIN ERROR
  // ========================================

  const handleGoogleError = () => {
    setError(
      "Google login failed. Please try again."
    );
  };


  // ========================================
  // VERIFY OTP
  // ========================================

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");


    if (!otp || otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }


    try {
      setLoading(true);

      const response = await fetch(
        "https://genlearning.in/api/auth/verify-email",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        setError(
          data.message ||
          "OTP verification failed."
        );

        return;
      }


      // ========================================
      // SAVE REAL LOGIN SESSION
      // ========================================

      localStorage.setItem(
        "genlearningToken",
        data.token
      );

      localStorage.setItem(
        "genlearningUser",
        JSON.stringify(data.user)
      );


      setMessage(
        "Email verified successfully!"
      );


      navigate("/dashboard");

    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // BACK TO REGISTER
  // ========================================

  const handleBackToRegister = () => {
    setStep("register");

    setOtp("");

    setError("");

    setMessage("");
  };


  // ========================================
  // UI
  // ========================================

  return (
    <main className="register-page">

      <div className="register-container">


        {/* =================================
            LOGO
        ================================= */}

        <Link
          to="/"
          className="register-logo"
        >

          <span className="register-logo-mark">
            G
          </span>

          <span>
            GEN Learning
          </span>

        </Link>


        {/* =================================
            REGISTER STEP
        ================================= */}

        {step === "register" && (

          <div className="register-card">


            {/* HEADING */}

            <div className="register-heading">

              <span className="section-eyebrow">
                GET STARTED
              </span>

              <h1>
                Create your
                <span> account.</span>
              </h1>

              <p>
                Create an account to access your
                learning dashboard and courses.
              </p>

            </div>


            {/* FORM */}

            <form
              className="register-form"
              onSubmit={handleRegister}
            >


              {/* NAME */}

              <div className="register-form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="register-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="register-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-password-input">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
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


              {/* CONFIRM PASSWORD */}

              <div className="register-form-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

              </div>


              {/* TERMS */}

<label className="register-terms">
  <input
    type="checkbox"
    name="agree"
    checked={formData.agree}
    onChange={handleChange}
  />

  <span>
    I agree to the{" "}
    <Link to="/terms">
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link to="/privacy">
      Privacy Policy
    </Link>
    .
  </span>
</label>


              {/* ERROR */}

              {error && (
                <p className="register-error">
                  {error}
                </p>
              )}


              {/* MESSAGE */}

              {message && (
                <p className="register-success">
                  {message}
                </p>
              )}


              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                {loading
                  ? "Sending OTP..."
                  : "Create Account"}

                <span>
                  →
                </span>

              </button>


              {/* =================================
                  GOOGLE LOGIN
              ================================= */}

              <div className="register-divider">
                <span>or</span>
              </div>

              <div className="register-google">

                <GoogleLogin
                  onSuccess={
                    handleGoogleRegister
                  }
                  onError={
                    handleGoogleError
                  }
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />

              </div>

            </form>


            {/* LOGIN */}

            <div className="register-login">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign In
              </Link>

            </div>

          </div>

        )}


        {/* =================================
            OTP STEP
        ================================= */}

        {step === "otp" && (

          <div className="register-card">


            {/* OTP HEADING */}

            <div className="register-heading">

              <span className="section-eyebrow">
                EMAIL VERIFICATION
              </span>

              <h1>
                Verify your
                <span> email.</span>
              </h1>

              <p>
                We sent a 6-digit verification code
                to:
              </p>

              <strong className="otp-email">
                {formData.email}
              </strong>

            </div>


            {/* OTP FORM */}

            <form
              className="register-form"
              onSubmit={handleVerifyOtp}
            >

              <div className="register-form-group">

                <label htmlFor="otp">
                  Verification Code
                </label>

                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) => {

                    const value =
                      event.target.value
                        .replace(/\D/g, "");

                    setOtp(value);

                    setError("");
                    setMessage("");

                  }}
                  autoComplete="one-time-code"
                  required
                />

              </div>


              {/* ERROR */}

              {error && (
                <p className="register-error">
                  {error}
                </p>
              )}


              {/* MESSAGE */}

              {message && (
                <p className="register-success">
                  {message}
                </p>
              )}


              {/* VERIFY */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                {loading
                  ? "Verifying..."
                  : "Verify Email"}

                <span>
                  →
                </span>

              </button>


              {/* BACK */}

              <button
                type="button"
                className="otp-back-btn"
                onClick={
                  handleBackToRegister
                }
              >
                ← Change email
              </button>

            </form>

          </div>

        )}


        {/* =================================
            BACK TO WEBSITE
        ================================= */}

        <Link
          to="/"
          className="register-back"
        >
          ← Back to website
        </Link>

      </div>

    </main>
  );
};

export default Register;