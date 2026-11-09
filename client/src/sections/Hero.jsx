
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { InView } from "../components/motion-primitives/in-view";
import { TextEffect } from "../components/motion-primitives/text-effect";
import AnnouncementSlider from "../components/AnnouncementSlider";
import "./Hero.css";

// Add your photos in: public/images/hero/
const heroSlides = [
  {
    image: "/images/hero/slide1.jpg",
    title: "Learn New Skills",
    description: "Build knowledge for your future.",
  },
  {
    image: "/images/hero/slide2.jpg",
    title: "Learn From Experts",
    description: "Get guidance from experienced mentors.",
  },
  {
    image: "/images/hero/slide3.jpg",
    title: "Build Your Future",
    description: "Turn your skills into real opportunities.",
  },
  {
    image: "/images/hero/slide4.jpg",
    title: "Grow With Technology",
    description: "Learn, create and achieve more.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = heroSlides[currentSlide];

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

        {/* RIGHT SIDE - AUTOMATIC IMAGE CAROUSEL */}
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
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsPaused(false);
              }
            }}
          >
            {/* IMAGE */}
            <div className="hero-carousel-image-wrapper">
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  className="hero-carousel-image"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* IMAGE OVERLAY */}
              <div className="hero-carousel-overlay"></div>

              {/* SLIDE TEXT */}
              <div className="hero-carousel-caption">
                <span className="hero-carousel-label">
                  GENLEARNING
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
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

              {/* SLIDE COUNTER */}
              <div className="hero-carousel-counter">
                {String(currentSlide + 1).padStart(2, "0")}
                <span>/</span>
                {String(heroSlides.length).padStart(2, "0")}
              </div>
            </div>

            {/* DOT INDICATORS */}
            <div className="hero-carousel-dots">
              {heroSlides.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  className={`hero-carousel-dot ${
                    currentSlide === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
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
