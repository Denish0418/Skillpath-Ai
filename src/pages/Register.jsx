import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api.js";
import "../styles/register.css";

/**
 * Register Page Component
 * Implements real-time validation, password strength calculation, loading spinners,
 * and toast notification triggers.
 */
function Register({ onToast }) {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        education: "",
        careerGoal: "",
        skillLevel: "",
        password: ""
    });

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    // Password strength logic
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: "", color: "bg-secondary" };
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 2) return { score: 33, label: "Weak", color: "bg-danger" };
        if (score <= 4) return { score: 66, label: "Medium", color: "bg-warning" };
        return { score: 100, label: "Strong", color: "bg-success" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Validate a specific field
    const validateField = (name, value) => {
        let errorMsg = "";

        if (name === "name") {
            if (!value.trim()) errorMsg = "Full Name is required";
            else if (value.trim().length < 3) errorMsg = "Name must be at least 3 characters";
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) errorMsg = "Email address is required";
            else if (!emailRegex.test(value.trim())) errorMsg = "Enter a valid email address";
        }

        if (name === "education") {
            if (!value) errorMsg = "Please select your education level";
        }

        if (name === "careerGoal") {
            if (!value) errorMsg = "Please select your target career goal";
        }

        if (name === "skillLevel") {
            if (!value) errorMsg = "Please select your current skill level";
        }

        if (name === "password") {
            if (!value) errorMsg = "Password is required";
            else if (value.length < 6) errorMsg = "Password must be at least 6 characters";
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
        let valid = true;
        const fields = ["name", "email", "education", "careerGoal", "skillLevel", "password"];
        const newTouched = {};

        fields.forEach(field => {
            newTouched[field] = true;
            if (!validateField(field, formData[field])) {
                valid = false;
            }
        });

        setTouched(newTouched);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            if (onToast) onToast("Please complete all required fields correctly.", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            if (onToast) {
                onToast("Registration Successful! Redirecting to dashboard...", "success");
            }

            setTimeout(() => {
                navigate(res.data.user ? "/dashboard" : "/login");
            }, 1200);

        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.";
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
                    <div className="col-lg-8 col-xl-7">
                        <div className="register-card">
                            <div className="text-center mb-4">
                                <h1 className="brand-title">Create Your Account</h1>
                                <p className="text-muted">
                                    Start your personalized AI-guided learning journey
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate aria-label="Registration Form">
                                <div className="row g-3">
                                    {/* Full Name */}
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" htmlFor="reg-name">
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="reg-name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-control custom-input ${
                                                touched.name && errors.name ? "is-invalid" : touched.name && !errors.name ? "is-valid" : ""
                                            }`}
                                            placeholder="John Doe"
                                            required
                                        />
                                        {touched.name && errors.name && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.name}</small>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" htmlFor="reg-email">
                                            Email Address <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="reg-email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-control custom-input ${
                                                touched.email && errors.email ? "is-invalid" : touched.email && !errors.email ? "is-valid" : ""
                                            }`}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        {touched.email && errors.email && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.email}</small>
                                        )}
                                    </div>

                                    {/* Education */}
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" htmlFor="reg-education">
                                            Education Level <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            id="reg-education"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-select ${
                                                touched.education && errors.education ? "is-invalid" : touched.education && !errors.education ? "is-valid" : ""
                                            }`}
                                            required
                                        >
                                            <option value="">Select Education</option>
                                            <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                                            <option value="MCA">MCA (Master of Computer Applications)</option>
                                            <option value="B.Tech">B.Tech / B.E.</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Other">Other Degree / Self-Taught</option>
                                        </select>
                                        {touched.education && errors.education && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.education}</small>
                                        )}
                                    </div>

                                    {/* Skill Level */}
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" htmlFor="reg-skillLevel">
                                            Current Experience Level <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            id="reg-skillLevel"
                                            name="skillLevel"
                                            value={formData.skillLevel}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-select ${
                                                touched.skillLevel && errors.skillLevel ? "is-invalid" : touched.skillLevel && !errors.skillLevel ? "is-valid" : ""
                                            }`}
                                            required
                                        >
                                            <option value="">Select Skill Level</option>
                                            <option value="Beginner">Beginner (Starting from scratch)</option>
                                            <option value="Intermediate">Intermediate (Know fundamentals)</option>
                                            <option value="Advanced">Advanced (Looking to specialize)</option>
                                        </select>
                                        {touched.skillLevel && errors.skillLevel && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.skillLevel}</small>
                                        )}
                                    </div>

                                    {/* Career Goal */}
                                    <div className="col-12 mb-2">
                                        <label className="form-label" htmlFor="reg-careerGoal">
                                            Target Career Goal <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            id="reg-careerGoal"
                                            name="careerGoal"
                                            value={formData.careerGoal}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`form-select ${
                                                touched.careerGoal && errors.careerGoal ? "is-invalid" : touched.careerGoal && !errors.careerGoal ? "is-valid" : ""
                                            }`}
                                            required
                                        >
                                            <option value="">Select Target Role</option>
                                            <option value="Web Developer">Web Developer</option>
                                            <option value="Full Stack Developer">Full Stack Developer</option>
                                            <option value="Data Scientist">Data Scientist</option>
                                            <option value="AI Engineer">AI Engineer</option>
                                            <option value="Cyber Security Expert">Cyber Security Expert</option>
                                            <option value="Cloud Engineer">Cloud Engineer</option>
                                            <option value="Mobile App Developer">Mobile App Developer</option>
                                            <option value="Game Developer">Game Developer</option>
                                            <option value="DevOps Engineer">DevOps Engineer</option>
                                            <option value="UI/UX Designer">UI/UX Designer</option>
                                        </select>
                                        {touched.careerGoal && errors.careerGoal && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.careerGoal}</small>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="col-12 mb-3">
                                        <label className="form-label" htmlFor="reg-password">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                id="reg-password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`form-control custom-input ${
                                                    touched.password && errors.password ? "is-invalid" : touched.password && !errors.password ? "is-valid" : ""
                                                }`}
                                                placeholder="Minimum 6 characters"
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

                                        {/* Password Strength Indicator */}
                                        {formData.password && (
                                            <div className="mt-2">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <small className="text-muted">Password Strength:</small>
                                                    <small className="fw-bold">{passwordStrength.label}</small>
                                                </div>
                                                <div className="password-strength-meter">
                                                    <div
                                                        className={`password-strength-bar ${passwordStrength.color}`}
                                                        style={{ width: `${passwordStrength.score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {touched.password && errors.password && (
                                            <small className="text-danger mt-1 d-block fw-semibold">{errors.password}</small>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn register-btn w-100 mt-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <i className="bi bi-check-lg fs-5"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <p className="mb-0 text-muted small">
                                    Already have an account?{" "}
                                    <Link to="/login" className="register-link">
                                        Sign In
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

export default Register;
