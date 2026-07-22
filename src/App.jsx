import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

/**
 * Main Application Component with Protected Routes & Toast Notifications
 */
function App() {
    const [toastState, setToastState] = useState({
        show: false,
        message: "",
        type: "info"
    });

    const triggerToast = useCallback((message, type = "info") => {
        setToastState({
            show: true,
            message,
            type
        });
    }, []);

    const closeToast = useCallback(() => {
        setToastState(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <Navbar onToast={triggerToast} />

                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />

                        {/* Public Auth Routes (Redirects to /dashboard if logged in) */}
                        <Route
                            path="/login"
                            element={
                                <PublicOnlyRoute>
                                    <Login onToast={triggerToast} />
                                </PublicOnlyRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicOnlyRoute>
                                    <Register onToast={triggerToast} />
                                </PublicOnlyRoute>
                            }
                        />

                        {/* Protected Routes (Redirects to /login if NOT logged in) */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard onToast={triggerToast} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-roadmap"
                            element={
                                <ProtectedRoute>
                                    <Roadmap onToast={triggerToast} />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>

                <Footer />

                {/* Global Notification Toast */}
                <Toast
                    show={toastState.show}
                    message={toastState.message}
                    type={toastState.type}
                    onClose={closeToast}
                />
            </div>
        </BrowserRouter>
    );
}

export default App;