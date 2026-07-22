import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

/**
 * Modern Responsive Sticky Navbar with Theme Toggle and Auth Context
 */
function Navbar({ onToast }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("skillpath_theme") || "light";
    });

    // Derive active user object directly from storage
    const getUser = () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    };

    const user = getUser();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Synchronize theme with DOM attribute & localStorage
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("skillpath_theme", theme);
    }, [theme]);

    // Toggle Light / Dark theme
    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        if (onToast) {
            onToast(`Switched to ${nextTheme === "dark" ? "Dark 🌙" : "Light ☀️"} mode`, "info");
        }
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("user");
        if (onToast) {
            onToast("Logged out successfully", "info");
        }
        navigate("/login");
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    return (
        <nav
            className={`navbar navbar-expand-lg custom-navbar ${scrolled ? "navbar-scrolled" : ""}`}
            aria-label="Main Navigation"
        >
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand logo" to="/" aria-label="SkillPath AI Home">
                    <i className="bi bi-cpu-fill text-primary me-1"></i>
                    SkillPath AI
                </Link>

                {/* Mobile Hamburger Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation menu"
                >
                    <i className="bi bi-list fs-3 text-primary"></i>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>

                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                                        to="/dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/my-roadmap" ? "active" : ""}`}
                                        to="/my-roadmap"
                                    >
                                        My Roadmap
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Theme Toggle Button */}
                        <li className="nav-item my-2 my-lg-0 mx-lg-2">
                            <button
                                type="button"
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                                title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? (
                                    <i className="bi bi-moon-stars-fill text-warning"></i>
                                ) : (
                                    <i className="bi bi-sun-fill text-warning"></i>
                                )}
                            </button>
                        </li>

                        {/* Auth Buttons / User Profile */}
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item ms-lg-2">
                                    <Link className="btn register-btn w-100" to="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item d-flex align-items-center gap-2 ms-lg-2 my-2 my-lg-0">
                                <div
                                    className="user-profile-pill"
                                    title={`Logged in as ${user.name || user.email}`}
                                >
                                    <div className="user-avatar">
                                        {getInitial(user.name || user.email)}
                                    </div>
                                    <span className="user-name">
                                        {user.name || user.email}
                                    </span>
                                </div>

                                <button
                                    className="btn logout-btn"
                                    onClick={handleLogout}
                                    title="Logout of your account"
                                    aria-label="Logout"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;