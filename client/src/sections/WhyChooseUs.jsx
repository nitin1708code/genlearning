import React from "react";

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
        <div className="why-heading">
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
        </div>


        {/* Main Content */}
        <div className="why-content">

          {/* Left Statement */}
          <div className="why-statement">

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

          </div>


          {/* Reasons */}
          <div className="why-list">

            {reasons.map((reason) => (
              <div
                className="why-item"
                key={reason.number}
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

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;