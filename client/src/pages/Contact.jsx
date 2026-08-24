import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://api.genlearning.in/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to submit enquiry."
        );

        return;
      }

      console.log(
        "Enquiry submitted:",
        data
      );

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <main className="contact-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="contact-hero">
        <div className="contact-container">

          <span className="section-eyebrow">
            GET IN TOUCH
          </span>

          <h1>
            Let's talk about
            <br />
            <span>your project.</span>
          </h1>

          <p>
            Have an idea, need a website or want to discuss
            a digital solution? Tell us what you need.
          </p>

        </div>
      </section>


      {/* ========================================
          CONTACT AREA
      ======================================== */}

      <section className="contact-main-section">

        <div className="contact-container">

          <div className="contact-grid">

            {/* LEFT SIDE */}

            <div className="contact-info">

              <span className="section-eyebrow">
                CONTACT
              </span>

              <h2>
                Start a
                <span> conversation.</span>
              </h2>

              <p>
                Share some details about your project and
                we'll get back to you with the next steps.
              </p>


              <div className="contact-info-list">

                <div className="contact-info-item">

                  <span>EMAIL</span>

                  <a href="mailto:nitinchess17@gmail.com">
                    nitinchess17@gmail.com
                  </a>

                </div>


                <div className="contact-info-item">

                  <span>LOCATION</span>

                  <p>
                    Lucknow, Uttar Pradesh
                  </p>

                </div>


                <div className="contact-info-item">

                  <span>AVAILABILITY</span>

                  <p>
                    Open for project enquiries
                  </p>

                </div>

              </div>


              <div className="contact-note">

                <span>?</span>

                <p>
                  Not sure which service you need?
                  No problem. Just describe your idea
                  in the message.
                </p>

              </div>


              {/* ========================================
                  LOCATION MAP
              ======================================== */}

              <div className="contact-map">

                <iframe
                  src="https://www.google.com/maps?q=Lucknow,Uttar+Pradesh&output=embed"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GEN Learning Location"
                ></iframe>

              </div>

            </div>


            {/* FORM */}

            <div className="contact-form-wrapper">

              {!submitted ? (

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                >

                  <div className="contact-form-heading">

                    <span className="section-eyebrow">
                      PROJECT ENQUIRY
                    </span>

                    <h2>
                      Tell us what you
                      <span> need.</span>
                    </h2>

                  </div>


                  {/* NAME */}

                  <div className="form-group">

                    <label htmlFor="name">
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* EMAIL + PHONE */}

                  <div className="form-row">

                    <div className="form-group">

                      <label htmlFor="email">
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label htmlFor="phone">
                        Phone
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  {/* SERVICE */}

                  <div className="form-group">

                    <label htmlFor="service">
                      What do you need?
                    </label>

                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select a service
                      </option>

                      <option value="website-development">
                        Website Development
                      </option>

                      <option value="web-application">
                        Web Application
                      </option>

                      <option value="ecommerce">
                        E-Commerce
                      </option>

                      <option value="custom-software">
                        Custom Software
                      </option>

                      <option value="ui-ux">
                        UI/UX Design
                      </option>

                      <option value="maintenance">
                        Website Maintenance
                      </option>

                      <option value="other">
                        Something Else
                      </option>

                    </select>

                  </div>


                  {/* BUDGET */}

                  <div className="form-group">

                    <label htmlFor="budget">
                      Estimated Budget
                    </label>

                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select budget
                      </option>

                      <option value="under-10k">
                        Under ₹10,000
                      </option>

                      <option value="10k-25k">
                        ₹10,000 – ₹25,000
                      </option>

                      <option value="25k-50k">
                        ₹25,000 – ₹50,000
                      </option>

                      <option value="50k-1l">
                        ₹50,000 – ₹1,00,000
                      </option>

                      <option value="1l-plus">
                        ₹1,00,000+
                      </option>

                      <option value="not-sure">
                        Not Sure Yet
                      </option>

                    </select>

                  </div>


                  {/* MESSAGE */}

                  <div className="form-group">

                    <label htmlFor="message">
                      Tell us about your project
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Describe your idea, requirements or problem..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <button
                    type="submit"
                    className="contact-submit-btn"
                  >
                    Send Enquiry
                    <span>→</span>
                  </button>


                  <p className="form-disclaimer">
                    By submitting this form, you agree to be
                    contacted regarding your enquiry.
                  </p>

                </form>

              ) : (

                <div className="contact-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <span className="section-eyebrow">
                    ENQUIRY RECEIVED
                  </span>

                  <h2>
                    Thanks for
                    <span> reaching out.</span>
                  </h2>

                  <p>
                    Your project enquiry has been received.
                    We'll review the details and get back to you.
                  </p>

                  <button
                    type="button"
                    className="contact-reset-btn"
                    onClick={() => {
                      setSubmitted(false);

                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        service: "",
                        budget: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another Enquiry
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          PROCESS
      ======================================== */}

      <section className="contact-process-section">

        <div className="contact-container">

          <div className="contact-process-heading">

            <span className="section-eyebrow">
              WHAT HAPPENS NEXT
            </span>

            <h2>
              Simple from
              <span> here.</span>
            </h2>

          </div>


          <div className="contact-process-grid">

            <div>

              <span>01</span>

              <h3>
                We review
              </h3>

              <p>
                We go through your project requirements
                and understand what you're looking for.
              </p>

            </div>


            <div>

              <span>02</span>

              <h3>
                We connect
              </h3>

              <p>
                We'll discuss your requirements and
                clarify any important details.
              </p>

            </div>


            <div>

              <span>03</span>

              <h3>
                We plan
              </h3>

              <p>
                We suggest a suitable approach, scope
                and project direction.
              </p>

            </div>


            <div>

              <span>04</span>

              <h3>
                We build
              </h3>

              <p>
                Once everything is agreed, development
                can begin.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Contact;