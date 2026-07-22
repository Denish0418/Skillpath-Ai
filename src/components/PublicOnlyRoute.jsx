import { Navigate } from "react-router-dom";

/**
 * PublicOnlyRoute Component
 * Prevents authenticated users from visiting public login/register pages.
 * Redirects logged-in users straight to /dashboard.
 */
function PublicOnlyRoute({ children }) {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicOnlyRoute;
