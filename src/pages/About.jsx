import { Link } from "react-router-dom";
import "../styles/about.css";

/**
 * About Page Component
 */
function About() {
    const isLoggedIn = !!localStorage.getItem("user");

    return (
        <div className="about-page">
            <div className="container py-4">
                {/* Heading */}
                <div className="about-hero animate-fade-in">
                    <h1 className="about-title">About SkillPath AI</h1>
                    <p className="about-subtitle">
                        Empowering Students Through Personalized AI Learning Paths
                    </p>
                </div>

                {/* Intro Glass Card */}
                <div className="glass-card about-info mb-5 animate-fade-in">
                    <h2>Who We Are</h2>
                    <p>
                        SkillPath AI is an intelligent learning recommendation platform that helps students identify skill gaps, discover curated resources, and follow structured roadmaps toward their dream tech careers.
                    </p>
                    <p className="mb-0">
                        Instead of wasting time searching through thousands of unverified online tutorials, students receive an optimized, step-by-step curriculum customized to their career goals and available study hours.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="glass-card info-card text-center p-4">
                            <i className="bi bi-bullseye"></i>
                            <h3>Our Mission</h3>
                            <p>
                                To simplify learning by providing every student with AI-powered roadmaps and verified learning resources.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="glass-card info-card text-center p-4">
                            <i className="bi bi-lightbulb"></i>
                            <h3>Our Vision</h3>
                            <p>
                                To build the world's most trusted, accessible, and adaptive career preparation platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="glass-card stats-section py-4">
                    <div className="row text-center g-4">
                        <div className="col-6 col-md-3">
                            <div className="stat-number">10,000+</div>
                            <div className="stat-title">Roadmaps Generated</div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-number">50+</div>
                            <div className="stat-title">Career Tracks</div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-number">500+</div>
                            <div className="stat-title">Curated Tutorials</div>
                        </div>

                        <div className="col-6 col-md-3">
                            <div className="stat-number">96%</div>
                            <div className="stat-title">Student Satisfaction</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-5">
                    <Link
                        to={isLoggedIn ? "/dashboard" : "/register"}
                        className="custom-btn-primary btn-lg"
                    >
                        <span>{isLoggedIn ? "Access Dashboard" : "Get Started Today"}</span>
                        <i className="bi bi-arrow-right me-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default About;