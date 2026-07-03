import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
    const navigate = useNavigate();

    // User State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [skillsInput, setSkillsInput] = useState("");
    const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
    const [studyHours, setStudyHours] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [navigate]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);

        const skillsArray = skillsInput
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        try {
            await axios.post("http://localhost:5000/api/roadmap/generate", {
                userId: user._id,
                skills: skillsArray,
                careerGoal,
                studyHours
            });

            // Redirect to the roadmap page after generation
            navigate("/my-roadmap");

        } catch (error) {
            alert("Error generating roadmap");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div className="text-center mt-5">Loading Dashboard...</div>;
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
                <a className="navbar-brand fw-bold fs-4" href="#">SkillPath AI</a>
                <div className="ms-auto d-flex align-items-center">
                    <span className="text-light me-4">Welcome, {user?.name}</span>
                    <button
                        className="btn btn-outline-info btn-sm me-3"
                        onClick={() => navigate("/my-roadmap")}
                    >
                        View My Roadmap
                    </button>
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-primary text-white py-4 text-center">
                                <h4 className="mb-0 fw-bold">Generate New Learning Roadmap</h4>
                            </div>
                            <div className="card-body p-5">
                                <form onSubmit={handleGenerate}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">What skills do you already know?</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="e.g. HTML, CSS, Git"
                                            value={skillsInput}
                                            onChange={(e) => setSkillsInput(e.target.value)}
                                        />
                                        <small className="text-muted">Separate skills with commas. Leave blank if beginner.</small>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">What is your Career Goal?</label>
                                        <select
                                            className="form-select form-select-lg"
                                            value={careerGoal}
                                            onChange={(e) => setCareerGoal(e.target.value)}
                                        >
                                            <option value="Web Developer">Web Developer</option>
                                            <option value="Full Stack Developer">Full Stack Developer</option>
                                            <option value="Data Scientist">Data Scientist</option>
                                            <option value="AI Engineer">AI Engineer</option>
                                            <option value="Cyber Security Expert">Cyber Security Expert</option>
                                            <option value="Cloud Engineer">Cloud Engineer</option>
                                            <option value="Mobile App Developer">Mobile App Developer</option>
                                            <option value="Game Developer">Game Developer</option>
                                            <option value="DevOps Engineer">DevOps Engineer</option>
                                            <option value="Blockchain Developer">Blockchain Developer</option>
                                            <option value="UI/UX Designer">UI/UX Designer</option>
                                            <option value="Data Engineer">Data Engineer</option>
                                            <option value="QA Tester">QA Tester</option>
                                            <option value="Embedded Systems Engineer">Embedded Systems Engineer</option>
                                            <option value="Java Enterprise Developer">Java Enterprise Developer</option>
                                        </select>
                                    </div>

                                    <div className="mb-5">
                                        <label className="form-label fw-bold">Study Hours Per Day</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-lg"
                                            min="1" max="12"
                                            value={studyHours}
                                            onChange={(e) => setStudyHours(Number(e.target.value))}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 fw-bold"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? "Generating..." : "Generate Roadmap & Start Learning"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
