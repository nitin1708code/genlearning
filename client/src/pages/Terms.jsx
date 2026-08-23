import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back">
          ← Back to website
        </Link>

        <header className="legal-header">
          <span className="section-eyebrow">LEGAL</span>

          <h1>
            Terms & <span>Conditions.</span>
          </h1>

          <p>
            The terms and conditions governing your use of the
            GEN Learning platform, educational content and digital services.
          </p>

          <small>Last updated: August 23, 2026</small>
        </header>


        <section className="legal-content">

          <div className="legal-intro">
            <strong>Welcome to GEN Learning.</strong>

            <p>
              By accessing or using our website, courses or services,
              you agree to comply with these Terms & Conditions.
              Please read them carefully before using the platform.
            </p>
          </div>


          <article className="legal-section">
            <span className="legal-section-number">01</span>
            <div>
              <h2>Acceptance of Terms</h2>

              <p>
                By accessing or using GEN Learning, you acknowledge
                that you have read, understood and agreed to these
                Terms & Conditions.
              </p>

              <p>
                If you do not agree with these terms, please discontinue
                use of the website and its services.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">02</span>
            <div>
              <h2>Account Registration</h2>

              <p>
                Certain features may require you to create an account.
                You agree to provide accurate and current information
                during registration.
              </p>

              <ul>
                <li>Keep your account credentials confidential</li>
                <li>Use your account only for legitimate purposes</li>
                <li>Notify us of unauthorized account activity</li>
              </ul>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">03</span>
            <div>
              <h2>Courses & Learning Content</h2>

              <p>
                GEN Learning provides educational content, courses,
                tutorials and learning resources for educational and
                skill-development purposes.
              </p>

              <ul>
                <li>Content must not be copied or redistributed without permission</li>
                <li>Content must not be resold or commercially exploited</li>
                <li>Content must not be republished as your own work</li>
              </ul>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">04</span>
            <div>
              <h2>IT Services & Client Projects</h2>

              <p>
                GEN Learning may provide website development, software
                development, consulting and other digital services.
              </p>

              <p>
                Project scope, timelines, deliverables and pricing are
                determined separately based on the requirements agreed
                with the client.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">05</span>
            <div>
              <h2>Acceptable Use</h2>

              <p>You agree not to:</p>

              <ul>
                <li>Attempt unauthorized access to the platform</li>
                <li>Interfere with website functionality or security</li>
                <li>Upload malicious or harmful content</li>
                <li>Use the platform for unlawful activities</li>
                <li>Abuse or misuse another user's account</li>
              </ul>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">06</span>
            <div>
              <h2>Intellectual Property</h2>

              <p>
                The GEN Learning name, branding, website design,
                original educational materials and other proprietary
                content are protected by applicable intellectual
                property laws.
              </p>

              <p>
                No ownership rights are transferred to users unless
                expressly agreed in writing.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">07</span>
            <div>
              <h2>Third-Party Services</h2>

              <p>
                Certain features may depend on third-party services,
                including authentication providers, hosting platforms
                and other external technologies.
              </p>

              <p>
                Your use of such services may also be subject to
                the terms and policies of those providers.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">08</span>
            <div>
              <h2>Service Availability</h2>

              <p>
                We aim to maintain a reliable and secure platform.
                However, temporary interruptions may occur due to
                maintenance, technical issues, third-party services
                or circumstances beyond our reasonable control.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">09</span>
            <div>
              <h2>Disclaimer & Liability</h2>

              <p>
                Information and educational materials provided through
                GEN Learning are intended for general educational
                purposes and may not always be complete or suitable
                for every individual situation.
              </p>

              <p>
                To the extent permitted by applicable law, GEN Learning
                shall not be responsible for losses resulting from
                misuse of the platform or reliance on information
                provided through the website.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">10</span>
            <div>
              <h2>Suspension & Termination</h2>

              <p>
                We may restrict or suspend access to an account or
                service where there is a violation of these terms,
                security concern, misuse of the platform or other
                legitimate operational reason.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">11</span>
            <div>
              <h2>Changes to These Terms</h2>

              <p>
                We may modify these Terms & Conditions when necessary
                to reflect changes to our platform, services or
                applicable requirements.
              </p>

              <p>
                Updated terms will be published on this page with
                a revised effective date.
              </p>
            </div>
          </article>


          <article className="legal-contact">
            <span className="section-eyebrow">CONTACT</span>

            <h2>Have a question?</h2>

            <p>
              If you have questions regarding these Terms & Conditions,
              please contact the GEN Learning team.
            </p>

            <a
              href="mailto:hello@genlearning.in"
              className="legal-email"
            >
              hello@genlearning.in →
            </a>
          </article>

        </section>


        <footer className="legal-footer">
          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/">
            GEN Learning
          </Link>
        </footer>

      </div>
    </main>
  );
};

export default Terms;