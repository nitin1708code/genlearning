import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { InView } from "../components/motion-primitives/in-view";
import { TextEffect } from "../components/motion-primitives/text-effect";
import AnnouncementSlider from "../components/AnnouncementSlider";
import "./Hero.css";

/* ------------------------------------------------------------------
   EDIT YOUR NEWS / ADS HERE
   - tag:    small pill above the title ("News · ..." or "Ad · ...")
   - image:  optional. Files live in public/images/hero/
   - tone:   teal | blue | violet | amber
   - source: shown under news slides (leave out for ads)
   - cta:    use "to" for pages on your site, "href" for outside links
   Facts below were checked on 11 Nov 2026. Re-check dates before
   you keep a news slide up for long.
------------------------------------------------------------------- */
const heroSlides = [
 
{
  id: "national-scholarship-2026",
  image: "/images/hero/news2.jpg",
  tone: "blue",
  tag: "Student Opportunity · November 2026",
  title: "Multiple Scholarships Open for Students – 2026–27",
  description:
    "Explore Central Government scholarship opportunities for school, college, technical and postgraduate students. Check eligibility and application deadlines.",
  source: "National Scholarship Portal · Government of India",
  cta: {
    label: "Explore Scholarships",
    href: "https://scholarships.gov.in/All-Scholarships"
  },
},

  {
    id: "cbse-2027-dates",
    image: "/images/hero/news2.jpg",
    tone: "blue",
    tag: "News · Boards 2027",
    title: "CBSE board exams begin on 16 February 2027",
    description:
      "Class 10 papers finish by 9 March and Class 12 by 9 April. Over 45 lakh students are expected to appear.",
    source: "CBSE 2027 date sheet, via Careers360 and NewsBytes",
    cta: { label: "Plan your revision", to: "/mentoring" },
  },
  {
    id: "mentoring-ad",
    image: "/images/hero/slide1.jpg",
    tone: "teal",
    tag: "Ad · Exam prep",
    title: "Board exams are close. Get a mentor.",
    description:
      "One-to-one online guidance to plan your revision, clear doubts and stay on track.",
    cta: { label: "Find your mentor", to: "/mentoring" },
  },
  {
    id: "two-exams",
    image: "/images/hero/news3.jpg",
    tone: "violet",
    tag: "News · Class 10",
    title: "Class 10 now has two board exams",
    description:
      "Everyone appears in the first phase. Students who want a better score can take a second phase in up to three subjects.",
    source: "CBSE two-exam system, via Careers360",
    cta: { label: "Prepare with a mentor", to: "/mentoring" },
  },
  {
    id: "niti-roadmap",
    image: "/images/hero/news4.jpg",
    tone: "teal",
    tag: "News · Policy",
    title: "NITI Aayog releases a school education roadmap",
    description:
      "The May 2026 report reviews a decade of enrolment and learning data and suggests ways to improve quality and equity.",
    source: "NITI Aayog, May 2026",
    cta: { label: "Read the report", href: "https://www.niti.gov.in/node/2288" },
  },
  {
    id: "courses-ad",
    image: "/images/hero/slide2.jpg",
    tone: "blue",
    tag: "Ad · Courses",
    title: "Add practical IT skills to your studies",
    description:
      "Hands-on coding and technology courses you can learn at your own pace.",
    cta: { label: "Explore courses", to: "/courses" },
  },
];

const AUTOPLAY_MS = 6000;

const Hero = () => {
  const reduceMotion = useReducedMotion();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  const total = heroSlides.length;
  const isRunning = !reduceMotion && !userPaused && !hovering && !keyboardFocus;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + total) % total);

  // Restarts every time the slide changes, so manual clicks get a full 6s too.
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [isRunning, currentSlide, total]);

  const slide = heroSlides[currentSlide];
  const showImage = Boolean(slide.image) && !failedImages[slide.id];

  const handleImageError = () =>
    setFailedImages((prev) => ({ ...prev, [slide.id]: true }));

  return (
    <section className="hero">

      {/* FULL WIDTH ANNOUNCEMENT SLIDER */}
      <div className="hero-announcement-slider">
        <AnnouncementSlider />
      </div>

      <div className="hero-container">

        {/* LEFT CONTENT */}
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

          <h1 className="hero-title">
            <TextEffect per="word" delay={0.2}>
              Build Your
            </TextEffect>{" "}

            <span>
              <TextEffect per="word" delay={0.75}>
                Future
              </TextEffect>
            </span>{" "}

            <TextEffect per="word" delay={1.2}>
              With Technology.
            </TextEffect>
          </h1>

          <TextEffect
            per="word"
            delay={1.7}
            className="hero-description"
          >
            Learn practical IT skills and get professional digital
            solutions for your business — all in one place.
          </TextEffect>

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

          <div className="hero-note">
            <span className="hero-note-icon">✓</span>

            <div>
              <strong>Learn. Build. Grow.</strong>
              <p>Practical skills for the real world.</p>
            </div>
          </div>
        </InView>

        {/* RIGHT SIDE - AUTOMATIC CAROUSEL */}
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
          <div
            className="hero-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured updates"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocus={(event) => {
              // Only pause for keyboard users, not after a mouse click on an arrow.
              if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setKeyboardFocus(false);
              }
            }}
          >
            <div className="hero-carousel-image-wrapper">

              {/* BACKGROUND: colored tone, with the photo on top if it loads */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  className={`hero-carousel-bg hero-tone-${slide.tone}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                >
                  {showImage && (
                    <img
                      src={slide.image}
                      alt=""
                      className="hero-carousel-image"
                      onError={handleImageError}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* OVERLAY */}
              <div className="hero-carousel-overlay"></div>

              {/* SLIDE TEXT */}
              <div className="hero-carousel-caption">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    aria-live={isRunning ? "off" : "polite"}
                  >
                    <span className="hero-carousel-label">{slide.tag}</span>
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>

                    {slide.source && (
                      <p className="hero-carousel-source">
                        Source: {slide.source}
                      </p>
                    )}

                    {slide.cta.href ? (
                      <a
                        href={slide.cta.href}
                        className="hero-carousel-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {slide.cta.label}
                      </a>
                    ) : (
                      <Link to={slide.cta.to} className="hero-carousel-cta">
                        {slide.cta.label}
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* PREVIOUS BUTTON */}
              <button
                type="button"
                className="hero-carousel-arrow hero-carousel-prev"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                &#10094;
              </button>

              {/* NEXT BUTTON */}
              <button
                type="button"
                className="hero-carousel-arrow hero-carousel-next"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                &#10095;
              </button>

              {/* PAUSE / PLAY */}
              <button
                type="button"
                className="hero-carousel-pause"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {userPaused ? "▶" : "❚❚"}
              </button>

              {/* SLIDE COUNTER */}
              <div className="hero-carousel-counter" aria-hidden="true">
                {String(currentSlide + 1).padStart(2, "0")}
                <span>/</span>
                {String(total).padStart(2, "0")}
              </div>
            </div>

            {/* DOT INDICATORS */}
            <div className="hero-carousel-dots">
              {heroSlides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`hero-carousel-dot ${
                    currentSlide === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}: ${item.title}`}
                  aria-current={
                    currentSlide === index ? "true" : undefined
                  }
                />
              ))}
            </div>
          </div>
        </InView>

      </div>
    </section>
  );
};

export default Hero;