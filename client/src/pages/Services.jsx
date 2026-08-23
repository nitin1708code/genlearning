import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      number: "01",
      title: "Website Development",
      description:
        "Modern, responsive and professional websites designed to give your business a strong online presence.",
      features: [
        "Business Websites",
        "Portfolio Websites",
        "Landing Pages",
      ],
      slug: "website-development",
      image: "/services/website-dev.webp",
    },
    {
      number: "02",
      title: "Web Applications",
      description:
        "Custom web applications built around your business workflow, requirements and users.",
      features: [
        "Custom Dashboards",
        "Management Systems",
        "Booking Platforms",
      ],
      slug: "web-applications",
      image: "/services/web-apps.webp",
    },
    {
      number: "03",
      title: "E-Commerce Solutions",
      description:
        "Build an online store with product management, customer flows and a scalable digital experience.",
      features: [
        "Online Stores",
        "Product Management",
        "Order Systems",
      ],
      slug: "ecommerce-solutions",
      image: "/services/ecommerce.webp",
    },
    {
      number: "04",
      title: "Custom Software",
      description:
        "Software solutions developed for specific business processes and operational requirements.",
      features: [
        "Business Software",
        "Custom Features",
        "Database Systems",
      ],
      slug: "custom-software",
      image: "/services/custom-software.webp",
    },
    {
      number: "05",
      title: "UI/UX Design",
      description:
        "Clean and user-focused interfaces designed to make digital products simple and easy to use.",
      features: [
        "Website UI",
        "Web App UI",
        "Responsive Design",
      ],
      slug: "ui-ux-design",
      image: "/services/ui-ux.webp",
    },
    {
      number: "06",
      title: "Website Maintenance",
      description:
        "Ongoing updates, improvements and technical support to keep your website running smoothly.",
      features: [
        "Content Updates",
        "Bug Fixes",
        "Technical Support",
      ],
      slug: "website-maintenance",
      image: "/services/maintenance.webp",
    },
  ];

  return (
    <main className="services-page">

      {/* HERO */}

      <section className="services-hero">
        <div className="services-container">

          <span className="section-eyebrow">
            IT SERVICES
          </span>

          <h1>
            Turn your idea
            <br />
            <span>into a digital product.</span>
          </h1>

          <p>
            We design and develop websites, web applications and
            custom digital solutions for individuals, startups
            and businesses.
          </p>

          <Link
            to="/contact"
            className="services-hero-btn"
          >
            Start Your Project
            <span>→</span>
          </Link>

        </div>
      </section>


      {/* SERVICES */}

      <section className="services-list-section">
        <div className="services-container">

          <div className="services-heading">

            <div>

              <span className="section-eyebrow">
                WHAT WE BUILD
              </span>

              <h2>
                Digital solutions
                <span> for real needs.</span>
              </h2>

            </div>

            <p>
              Choose a service or tell us what you need.
              We'll help turn your requirements into a
              practical digital solution.
            </p>

          </div>


          <div className="services-grid">

            {services.map((service) => (

              <article
                className="service-card"
                key={service.slug}
              >

                <div className="service-card-top">

                  <span className="service-number">
                    {service.number}
                  </span>

                  <div className="service-icon">
                    {"</>"}
                  </div>

                </div>


                {/* SERVICE IMAGE */}

                <div className="service-image">

                  <img
                    src={service.image}
                    alt={service.title}
                     loading="lazy"
                    decoding="async"
                  />

                </div>


                <div className="service-card-body">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <ul>

                    {service.features.map((feature) => (

                      <li key={feature}>

                        <span>✓</span>

                        {feature}

                      </li>

                    ))}

                  </ul>

                </div>


                <Link
                  to={`/services/${service.slug}`}
                  className="service-link"
                >
                  View Service
                  <span>→</span>
                </Link>

              </article>

            ))}

          </div>

        </div>
      </section>


      {/* PROCESS */}

      <section className="process-section">

        <div className="services-container">

          <div className="process-heading">

            <span className="section-eyebrow">
              OUR PROCESS
            </span>

            <h2>
              From idea
              <span> to launch.</span>
            </h2>

            <p>
              A simple and transparent process to take your
              project from an initial idea to a working product.
            </p>

          </div>


          <div className="process-grid">

            {/* 01 */}

            <div className="process-item">

              <span>01</span>

              <div className="process-icon">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.2A8.3 8.3 0 0 1 3 11.5C3 6.8 7 3 12 3s9 3.8 9 8.5Z" />
                  <path d="M8 11h.01" />
                  <path d="M12 11h.01" />
                  <path d="M16 11h.01" />
                </svg>
              </div>

              <h3>
                Discuss
              </h3>

              <p>
                Understand your idea, requirements and goals.
              </p>

            </div>


            {/* 02 */}

            <div className="process-item">

              <span>02</span>

              <div className="process-icon">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="5"
                    y="4"
                    width="14"
                    height="17"
                    rx="2"
                  />
                  <path d="M9 4V3h6v1" />
                  <path d="m8 10 1 1 2-2" />
                  <path d="M13 10h3" />
                  <path d="m8 15 1 1 2-2" />
                  <path d="M13 15h3" />
                </svg>
              </div>

              <h3>
                Plan
              </h3>

              <p>
                Define the features, structure and project scope.
              </p>

            </div>


            {/* 03 */}

            <div className="process-item">

              <span>03</span>

              <div className="process-icon">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m8 8-4 4 4 4" />
                  <path d="m16 8 4 4-4 4" />
                  <path d="m14 4-4 16" />
                </svg>
              </div>

              <h3>
                Build
              </h3>

              <p>
                Design and develop the solution step by step.
              </p>

            </div>


            {/* 04 */}

            <div className="process-item">

              <span>04</span>

              <div className="process-icon">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 3.5c3-.7 5.3.2 6 1-.8.8-1.7 3-1 6l-4.2 4.2-3.5-3.5 2.7-7.7Z" />
                  <path d="m11.8 11.2-3.5-.7-2.8 2.8 4.2 1.4" />
                  <path d="m14.5 14.5.7 3.5-2.8 2.8-1.4-4.2" />
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r="1.2"
                  />
                </svg>
              </div>

              <h3>
                Launch
              </h3>

              <p>
                Test, deploy and hand over the completed product.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}

      <section className="services-cta">

        <div className="services-container">

          <div className="services-cta-box">

            <img
              src="/services/cta-project.webp"
              alt="Build digital solutions with GEN Learning"
              className="services-cta-image"
              loading="lazy"
              decoding="async"
            />

            <div className="services-cta-content">

              <span className="section-eyebrow">
                HAVE AN IDEA?
              </span>

              <h2>
                Let's build it
                <span> together.</span>
              </h2>

              <p>
                Tell us what you're looking for and let's
                discuss your project.
              </p>

              <Link
                to="/contact"
                className="services-cta-btn"
              >
                Get a Quote
                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Services;