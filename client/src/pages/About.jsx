import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="about-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="about-hero">
        <div className="about-container">

          <div className="about-hero-grid">

            {/* LEFT CONTENT */}

            <div className="about-hero-content">

              <span className="section-eyebrow">
                ABOUT GEN LEARNING
              </span>

              <h1>
                Learn.
                <br />
                <span>Build. Grow.</span>
              </h1>

              <p>
                GEN Learning is a digital learning and IT solutions
                platform focused on practical skills, real projects
                and useful digital products.
              </p>

            </div>


            {/* RIGHT CODE VISUAL */}

            <div className="about-hero-code">

              <div className="code-window">

                <div className="code-window-top">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="code-content">

                  <div>
                    <span className="code-purple">const</span>{" "}
                    <span className="code-blue">learning</span>{" "}
                    = {"{"}
                  </div>

                  <div className="code-indent">
                    <span className="code-green">skills</span>: [
                  </div>

                  <div className="code-indent-2">
                    "HTML", "CSS", "JavaScript"
                  </div>

                  <div className="code-indent-2">
                    "React", "Node.js", "Database"
                  </div>

                  <div className="code-indent">
                    ],
                  </div>

                  <div className="code-indent">
                    <span className="code-green">projects</span>:{" "}
                    <span className="code-orange">true</span>,
                  </div>

                  <div className="code-indent">
                    <span className="code-green">practice</span>:{" "}
                    <span className="code-orange">true</span>
                  </div>

                  <div>
                    {"}"}
                  </div>

                  <br />

                  <div>
                    <span className="code-purple">while</span>{" "}
                    (learning) {"{"}
                  </div>

                  <div className="code-indent">
                    build();
                  </div>

                  <div className="code-indent">
                    improve();
                  </div>

                  <div>
                    {"}"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          WHO WE ARE
      ======================================== */}

      <section className="about-intro-section">
        <div className="about-container">

          <div className="about-intro-grid">

            <div>

              <span className="section-eyebrow">
                WHO WE ARE
              </span>

              <h2>
                More than just
                <span> learning.</span>
              </h2>

            </div>


            <div className="about-intro-text">

              <p>
                GEN Learning combines technology education with
                digital development services. Our goal is to make
                technology more practical, accessible and useful.
              </p>

              <p>
                We focus on learning through practical concepts,
                projects and real-world applications rather than
                only theoretical knowledge.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          WHAT WE DO
      ======================================== */}

      <section className="about-work-section">
        <div className="about-container">

          <div className="about-section-heading">

            <span className="section-eyebrow">
              WHAT WE DO
            </span>

            <h2>
              Two things.
              <span> One direction.</span>
            </h2>

          </div>


          <div className="about-work-grid">

            {/* LEARN */}

            <div className="about-work-card">

              <span className="about-work-number">
                01
              </span>

              <div className="about-work-icon">
                {"</>"}
              </div>

              <h3>
                Learn
              </h3>

              <p>
                Practical courses and learning resources designed
                to help students and beginners develop useful
                technology skills.
              </p>

              <Link to="/courses">
                Explore Courses →
              </Link>

            </div>


            {/* BUILD */}

            <div className="about-work-card">

              <span className="about-work-number">
                02
              </span>

              <div className="about-work-icon">
                {"↗"}
              </div>

              <h3>
                Build
              </h3>

              <p>
                Websites, web applications and custom digital
                solutions developed according to real business
                requirements.
              </p>

              <Link to="/services">
                Explore Services →
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          APPROACH
      ======================================== */}

      <section className="about-approach-section">
        <div className="about-container">

          <div className="about-approach-grid">

            {/* LEFT */}

            <div className="about-approach-title">

              <span className="section-eyebrow">
                OUR APPROACH
              </span>

              <h2>
                Keep it
                <span> practical.</span>
              </h2>

              <p className="about-approach-description">
                We believe technology is learned best by
                understanding it, applying it and building
                something real with it.
              </p>

              <div className="about-approach-code">

                <div className="approach-code-line">
                  <span className="approach-purple">
                    learn
                  </span>
                  <span>(</span>
                  <span className="approach-green">
                    build
                  </span>
                  <span>)</span>
                </div>

                <div className="approach-code-line">
                  <span className="approach-purple">
                    improve
                  </span>
                  <span>(</span>
                  <span className="approach-blue">
                    repeat
                  </span>
                  <span>)</span>
                </div>

              </div>

            </div>


            {/* RIGHT */}

            <div className="about-principles">

              {/* 01 */}

              <div className="about-principle">

                <span>01</span>

                <div>

                  <h3>
                    Practical First
                  </h3>

                  <p>
                    Focus on concepts that can actually be
                    applied to projects and real situations.
                  </p>

                </div>

              </div>


              {/* 02 */}

              <div className="about-principle">

                <span>02</span>

                <div>

                  <h3>
                    Simple Experience
                  </h3>

                  <p>
                    Keep products and learning experiences
                    clear, focused and easy to understand.
                  </p>

                </div>

              </div>


              {/* 03 */}

              <div className="about-principle">

                <span>03</span>

                <div>

                  <h3>
                    Continuous Growth
                  </h3>

                  <p>
                    Improve skills, products and services
                    through continuous learning and iteration.
                  </p>

                </div>

              </div>


              {/* 04 */}

              <div className="about-principle">

                <span>04</span>

                <div>

                  <h3>
                    Real Projects
                  </h3>

                  <p>
                    Use practical projects to turn knowledge
                    into demonstrable skills.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          MISSION
      ======================================== */}

      <section className="about-mission-section">
        <div className="about-container">

          <div className="about-mission-box">

            <span className="section-eyebrow">
              OUR MISSION
            </span>

            <h2>
              Make technology
              <br />
              <span>more useful.</span>
            </h2>

            <p>
              We want to create a platform where people can
              learn useful technology skills and businesses can
              get practical digital solutions — all through a
              simple and modern experience.
            </p>

          </div>

        </div>
      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="about-cta-section">
        <div className="about-container">

          <div className="about-cta-box">

            <div>

              <span className="section-eyebrow">
                LET'S WORK TOGETHER
              </span>

              <h2>
                Have an idea?
                <span> Let's build it.</span>
              </h2>

            </div>

            <Link
              to="/contact"
              className="about-cta-btn"
            >
              Get Started
              <span>→</span>
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
};

export default About;