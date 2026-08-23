 import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Course visuals
  const courseImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
         const response = await fetch(
  "https://genlearning-production.up.railway.app/api/courses"
);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch courses"
          );
        }

        setCourses(data.courses);
      } catch (error) {
        console.error("Courses fetch error:", error);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="courses-page">

      {/* HERO */}
      <section className="courses-hero">
        <div className="courses-container">

          <span className="section-eyebrow">
            LEARN WITH GEN LEARNING
          </span>

          <h1>
            Build skills.
            <br />
            <span>Build your future.</span>
          </h1>

          <p>
            Explore practical IT courses designed to help you
            understand technology, build projects and develop
            useful skills.
          </p>

        </div>
      </section>


      {/* COURSE LIST */}
      <section className="courses-list-section">
        <div className="courses-container">

          <div className="courses-header">

            <div>
              <span className="section-eyebrow">
                OUR COURSES
              </span>

              <h2>
                Learn what
                <span> matters.</span>
              </h2>
            </div>

            <p>
              Start with the fundamentals or move towards
              practical development.
            </p>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="courses-status">
              Loading courses...
            </div>
          )}


          {/* ERROR */}
          {!loading && error && (
            <div className="courses-status">
              {error}
            </div>
          )}


          {/* EMPTY */}
          {!loading &&
            !error &&
            courses.length === 0 && (
              <div className="courses-status">
                No courses available.
              </div>
            )}


          {/* COURSES */}
          {!loading && !error && courses.length > 0 && (

            <div className="courses-grid">

              {courses.map((course, index) => (

                <article
                  className="course-card"
                  key={course.id}
                >

                  {/* COURSE IMAGE */}
                  <div className="course-card-image">

                    <img
                      src={
                        course.image ||
                        courseImages[index % courseImages.length]
                      }
                      alt={course.title}
                      loading="lazy"
                    />

                    <div className="course-image-overlay" />

                    <div className="course-card-top">

                      <span className="course-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="course-level">
                        {course.level}
                      </span>

                    </div>

                  </div>


                  {/* CARD CONTENT */}
                  <div className="course-card-body">

                    <div className="course-icon">
                      {"</>"}
                    </div>

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.description}
                    </p>


                    <div className="course-tech">

                      <span>
                        {course.category}
                      </span>

                      <span>
                        {course.duration}
                      </span>

                      <span>
                        {course.lessons} Lessons
                      </span>

                    </div>

                  </div>


                  {/* CARD LINK */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="course-link"
                  >
                    <span>View Course</span>
                    <span>→</span>
                  </Link>

                </article>

              ))}

            </div>

          )}

        </div>
      </section>

    </main>
  );
};

export default Courses;