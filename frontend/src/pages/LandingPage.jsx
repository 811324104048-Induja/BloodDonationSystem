import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">

        <div
          className="landing-logo"
          onClick={() => navigate("/")}
        >
          <span className="blood-icon">♥</span>
          BloodConnect
        </div>

        <div className="landing-nav-buttons">
          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="landing-signup-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

      </nav>


      {/* HERO SECTION */}
      <section className="landing-hero">

        <div className="hero-content">

          <div className="hero-badge">
            🩸 Every Drop Can Save a Life
          </div>

          <h1>
            Connecting Donors.
            <br />
            <span>Saving Lives.</span>
          </h1>

          <p>
            BloodConnect is a smart blood donation and emergency
            matching platform that connects blood donors with patients
            who need blood when it matters most.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={() => navigate("/signup")}
            >
              Become a Donor
              <span>→</span>
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() => navigate("/login")}
            >
              Find Blood
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>24/7</strong>
              <span>Emergency Support</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Secure Platform</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Blood Matching</span>
            </div>

          </div>

        </div>


        {/* BLOOD DROP VISUAL */}
        <div className="hero-visual">

          <div className="glow-circle"></div>

          <div className="blood-drop">
            <div className="drop-heart">♥</div>
          </div>

          <div className="floating-card card-one">
            <span>🩸</span>
            <div>
              <strong>Blood Donor</strong>
              <small>Ready to help</small>
            </div>
          </div>

          <div className="floating-card card-two">
            <span>❤️</span>
            <div>
              <strong>Emergency</strong>
              <small>Request matched</small>
            </div>
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="features-section">

        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>
            One Platform. Multiple Ways to Help.
          </h2>

          <p>
            BloodConnect makes blood donation and emergency requests
            simple, secure and accessible.
          </p>
        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon donor-icon">
              🩸
            </div>

            <h3>Become a Donor</h3>

            <p>
              Register as a donor and make your blood availability
              visible to patients who need it.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon patient-icon">
              🚨
            </div>

            <h3>Request Blood</h3>

            <p>
              Patients can create emergency blood requests with
              their required blood group and location.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon match-icon">
              🤝
            </div>

            <h3>Smart Matching</h3>

            <p>
              Find compatible donors based on blood group,
              availability and location.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon security-icon">
              🔐
            </div>

            <h3>Secure Access</h3>

            <p>
              Your account is protected using password encryption,
              JWT authentication and OTP verification.
            </p>

          </div>

        </div>

      </section>


      {/* CALL TO ACTION */}
      <section className="landing-cta">

        <div>

          <h2>
            Your One Decision Could Save a Life.
          </h2>

          <p>
            Join BloodConnect and become part of a community
            that helps connect people with life-saving blood.
          </p>

        </div>

        <button
          onClick={() => navigate("/signup")}
        >
          Get Started →
        </button>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="footer-logo">
          <span>♥</span>
          BloodConnect
        </div>

        <p>
          Blood Donation Network & Emergency Matching Platform
        </p>

        <span className="footer-copy">
          © 2026 BloodConnect. All rights reserved.
        </span>

      </footer>

    </div>
  );
}

export default LandingPage;