import React from "react";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Home() {
    return (
        <>

            {/* Hero */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold">
                                Discover Your Perfect Learning Path
                            </h1>

                            <p className="lead">
                                AI-powered personalized roadmap for your career growth.
                            </p>

                            <button className="btn btn-primary btn-lg me-2">
                                Start Learning
                            </button>

                            <button className="btn btn-outline-light btn-lg">
                                Learn More
                            </button>
                        </div>

                        <div className="col-lg-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                                alt="learning"
                                className="img-fluid rounded shadow"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="container py-5">
                <h2 className="text-center mb-5">Features</h2>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 text-center p-3">
                            <i className="bi bi-robot fs-1 text-primary"></i>
                            <h4>AI Roadmap</h4>
                            <p>Personalized learning roadmap.</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 text-center p-3">
                            <i className="bi bi-book fs-1 text-primary"></i>
                            <h4>Course Recommendation</h4>
                            <p>Best resources selected for you.</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 text-center p-3">
                            <i className="bi bi-graph-up fs-1 text-primary"></i>
                            <h4>Progress Tracking</h4>
                            <p>Track your learning journey.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="bg-light py-5">
                <div className="container text-center">
                    <h2>About SkillPath AI</h2>

                    <p>
                        SkillPath AI helps students discover the right learning
                        sequence based on their goals and existing skills.
                    </p>
                </div>
            </section>


        </>
    );
}

export default Home;