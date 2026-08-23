import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">

        {/* Left Content */}
        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Learn • Build • Grow
          </div>

          <h1 className="hero-title">
            Build Your
            <span> Future </span>
            With Technology.
          </h1>

          <p className="hero-description">
            Learn practical IT skills and get professional digital
            solutions for your business — all in one place.
          </p>

          <div className="hero-actions">
            <Link
              to="/courses"
              className="hero-btn hero-btn-primary"
            >
              Explore Courses
              <span>→</span>
            </Link>

            <Link
              to="/contact"
              className="hero-btn hero-btn-secondary"
            >
              Get a Quote
            </Link>
          </div>

          <div className="hero-note">
            <span className="hero-note-icon">✓</span>

            <div>
              <strong>Learn. Build. Grow.</strong>
              <p>Practical skills for the real world.</p>
            </div>
          </div>

        </div>


        {/* Right Visual */}
        <div className="hero-visual">

          <div className="hero-glow"></div>

          <div className="code-window">

            <div className="code-window-header">

              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>genlearning.js</span>

            </div>

            <div className="code-window-body">

              <div>
                <span className="code-keyword">
                  const
                </span>{" "}
                <span className="code-variable">
                  future
                </span>{" "}
                = {"{"}
              </div>

              <div className="code-line">
                <span className="code-property">
                  learn
                </span>
                :{" "}
                <span className="code-value">
                  true
                </span>
                ,
              </div>

              <div className="code-line">
                <span className="code-property">
                  build
                </span>
                :{" "}
                <span className="code-value">
                  true
                </span>
                ,
              </div>

              <div className="code-line">
                <span className="code-property">
                  grow
                </span>
                :{" "}
                <span className="code-value">
                  true
                </span>
              </div>

              <div>{"};"}</div>

              <div className="code-result">
                <span>✓</span>
                Your future starts here.
              </div>

            </div>
          </div>


          {/* Floating Card 1 */}
          <div className="hero-floating-card hero-card-top">

            <div className="floating-icon">
              &
            </div>

            <div>
              <strong>IT Skills</strong>
              <small>Learn & Grow</small>
            </div>

          </div>


          {/* Floating Card 2 */}
          <div className="hero-floating-card hero-card-bottom">

            <div className="floating-icon">
              ↗
            </div>

            <div>
              <strong>Real Projects</strong>
              <small>Build Experience</small>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;