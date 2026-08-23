import React from "react";
import { Link, useParams } from "react-router-dom";

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
        <span className="section-eyebrow">
          SERVICE NOT FOUND
        </span>

        <h1>We couldn't find this service.</h1>

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
      </main>
    );
  }

  return (
    <main className="service-details-page">

      {/* HERO */}
      <section className="service-details-hero">
        <div className="service-details-container">

          <Link
            to="/services"
            className="service-back-link"
          >
            ← All Services
          </Link>

          <div className="service-details-grid">

            <div className="service-details-content">

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

            </div>


            {/* VISUAL */}

            <div className="service-details-visual">

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

            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}

      <section
        className="service-features-section"
        id="features"
      >
        <div className="service-details-container">

          <div className="service-features-heading">

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

          </div>


          <div className="service-features-grid">

            {service.features.map((feature, index) => (
              <div
                className="service-feature"
                key={feature}
              >

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>{feature}</h3>

                  <p>
                    Designed and implemented according to
                    the requirements of your project.
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* PROCESS */}

      <section className="service-process-section">
        <div className="service-details-container">

          <div className="service-process-heading">

            <span className="section-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              Simple process.
              <span> Clear communication.</span>
            </h2>

          </div>


          <div className="service-process-list">

            <div>
              <span>01</span>
              <h3>Discuss</h3>
              <p>
                We understand your idea and requirements.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Plan</h3>
              <p>
                We define scope, features and project direction.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Develop</h3>
              <p>
                We design and build the solution.
              </p>
            </div>

            <div>
              <span>04</span>
              <h3>Deliver</h3>
              <p>
                We test, deploy and hand over the project.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}

      <section className="service-details-cta">
        <div className="service-details-container">

          <div className="service-details-cta-box">

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

          </div>

        </div>
      </section>

    </main>
  );
};

export default ServiceDetails;