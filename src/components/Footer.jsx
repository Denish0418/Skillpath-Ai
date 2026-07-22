import { Link } from "react-router-dom";
import "../styles/footer.css";

/**
 * Footer Component
 */
function Footer() {
    return (
        <footer className="footer-section mt-auto">
            <div className="container">
                <div className="row gy-4">
                    {/* Logo & Description */}
                    <div className="col-lg-4 col-md-6">
                        <h3 className="footer-logo">SkillPath AI</h3>
                        <p className="footer-text">
                            Empowering students with AI-powered personalized learning roadmaps, skill gap analysis, and career guidance to achieve goals faster.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5>Navigation</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="col-lg-3 col-md-6">
                        <h5>Key Features</h5>
                        <ul className="footer-links">
                            <li>AI Roadmap Generator</li>
                            <li>Skill Mastery Tracking</li>
                            <li>Curated Video Tutorials</li>
                            <li>Career Goal Selection</li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div className="col-lg-3 col-md-6">
                        <h5>Connect With Us</h5>
                        <p className="footer-text mb-2">Email: support@skillpathai.com</p>

                        <div className="social-icons mt-3">
                            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                            <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                            <a href="#" aria-label="GitHub"><i className="bi bi-github"></i></a>
                        </div>
                    </div>
                </div>

                <hr className="my-4 opacity-25" />

                <div className="text-center text-muted small">
                    <p className="mb-0">
                        © 2026 SkillPath AI. All Rights Reserved. Built with React & Bootstrap 5.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;