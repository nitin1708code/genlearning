
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MentorPopup.css";

const MentorPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Show popup once whenever the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle Escape key and background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleContinue = () => {
    setIsOpen(false);
    navigate("/mentoring");
  };

  if (!isOpen) return null;

  return (
    <div
      className="mentor-popup-overlay"
      onClick={closePopup}
    >
      <div
        className="mentor-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentor-popup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="mentor-popup-close"
          onClick={closePopup}
          aria-label="Close popup"
        >
          &times;
        </button>

        <div className="mentor-popup-content">

          <div className="mentor-popup-brand">
            <span className="mentor-brand-icon">G</span>
            <span>GENLEARNING</span>
          </div>

          <div className="mentor-popup-label">
            PERSONALIZED 1:1 GUIDANCE
          </div>

          <h2 id="mentor-popup-title">
            Meet Your
            <span>MENTOR.</span>
          </h2>

          <p className="mentor-popup-description">
            One-to-one guidance. Focused learning. Real progress.
          </p>

          <button
            type="button"
            className="mentor-popup-button"
            onClick={handleContinue}
          >
            Find Your Mentor
            <span>&rarr;</span>
          </button>

          <p className="mentor-popup-footer">
            Your learning, your pace.
          </p>

        </div>
      </div>
    </div>
  );
};

export default MentorPopup;
