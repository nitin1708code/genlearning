import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // FETCH COURSE FROM DATABASE
  // ========================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  `https://api.genlearning.in/api/courses/${courseId}`,
  {
    cache: "no-store",
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Course not found"
          );
        }

        setCourse(data.course);

      } catch (error) {
        console.error("Course fetch error:", error);
        setError("Course could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);


  // ========================================
  // CHECK IF USER IS ALREADY ENROLLED
  // ========================================

  useEffect(() => {
    const checkEnrollment = async () => {
      const token = localStorage.getItem(
        "genlearningToken"
      );

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          "https://api.genlearning.in/api/enrollments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {

          const enrolled = data.courses.some(
            (item) => item.id === course?.id
          );

          setIsEnrolled(enrolled);
        }

      } catch (error) {
        console.error(
          "Enrollment check error:",
          error
        );
      }
    };

    if (course) {
      checkEnrollment();
    }

  }, [course]);


  // ========================================
  // ENROLL
  // ========================================

   const handleEnroll = async () => {
  const token = localStorage.getItem("genlearningToken");

  // User is not logged in
  if (!token) {
    navigate("/login");
    return;
  }

  // Already enrolled
  if (isEnrolled) {
    navigate("/dashboard");
    return;
  }

  try {
    setEnrolling(true);
    setError("");

    // ========================================
    // CREATE RAZORPAY ORDER
    // ========================================

    const orderResponse = await fetch(
       "https://api.genlearning.in/api/payments/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          courseId: course.id,
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(
        orderData.message || "Failed to create payment order"
      );
    }

    // ========================================
    // OPEN RAZORPAY CHECKOUT
    // ========================================

    const options = {
      key: orderData.keyId,

      amount: orderData.order.amount,

      currency: orderData.order.currency,

      name: "GEN Learning",

      description: course.title,

      order_id: orderData.order.id,

      handler: async function (response) {

        // ========================================
        // VERIFY PAYMENT
        // ========================================

        const verifyResponse = await fetch(
          "https://api.genlearning.in/api/payments/verify-payment",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              courseId: course.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(
            verifyData.message || "Payment verification failed"
          );
        }

        setIsEnrolled(true);

        navigate("/dashboard");
      },

      prefill: {
        name: "",
        email: "",
      },

      theme: {
        color: "#000000",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

    razorpay.on("payment.failed", function () {
      setError("Payment failed. Please try again.");
      setEnrolling(false);
    });

  } catch (error) {

    console.error(
      "Payment error:",
      error
    );

    setError(
      error.message ||
      "Unable to start payment."
    );

    setEnrolling(false);
  }
};

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="course-not-found">
        <div>
          <span className="section-eyebrow">
            LOADING COURSE
          </span>

          <h1>
            Loading...
          </h1>

          <p>
            Please wait while we load the course.
          </p>
        </div>
      </main>
    );
  }


  // ========================================
  // COURSE NOT FOUND
  // ========================================

  if (!course) {
    return (
      <main className="course-not-found">

        <div>

          <span className="section-eyebrow">
            COURSE NOT FOUND
          </span>

          <h1>
            This course
            <span> doesn't exist.</span>
          </h1>

          <p>
            {error ||
              "The course you are looking for could not be found."}
          </p>

          <Link to="/courses">
            ← Back to Courses
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="course-detail-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="course-detail-hero">

        <div className="course-detail-container">

          {/* BREADCRUMB */}

          <div className="course-detail-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <span>/</span>

            <Link to="/courses">
              Courses
            </Link>

            <span>/</span>

            <span>
              {course.title}
            </span>

          </div>


          <div className="course-detail-grid">

            {/* ========================================
                LEFT CONTENT
            ======================================== */}

            <div className="course-detail-content">

              <span className="section-eyebrow">
                {course.category}
              </span>

              <h1>
                {course.title}
              </h1>

              <p className="course-detail-description">
                {course.description}
              </p>


              {/* COURSE META */}

              <div className="course-detail-meta">

                <div>
                  <span>
                    LEVEL
                  </span>

                  <strong>
                    {course.level}
                  </strong>
                </div>


                <div>
                  <span>
                    DURATION
                  </span>

                  <strong>
                    {course.duration}
                  </strong>
                </div>


                <div>
                  <span>
                    LESSONS
                  </span>

                  <strong>
                    {course.lessons}
                  </strong>
                </div>


                <div>
                  <span>
                    STUDENTS
                  </span>

                  <strong>
                    {course.students}
                  </strong>
                </div>

              </div>

            </div>


            {/* ========================================
                PRICE CARD
            ======================================== */}

            <aside className="course-detail-price-card">

              <div className="course-detail-course-icon">
                {"</>"}
              </div>


              <span className="course-price-label">
                COURSE PRICE
              </span>


              <div className="course-price">

                <strong>
                  ₹{Number(course.price).toLocaleString("en-IN")}
                </strong>

                {course.old_price && (
                  <del>
                    ₹{Number(course.old_price).toLocaleString("en-IN")}
                  </del>
                )}

              </div>


              <p>
                Lifetime access • Certificate included
              </p>


              {/* ENROLL BUTTON */}

               {!isEnrolled ? (
  <button
    type="button"
    className="course-enroll-btn"
    onClick={handleEnroll}
    disabled={enrolling}
  >
    {enrolling ? "Enrolling..." : "Enroll Now"}
    <span>→</span>
  </button>
) : (
  <span className="course-secure-text">
    You are already enrolled in this course
  </span>
)}


               

            </aside>

          </div>

        </div>

      </section>


      {/* ========================================
          COURSE INFORMATION
      ======================================== */}

      <section className="course-detail-main">

        <div className="course-detail-container">

          <div className="course-content-grid">

            {/* COURSE OVERVIEW */}

            <div>

              <span className="section-eyebrow">
                COURSE OVERVIEW
              </span>

              <h2>
                Learn what
                <span> matters.</span>
              </h2>

              <p className="course-detail-description">
                {course.description}
              </p>


              <div className="course-skills">

                <div className="course-skill">
                  <span>01</span>
                  <strong>
                    Practical Learning
                  </strong>
                </div>

                <div className="course-skill">
                  <span>02</span>
                  <strong>
                    Project-Based Development
                  </strong>
                </div>

                <div className="course-skill">
                  <span>03</span>
                  <strong>
                    Industry Relevant Skills
                  </strong>
                </div>

                <div className="course-skill">
                  <span>04</span>
                  <strong>
                    Hands-on Practice
                  </strong>
                </div>

              </div>

            </div>


            {/* COURSE CONTENT */}

            <div className="course-modules-card">

              <span className="section-eyebrow">
                COURSE CONTENT
              </span>

              <h3>
                Course information
              </h3>


              <div className="course-modules">

                <div className="course-module">

                  <span>
                    01
                  </span>

                  <strong>
                    Course Level
                  </strong>

                  <span>
                    {course.level}
                  </span>

                </div>


                <div className="course-module">

                  <span>
                    02
                  </span>

                  <strong>
                    Duration
                  </strong>

                  <span>
                    {course.duration}
                  </span>

                </div>


                <div className="course-module">

                  <span>
                    03
                  </span>

                  <strong>
                    Lessons
                  </strong>

                  <span>
                    {course.lessons}
                  </span>

                </div>


                <div className="course-module">

                  <span>
                    04
                  </span>

                  <strong>
                    Students
                  </strong>

                  <span>
                    {course.students}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CTA
      ======================================== */}

      <section className="course-detail-cta">

        <div className="course-detail-container">

          <span className="section-eyebrow">
            READY TO START?
          </span>

          <h2>
            Start building your
            <span> future.</span>
          </h2>

          <p>
            Join the course and start learning today.
          </p>


           {!isEnrolled && (
  <button
    type="button"
    className="course-cta-btn"
    onClick={handleEnroll}
    disabled={enrolling}
  >
    {enrolling ? "Enrolling..." : "Enroll Now →"}
  </button>
)}

        </div>

      </section>

    </main>
  );
};

export default CourseDetail;