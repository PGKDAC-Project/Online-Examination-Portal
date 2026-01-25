import React, { useEffect, useState } from 'react';
import { getSystemSettings } from '../../services/admin/systemSettingsService';
import { FaExclamationTriangle } from 'react-icons/fa';

const MaintenanceGuard = ({ children }) => {
    const [maintenance, setMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const publicRoutes = ['/login', '/editPassword', '/auth/reset-password', '/', '/about'];
        const isPublic = publicRoutes.includes(window.location.pathname);

        const checkMaintenance = async () => {
            // If we are on a public route, we might skip the check to avoid 403 logs 
            // if the backend requires authentication for /settings.
            // However, usually maintenance mode should be public. 
            // Since our current backend returns 403, we skip for now.
            if (isPublic && !localStorage.getItem('token')) {
                setLoading(false);
                return;
            }

            try {
                const settings = await getSystemSettings();
                if (settings && settings.maintenanceMode) {
                    setMaintenance(true);
                } else {
                    setMaintenance(false);
                }
            } catch (err) {
                // Silently bypass maintenance check if unauthorized, unauthenticated, or endpoint missing (500/404)
                if (err.status !== 403 && err.status !== 401 && err.status !== 500 && err.status !== 404) {
                    console.warn("Maintenance check bypassed due to error:", err.message);
                }
                setMaintenance(false);
            } finally {
                setLoading(false);
            }
        };
        checkMaintenance();

        // Optional: Polling for maintenance mode if critical
        const interval = setInterval(checkMaintenance, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    if (maintenance) {
        return (
            <div className="container mt-5 text-center">
                <div className="card shadow-lg p-5 border-warning">
                    <FaExclamationTriangle size={80} className="text-warning mb-4" />
                    <h1 className="display-4">System Maintenance</h1>
                    <p className="lead">
                        The Online Examination Portal is currently undergoing scheduled maintenance.
                        All user access is temporarily suspended.
                    </p>
                    <p className="text-muted">Please try again later or contact the administrator.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default MaintenanceGuard;
