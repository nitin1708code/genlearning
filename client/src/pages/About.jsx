import React from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

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

            <InView
              className="about-hero-content"
              variants={{
                hidden: {
                  opacity: 0,
                  x: -35,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1.1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>


            {/* RIGHT CODE VISUAL */}

            <InView
              className="about-hero-code"
              variants={{
                hidden: {
                  opacity: 0,
                  x: 35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1.2,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>

          </div>
        </div>
      </section>


      {/* ========================================
          WHO WE ARE
      ======================================== */}

      <section className="about-intro-section">
        <div className="about-container">

          <div className="about-intro-grid">

            <InView
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
              <span className="section-eyebrow">
                WHO WE ARE
              </span>

              <h2>
                More than just
                <span> learning.</span>
              </h2>
            </InView>


            <InView
              className="about-intro-text"
              variants={{
                hidden: {
                  opacity: 0,
                  x: 35,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>

          </div>

        </div>
      </section>


      {/* ========================================
          WHAT WE DO
      ======================================== */}

      <section className="about-work-section">
        <div className="about-container">

          <InView
            className="about-section-heading"
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
                filter: "blur(4px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >
            <span className="section-eyebrow">
              WHAT WE DO
            </span>

            <h2>
              Two things.
              <span> One direction.</span>
            </h2>
          </InView>


          <div className="about-work-grid">

            {/* LEARN */}

            <InView
              className="about-work-card"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>


            {/* BUILD */}

            <InView
              className="about-work-card"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>

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

            <InView
              className="about-approach-title"
              variants={{
                hidden: {
                  opacity: 0,
                  x: -35,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1.1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
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
            </InView>


            {/* RIGHT */}

            <div className="about-principles">

              {/* 01 */}

              <InView
                className="about-principle"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 35,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  },
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
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
              </InView>


              {/* 02 */}

              <InView
                className="about-principle"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 35,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  },
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
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
              </InView>


              {/* 03 */}

              <InView
                className="about-principle"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 35,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  },
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.2,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
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
              </InView>


              {/* 04 */}

              <InView
                className="about-principle"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 35,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  },
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
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
              </InView>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          MISSION
      ======================================== */}

      <section className="about-mission-section">
        <div className="about-container">

          <InView
            className="about-mission-box"
            variants={{
              hidden: {
                opacity: 0,
                y: 35,
                scale: 0.98,
                filter: "blur(4px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -100px 0px",
            }}
          >
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
          </InView>

        </div>
      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="about-cta-section">
        <div className="about-container">

          <InView
            className="about-cta-box"
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
                filter: "blur(4px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >
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

          </InView>

        </div>
      </section>

    </main>
  );
};

export default About;