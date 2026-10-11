import React from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

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

        <InView
          className="offer-heading"
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
        </InView>


        {/* Offer Cards */}

        <div className="offer-grid">

          {offerings.map((offer, index) => (
            <InView
              key={offer.number}
              className="offer-card"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
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
                delay: index * 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
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

            </InView>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhatWeOffer;