import { useLocation } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
    const location = useLocation();

    if (location.pathname.startsWith("/dashboard")) {
        return null;
    }

    return (
        <footer className="footer-section">
            <div className="container">
                <div className="row gy-4">

                    {/* Logo & Description */}
                    <div className="col-lg-4 col-md-6">
                        <h3 className="footer-logo">SkillPath AI</h3>
                        <p className="footer-text">
                            Empowering students with AI-powered personalized learning
                            roadmaps, skill gap analysis, and career guidance to achieve
                            their goals faster.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5>Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="col-lg-3 col-md-6">
                        <h5>Features</h5>
                        <ul className="footer-links">
                            <li>AI Roadmap Generator</li>
                            <li>Skill Gap Analysis</li>
                            <li>Course Recommendations</li>
                            <li>Progress Tracking</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-lg-3 col-md-6">
                        <h5>Contact</h5>
                        <p>Email: support@skillpathai.com</p>
                        <p>Phone: +91 98765 43210</p>

                        <div className="social-icons">
                            <a href="#"><i className="bi bi-facebook"></i></a>
                            <a href="#"><i className="bi bi-instagram"></i></a>
                            <a href="#"><i className="bi bi-linkedin"></i></a>
                            <a href="#"><i className="bi bi-github"></i></a>
                        </div>
                    </div>

                </div>

                <hr />

                <div className="text-center">
                    <p className="mb-0">
                        © 2026 SkillPath AI. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;