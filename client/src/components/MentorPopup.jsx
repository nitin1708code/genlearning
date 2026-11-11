import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MentorPopup.css";

const SESSION_KEY = "genl_mentor_popup_seen";
const SHOW_DELAY_MS = 1200;
const TARGET_ROUTE = "/mentoring";

// Edit these to match what you actually offer.
const POINTS = [
  "Doubts cleared one-to-one, at your pace",
  "Study plan built around your goals",
  "Career guidance from experienced mentors",
];

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const hasSeenPopup = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

const markPopupSeen = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage can be blocked; popup just may show again */
  }
};

const MentorPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dialogRef = useRef(null);
  const primaryRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Show once per session, and never on the mentoring page itself.
  useEffect(() => {
    if (pathname.startsWith(TARGET_ROUTE) || hasSeenPopup()) return;

    const timer = setTimeout(() => setIsOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  const closePopup = useCallback(() => {
    markPopupSeen();
    setIsOpen(false);
  }, []);

  const handleContinue = () => {
    closePopup();
    navigate(TARGET_ROUTE);
  };

  // Escape key, focus trap, scroll lock, focus restore.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopup();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const items = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, closePopup]);

  if (!isOpen) return null;

  return (
    <div className="mp-overlay" onClick={closePopup}>
      <div
        ref={dialogRef}
        className="mp-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mp-title"
        aria-describedby="mp-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="mp-close"
          onClick={closePopup}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        <div className="mp-body">
          <p className="mp-brand">GenLearning mentoring</p>

          <h2 id="mp-title" className="mp-title">
            Get a personal mentor for your studies and career
          </h2>

          <p id="mp-desc" className="mp-desc">
            Learn one-to-one with an experienced mentor, online, at times that
            suit you.
          </p>

          <ul className="mp-points">
            {POINTS.map((point) => (
              <li key={point}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mp-actions">
            <button
              ref={primaryRef}
              type="button"
              className="mp-btn mp-btn-primary"
              onClick={handleContinue}
            >
              Find your mentor
            </button>
            <button
              type="button"
              className="mp-btn mp-btn-ghost"
              onClick={closePopup}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPopup;