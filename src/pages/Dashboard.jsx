import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

/**
 * Dashboard Component
 * Generator page for personalized learning roadmaps.
 * Auth guard: reads user from localStorage synchronously — if absent,
 * shows nothing and redirects to /login immediately (no flash).
 */
function Dashboard({ onToast }) {
    const navigate = useNavigate();

    // Read user SYNCHRONOUSLY so there's never a frame where we render
    // the dashboard for a logged-out user.
    const user = (() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const [skillsInput, setSkillsInput] = useState("");
    const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
    const [studyHours, setStudyHours] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);

    // If user is null, redirect immediately before rendering anything.
    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Guard: don't render dashboard content while redirecting
    if (!user) {
        return null;
    }

    const handleGenerate = async (e) => {
        e.preventDefault();

        if (studyHours < 1 || studyHours > 12) {
            if (onToast) onToast("Study hours per day must be between 1 and 12", "warning");
            return;
        }

        setIsGenerating(true);

        const skillsArray = skillsInput
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        try {
            await axios.post("http://localhost:5000/api/roadmap/generate", {
                userId: user?._id || user?.id,
                skills: skillsArray,
                careerGoal,
                studyHours
            });

            if (onToast) {
                onToast("Roadmap generated! Opening your personalized plan...", "success");
            }

            setTimeout(() => {
                navigate("/my-roadmap");
            }, 1200);

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error generating roadmap. Please check your backend server.";
            if (onToast) {
                onToast(errorMsg, "danger");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="dashboard-page py-5 mt-5">
            <div className="container py-4">

                {/* Welcome Banner */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="welcome-card p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <span className="badge mb-2 px-3 py-2 fw-semibold"
                                    style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    <i className="bi bi-stars me-1" style={{ color: '#fbbf24' }}></i>
                                    AI Learning Portal
                                </span>
                                <h1 className="text-white display-6 fw-bold mb-2">
                                    Welcome back, {user.name || "Student"}! 👋
                                </h1>
                                <p className="mb-0 lead fs-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                    Generate or update your customized learning path tailored to your goal and available time.
                                </p>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn fw-semibold"
                                    style={{
                                        background: 'rgba(255,255,255,0.18)',
                                        color: '#ffffff',
                                        border: '1.5px solid rgba(255,255,255,0.45)',
                                        borderRadius: '10px',
                                        padding: '9px 20px',
                                        backdropFilter: 'blur(4px)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => navigate("/my-roadmap")}
                                    title="View your existing roadmap"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.30)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                                >
                                    <i className="bi bi-map-fill me-1"></i> View My Roadmap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Strip */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="glass-card p-3 d-flex flex-wrap gap-3 align-items-center">
                            <div className="avatar">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                                    {user.name || "User"}
                                </div>
                                <div className="small" style={{ color: 'var(--text-muted)' }}>
                                    {user.email}
                                </div>
                            </div>
                            {user.careerGoal && (
                                <span className="badge ms-auto px-3 py-2"
                                    style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px' }}>
                                    <i className="bi bi-bullseye me-1"></i>
                                    {user.careerGoal}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roadmap Generator Form */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-7">
                        <div className="glass-card shadow-lg p-4 p-md-5">
                            <div className="border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                                <h3 className="fw-bold mb-1 d-flex align-items-center gap-2"
                                    style={{ color: 'var(--text-primary)' }}>
                                    <i className="bi bi-magic text-primary fs-3"></i>
                                    Generate New Roadmap
                                </h3>
                                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                                    Select your target role, specify existing skills, and let AI build your optimal curriculum.
                                </p>
                            </div>

                            <form onSubmit={handleGenerate} aria-label="Roadmap Generator Form">
                                <div className="row g-3">

                                    {/* Career Goal */}
                                    <div className="col-12 mb-2">
                                        <label className="form-label fw-bold d-flex align-items-center gap-1" htmlFor="career-goal-select">
                                            <span>Target Career Goal</span>
                                            <span className="text-danger">*</span>
                                            <i className="bi bi-info-circle ms-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
                                                title="The role you want to prepare for."></i>
                                        </label>
                                        <select
                                            id="career-goal-select"
                                            className="form-select form-select-lg"
                                            value={careerGoal}
                                            onChange={(e) => setCareerGoal(e.target.value)}
                                            required
                                        >
                                            <option value="Web Developer">Web Developer (Frontend / CSS / JS)</option>
                                            <option value="Full Stack Developer">Full Stack Developer (Node, React, DB)</option>
                                            <option value="Data Scientist">Data Scientist (Python, ML, Analytics)</option>
                                            <option value="AI Engineer">AI Engineer (LLMs, Neural Networks, PyTorch)</option>
                                            <option value="Cyber Security Expert">Cyber Security Expert</option>
                                            <option value="Cloud Engineer">Cloud Engineer (AWS, Azure, Docker)</option>
                                            <option value="Mobile App Developer">Mobile App Developer (Flutter, React Native)</option>
                                            <option value="Game Developer">Game Developer (Unity, C#)</option>
                                            <option value="DevOps Engineer">DevOps Engineer (CI/CD, Kubernetes)</option>
                                            <option value="UI/UX Designer">UI/UX Designer (Figma, Prototyping)</option>
                                        </select>
                                    </div>

                                    {/* Known Skills */}
                                    <div className="col-12 mb-2">
                                        <label className="form-label fw-bold d-flex align-items-center gap-1" htmlFor="skills-input">
                                            <span>Skills You Already Know</span>
                                            <i className="bi bi-info-circle ms-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
                                                title="Comma-separated list of skills you already have."></i>
                                        </label>
                                        <input
                                            id="skills-input"
                                            type="text"
                                            className="form-control form-control-lg custom-input"
                                            placeholder="e.g. HTML, CSS, JavaScript, Git"
                                            value={skillsInput}
                                            onChange={(e) => setSkillsInput(e.target.value)}
                                        />
                                        <small className="form-text" style={{ color: 'var(--text-muted)' }}>
                                            Separate skills with commas. Leave blank if you are a complete beginner.
                                        </small>
                                    </div>

                                    {/* Study Hours */}
                                    <div className="col-12 mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label fw-bold mb-0" htmlFor="study-hours">
                                                Study Hours Per Day
                                            </label>
                                            <span className="badge px-3 py-1 fs-6"
                                                style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '8px', fontWeight: 700 }}>
                                                {studyHours} {studyHours === 1 ? "hour" : "hours"}/day
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <input
                                                id="study-hours"
                                                type="range"
                                                className="form-range flex-grow-1"
                                                min="1"
                                                max="12"
                                                step="1"
                                                value={studyHours}
                                                onChange={(e) => setStudyHours(Number(e.target.value))}
                                            />
                                            <input
                                                type="number"
                                                className="form-control custom-input text-center"
                                                style={{ width: "80px" }}
                                                min="1"
                                                max="12"
                                                value={studyHours}
                                                onChange={(e) =>
                                                    setStudyHours(Math.max(1, Math.min(12, Number(e.target.value))))
                                                }
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn custom-btn-primary btn-lg w-100 py-3 fw-bold"
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            <span>Building Your AI Roadmap...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-lightning-charge-fill me-1"></i>
                                            <span>Generate Roadmap &amp; Start Learning</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
