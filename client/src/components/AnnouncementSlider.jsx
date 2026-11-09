import React from "react";
import { Link } from "react-router-dom";
import "./AnnouncementSlider.css";

/*
  Edit announcements here.
  `to` accepts an internal React Router path.
  Duplicate items are created automatically for seamless scrolling.
*/
const announcements = [
  {
    label: "REGISTRATION OPEN",
    message: "Join GENLearning today",
    to: "/register",
    type: "new",
  },
  {
    label: "SPECIAL OFFER",
    message: "Explore courses and available offers",
    to: "/courses",
    type: "offer",
  },
  {
    label: "NEW",
    message: "Discover our latest courses",
    to: "/courses",
    type: "new",
  },
  {
    label: "MENTORSHIP",
    message: "Get personalized 1:1 guidance",
    to: "/mentoring",
    type: "mentor",
  },
];

const AnnouncementSlider = () => {
  const repeatedAnnouncements = [...announcements, ...announcements];

  return (
    <div
      className="announcement-slider"
      aria-label="GENLearning announcements"
    >
      <div className="announcement-track">
        {repeatedAnnouncements.map((item, index) => (
          <Link
            key={`${item.label}-${index}`}
            to={item.to}
            className="announcement-item"
            tabIndex={index < announcements.length ? 0 : -1}
            aria-hidden={index >= announcements.length}
          >
            <span className={`announcement-tag announcement-tag-${item.type}`}>
              {item.label}
            </span>
            <span className="announcement-message">{item.message}</span>
            <span className="announcement-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementSlider;
