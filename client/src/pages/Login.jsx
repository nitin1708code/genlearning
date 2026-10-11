import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { InView } from "../components/motion-primitives/in-view";
import { BorderTrail } from "../components/motion-primitives/border-trail";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // CHECK IF ALREADY LOGGED IN
  // ========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("genlearningUser");
    const storedToken = localStorage.getItem("genlearningToken");

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
  };

  // ========================================
  // NORMAL LOGIN
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.genlearning.in/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Invalid email or password."
        );
        return;
      }

      localStorage.setItem(
        "genlearningToken",
        data.token
      );

      localStorage.setItem(
        "genlearningUser",
        JSON.stringify(data.user)
      );

      navigate(
        location.state?.from ||
        "/dashboard"
      );

    } catch (error) {
      console.error(
        "Login error:",
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
  // GOOGLE LOGIN
  // ========================================

  const handleGoogleLogin = async (
    credentialResponse
  ) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.genlearning.in/api/auth/google",
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

      localStorage.setItem(
        "genlearningToken",
        data.token
      );

      localStorage.setItem(
        "genlearningUser",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Google login error:",
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
  // UI
  // ========================================

  return (
    <main className="login-page">

      <div className="login-container">

        {/* BRAND */}

        <InView
          className="login-logo"
          variants={{
            hidden: {
              opacity: 0,
              y: -15,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewOptions={{
            once: true,
          }}
        >
          <Link to="/">
            <span className="login-logo-mark">
              G
            </span>

            <span>
              GEN Learning
            </span>
          </Link>
        </InView>


        {/* LOGIN CARD */}

        <InView
          className="login-card"
          variants={{
            hidden: {
              opacity: 0,
              y: 35,
              scale: 0.98,
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
            once: true,
            margin: "0px 0px -80px 0px",
          }}
        >

          {/* BORDER TRAIL */}

          <BorderTrail
            size={100}
            duration={2.5}
          />


          {/* HEADING */}

          <div className="login-heading">

            <span className="section-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Sign in to
              <span> your account.</span>
            </h1>

            <p>
              Access your courses, projects and account.
            </p>

          </div>


          {/* LOGIN FORM */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="login-form-group">

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

            <div className="login-form-group">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>


              <div className="login-password-input">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <label className="login-remember">

              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              <span>
                Remember me
              </span>

            </label>


            {/* ERROR */}

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}


            {/* NORMAL LOGIN */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>


            {/* DIVIDER */}

            <div className="login-divider">
              <span>or</span>
            </div>


            {/* GOOGLE LOGIN */}

            <div className="google-login">

              <GoogleLogin
                onSuccess={
                  handleGoogleLogin
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


          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create one
            </Link>

          </div>

        </InView>


        {/* BACK */}

        <InView
          className="login-back"
          variants={{
            hidden: {
              opacity: 0,
              y: 15,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeInOut",
          }}
          viewOptions={{
            once: true,
          }}
        >
          <Link to="/">
            ← Back to website
          </Link>
        </InView>

      </div>

    </main>
  );
};

export default Login;