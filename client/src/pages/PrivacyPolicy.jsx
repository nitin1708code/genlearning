import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back">
          ← Back to website
        </Link>

        <header className="legal-header">
          <span className="section-eyebrow">PRIVACY</span>

          <h1>
            Privacy <span>Policy.</span>
          </h1>

          <p>
            How GEN Learning collects, uses, protects and manages
            information associated with your use of our platform
            and services.
          </p>

          <small>Last updated: August 23, 2026</small>
        </header>


        <section className="legal-content">

          <div className="legal-intro">
            <strong>Your privacy matters.</strong>
            <p>
              This Privacy Policy explains how GEN Learning handles
              information when you create an account, use our learning
              platform, access our services or contact us.
            </p>
          </div>


          <article className="legal-section">
            <span className="legal-section-number">01</span>
            <div>
              <h2>Information We Collect</h2>

              <p>
                Depending on how you use GEN Learning, we may collect:
              </p>

              <ul>
                <li>Name and basic profile information</li>
                <li>Email address and account information</li>
                <li>Information submitted through forms or enquiries</li>
                <li>Information required to provide courses and services</li>
                <li>Technical information required for website operation</li>
              </ul>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">02</span>
            <div>
              <h2>Google Sign-In</h2>

              <p>
                If you choose to sign in with Google, Google may provide
                basic account information such as your name, email address
                and profile information permitted through the authentication
                process.
              </p>

              <div className="legal-note">
                <strong>Authentication</strong>
                <span>
                  Google is used to securely authenticate your account.
                  We do not receive your Google password.
                </span>
              </div>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">03</span>
            <div>
              <h2>How We Use Information</h2>

              <p>Your information may be used to:</p>

              <ul>
                <li>Create and manage your GEN Learning account</li>
                <li>Provide courses and learning resources</li>
                <li>Process enquiries and service requests</li>
                <li>Improve website functionality and user experience</li>
                <li>Maintain platform security and prevent misuse</li>
              </ul>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">04</span>
            <div>
              <h2>Account Information</h2>

              <p>
                You are responsible for keeping your login credentials
                secure and for providing accurate information when creating
                an account.
              </p>

              <p>
                If you believe your account has been accessed without
                authorization, please contact us as soon as possible.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">05</span>
            <div>
              <h2>Data Security</h2>

              <p>
                We use reasonable technical and organizational measures
                to protect information associated with your account.
              </p>

              <p>
                However, no internet-based service can guarantee absolute
                security of information transmitted or stored online.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">06</span>
            <div>
              <h2>Third-Party Services</h2>

              <p>
                GEN Learning may rely on selected third-party technologies
                to operate and improve the platform.
              </p>

              <ul>
                <li>Google authentication</li>
                <li>Hosting and infrastructure providers</li>
                <li>Analytics or performance services</li>
                <li>Other services required for website functionality</li>
              </ul>

              <p>
                These services may process information according to
                their own privacy policies.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">07</span>
            <div>
              <h2>Cookies & Local Storage</h2>

              <p>
                Our website may use cookies, local storage or similar
                browser technologies to maintain sessions, remember
                account-related information and improve usability.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">08</span>
            <div>
              <h2>Your Choices</h2>

              <p>
                You may contact GEN Learning regarding your account
                information, privacy questions or account-related
                assistance.
              </p>
            </div>
          </article>


          <article className="legal-section">
            <span className="legal-section-number">09</span>
            <div>
              <h2>Changes to This Policy</h2>

              <p>
                We may update this Privacy Policy from time to time
                to reflect changes in our services, technology or
                legal requirements.
              </p>

              <p>
                Any updated version will be published on this page
                together with a revised effective date.
              </p>
            </div>
          </article>


          <article className="legal-contact">
            <span className="section-eyebrow">QUESTIONS?</span>

            <h2>Need more information?</h2>

            <p>
              For privacy-related questions or account assistance,
              contact the GEN Learning team.
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
          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/">
            GEN Learning
          </Link>
        </footer>

      </div>
    </main>
  );
};

export default PrivacyPolicy;