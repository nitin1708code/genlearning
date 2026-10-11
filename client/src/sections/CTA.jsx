import React from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <InView
          className="cta-content"
          variants={{
            hidden: {
              opacity: 0,
              y: 35,
              filter: "blur(4px)",
            },
            visible: {
              opacity: 1,
              y: 0,
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
        </InView>


        <InView
          className="cta-mark"
          variants={{
            hidden: {
              opacity: 0,
              x: 40,
              scale: 0.9,
              filter: "blur(5px)",
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
            margin: "0px 0px -100px 0px",
          }}
        >
          <span>G</span>
        </InView>

      </div>
    </section>
  );
};

export default CTA;