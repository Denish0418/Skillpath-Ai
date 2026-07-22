import { Link } from "react-router-dom";
import "../styles/home.css";

/**
 * Home Landing Page Component
 */
function Home() {
    const isLoggedIn = !!localStorage.getItem("user");

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-75 py-5">
                        <div className="col-lg-6 mb-5 mb-lg-0 animate-fade-in">
                            <span className="badge bg-primary px-3 py-2 fw-semibold mb-3">
                                <i className="bi bi-cpu me-1"></i> AI-Powered Career Learning
                            </span>
                            <h1 className="hero-title">
                                Discover Your Perfect Skill Path & Career Growth
                            </h1>
                            <p className="hero-subtitle">
                                SkillPath AI analyzes your existing knowledge, identifies skill gaps, and constructs personalized learning roadmaps tailored to your goals.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link
                                    to={isLoggedIn ? "/dashboard" : "/register"}
                                    className="custom-btn-primary btn-lg"
                                >
                                    <span>{isLoggedIn ? "Go to Dashboard" : "Start Learning Free"}</span>
                                    <i className="bi bi-arrow-right-short fs-4"></i>
                                </Link>
                                <a href="#features" className="custom-btn-outline btn-lg">
                                    <span>Explore Features</span>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-6 text-center animate-fade-in">
                            <div className="hero-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                                    alt="SkillPath AI Learning Dashboard Preview"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5">
                <div className="container py-4">
                    <div className="text-center max-w-600 mx-auto mb-5">
                        <span className="text-primary fw-bold text-uppercase tracking-wider small">Why Choose Us</span>
                        <h2 className="display-6 fw-bold mt-1">Smart Features for Faster Mastery</h2>
                        <p className="text-muted">Designed to take you from beginner to job-ready with minimal friction.</p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card text-center">
                                <div className="feature-icon-wrapper mx-auto">
                                    <i className="bi bi-robot"></i>
                                </div>
                                <h4 className="fw-bold mb-2">AI Roadmap Generator</h4>
                                <p className="text-muted small">
                                    Input your background and study hours per day to get an adaptive step-by-step curriculum.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card text-center">
                                <div className="feature-icon-wrapper mx-auto">
                                    <i className="bi bi-youtube"></i>
                                </div>
                                <h4 className="fw-bold mb-2">Curated Tutorials</h4>
                                <p className="text-muted small">
                                    Access top-rated video tutorials and documentation links for every skill module.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card text-center">
                                <div className="feature-icon-wrapper mx-auto">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <h4 className="fw-bold mb-2">Progress Analytics</h4>
                                <p className="text-muted small">
                                    Check off mastered skills and track overall percentage progress in real-time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-5">
                <div className="container">
                    <div className="cta-banner text-center">
                        <h2 className="display-6 text-white fw-bold mb-3">Ready to Accelerate Your Career?</h2>
                        <p className="lead opacity-90 mb-4 max-w-600 mx-auto">
                            Join thousands of students building their tech future with AI-guided precision.
                        </p>
                        <Link
                            to={isLoggedIn ? "/dashboard" : "/register"}
                            className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-3 shadow text-primary"
                        >
                            {isLoggedIn ? "Open Dashboard" : "Create Free Account"}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;