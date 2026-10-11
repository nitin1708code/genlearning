import React from "react";
import { InView } from "../components/motion-primitives/in-view";
import { AnimatedNumber } from "../components/motion-primitives/animated-number";

const Stats = () => {
  const stats = [
    {
      value: 10,
      suffix: "+",
      label: "IT Skills",
      description: "Practical technologies",
    },
    {
      value: 20,
      suffix: "+",
      label: "Projects",
      description: "Real-world solutions",
    },
    {
      value: 100,
      suffix: "%",
      label: "Practical",
      description: "Learning approach",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Access",
      description: "Online learning support",
    },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">

        {/* =====================================================
            STATS HEADING
        ===================================================== */}

        <InView
          className="stats-heading"
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
          <span className="stats-eyebrow">
            WHY GEN LEARNING
          </span>

          <h2>
            Learn skills that
            <span> actually matter.</span>
          </h2>

          <p>
            Focused learning, practical projects and digital
            solutions designed for today's technology needs.
          </p>
        </InView>


        {/* =====================================================
            STATS GRID
        ===================================================== */}

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <InView
              key={stat.label}
              className="stat-card"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                  scale: 0.96,
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
                duration: 0.8,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >

              <strong className="stat-value">
                <AnimatedNumber
  key={`${stat.label}-${index}`}
  value={stat.value}
/>
                {stat.suffix}
              </strong>

              <div className="stat-info">
                <h3>{stat.label}</h3>
                <p>{stat.description}</p>
              </div>

            </InView>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;