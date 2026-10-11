import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { InView } from "../components/motion-primitives/in-view";
import { TextEffect } from "../components/motion-primitives/text-effect";

/* ============================================================
   RANDOM CODE EXAMPLES
============================================================ */

const codeExamples = [
  {
    language: "JavaScript",
    code: `const numbers = [1, 2, 3, 4, 5];

const total = numbers.reduce(
  (sum, n) => sum + n,
  0
);

console.log(total);`,
    output: "15",
  },

  {
    language: "Python",
    code: `numbers = [10, 20, 30]

total = sum(numbers)

print(total)`,
    output: "60",
  },

  {
    language: "Java",
    code: `int a = 10;
int b = 20;

int result = a + b;

System.out.println(result);`,
    output: "30",
  },

  {
    language: "C++",
    code: `int a = 5;
int b = 7;

cout << a + b;`,
    output: "12",
  },

  {
    language: "JavaScript",
    code: `const user = {
  name: "Nitin",
  skills: 5
};

console.log(user.name);`,
    output: "Nitin",
  },

  {
    language: "Python",
    code: `name = "GenLearning"
skills = 3

print(f"{name}: {skills} skills")`,
    output: "GenLearning: 3 skills",
  },

  {
    language: "Java",
    code: `String course = "BCA";
int semester = 4;

System.out.println(
  course + " - Semester " + semester
);`,
    output: "BCA - Semester 4",
  },

  {
    language: "JavaScript",
    code: `const users = ["Alex", "Sam", "John"];

users.forEach(user => {
  console.log("Hello " + user);
});`,
    output: `Hello Alex
Hello Sam
Hello John`,
  },

  {
    language: "Python",
    code: `for i in range(1, 6):
    print(i * i)`,
    output: `1
4
9
16
25`,
  },

  {
    language: "C++",
    code: `int numbers[] = {2, 4, 6, 8};

int sum = 0;

for (int n : numbers) {
    sum += n;
}

cout << sum;`,
    output: "20",
  },

  {
    language: "Java",
    code: `int marks = 85;

if (marks >= 80) {
    System.out.println("Excellent");
} else {
    System.out.println("Keep Learning");
}`,
    output: "Excellent",
  },

  {
    language: "Python",
    code: `name = "GenLearning"

if len(name) > 5:
    print("Keep Learning")`,
    output: "Keep Learning",
  },
];


/* ============================================================
   HERO COMPONENT
============================================================ */

const Hero = () => {
  const [mentoringDuration, setMentoringDuration] = useState(60);
  const [showPrice, setShowPrice] = useState(false);

  /* ============================================================
     DYNAMIC CODE STATE
  ============================================================ */

  const [codeIndex, setCodeIndex] = useState(
    () => Math.floor(Math.random() * codeExamples.length)
  );

  const [showOutput, setShowOutput] = useState(false);

  const currentCode = codeExamples[codeIndex];

  /* ============================================================
     RANDOM CODE BUTTON
  ============================================================ */

  const runCode = () => {
    let nextIndex = Math.floor(
      Math.random() * codeExamples.length
    );

    /* Prevent same code from appearing twice */
    while (
      nextIndex === codeIndex &&
      codeExamples.length > 1
    ) {
      nextIndex = Math.floor(
        Math.random() * codeExamples.length
      );
    }

    setCodeIndex(nextIndex);
    setShowOutput(true);
  };


  /* ============================================================
     MENTORING
  ============================================================ */

  const mentoringPrice =
    mentoringDuration === 60 ? 199 : 349;

  const handleDurationChange = (event) => {
    setMentoringDuration(
      Number(event.target.value)
    );

    setShowPrice(true);
  };


  return (
    <section className="hero">

      <div className="hero-container">

        {/* =====================================================
            QUICK MENTORING BOOKING
        ===================================================== */}

        <div className="hero-mentoring-quick">

          <span className="hero-mentoring-quick-label">
            1:1 Mentoring
          </span>

          <select
            className="hero-mentoring-quick-select"
            value={mentoringDuration}
            onChange={handleDurationChange}
            aria-label="Select mentoring duration"
          >

            <option value={60}>
              1 Hour
            </option>

            <option value={120}>
              2 Hours
            </option>

          </select>

          {showPrice && (
            <span className="hero-mentoring-quick-price">
              ₹{mentoringPrice}
            </span>
          )}

          <Link
            to={`/mentoring?duration=${mentoringDuration}`}
            className="hero-mentoring-quick-link"
          >
            Book
            <span>→</span>
          </Link>

        </div>


        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <InView
          className="hero-content"

          variants={{
            hidden: {
              opacity: 0,
              y: 30,
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
            duration: 0.9,
            ease: "easeInOut",
          }}

          viewOptions={{
            margin: "0px 0px -100px 0px",
          }}
        >

          <div className="hero-badge">

            <span className="hero-badge-dot"></span>

            Learn • Build • Grow

          </div>


          {/* =================================================
              HERO TITLE
          ================================================= */}

          <h1 className="hero-title">

            <TextEffect
              per="char"
              delay={0.2}
            >
              Build Your
            </TextEffect>

            {" "}

            <span>

              <TextEffect
                per="char"
                delay={0.75}
              >
                Future
              </TextEffect>

            </span>

            {" "}

            <TextEffect
              per="char"
              delay={1.2}
            >
              With Technology.
            </TextEffect>

          </h1>


          {/* =================================================
              HERO DESCRIPTION
          ================================================= */}

          <TextEffect
            per="word"
            delay={1.7}
            className="hero-description"
          >
            Learn practical IT skills and get professional digital
            solutions for your business — all in one place.
          </TextEffect>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="hero-actions">

            <Link
              to="/courses"
              className="hero-btn hero-btn-primary"
            >
              Explore Courses
              <span>→</span>
            </Link>

            <Link
              to="/contact"
              className="hero-btn hero-btn-secondary"
            >
              Get a Quote
            </Link>

          </div>


          {/* =================================================
              NOTE
          ================================================= */}

          <div className="hero-note">

            <span className="hero-note-icon">
              ✓
            </span>

            <div>

              <strong>
                Learn. Build. Grow.
              </strong>

              <p>
                Practical skills for the real world.
              </p>

            </div>

          </div>

        </InView>


        {/* =====================================================
            RIGHT VISUAL
        ===================================================== */}

        <InView
          className="hero-visual"

          variants={{
            hidden: {
              opacity: 0,
              x: 60,
              scale: 0.98,
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
            duration: 0.9,
            delay: 0.15,
            ease: "easeInOut",
          }}

          viewOptions={{
            margin: "0px 0px -100px 0px",
          }}
        >

          <div className="hero-glow"></div>


          {/* =================================================
              DYNAMIC CODE WINDOW
          ================================================= */}

          <motion.div
            className="code-window"

            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* CODE HEADER */}

            <div className="code-window-header">

              <div className="window-dots">

                <span></span>
                <span></span>
                <span></span>

              </div>

              <span>
                genlearning.js
              </span>

            </div>


            {/* CODE BODY */}

            <div className="code-window-body">

              {/* LANGUAGE */}

              <div className="code-language">

                {currentCode.language}

              </div>


              {/* CODE */}

              <pre className="dynamic-code">

                <code>
                  {currentCode.code}
                </code>

              </pre>


              {/* RUN BUTTON */}

              <button
                className="code-run-button"
                onClick={runCode}
                type="button"
              >

                <span>
                  ▶
                </span>

                Run Code

              </button>


              {/* OUTPUT */}

              {showOutput && (

                <motion.div
                  className="code-result"

                  initial={{
                    opacity: 0,
                    y: 8,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.25,
                  }}
                >

                  <span>
                    ✓
                  </span>

                  <div>

                    <small>
                      Output
                    </small>

                    <strong>
                      {currentCode.output}
                    </strong>

                  </div>

                </motion.div>

              )}

            </div>

          </motion.div>


          {/* =================================================
              FLOATING CARD — IT SKILLS
          ================================================= */}

          <motion.div
            className="hero-floating-card hero-card-top"

            animate={{
              y: [0, -7, 0],
            }}

            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <div className="floating-icon">
              &
            </div>

            <div>

              <strong>
                IT Skills
              </strong>

              <small>
                Learn & Grow
              </small>

            </div>

          </motion.div>


          {/* =================================================
              FLOATING CARD — REAL PROJECTS
          ================================================= */}

          <motion.div
            className="hero-floating-card hero-card-bottom"

            animate={{
              y: [0, 7, 0],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >

            <div className="floating-icon">
              ↗
            </div>

            <div>

              <strong>
                Real Projects
              </strong>

              <small>
                Build Experience
              </small>

            </div>

          </motion.div>

        </InView>

      </div>

    </section>
  );
};

export default Hero;