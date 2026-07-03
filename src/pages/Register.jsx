import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: ""
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        education: "",
        careerGoal: "",
        skillLevel: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.education) {
            newErrors.education = "Please select education";
        }

        if (!formData.careerGoal) {
            newErrors.careerGoal = "Please select career goal";
        }

        if (!formData.skillLevel) {
            newErrors.skillLevel = "Please select skill level";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                formData
            );

            setToast({
                show: true,
                message: "Registration Successful!",
                type: "success"
            });

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {

            setToast({
                show: true,
                message:
                    error.response?.data?.message ||
                    "Registration Failed",
                type: "danger"
            });

            setTimeout(() => {
                setToast({
                    show: false,
                    message: "",
                    type: ""
                });
            }, 3000);
        }
    };

    return (

        <div className="register-page">
            <div className="container">
                <div className="row justify-content-center py-5">
                    <div className="col-lg-7">

                        <div className="register-card">

                            <div className="text-center mb-4">
                                <h1 className="brand-title">
                                    Create Your Account
                                </h1>

                                <p className="text-muted">
                                    Start your personalized learning journey with SkillPath AI
                                </p>
                            </div>

                            {message && (
                                <div
                                    className={`alert alert - ${messageType} text - center`}
                                    role="alert"
                                >
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your full name"
                                    />

                                    {errors.name && (
                                        <small className="text-danger">
                                            {errors.name}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />

                                    {errors.email && (
                                        <small className="text-danger">
                                            {errors.email}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Education
                                    </label>

                                    <select
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Select Education
                                        </option>
                                        <option>BCA</option>
                                        <option>MCA</option>
                                        <option>B.Tech</option>
                                        <option>Diploma</option>
                                        <option>Other</option>
                                    </select>

                                    {errors.education && (
                                        <small className="text-danger">
                                            {errors.education}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Career Goal
                                    </label>

                                    <select
                                        name="careerGoal"
                                        value={formData.careerGoal}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Select Career Goal
                                        </option>
                                        <option>Web Developer</option>
                                        <option>Full Stack Developer</option>
                                        <option>Data Scientist</option>
                                        <option>AI Engineer</option>
                                        <option>Cyber Security Expert</option>
                                        <option>Cloud Engineer</option>
                                        <option>Mobile App Developer</option>
                                        <option>Game Developer</option>
                                        <option>DevOps Engineer</option>
                                        <option>Blockchain Developer</option>
                                        <option>UI/UX Designer</option>
                                    </select>

                                    {errors.careerGoal && (
                                        <small className="text-danger">
                                            {errors.careerGoal}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Current Skill Level
                                    </label>

                                    <select
                                        name="skillLevel"
                                        value={formData.skillLevel}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Select Level
                                        </option>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>

                                    {errors.skillLevel && (
                                        <small className="text-danger">
                                            {errors.skillLevel}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <div className="input-group">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Create Password"
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <small className="text-danger">
                                            {errors.password}
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 register-btn"
                                >
                                    Create Account
                                </button>

                            </form>

                        </div>

                    </div>
                </div>
            </div>
            <>
                {toast.show && (
                    <div
                        className={`toast show align-items-center text-white bg-${toast.type} border-0`}
                        style={{
                            position: "fixed",
                            top: "20px",
                            right: "20px",
                            zIndex: 9999,
                            minWidth: "320px"
                        }}
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                {toast.message}
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                onClick={() =>
                                    setToast({
                                        show: false,
                                        message: "",
                                        type: ""
                                    })
                                }
                            ></button>
                        </div>
                    </div>
                )}

                <div className="register-page">
                    {/* ALL YOUR EXISTING PAGE CODE HERE */}
                </div>
            </>
        </div>
    );
}

export default Register;
