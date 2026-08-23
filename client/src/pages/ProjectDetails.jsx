import React from "react";
import { Link, useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { projectSlug } = useParams();

  const projects = {
    "bus-reservation-system": {
      category: "WEB APPLICATION",
      title: "Bus Reservation System",
      description:
        "A web-based bus reservation platform designed to simplify bus discovery, route management and passenger booking.",
      technologies: ["React", "Node.js", "Database"],
      status: "Completed",
      year: "2026",
      features: [
        "Bus Search",
        "Route Management",
        "Passenger Booking",
        "Reservation Management",
        "Responsive Interface",
      ],
    },

    "gen-learning-store": {
      category: "E-COMMERCE",
      title: "GEN Learning Store",
      description:
        "An e-commerce platform concept designed for browsing products, managing customers and handling online orders.",
      technologies: ["React", "Node.js", "MongoDB"],
      status: "In Development",
      year: "2026",
      features: [
        "Product Listings",
        "Product Management",
        "Shopping Cart",
        "Order Management",
        "Responsive Interface",
      ],
    },

    "business-management-system": {
      category: "WEB APPLICATION",
      title: "Business Management System",
      description:
        "A custom web application concept designed to manage business information, users and operational workflows.",
      technologies: ["React", "Express", "Database"],
      status: "Prototype",
      year: "2026",
      features: [
        "Dashboard",
        "User Management",
        "Data Management",
        "Business Workflows",
        "Admin Controls",
      ],
    },
  };

  const project = projects[projectSlug];

  if (!project) {
    return (
      <main className="project-not-found">

        <span className="section-eyebrow">
          PROJECT NOT FOUND
        </span>

        <h1>
          We couldn't find this project.
        </h1>

        <p>
          The project you're looking for may not exist
          or may have been moved.
        </p>

        <Link
          to="/projects"
          className="project-back-btn"
        >
          ← Back to Projects
        </Link>

      </main>
    );
  }

  return (
    <main className="project-details-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="project-details-hero">

        <div className="project-details-container">

          <Link
            to="/projects"
            className="project-back-link"
          >
            ← All Projects
          </Link>


          <div className="project-details-grid">

            {/* LEFT */}

            <div className="project-details-content">

              <span className="section-eyebrow">
                {project.category}
              </span>

              <h1>
                {project.title}
              </h1>

              <p className="project-details-description">
                {project.description}
              </p>


              <div className="project-details-meta">

                <div>
                  <span>STATUS</span>
                  <strong>{project.status}</strong>
                </div>

                <div>
                  <span>YEAR</span>
                  <strong>{project.year}</strong>
                </div>

              </div>


              <div className="project-details-actions">

                <a
                  href="#features"
                  className="project-primary-btn"
                >
                  Explore Project
                  <span>↓</span>
                </a>

                <Link
                  to="/contact"
                  className="project-secondary-btn"
                >
                  Start Similar Project
                </Link>

              </div>

            </div>


            {/* RIGHT VISUAL */}

            <div className="project-details-visual">

              <div className="project-large-mockup">

                <div className="large-mockup-header">

                  <div className="large-mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="large-mockup-url">
                    project
                  </div>

                </div>


                <div className="large-mockup-body">

                  <div className="large-mockup-nav">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="large-mockup-heading">
                    <span></span>
                    <span></span>
                  </div>

                  <div className="large-mockup-cards">

                    <div></div>
                    <div></div>
                    <div></div>

                  </div>

                  <div className="large-mockup-bottom"></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          PROJECT OVERVIEW
      ======================================== */}

      <section className="project-overview-section">

        <div className="project-details-container">

          <div className="project-overview-grid">

            <div>

              <span className="section-eyebrow">
                PROJECT OVERVIEW
              </span>

              <h2>
                Built with a
                <span> clear purpose.</span>
              </h2>

            </div>

            <p>
              This project focuses on creating a practical,
              easy-to-use digital experience while keeping
              the underlying system organized and scalable.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================
          FEATURES
      ======================================== */}

      <section
        className="project-features-section"
        id="features"
      >

        <div className="project-details-container">

          <div className="project-features-heading">

            <span className="section-eyebrow">
              KEY FEATURES
            </span>

            <h2>
              What the project
              <span> includes.</span>
            </h2>

          </div>


          <div className="project-features-grid">

            {project.features.map(
              (feature, index) => (
                <div
                  className="project-feature-card"
                  key={feature}
                >

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>
                    {feature}
                  </h3>

                  <p>
                    A practical feature designed around
                    the requirements of the project.
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>


      {/* ========================================
          TECH STACK
      ======================================== */}

      <section className="project-stack-section">

        <div className="project-details-container">

          <div className="project-stack-content">

            <div>

              <span className="section-eyebrow">
                TECHNOLOGY
              </span>

              <h2>
                Built using
                <span> modern tools.</span>
              </h2>

            </div>


            <div className="project-stack-list">

              {project.technologies.map(
                (technology, index) => (
                  <div
                    key={technology}
                    className="project-stack-item"
                  >

                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>
                      {technology}
                    </strong>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="project-details-cta">

        <div className="project-details-container">

          <div className="project-details-cta-box">

            <div>

              <span className="section-eyebrow">
                HAVE A SIMILAR IDEA?
              </span>

              <h2>
                Let's build your
                <span> project.</span>
              </h2>

              <p>
                Tell us what you want to build and let's
                discuss the right solution.
              </p>

            </div>

            <Link
              to="/contact"
              className="project-cta-btn"
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

export default ProjectDetails;