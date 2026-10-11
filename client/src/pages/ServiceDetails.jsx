import React from "react";
import { Link, useParams } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

const ServiceDetails = () => {
  const { serviceSlug } = useParams();

  const services = {
    "website-development": {
      category: "WEB DEVELOPMENT",
      title: "Website Development",
      description:
        "Professional, responsive websites designed to give your business a strong and modern online presence.",
      features: [
        "Responsive Design",
        "Modern UI",
        "SEO-Friendly Structure",
        "Contact Forms",
        "Performance Optimization",
      ],
    },

    "web-applications": {
      category: "WEB APPLICATIONS",
      title: "Web Applications",
      description:
        "Custom web applications built around your business requirements, users and workflow.",
      features: [
        "Custom Dashboards",
        "User Authentication",
        "Database Integration",
        "Admin Panels",
        "API Integration",
      ],
    },

    "ecommerce-solutions": {
      category: "E-COMMERCE",
      title: "E-Commerce Solutions",
      description:
        "Build a complete online store with product management, customer flows and order management.",
      features: [
        "Product Management",
        "Shopping Cart",
        "Order Management",
        "Customer Accounts",
        "Payment Integration",
      ],
    },

    "custom-software": {
      category: "CUSTOM SOFTWARE",
      title: "Custom Software",
      description:
        "Software solutions designed specifically around your business processes and operational requirements.",
      features: [
        "Custom Features",
        "Business Workflows",
        "Database Systems",
        "Admin Management",
        "Scalable Architecture",
      ],
    },

    "ui-ux-design": {
      category: "UI/UX DESIGN",
      title: "UI/UX Design",
      description:
        "Clean and user-focused interfaces designed to make websites and digital products simple and intuitive.",
      features: [
        "Wireframes",
        "User Interface Design",
        "Responsive Layouts",
        "Design Systems",
        "Prototype Design",
      ],
    },

    "website-maintenance": {
      category: "MAINTENANCE",
      title: "Website Maintenance",
      description:
        "Keep your website secure, updated and running smoothly with ongoing technical support.",
      features: [
        "Content Updates",
        "Bug Fixes",
        "Performance Checks",
        "Technical Support",
        "Feature Updates",
      ],
    },
  };

  const service = services[serviceSlug];

  if (!service) {
    return (
      <main className="service-not-found">

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
        >
          <span className="section-eyebrow">
            SERVICE NOT FOUND
          </span>

          <h1>
            We couldn't find this service.
          </h1>

          <p>
            The service you're looking for may not exist or may
            have been moved.
          </p>

          <Link
            to="/services"
            className="service-back-btn"
          >
            ← Back to Services
          </Link>
        </InView>

      </main>
    );
  }

  return (
    <main className="service-details-page">

      {/* HERO */}

      <section className="service-details-hero">

        <div className="service-details-container">

          <InView
            variants={{
              hidden: {
                opacity: 0,
                x: -20,
              },
              visible: {
                opacity: 1,
                x: 0,
              },
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -60px 0px",
            }}
          >
            <Link
              to="/services"
              className="service-back-link"
            >
              ← All Services
            </Link>
          </InView>


          <div className="service-details-grid">

            {/* LEFT */}

            <InView
              className="service-details-content"
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
                duration: 1.1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >

              <span className="section-eyebrow">
                {service.category}
              </span>

              <h1>
                {service.title}
              </h1>

              <p className="service-details-description">
                {service.description}
              </p>

              <div className="service-details-actions">

                <Link
                  to="/contact"
                  className="service-primary-btn"
                >
                  Get a Quote
                  <span>→</span>
                </Link>

                <a
                  href="#features"
                  className="service-secondary-btn"
                >
                  View Features
                </a>

              </div>

            </InView>


            {/* VISUAL */}

            <InView
              className="service-details-visual"
              variants={{
                hidden: {
                  opacity: 0,
                  x: 40,
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
                duration: 1.1,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >

              <div className="service-visual-card">

                <span className="service-visual-number">
                  01
                </span>

                <div className="service-visual-icon">
                  {"</>"}
                </div>

                <h2>
                  {service.title}
                </h2>

                <div className="service-visual-line"></div>

                <span>
                  GEN Learning
                </span>

              </div>

            </InView>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section
        className="service-features-section"
        id="features"
      >

        <div className="service-details-container">

          <InView
            className="service-features-heading"
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
              WHAT YOU GET
            </span>

            <h2>
              Built around
              <span> your needs.</span>
            </h2>

            <p>
              Every project can be customized according to your
              requirements, goals and budget.
            </p>

          </InView>


          <div className="service-features-grid">

            {service.features.map(
              (feature, index) => (

                <InView
                  className="service-feature"
                  key={feature}
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
                    duration: 0.85,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  viewOptions={{
                    margin: "0px 0px -70px 0px",
                  }}
                >

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>

                    <h3>
                      {feature}
                    </h3>

                    <p>
                      Designed and implemented according to
                      the requirements of your project.
                    </p>

                  </div>

                </InView>

              )
            )}

          </div>

        </div>

      </section>


      {/* PROCESS */}

      <section className="service-process-section">

        <div className="service-details-container">

          <InView
            className="service-process-heading"
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
              HOW IT WORKS
            </span>

            <h2>
              Simple process.
              <span> Clear communication.</span>
            </h2>

          </InView>


          <div className="service-process-list">

            <InView
              variants={{
                hidden: {
                  opacity: 0,
                  x: -30,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.85,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -70px 0px",
              }}
            >
              <span>01</span>

              <h3>
                Discuss
              </h3>

              <p>
                We understand your idea and requirements.
              </p>
            </InView>


            <InView
              variants={{
                hidden: {
                  opacity: 0,
                  x: 30,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.85,
                delay: 0.1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -70px 0px",
              }}
            >
              <span>02</span>

              <h3>
                Plan
              </h3>

              <p>
                We define scope, features and project direction.
              </p>
            </InView>


            <InView
              variants={{
                hidden: {
                  opacity: 0,
                  x: -30,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.85,
                delay: 0.2,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -70px 0px",
              }}
            >
              <span>03</span>

              <h3>
                Develop
              </h3>

              <p>
                We design and build the solution.
              </p>
            </InView>


            <InView
              variants={{
                hidden: {
                  opacity: 0,
                  x: 30,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.85,
                delay: 0.3,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -70px 0px",
              }}
            >
              <span>04</span>

              <h3>
                Deliver
              </h3>

              <p>
                We test, deploy and hand over the project.
              </p>
            </InView>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="service-details-cta">

        <div className="service-details-container">

          <InView
            className="service-details-cta-box"
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
              duration: 1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >

            <div>

              <span className="section-eyebrow">
                READY TO START?
              </span>

              <h2>
                Let's discuss
                <span> your project.</span>
              </h2>

              <p>
                Tell us what you need and we'll discuss the
                best approach for your project.
              </p>

            </div>

            <Link
              to="/contact"
              className="service-cta-btn"
            >
              Get a Quote
              <span>→</span>
            </Link>

          </InView>

        </div>

      </section>

    </main>
  );
};

export default ServiceDetails;