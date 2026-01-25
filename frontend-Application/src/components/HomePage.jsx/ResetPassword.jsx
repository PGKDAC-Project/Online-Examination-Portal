import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaLock, FaArrowRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './Home.css';
import { resetPassword as resetPasswordService } from "../../services/auth/authService";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or expired reset link. Please request a new one.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})/;
        if (!passwordRegex.test(password)) {
            setError("Password must be 5-20 chars, include digit, lowercase and special character (#@$*).");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            await resetPasswordService({ token, newPassword: password });
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error("Reset Password Error:", err);
            setError(err?.data?.message || "Failed to reset password. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-sidebar">
                    <h2 className="display-4 fw-bold mb-4">Secure Access</h2>
                    <p className="lead mb-4">
                        Resetting your password ensures your account remains secure. Choose a strong, unique password.
                    </p>
                </div>

                <div className="login-form-section">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-dark">Reset Password</h3>
                        <p className="text-muted">Enter your new password below</p>
                    </div>

                    {success ? (
                        <div className="text-center py-4">
                            <FaCheckCircle className="text-success mb-3" size={50} />
                            <h4 className="fw-bold text-success mb-2">Success!</h4>
                            <p className="text-muted mb-4">
                                Your password has been successfully reset. Redirecting you to login...
                            </p>
                            <Link to="/login" className="btn btn-primary w-100">
                                Go to Login Now
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center small py-2">
                                    <FaExclamationCircle className="me-2" />
                                    {error}
                                </div>
                            )}

                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={!token || loading}
                                />
                                <label htmlFor="password"><FaLock className="me-2" />New Password</label>
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={!token || loading}
                                />
                                <label htmlFor="confirmPassword"><FaLock className="me-2" />Confirm New Password</label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center"
                                disabled={!token || loading}
                            >
                                {loading ? 'Updating...' : (
                                    <>Update Password <FaArrowRight className="ms-2" /></>
                                )}
                            </button>

                            <div className="text-center">
                                <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
