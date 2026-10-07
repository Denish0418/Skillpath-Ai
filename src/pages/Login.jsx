import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

/**
 * Login Page Component
 * Identical visual design & structure to Register page — clean glass card,
 * standard custom-input controls, password toggle button, and full theme support.
 */
function Login({ onToast }) {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let errorMsg = "";

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                errorMsg = "Email address is required";
            } else if (!emailRegex.test(value.trim())) {
                errorMsg = "Please enter a valid email address";
            }
        }

        if (name === "password") {
            if (!value) {
                errorMsg = "Password is required";
            } else if (value.length < 6) {
                errorMsg = "Password must be at least 6 characters";
            }
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return !errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const validateAll = () => {
        const emailValid = validateField("email", formData.email);
        const passValid = validateField("password", formData.password);
        setTouched({ email: true, password: true });
        return emailValid && passValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            if (onToast) onToast("Please fix validation errors before submitting.", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            if (onToast) {
                onToast(`Welcome back, ${res.data.user?.name || "User"}! Redirecting...`, "success");
            }

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Invalid email or password";
            if (onToast) {
                onToast(errorMsg, "danger");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-xl-5">
                        <div className="register-card">

                            {/* Header */}
                            <div className="text-center mb-4">
                                <h1 className="brand-title">Welcome Back</h1>
                                <p className="text-muted">
                                    Sign in to continue your personalized AI learning path
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate aria-label="Login Form">
                                <div className="row g-3">

                                    {/* Email */}
                                    <div className="col-12 mb-2">
                                        <label className="form-label" htmlFor="login-email">
                                            Email Address <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="login-email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-control custom-input ${touched.email && errors.email ? "is-invalid" : touched.email && !errors.email ? "is-valid" : ""
                                                }`}
                                            placeholder="name@example.com"
                                            required
                                        />
                                        {touched.email && errors.email && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.email}</small>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="col-12 mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label mb-0" htmlFor="login-password">
                                                Password <span className="text-danger">*</span>
                                            </label>
                                            <a
                                                href="#"
                                                className="small text-decoration-none"
                                                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (onToast) onToast("Password reset link sent! (demo)", "info");
                                                }}
                                            >
                                                Forgot password?
                                            </a>
                                        </div>
                                        <div className="input-group">
                                            <input
                                                id="login-password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`form-control custom-input ${touched.password && errors.password ? "is-invalid" : touched.password && !errors.password ? "is-valid" : ""
                                                    }`}
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                                            </button>
                                        </div>
                                        {touched.password && errors.password && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.password}</small>
                                        )}
                                    </div>

                                    {/* Remember Me */}
                                    <div className="col-12 mb-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="remember-me"
                                            />
                                            <label className="form-check-label small" htmlFor="remember-me">
                                                Remember me on this device
                                            </label>
                                        </div>
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn register-btn w-100 mt-4"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <i className="bi bi-arrow-right-short fs-4"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Register Link Footer */}
                            <div className="text-center mt-4">
                                <p className="mb-0 text-muted small">
                                    Don't have an account?{" "}
                                    <Link to="/register" className="register-link">
                                        Create Account
                                    </Link>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;