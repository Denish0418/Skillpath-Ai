import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: ""
    });

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
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
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            setToast({
                show: true,
                message: "Login Successful!",
                type: "success"
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (error) {

            setToast({
                show: true,
                message:
                    error.response?.data?.message ||
                    "Login Failed",
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
        <div className="login-page">

            <div className="login-card">

                <h1 className="login-title">
                    SkillPath AI
                </h1>

                <p className="login-subtitle">
                    Welcome Back
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control custom-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {errors.email && (
                            <small className="text-danger">
                                {errors.email}
                            </small>
                        )}

                    </div>

                    <div className="mb-4">

                        <label className="form-label">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                className="form-control custom-input"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>

                        </div>

                        {errors.password && (
                            <small className="text-danger">
                                {errors.password}
                            </small>
                        )}

                    </div>

                    <div className="d-flex justify-content-between mb-4">

                        <div className="form-check">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember"
                            />

                            <label
                                className="form-check-label"
                                htmlFor="remember"
                            >
                                Remember Me
                            </label>

                        </div>

                        <a href="#">
                            Forgot Password?
                        </a>

                    </div>

                    <button
                        type="submit"
                        className="btn login-btn w-100"
                    >
                        Login
                    </button>

                </form>

                <div className="text-center mt-4">

                    <p>
                        Don't have an account?

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </Link>
                    </p>

                </div>

            </div>

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

        </div>
    );
}

export default Login;