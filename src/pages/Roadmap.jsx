import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api.js";

/**
 * Roadmap Page Component
 * Renders curriculum modules, progress indicator, and tutorial links with theme support.
 */
function Roadmap({ onToast }) {
    const navigate = useNavigate();

    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    });
    const [roadmapData, setRoadmapData] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingSkill, setUpdatingSkill] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        let isSubscribed = true;
        const loadRoadmap = async () => {
            const userId = user._id || user.id;
            try {
                const resRoadmap = await axios.get(`${API_BASE_URL}/roadmap/${userId}`);
                if (isSubscribed) setRoadmapData(resRoadmap.data);

                const resProgress = await axios.get(`${API_BASE_URL}/progress/${userId}`);
                if (isSubscribed) setProgressData(resProgress.data);
            } catch {
                console.log("No existing roadmap found for user");
                if (isSubscribed) navigate("/dashboard");
            } finally {
                if (isSubscribed) setLoading(false);
            }
        };

        loadRoadmap();
        return () => {
            isSubscribed = false;
        };
    }, [user, navigate]);

    const markCompleted = async (skill) => {
        setUpdatingSkill(skill);
        try {
            const res = await axios.post(`${API_BASE_URL}/progress/update`, {
                userId: user._id || user.id,
                skill
            });
            setProgressData(res.data);
            if (onToast) {
                onToast(`Skill mastered: "${skill}"! Great job! 🎉`, "success");
            }
        } catch {
            if (onToast) {
                onToast("Error updating skill progress", "danger");
            }
        } finally {
            setUpdatingSkill(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
                <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold">Loading Your Roadmap...</h5>
            </div>
        );
    }

    const percentage = progressData?.percentage || 0;

    return (
        <div className="roadmap-page py-5 mt-5">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {roadmapData ? (
                            <div className="glass-card shadow-lg p-4 p-md-5">
                                {/* Header */}
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-4 mb-4 gap-3">
                                    <div>
                                        <span className="badge bg-primary px-3 py-2 fw-semibold mb-2">
                                            <i className="bi bi-compass-fill me-1"></i> Active Curriculum
                                        </span>
                                        <h2 className="fw-bold mb-1 display-6">
                                            {roadmapData.careerGoal}
                                        </h2>
                                        <p className="text-muted small mb-0">
                                            Follow the step-by-step sequence designed by SkillPath AI
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-success px-3 py-2 fs-6 shadow-sm">
                                            <i className="bi bi-clock-history me-1"></i> {roadmapData.timeline || "Estimated 8-12 weeks"}
                                        </span>
                                        <button
                                            className="btn custom-btn-outline btn-sm"
                                            onClick={() => navigate("/dashboard")}
                                            title="Generate a new roadmap"
                                        >
                                            <i className="bi bi-arrow-repeat me-1"></i> Regenerate
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Card */}
                                <div className="glass-card mb-5 p-4 bg-hover border-0">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-bold fs-5 d-flex align-items-center gap-2">
                                            <i className="bi bi-trophy-fill text-warning fs-4"></i>
                                            Overall Progress
                                        </span>
                                        <span className="fw-bold fs-4 text-success">{percentage}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
                                        <div
                                            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${percentage}%` }}
                                            aria-valuenow={percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>

                                {/* Curriculum List */}
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-journal-check text-primary"></i>
                                    Step-by-Step Modules
                                </h4>

                                <div className="row g-4">
                                    {(roadmapData?.roadmap || []).map((skill, index) => {
                                        const isCompleted = progressData?.completedSkills?.includes(skill);
                                        const video = roadmapData.recommendedVideos?.[index];

                                        return (
                                            <div key={index} className="col-md-6">
                                                <div
                                                    className={`card h-100 border-2 shadow-sm transition-all ${
                                                        isCompleted ? "border-success bg-surface-glass opacity-85" : "border-primary"
                                                    }`}
                                                    style={{ borderRadius: "16px" }}
                                                >
                                                    <div className="card-body p-4 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <h5 className="card-title fw-bold mb-0 d-flex align-items-center gap-2">
                                                                <span className="badge bg-primary rounded-circle px-2 py-1 fs-6">
                                                                    {index + 1}
                                                                </span>
                                                                <span>{skill}</span>
                                                            </h5>
                                                            {isCompleted && (
                                                                <i className="bi bi-check-circle-fill text-success fs-3" title="Skill Mastered"></i>
                                                            )}
                                                        </div>

                                                        <p className="text-muted small mb-3">
                                                            Master key concepts in {skill} to fulfill core requirements for {roadmapData.careerGoal}.
                                                        </p>

                                                        {video ? (
                                                            <a
                                                                href={video.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="btn btn-outline-danger btn-sm mb-4 fw-semibold d-inline-flex align-items-center gap-2 w-auto"
                                                            >
                                                                <i className="bi bi-youtube fs-5"></i>
                                                                <span>Watch Tutorial</span>
                                                            </a>
                                                        ) : (
                                                            <p className="text-muted small mb-4">
                                                                <i className="bi bi-info-circle me-1"></i> Recommended docs available online
                                                            </p>
                                                        )}

                                                        <div className="mt-auto">
                                                            <button
                                                                className={`btn w-100 fw-bold py-2.5 ${
                                                                    isCompleted ? "btn-success disabled" : "custom-btn-primary"
                                                                }`}
                                                                onClick={() => markCompleted(skill)}
                                                                disabled={isCompleted || updatingSkill === skill}
                                                            >
                                                                {updatingSkill === skill ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        Updating...
                                                                    </>
                                                                ) : isCompleted ? (
                                                                    <>
                                                                        <i className="bi bi-patch-check-fill me-1"></i> Skill Mastered
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-check2-circle me-1"></i> Mark as Completed
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card text-center p-5">
                                <i className="bi bi-map text-muted fs-1 mb-3 d-block"></i>
                                <h4 className="fw-bold mb-2">No Roadmap Found</h4>
                                <p className="text-muted mb-4">You need to generate a roadmap first!</p>
                                <button className="btn custom-btn-primary btn-lg" onClick={() => navigate("/dashboard")}>
                                    Go to Roadmap Generator
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roadmap;
