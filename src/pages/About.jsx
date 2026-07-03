import "../styles/about.css";

function About() {
    return (
        <div className="about-page">

            <div className="container py-5">

                {/* Heading */}
                <div className="text-center mb-5">
                    <h1 className="about-title">
                        About SkillPath AI
                    </h1>

                    <p className="about-subtitle">
                        Empowering Students Through Personalized AI Learning Paths
                    </p>
                </div>

                {/* Intro Card */}
                <div className="glass-card mb-5">
                    <h2>Who We Are</h2>

                    <p>
                        SkillPath AI is an intelligent learning recommendation
                        platform that helps students identify skill gaps,
                        discover the right resources, and follow a structured
                        roadmap toward their dream career.
                    </p>

                    <p>
                        Instead of wasting time searching through thousands
                        of random tutorials, students receive a personalized
                        roadmap based on their goals, interests, and
                        current skill level.
                    </p>
                </div>

                {/* Mission Vision */}
                <div className="row g-4 mb-5">

                    <div className="col-md-6">
                        <div className="glass-card feature-card">
                            <i className="bi bi-bullseye icon"></i>

                            <h3>Our Mission</h3>

                            <p>
                                To simplify learning by providing students
                                with AI-powered roadmaps and curated resources.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="glass-card feature-card">
                            <i className="bi bi-lightbulb icon"></i>

                            <h3>Our Vision</h3>

                            <p>
                                To become the world's most trusted
                                personalized learning platform.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Features */}
                <h2 className="section-title">
                    Why SkillPath AI?
                </h2>

                <div className="row g-4 mb-5">

                    <div className="col-md-4">
                        <div className="glass-card feature-card">
                            <i className="bi bi-robot icon"></i>

                            <h4>AI Recommendations</h4>

                            <p>
                                Personalized learning paths generated
                                using intelligent recommendations.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="glass-card feature-card">
                            <i className="bi bi-journal-bookmark icon"></i>

                            <h4>Best Resources</h4>

                            <p>
                                Curated courses, videos, and tutorials
                                from trusted platforms.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="glass-card feature-card">
                            <i className="bi bi-graph-up-arrow icon"></i>

                            <h4>Track Progress</h4>

                            <p>
                                Monitor achievements and stay motivated
                                throughout your journey.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Stats */}
                <div className="glass-card stats-section">

                    <div className="row text-center">

                        <div className="col-md-3">
                            <h2>1000+</h2>
                            <p>Students</p>
                        </div>

                        <div className="col-md-3">
                            <h2>200+</h2>
                            <p>Courses</p>
                        </div>

                        <div className="col-md-3">
                            <h2>50+</h2>
                            <p>Career Paths</p>
                        </div>

                        <div className="col-md-3">
                            <h2>95%</h2>
                            <p>Success Rate</p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default About;