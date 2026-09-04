import React from "react";
import { Link } from "react-router-dom";

/* =========================================================
   GEN LEARNING SVG
   ========================================================= */

const GenLearningSVG = () => (
  <svg
    viewBox="0 0 600 340"
    className="project-card-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="600" height="340" rx="20" fill="#0b1020" />
    <rect x="35" y="30" width="530" height="280" rx="14" fill="#111827" />

    {/* Sidebar */}
    <rect x="55" y="50" width="125" height="240" rx="10" fill="#171f38" />
    <rect x="75" y="70" width="85" height="18" rx="5" fill="#6366f1" />

    <rect x="75" y="115" width="70" height="8" rx="4" fill="#475569" />
    <rect x="75" y="140" width="80" height="8" rx="4" fill="#475569" />
    <rect x="75" y="165" width="65" height="8" rx="4" fill="#475569" />
    <rect x="75" y="190" width="75" height="8" rx="4" fill="#475569" />

    {/* Main */}
    <rect x="205" y="55" width="335" height="38" rx="8" fill="#1e293b" />
    <circle cx="225" cy="74" r="8" fill="#6366f1" />

    {/* Cards */}
    <rect x="205" y="115" width="100" height="75" rx="10" fill="#18213a" />
    <rect x="320" y="115" width="100" height="75" rx="10" fill="#18213a" />
    <rect x="435" y="115" width="105" height="75" rx="10" fill="#18213a" />

    <rect x="220" y="135" width="35" height="35" rx="8" fill="#6366f1" />
    <rect x="335" y="135" width="35" height="35" rx="8" fill="#22c55e" />
    <rect x="450" y="135" width="35" height="35" rx="8" fill="#38bdf8" />

    {/* Progress */}
    <rect x="205" y="210" width="335" height="65" rx="10" fill="#18213a" />
    <rect x="225" y="230" width="170" height="8" rx="4" fill="#64748b" />
    <rect x="225" y="250" width="230" height="8" rx="4" fill="#334155" />

    <text
      x="300"
      y="325"
      fill="#94a3b8"
      fontSize="15"
      textAnchor="middle"
      fontFamily="Arial"
    >
      GEN LEARNING
    </text>
  </svg>
);


/* =========================================================
   BUS RESERVATION SVG
   ========================================================= */

const BusReservationSVG = () => (
  <svg
    viewBox="0 0 600 340"
    className="project-card-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="600" height="340" rx="20" fill="#0b1220" />
    <rect x="35" y="30" width="530" height="280" rx="14" fill="#111827" />

    {/* Header */}
    <rect x="60" y="55" width="480" height="42" rx="8" fill="#1e293b" />
    <circle cx="85" cy="76" r="11" fill="#38bdf8" />
    <rect x="110" y="69" width="100" height="12" rx="5" fill="#64748b" />

    {/* Route */}
    <rect x="60" y="120" width="480" height="70" rx="10" fill="#172033" />

    <circle cx="105" cy="155" r="14" fill="#38bdf8" />
    <circle cx="495" cy="155" r="14" fill="#22c55e" />

    <line
      x1="125"
      y1="155"
      x2="475"
      y2="155"
      stroke="#475569"
      strokeWidth="3"
      strokeDasharray="8 8"
    />

    <text
      x="105"
      y="180"
      fill="#94a3b8"
      fontSize="11"
      textAnchor="middle"
      fontFamily="Arial"
    >
      SOURCE
    </text>

    <text
      x="495"
      y="180"
      fill="#94a3b8"
      fontSize="11"
      textAnchor="middle"
      fontFamily="Arial"
    >
      DESTINATION
    </text>

    {/* Seats */}
    <rect x="60" y="210" width="220" height="65" rx="10" fill="#172033" />
    <rect x="300" y="210" width="240" height="65" rx="10" fill="#172033" />

    <rect x="80" y="230" width="28" height="28" rx="5" fill="#38bdf8" />
    <rect x="120" y="230" width="28" height="28" rx="5" fill="#334155" />
    <rect x="160" y="230" width="28" height="28" rx="5" fill="#334155" />
    <rect x="200" y="230" width="28" height="28" rx="5" fill="#22c55e" />

    <rect x="325" y="230" width="120" height="9" rx="4" fill="#64748b" />
    <rect x="325" y="250" width="80" height="9" rx="4" fill="#334155" />

    <text
      x="300"
      y="325"
      fill="#94a3b8"
      fontSize="15"
      textAnchor="middle"
      fontFamily="Arial"
    >
      BUS RESERVATION SYSTEM
    </text>
  </svg>
);


/* =========================================================
   PROJECTS PAGE
   ========================================================= */

const Projects = () => {
  return (
    <main className="projects-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="projects-page-hero">
        <div className="projects-page-container">

          <span className="section-eyebrow">
            OUR WORK
          </span>

          <h1>
            Projects built
            <br />
            <span>with purpose.</span>
          </h1>

          <p>
            A collection of practical projects focused on
            learning, real-world problems and modern web
            technologies.
          </p>

        </div>
      </section>


      {/* =====================================================
          PROJECT SHOWCASE
      ===================================================== */}

      <section className="all-projects-section">
        <div className="projects-page-container">

          <div className="projects-showcase-header">

            <span className="section-eyebrow">
              PROJECT SHOWCASE
            </span>

            <h2>
              What we've been
              <span> building.</span>
            </h2>

            <p>
              Explore some of our projects and experiments
              developed using modern technologies.
            </p>

          </div>


          {/* PROJECT GRID */}

          <div className="projects-grid">

            {/* =================================================
                GEN LEARNING
            ================================================= */}

            <article className="project-card">

              <div className="project-card-image">

                <GenLearningSVG />

                <span className="project-status">
                  In Development
                </span>

              </div>


              <div className="project-card-content">

                <span className="project-category">
                  FULL STACK • EDUCATION
                </span>

                <h3>
                  GEN Learning
                </h3>

                <p>
                  A full-stack learning platform featuring
                  courses, mentoring, authentication and
                  online payments.
                </p>


                <div className="project-tech">

                  <span>React</span>
                  <span>Node.js</span>
                  <span>MySQL</span>
                  <span>Razorpay</span>

                </div>


                <span className="project-view-btn project-disabled-btn">
                  Project Details
                  <span>→</span>
                </span>

              </div>

            </article>


            {/* =================================================
                BUS RESERVATION
            ================================================= */}

            <article className="project-card">

              <div className="project-card-image">

                <BusReservationSVG />

                <span className="project-status">
                  Academic Project
                </span>

              </div>


              <div className="project-card-content">

                <span className="project-category">
                  WEB APPLICATION • MANAGEMENT
                </span>

                <h3>
                  Bus Reservation System
                </h3>

                <p>
                  A reservation management system designed
                  to simplify bus scheduling, seat booking
                  and passenger management.
                </p>


                <div className="project-tech">

                  <span>React</span>
                  <span>Node.js</span>
                  <span>MySQL</span>
                  <span>Razorpay</span>

                </div>


                <Link
                  to="/projects/bus-reservation-system"
                  className="project-view-btn"
                >
                  View Project
                  <span>→</span>
                </Link>

              </div>

            </article>

          </div>


          {/* =================================================
              UPCOMING PROJECTS
          ================================================= */}

          <div className="upcoming-projects">

            <div className="upcoming-projects-header">

              <span className="section-eyebrow">
                UPCOMING
              </span>

              <span className="upcoming-projects-note">
                Currently in planning & development
              </span>

            </div>


            <div className="upcoming-projects-list">

              <div className="upcoming-project-item">
                <span className="upcoming-number">
                  01
                </span>

                <span className="upcoming-name">
                  Connect Campaign
                </span>

                <span className="upcoming-arrow">
                  ↗
                </span>
              </div>


              <div className="upcoming-project-item">
                <span className="upcoming-number">
                  02
                </span>

                <span className="upcoming-name">
                  E-Commerce Platform
                </span>

                <span className="upcoming-arrow">
                  ↗
                </span>
              </div>


              <div className="upcoming-project-item">
                <span className="upcoming-number">
                  03
                </span>

                <span className="upcoming-name">
                  Child Thinking Development
                </span>

                <span className="upcoming-arrow">
                  ↗
                </span>
              </div>


              <div className="upcoming-project-item">
                <span className="upcoming-number">
                  04
                </span>

                <span className="upcoming-name">
                  PillPilot AI
                </span>

                <span className="upcoming-arrow">
                  ↗
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="projects-page-cta">

        <div className="projects-page-container">

          <div className="projects-page-cta-box">

            <div>

              <span className="section-eyebrow">
                HAVE AN IDEA?
              </span>

              <h2>
                Let's build something
                <span> useful.</span>
              </h2>

              <p>
                Have an idea for a website, web application
                or digital solution? Let's discuss it.
              </p>

            </div>


            <Link
              to="/contact"
              className="projects-page-cta-btn"
            >
              Start a Project
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Projects;