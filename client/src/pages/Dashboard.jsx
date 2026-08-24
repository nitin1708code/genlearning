 import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
  });

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD USER + ENROLLED COURSES
  // ========================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("genlearningUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );
      }
    }

    fetchEnrolledCourses();
  }, []);


  // ========================================
  // FETCH ENROLLED COURSES
  // ========================================

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingCourses(true);
      setError("");

      const token =
        localStorage.getItem(
          "genlearningToken"
        );

      if (!token) {
        setError(
          "Authentication token not found."
        );
        return;
      }

      const response = await fetch(
  "https://genlearning.in/api/enrollments/my",
  {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch courses."
        );
      }

      setCourses(data.courses || []);

    } catch (error) {

      console.error(
        "Dashboard courses error:",
        error
      );

      setError(
        error.message ||
          "Unable to load your courses."
      );

    } finally {
      setLoadingCourses(false);
    }
  };


  // ========================================
  // STATS
  // ========================================

  const stats = useMemo(() => {

    const enrolled = courses.length;

    const completed =
      courses.filter(
        (course) =>
          Number(course.progress) === 100
      ).length;

    const inProgress =
      courses.filter(
        (course) =>
          Number(course.progress) < 100
      ).length;

    return {
      enrolled,
      completed,
      inProgress,
    };

  }, [courses]);


  return (
    <main className="dashboard-page">

      {/* ================================
          HEADER
      ================================= */}

      <section className="dashboard-header">

        <div className="dashboard-container">

          <div>

            <span className="section-eyebrow">
              MY DASHBOARD
            </span>

            <h1>
              Welcome back,
              <span> {user.name}.</span>
            </h1>

            <p>
              Continue learning and keep
              building your skills.
            </p>

          </div>


          <Link
            to="/courses"
            className="dashboard-primary-btn"
          >
            Explore Courses
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* ================================
          STATS
      ================================= */}

      <section className="dashboard-stats-section">

        <div className="dashboard-container">

          <div className="dashboard-stats">

            <div>
              <span>
                ENROLLED COURSES
              </span>

              <strong>
                {String(
                  stats.enrolled
                ).padStart(2, "0")}
              </strong>
            </div>


            <div>
              <span>
                COMPLETED
              </span>

              <strong>
                {String(
                  stats.completed
                ).padStart(2, "0")}
              </strong>
            </div>


            <div>
              <span>
                IN PROGRESS
              </span>

              <strong>
                {String(
                  stats.inProgress
                ).padStart(2, "0")}
              </strong>
            </div>


            <div>
              <span>
                PROJECTS
              </span>

              <strong>
                03
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================================
          MAIN
      ================================= */}

      <section className="dashboard-main-section">

        <div className="dashboard-container">

          <div className="dashboard-grid">


            {/* ================================
                MY COURSES
            ================================= */}

            <div className="dashboard-courses">

              <div className="dashboard-section-heading">

                <div>

                  <span className="section-eyebrow">
                    LEARNING
                  </span>

                  <h2>
                    My <span>courses.</span>
                  </h2>

                </div>

                <Link to="/courses">
                  View all →
                </Link>

              </div>


              {/* LOADING */}

              {loadingCourses && (
                <p>
                  Loading your courses...
                </p>
              )}


              {/* ERROR */}

              {!loadingCourses &&
                error && (
                  <p className="dashboard-error">
                    {error}
                  </p>
                )}


              {/* NO COURSES */}

              {!loadingCourses &&
                !error &&
                courses.length === 0 && (

                  <div className="dashboard-empty">

                    <h3>
                      No courses yet.
                    </h3>

                    <p>
                      Explore our courses and
                      start learning today.
                    </p>

                    <Link to="/courses">
                      Explore Courses →
                    </Link>

                  </div>

                )}


              {/* ENROLLED COURSES */}

              {!loadingCourses &&
                !error &&
                courses.length > 0 && (

                  <div className="dashboard-course-list">

                    {courses.map(
                      (course) => {

                        const progress =
                          Number(
                            course.progress || 0
                          );

                        const completed =
                          progress === 100;

                        return (

                          <div
                            className="dashboard-course-card"
                            key={course.id}
                          >

                            <div className="dashboard-course-top">

                              <div className="dashboard-course-icon">
                                {"</>"}
                              </div>

                              <span>
                                {completed
                                  ? "Completed"
                                  : "In Progress"}
                              </span>

                            </div>


                            <h3>
                              {course.title}
                            </h3>


                            <div className="dashboard-progress-info">

                              <span>
                                Progress
                              </span>

                              <strong>
                                {progress}%
                              </strong>

                            </div>


                            <div className="dashboard-progress">

                              <div
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>


                            <Link
                              to={`/courses/${course.slug}`}
                              className="dashboard-course-btn"
                            >

                              {completed
                                ? "Review Course"
                                : "Continue Learning"}

                              <span>
                                →
                              </span>

                            </Link>

                          </div>

                        );

                      }
                    )}

                  </div>

                )}

            </div>


            {/* ================================
                SIDEBAR
            ================================= */}

            <aside className="dashboard-sidebar">


              {/* QUICK ACTIONS */}

              <div className="dashboard-side-card">

                <span className="section-eyebrow">
                  QUICK ACTIONS
                </span>

                <h3>
                  What do you
                  <span> want to do?</span>
                </h3>


                <div className="dashboard-actions">

                  <Link to="/courses">

                    <span>
                      01
                    </span>

                    Explore Courses

                    <b>
                      →
                    </b>

                  </Link>


                  <Link to="/projects">

                    <span>
                      02
                    </span>

                    View Projects

                    <b>
                      →
                    </b>

                  </Link>


                  <Link to="/contact">

                    <span>
                      03
                    </span>

                    Start a Project

                    <b>
                      →
                    </b>

                  </Link>


                  <Link to="/profile">

                    <span>
                      04
                    </span>

                    Edit Profile

                    <b>
                      →
                    </b>

                  </Link>

                </div>

              </div>


              {/* HELP */}

              <div
                className="
                  dashboard-side-card
                  dashboard-help-card
                "
              >

                <span className="section-eyebrow">
                  NEED HELP?
                </span>

                <h3>
                  Have a
                  <span> question?</span>
                </h3>

                <p>
                  Contact us if you need help
                  with your course or account.
                </p>

                <Link to="/contact">
                  Contact Support →
                </Link>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Dashboard;