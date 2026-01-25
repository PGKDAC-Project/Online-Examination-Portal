import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/auth/authService";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const user = getCurrentUser();
    const location = useLocation();

    if (!user) {
        // Not logged in -> Redirect to Home/Login
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toLowerCase())) {
        // Logged in but wrong role -> Redirect to their specific dashboard or Home
        // For simplicity, strict redirect to Home to avoid loops
        return <Navigate to="/" replace />;
    }

    // Authorized
    return <Outlet />;
};

export default ProtectedRoute;
