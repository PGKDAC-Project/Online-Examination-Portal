import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartLine, FaUserGraduate, FaCheckCircle } from 'react-icons/fa';
import './Home.css';

function Home() {
    return (
        <div className="home-wrapper">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)' }}>
                <div className="container">
                    <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                        <FaUserGraduate className="me-2 text-primary" /> 
                        ExamPortal
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
                            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                            <li className="nav-item ms-lg-3">
                                <Link className="btn btn-primary-glow px-4" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 hero-content">
                            <h1>Secure, Seamless <br /> <span className="text-primary">Online Examinations</span></h1>
                            <p>
                                Experience the future of assessment with our AI-powered proctoring, 
                                real-time analytics, and intuitive interface designed for students and educators.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/login" className="btn btn-primary-glow hero-btn">Get Started</Link>
                                <a href="#features" className="btn btn-outline-light hero-btn">Learn More</a>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <img 
                                src="https://img.freepik.com/free-vector/online-test-concept-illustration_114360-5474.jpg" 
                                alt="Online Exam" 
                                className="img-fluid floating-animation" 
                                style={{ filter: 'drop-shadow(0 0 20px rgba(37,99,235,0.3))' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <section className="stats-strip">
                <div className="container">
                    <div className="row g-3 text-center">
                        <div className="col-md-4">
                            <div className="stats-card">
                                <div className="stats-value">99.9%</div>
                                <div className="stats-label">Exam uptime target</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card">
                                <div className="stats-value">Live</div>
                                <div className="stats-label">Monitoring & governance</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card">
                                <div className="stats-value">Fast</div>
                                <div className="stats-label">Results & scorecards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">Why Choose ExamPortal?</h2>
                        <p className="text-muted">Built for reliability, security, and scale.</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FaShieldAlt className="feature-icon" />
                                <h4>Anti-Cheat Security</h4>
                                <p className="text-muted">
                                    Advanced proctoring with tab-switch detection, fullscreen enforcement, and automated violation reporting.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FaChartLine className="feature-icon" />
                                <h4>Real-Time Analytics</h4>
                                <p className="text-muted">
                                    Instant grading and detailed performance insights for students and instructors.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <FaCheckCircle className="feature-icon" />
                                <h4>Reliable Platform</h4>
                                <p className="text-muted">
                                    99.9% uptime with auto-save functionality ensuring no progress is ever lost during exams.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">How It Works</h2>
                        <p className="text-muted">Seamless experience for everyone.</p>
                    </div>
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="p-4 rounded-3 bg-light h-100">
                                <div className="h1 text-primary mb-3">1</div>
                                <h5>Sign In</h5>
                                <p className="text-muted small">Use your email and password to securely access your dashboard.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 rounded-3 bg-light h-100">
                                <div className="h1 text-primary mb-3">2</div>
                                <h5>Take or Manage Exams</h5>
                                <p className="text-muted small">Instructors create exams; Students take them in a secure environment.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 rounded-3 bg-light h-100">
                                <div className="h1 text-primary mb-3">3</div>
                                <h5>Instant Results</h5>
                                <p className="text-muted small">Get detailed scorecards and analytics immediately after submission.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="about-section">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-6">
                            <h2 className="fw-bold mb-3">About ExamPortal</h2>
                            <p className="text-muted mb-3">
                                ExamPortal is designed to make assessments secure, transparent, and easy to manage.
                                Students get a calm and guided exam experience, instructors get powerful tools to build
                                and evaluate exams, and admins get governance and audit visibility.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge text-bg-light border">Secure</span>
                                <span className="badge text-bg-light border">Scalable</span>
                                <span className="badge text-bg-light border">Role-based dashboards</span>
                                <span className="badge text-bg-light border">Audit-friendly logs</span>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-card">
                                <div className="about-card-title">What you get</div>
                                <ul className="about-list">
                                    <li>Anti-cheat signals (fullscreen + violations)</li>
                                    <li>Centralized login and role-based routing</li>
                                    <li>Exam management, cloning, and governance logs</li>
                                    <li>Question bank with tagging and editing</li>
                                </ul>
                                <div className="d-flex gap-2 mt-3">
                                    <Link className="btn btn-primary-glow" to="/login">Login</Link>
                                    <Link className="btn btn-outline-secondary" to="/about">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">&copy; 2025 ExamPortal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
