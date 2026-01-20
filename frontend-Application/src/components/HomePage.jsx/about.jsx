import { Link } from "react-router-dom";
import { FaArrowLeft, FaUserGraduate } from "react-icons/fa";
import "./Home.css";

function About() {
  return (
    <div className="home-wrapper">
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <FaUserGraduate className="me-2 text-primary" />
            ExamPortal
          </Link>
          <div className="d-flex gap-2 ms-auto">
            <Link className="btn btn-outline-light btn-sm" to="/">
              <FaArrowLeft className="me-2" />
              Home
            </Link>
            <Link className="btn btn-primary-glow btn-sm" to="/login">Login</Link>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 90 }}>
        <section className="about-section">
          <div className="container">
            <div className="row align-items-start g-4">
              <div className="col-lg-7">
                <h1 className="fw-bold mb-3">About ExamPortal</h1>
                <p className="text-muted">
                  ExamPortal is a role-based examination platform focused on secure delivery, smooth evaluation, and
                  audit-friendly governance. It is built to support students, instructors, and administrators with a
                  consistent UI and reliable workflows.
                </p>
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div className="about-card">
                      <div className="about-card-title">For Students</div>
                      <ul className="about-list">
                        <li>Guided exam flow with review and submit</li>
                        <li>Results and history visibility controls</li>
                        <li>Focused UI that reduces distractions</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-card">
                      <div className="about-card-title">For Instructors</div>
                      <ul className="about-list">
                        <li>Exam creation, cloning, and management</li>
                        <li>Question bank, tagging, and maintenance</li>
                        <li>Result evaluation with publishing controls</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-card">
                      <div className="about-card-title">For Admins</div>
                      <ul className="about-list">
                        <li>User management and role governance</li>
                        <li>Exam governance monitoring</li>
                        <li>Central activity logs for auditing</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-card">
                      <div className="about-card-title">Security & Reliability</div>
                      <ul className="about-list">
                        <li>Fullscreen enforcement and violation capture</li>
                        <li>Stable UI patterns across dashboards</li>
                        <li>Designed for backend integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="about-card">
                  <div className="about-card-title mb-2">Quick Links</div>
                  <div className="d-grid gap-2">
                    <Link className="btn btn-primary-glow" to="/login">Sign In</Link>
                    <Link className="btn btn-outline-secondary" to="/#features">View Features</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container text-center">
            <p className="mb-0">&copy; 2025 ExamPortal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default About;

