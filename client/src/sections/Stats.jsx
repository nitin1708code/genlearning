import React from "react";

const Stats = () => {
  const stats = [
    {
      value: "10+",
      label: "IT Skills",
      description: "Practical technologies",
    },
    {
      value: "20+",
      label: "Projects",
      description: "Real-world solutions",
    },
    {
      value: "100%",
      label: "Practical",
      description: "Learning approach",
    },
    {
      value: "24/7",
      label: "Access",
      description: "Online learning support",
    },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">

        <div className="stats-heading">
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
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>

              <strong className="stat-value">
                {stat.value}
              </strong>

              <div className="stat-info">
                <h3>{stat.label}</h3>
                <p>{stat.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;