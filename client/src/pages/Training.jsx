
import React from "react";
import { Link } from "react-router-dom";
import "./Training.css";

const Training = () => {
  return (
    <main className="training-page">
      <section className="training-container">

        <div className="training-badge">
          <span className="training-dot"></span>
          GENLEARNING • TRAINING
        </div>

        <div className="training-icon">
          <span>📰</span>
        </div>

        <p className="training-eyebrow">
          SOMETHING NEW IS ON THE WAY
        </p>

        <h1>
          Professional Training.
          <br />
          <span>Coming Soon.</span>
        </h1>

        <p className="training-description">
          We're working on practical, skill-focused training
          programs designed to help you learn, grow, and
          prepare for the future.
        </p>

        <div className="training-status">
          <span className="training-status-dot"></span>
          <span>We're preparing something valuable for you.</span>
        </div>

        <div className="training-actions">
          <Link to="/contact" className="training-primary-btn">
            Stay Connected <span>→</span>
          </Link>

          <Link to="/" className="training-secondary-btn">
            Back to Home
          </Link>
        </div>

        <div className="training-footer">
          <span>LEARN</span>
          <span className="training-footer-dot">•</span>
          <span>BUILD</span>
          <span className="training-footer-dot">•</span>
          <span>GROW</span>
        </div>

      </section>
    </main>
  );
};

export default Training;
