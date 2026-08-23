import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <div className="cta-content">
          <span className="section-eyebrow">
            HAVE A PROJECT IN MIND?
          </span>

          <h2>
            Let's build something
            <span> useful.</span>
          </h2>

          <p>
            Tell us what you want to build. Whether it's a website,
            web application or custom digital solution, let's turn
            your idea into reality.
          </p>

          <div className="cta-actions">
            <Link
              to="/contact"
              className="cta-primary"
            >
              Start a Project
              <span>→</span>
            </Link>

            <Link
              to="/services"
              className="cta-secondary"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="cta-mark">
          <span>G</span>
        </div>

      </div>
    </section>
  );
};

export default CTA;