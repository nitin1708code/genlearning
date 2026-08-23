import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ========================================
            MAIN FOOTER
        ======================================== */}

        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">

            <Link to="/" className="footer-logo">

              <img
                src="/logo.webp"
                alt="GEN Learning"
                className="footer-logo-image"
                width="169"
                height="55"
              />

              <span className="footer-logo-name">
                GEN Learning
              </span>

            </Link>

            <p>
              Learn practical IT skills, build real projects
              and create digital solutions that matter.
            </p>


            {/* SOCIAL LINKS */}

            <div className="footer-socials">

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="GEN Learning on LinkedIn"
                className="footer-social"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85c0-3.77-2.01-5.52-4.69-5.52-2.16 0-3.13 1.19-3.67 2.03V8.5H9.14V21h3.5v-6.2c0-1.63.31-3.2 2.33-3.2 1.99 0 2.02 1.86 2.02 3.3V21H21v-7.15Z"
                  />
                </svg>
              </a>


              {/* Instagram */}
              <a
                href="#"
                aria-label="GEN Learning on Instagram"
                className="footer-social"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    ry="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    className="instagram-dot"
                  />
                </svg>
              </a>


              {/* YouTube */}
              <a
                href="#"
                aria-label="GEN Learning on YouTube"
                className="footer-social"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M21.6 7.2a2.9 2.9 0 0 0-2.05-2.05C17.74 4.6 12 4.6 12 4.6s-5.74 0-7.55.55A2.9 2.9 0 0 0 2.4 7.2C1.85 9.01 1.85 12 1.85 12s0 2.99.55 4.8a2.9 2.9 0 0 0 2.05 2.05c1.81.55 7.55.55 7.55.55s5.74 0 7.55-.55a2.9 2.9 0 0 0 2.05-2.05c.55-1.81.55-4.8.55-4.8s0-2.99-.55-4.8ZM9.9 15.45v-6.9l5.8 3.45-5.8 3.45Z"
                  />
                </svg>
              </a>


              {/* GitHub */}
              <a
                href="#"
                aria-label="GEN Learning on GitHub"
                className="footer-social"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.77 10.77 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.04.76 2.1v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z"
                  />
                </svg>
              </a>

            </div>

          </div>


          {/* ========================================
              EXPLORE
          ======================================== */}

          <div className="footer-column">

            <h3>Explore</h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/services">
              IT Services
            </Link>

          </div>


          {/* ========================================
              COMPANY
          ======================================== */}

          <div className="footer-column">

            <h3>Company</h3>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact
            </Link>

            <Link to="/contact">
              Get a Quote
            </Link>

            <Link to="/login">
              Login
            </Link>

          </div>


          {/* ========================================
              CONTACT
          ======================================== */}

          <div className="footer-column footer-contact">

            <h3>Let's Talk</h3>

            <a href="mailto:nitinchess17@gmail.com">
              nitinchess17@gmail.com
            </a>

            <span>
              Lucknow, Uttar Pradesh
            </span>

            <Link
              to="/contact"
              className="footer-contact-link"
            >
              Start a conversation →
            </Link>

          </div>

        </div>


        {/* ========================================
            FOOTER BOTTOM
        ======================================== */}

        <div className="footer-bottom">

          <p>
            © {currentYear} GEN Learning. All rights reserved.
          </p>

          <div className="footer-legal">

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;