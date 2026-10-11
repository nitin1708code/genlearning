import React from "react";
import { InView } from "../components/motion-primitives/in-view";

const WhyChooseUs = () => {
  const reasons = [
    {
      number: "01",
      title: "Practical Learning",
      description:
        "Focus on useful skills, hands-on practice and projects instead of only theoretical concepts.",
    },
    {
      number: "02",
      title: "Real Projects",
      description:
        "Build practical projects that help you understand how technology is actually used.",
    },
    {
      number: "03",
      title: "Career Focused",
      description:
        "Learn skills that are relevant to modern development and digital work.",
    },
    {
      number: "04",
      title: "One Platform",
      description:
        "Learn IT skills and get professional digital solutions from the same platform.",
    },
  ];

  return (
    <section className="why-section">
      <div className="why-container">

        {/* Heading */}

        <InView
          className="why-heading"
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
            duration: 1.1,
            ease: "easeInOut",
          }}
          viewOptions={{
            margin: "0px 0px -100px 0px",
          }}
        >
          <span className="section-eyebrow">
            WHY GEN LEARNING
          </span>

          <h2>
            More than just
            <span> learning.</span>
          </h2>

          <p>
            We focus on practical skills, real projects and useful
            digital solutions that create value beyond the classroom.
          </p>
        </InView>


        {/* Main Content */}

        <div className="why-content">

          {/* Left Statement */}

          <InView
            className="why-statement"
            variants={{
              hidden: {
                opacity: 0,
                x: -40,
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
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >
            <div className="why-statement-number">
              04
            </div>

            <h3>
              Learn.
              <br />
              Build.
              <br />
              <span>Grow.</span>
            </h3>

            <p>
              A simple approach to technology: learn the right
              skills, apply them through projects and keep growing.
            </p>
          </InView>


          {/* Reasons */}

          <div className="why-list">

            {reasons.map((reason, index) => (
              <InView
                key={reason.number}
                className="why-item"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 40,
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
                  delay: index * 0.12,
                  ease: "easeInOut",
                }}
                viewOptions={{
                  margin: "0px 0px -70px 0px",
                }}
              >
                <span className="why-number">
                  {reason.number}
                </span>

                <div className="why-item-content">
                  <h3>
                    {reason.title}
                  </h3>

                  <p>
                    {reason.description}
                  </p>
                </div>

                <span className="why-arrow">
                  ↗
                </span>
              </InView>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;