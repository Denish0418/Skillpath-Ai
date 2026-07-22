import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute Component
 * Guards routes that require user authentication.
 * Checks localStorage for 'user' data.
 * If missing, automatically redirects user to /login with state preserved.
 */
function ProtectedRoute({ children }) {
    const location = useLocation();
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        // Automatically redirect unauthenticated user to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
