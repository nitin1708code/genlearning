import React from "react";
import { Link } from "react-router-dom";

const RecentProjects = () => {
  const projects = [
    {
      number: "01",
      category: "Web Application",
      title: "Bus Reservation System",
      description:
        "A web-based bus reservation platform for searching buses, managing routes and handling passenger bookings.",
      technologies: ["React", "Node.js", "Database"],
      slug: "bus-reservation-system",
    },

    {
      number: "02",
      category: "Custom Software",
      title: "Business Web Application",
      description:
        "A custom web application concept designed around business requirements, workflows and digital operations.",
      technologies: ["React", "Express", "Database"],
      slug: "business-web-application",
    },
  ];

  return (
    <section className="projects-section">
      <div className="projects-container">

        {/* Heading */}
        <div className="projects-heading">

          <div>
            <span className="section-eyebrow">
              RECENT PROJECTS
            </span>

            <h2>
              Things we've
              <span> built.</span>
            </h2>
          </div>

          <Link
            to="/projects"
            className="projects-view-all"
          >
            View All Projects
            <span>→</span>
          </Link>

        </div>


        {/* Projects */}
        <div className="projects-list">

          {projects.map((project) => (
            <article
              className="project-card"
              key={project.slug}
            >

              {/* Project Visual */}
              <div className="project-visual">

                <div className="project-browser">

                  <div className="project-browser-top">

                    <div className="project-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="project-browser-line"></div>

                  </div>

                  <div className="project-browser-content">

                    <div className="project-ui-line large"></div>
                    <div className="project-ui-line"></div>

                    <div className="project-ui-grid">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="project-ui-bottom"></div>

                  </div>

                </div>

                <span className="project-number">
                  {project.number}
                </span>

              </div>


              {/* Project Details */}
              <div className="project-details">

                <span className="project-category">
                  {project.category}
                </span>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>


                {/* Technologies */}
                <div className="project-tech">

                  {project.technologies.map((technology) => (
                    <span key={technology}>
                      {technology}
                    </span>
                  ))}

                </div>


                <Link
                  to={`/projects/${project.slug}`}
                  className="project-link"
                >
                  View Project
                  <span>↗</span>
                </Link>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
};

export default RecentProjects;