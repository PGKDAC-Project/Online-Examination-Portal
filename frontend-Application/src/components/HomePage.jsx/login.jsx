import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
// Toast removed as per requirement
import { FaUser, FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import './Home.css';
import { loginWithEmailPassword, requestPasswordReset, resetPassword as resetPasswordService } from "../../services/auth/authService";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [resetPassword, setResetPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [resetError, setResetError] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [codeInput, setCodeInput] = useState("");

    useEffect(() => {
        if (location.pathname === "/editPassword") {
            setMode("forgot");
        } else {
            setMode("login");
        }
    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (loginError) setLoginError(""); // Clear error on type
    };

    const routeByRole = (role) => {
        const r = (role ?? "").toLowerCase();
        if (r === "admin") return "/admin/dashboard";
        if (r === "instructor") return "/instructor/home";
        return "/student/home";
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(""); // Clear previous errors
        try {
            const authUser = await loginWithEmailPassword({
                email: formData.email.trim(),
                password: formData.password
            });
            // Login success: Redirect immediately. avoiding toast as per requirement.
            navigate(routeByRole(authUser.role));
        } catch (err) {
            console.error("Login Fail:", err);
            // Requirement: "Display backend error message Below password field In red color"
            // And "Remove toast notifications for login errors"
            if (err?.code === "INVALID_CREDENTIALS") {
                setLoginError("Invalid email or password");
            } else {
                setLoginError("Invalid email or password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setForgotError("");
        setIsEmailSent(false);
        try {
            const trimmedEmail = (forgotEmail || "").trim();
            await requestPasswordReset({ email: trimmedEmail });
            setIsEmailSent(true);
        } catch (err) {
            console.error("Forgot Pass Fail:", err);
            if (err?.data?.message?.toLowerCase().includes("not found") || err?.status === 404) {
                setForgotError("Invalid email address. Please check and try again.");
            } else {
                setForgotError("Failed to request password reset. Please check your email and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResetError("");
        const email = forgotEmail.trim().toLowerCase();

        const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})/;
        if (!passwordRegex.test(resetPassword)) {
            setResetError("Password must be 5-20 chars, include digit, lowercase and special character (#@$*).");
            setLoading(false);
            return;
        }

        if (resetPassword !== resetConfirmPassword) {
            setResetError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Updated service call (no email needed as per DTO)
            const token = ""; // This handleResetPassword seems to be for a different flow? 
            // Usually reset is in ResetPassword.jsx.
            await resetPasswordService({ token, newPassword: resetPassword });
            setResetPassword("");
            setResetConfirmPassword("");
            setMode("login");
        } catch (err) {
            console.error("Reset Pass Fail:", err);
            setResetError("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Sidebar / Info Panel */}
                <div className="login-sidebar">
                    <h2 className="display-4 fw-bold mb-4">Welcome Back!</h2>
                    <p className="lead mb-4">
                        Access your exams, results, and learning materials securely.
                    </p>
                    <div className="mt-auto">
                        <p className="small opacity-75">Secure Online Examination Portal &copy; 2025</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="login-form-section">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-dark">
                            {mode === "login" ? "Sign In" : mode === "forgot" ? "Forgot Password" : mode === "verify" ? "Verify Code" : "Reset Password"}
                        </h3>
                        <p className="text-muted">
                            {mode === "login"
                                ? "Enter your email and password"
                                : mode === "forgot"
                                    ? "Enter your registered email"
                                    : mode === "verify"
                                        ? "Enter the code sent to your email"
                                        : "Choose a new password"}
                        </p>
                    </div>

                    {mode === "login" && (
                        <form onSubmit={handleLogin}>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="email"><FaEnvelope className="me-2" />Email Address</label>
                            </div>

                            <div className="form-floating mb-2">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="password"><FaLock className="me-2" />Password</label>
                            </div>

                            {/* Inline Error (Red) */}
                            {loginError && (
                                <div className="text-danger mb-4 small fw-bold">
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : (
                                    <>Sign In <FaArrowRight className="ms-2" /></>
                                )}
                            </button>

                            <div className="text-center">
                                <Link to="/editPassword" style={{ textDecoration: 'none', color: '#64748b' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>
                    )}

                    {mode === "forgot" && (
                        <form onSubmit={handleForgotPassword}>
                            {isEmailSent ? (
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block">
                                            <FaEnvelope size={40} />
                                        </div>
                                    </div>
                                    <h4 className="fw-bold text-success mb-3">Email Sent!</h4>
                                    <p className="text-muted mb-4">
                                        We've sent a password reset link to <strong>{forgotEmail}</strong>.
                                        Please check your inbox (and spam folder) and follow the link to reset your password.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={() => { setMode("login"); setIsEmailSent(false); }}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {forgotError && <div className="text-danger mb-3 small fw-bold">{forgotError}</div>}
                                    <div className="form-floating mb-4">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="forgotEmail"
                                            placeholder="name@example.com"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="forgotEmail"><FaEnvelope className="me-2" />Email Address</label>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3" disabled={loading}>
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>

                                    <div className="text-center">
                                        <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>
                                            Back to Login
                                        </Link>
                                    </div>
                                </>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
