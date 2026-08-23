 import React from "react";
import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <main className="projects-page">

      {/* HERO */}
      <section className="projects-page-hero">
        <div className="projects-page-container">

          <span className="section-eyebrow">
            OUR WORK
          </span>

          <h1>
            Building ideas
            <br />
            <span>that make an impact.</span>
          </h1>

          <p>
            We're currently working on practical digital products
            and real-world solutions. Our project showcase will
            be updated as new projects are completed.
          </p>

        </div>
      </section>


      {/* COMING SOON */}
      <section className="all-projects-section">
        <div className="projects-page-container">

          <div className="projects-coming-soon">

            <div className="projects-coming-number">
              01
            </div>

            <span className="section-eyebrow">
              PROJECT SHOWCASE
            </span>

            <h2>
              Something useful is
              <span> being built.</span>
            </h2>

            <p>
              We're developing projects focused on learning,
              business solutions and modern web technologies.
              Completed projects will be showcased here with
              their features, technology stack and details.
            </p>

            <div className="projects-coming-tags">
              <span>Web Applications</span>
              <span>E-Commerce</span>
              <span>Digital Solutions</span>
              <span>Learning Projects</span>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
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
                Have an idea for a website, web application or
                digital solution? Let's discuss it.
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