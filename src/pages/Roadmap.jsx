import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Roadmap() {
    const navigate = useNavigate();

    // User & Data State
    const [user, setUser] = useState(null);
    const [roadmapData, setRoadmapData] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchRoadmap(parsedUser._id);
    }, [navigate]);

    const fetchRoadmap = async (userId) => {
        try {
            const resRoadmap = await axios.get(`http://localhost:5000/api/roadmap/${userId}`);
            setRoadmapData(resRoadmap.data);

            const resProgress = await axios.get(`http://localhost:5000/api/progress/${userId}`);
            setProgressData(resProgress.data);
        } catch (error) {
            console.log("No existing roadmap found for user");
            // If they don't have a roadmap, send them to the generator dashboard
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const markCompleted = async (skill) => {
        try {
            const res = await axios.post("http://localhost:5000/api/progress/update", {
                userId: user._id,
                skill
            });
            setProgressData(res.data);
        } catch (error) {
            alert("Error updating progress");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div className="text-center mt-5">Loading Your Roadmap...</div>;
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
                <a className="navbar-brand fw-bold fs-4" href="#">SkillPath AI</a>
                <div className="ms-auto d-flex align-items-center">
                    <span className="text-light me-4">Student: {user?.name}</span>
                    <button
                        className="btn btn-outline-info btn-sm me-3"
                        onClick={() => navigate("/dashboard")}
                    >
                        Generate New Roadmap
                    </button>
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {roadmapData ? (
                            <div className="card shadow-lg border-0 h-100">
                                <div className="card-header bg-success text-white py-4 d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold">Learning Roadmap: {roadmapData.careerGoal}</h4>
                                    <span className="badge bg-light text-success fs-6 shadow-sm px-3 py-2">
                                        ⏱️ {roadmapData.timeline}
                                    </span>
                                </div>
                                <div className="card-body p-5">

                                    {/* Progress Bar */}
                                    <div className="mb-5 bg-light p-4 rounded border">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="fw-bold text-secondary fs-5">Overall Progress</span>
                                            <span className="fw-bold fs-5 text-success">{progressData?.percentage || 0}%</span>
                                        </div>
                                        <div className="progress" style={{ height: "25px", borderRadius: "10px" }}>
                                            <div
                                                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                                                role="progressbar"
                                                style={{ width: `${progressData?.percentage || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <h4 className="fw-bold mb-4 border-bottom pb-3 text-secondary">Step-by-Step Curriculum</h4>

                                    <div className="row g-4">
                                        {(roadmapData?.roadmap || []).map((skill, index) => {
                                            const isCompleted = progressData?.completedSkills?.includes(skill);
                                            // Find video recommendation
                                            const video = roadmapData.recommendedVideos?.[index];

                                            return (
                                                <div key={index} className="col-md-6">
                                                    <div className={`card h-100 border-2 shadow-sm ${isCompleted ? 'border-success bg-light opacity-75' : 'border-primary'}`}>
                                                        <div className="card-body p-4 d-flex flex-column">
                                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                                <h5 className={`card-title fw-bold mb-0 ${isCompleted ? 'text-success' : 'text-primary'}`}>
                                                                    <span className="badge bg-secondary me-2">{index + 1}</span>
                                                                    {skill}
                                                                </h5>
                                                                {isCompleted && <i className="bi bi-check-circle-fill text-success fs-4"></i>}
                                                            </div>

                                                            {video ? (
                                                                <a href={video.url} target="_blank" rel="noreferrer" className="btn btn-outline-danger mt-3 mb-4 fw-bold">
                                                                    🎬 Watch YouTube Tutorial
                                                                </a>
                                                            ) : (
                                                                <p className="text-muted small mt-2 mb-4"><i className="bi bi-info-circle"></i> No specific video found</p>
                                                            )}

                                                            <div className="mt-auto">
                                                                <button
                                                                    className={`btn w-100 fw-bold py-2 ${isCompleted ? 'btn-success disabled' : 'btn-primary'}`}
                                                                    onClick={() => markCompleted(skill)}
                                                                >
                                                                    {isCompleted ? "✅ Skill Mastered" : "Mark as Completed"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm border-0 h-100 d-flex align-items-center justify-content-center p-5 text-center bg-light">
                                <div>
                                    <h4 className="text-muted mb-3">No Roadmap Found</h4>
                                    <p className="text-secondary mb-4">You need to generate a roadmap first!</p>
                                    <button className="btn btn-primary btn-lg" onClick={() => navigate("/dashboard")}>
                                        Go to Generator
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roadmap;
