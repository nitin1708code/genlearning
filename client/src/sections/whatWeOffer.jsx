import React from "react";
import { Link } from "react-router-dom";

const WhatWeOffer = () => {
  const offerings = [
    {
      number: "01",
      title: "IT Courses",
      description:
        "Learn practical technology skills through structured courses designed for students, beginners and aspiring developers.",
      features: [
        "Programming & Development",
        "Web Development",
        "Practical Projects",
      ],
      link: "/courses",
      linkText: "Explore Courses",
    },
    {
      number: "02",
      title: "IT Services",
      description:
        "Get professional websites and digital solutions built for individuals, startups and businesses.",
      features: [
        "Website Development",
        "Web Applications",
        "Custom IT Solutions",
      ],
      link: "/services",
      linkText: "View Services",
    },
  ];

  return (
    <section className="offer-section">
      <div className="offer-container">

        {/* Section Heading */}
        <div className="offer-heading">

          <div>
            <span className="section-eyebrow">
              WHAT WE OFFER
            </span>

            <h2>
              Learn technology.
              <br />
              <span>Build with technology.</span>
            </h2>
          </div>

          <p>
            Whether you want to develop your skills or need a
            digital solution, GEN Learning brings both together
            under one platform.
          </p>

        </div>


        {/* Offer Cards */}
        <div className="offer-grid">

          {offerings.map((offer) => (
            <article
              className="offer-card"
              key={offer.number}
            >

              <div className="offer-card-top">

                <span className="offer-number">
                  {offer.number}
                </span>

                <div className="offer-icon">
                  {offer.number === "01" ? "</>" : "↗"}
                </div>

              </div>


              <div className="offer-card-content">

                <h3>
                  {offer.title}
                </h3>

                <p>
                  {offer.description}
                </p>

                <ul>
                  {offer.features.map((feature) => (
                    <li key={feature}>
                      <span className="offer-check">
                        ✓
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>

              </div>


              <Link
                to={offer.link}
                className="offer-link"
              >
                {offer.linkText}

                <span>→</span>
              </Link>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhatWeOffer;