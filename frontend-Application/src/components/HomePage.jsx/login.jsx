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
    const [forgotError, setForgotError] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [resetError, setResetError] = useState("");

    const [forgotEmail, setForgotEmail] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");

    useEffect(() => {
        if (location.pathname === "/editPassword") {
            setMode("forgot");
        } else {
            setMode("login");
        }
    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        try {
            const authUser = await loginWithEmailPassword({
                email: formData.email,
                password: formData.password
            });
            // Successful major action: Toast optional, but requirement says "Remove toast notifications for login errors". 
            // Usually success toast is okay, but "Remove toast notifications for login errors" might imply only errors.
            // "Toasts may remain ONLY for: Successful major actions". Login IS a major action.
            // But let's stick to inline or just redirect.
            // toast.success(`Welcome, ${authUser.name}!`); 
            navigate(routeByRole(authUser.role));
        } catch (err) {
            if (err?.code === "INVALID_CREDENTIALS") {
                setLoginError("Invalid email or password");
                return;
            }
            setLoginError("Invalid email or password"); // Generic error for security
        } finally {
            setLoading(false);
        }
    };

    const startForgotPassword = (e) => {
        e.preventDefault();
        setForgotError("");
        requestPasswordReset({ email: forgotEmail })
            .then(({ code }) => {
                setGeneratedCode(code);
                setCodeInput("");
                setMode("verify");
                // toast.info(`Verification code sent (demo: ${code})`); // keep demo code in console or alert if really needed, or just let it pass
                console.log(`Verification code sent (demo: ${code})`);
            })
            .catch((err) => {
                if (err?.code === "EMAIL_NOT_FOUND") {
                    setForgotError("Email not found.");
                    return;
                }
                setForgotError("Could not send code. Please try again.");
            });
    };

    const verifyCode = (e) => {
        e.preventDefault();
        setVerifyError("");
        if (!generatedCode) {
            setVerifyError("Please request a code again.");
            setMode("forgot");
            return;
        }
        if (codeInput.trim() !== generatedCode) {
            setVerifyError("Invalid code.");
            return;
        }
        setMode("reset");
        // toast.success("Code verified. You can now reset your password.");
    };

    const submitReset = (e) => {
        e.preventDefault();
        setResetError("");
        const email = forgotEmail.trim().toLowerCase();
        if (resetPassword.length < 6) {
            setResetError("Password must be at least 6 characters long.");
            return;
        }
        if (resetPassword !== resetConfirmPassword) {
            setResetError("Passwords do not match.");
            return;
        }
        resetPasswordService({ email, newPassword: resetPassword });

        setGeneratedCode("");
        setCodeInput("");
        setResetPassword("");
        setResetConfirmPassword("");
        // toast.success("Password updated. Please login again.");
        setMode("login");
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

                            <div className="form-floating mb-4">
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

                            {loginError && (
                                <div className="text-danger mb-3 small">
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
                        <form onSubmit={startForgotPassword}>
                            {forgotError && <div className="text-danger mb-3 small">{forgotError}</div>}
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

                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                                Send Code
                            </button>

                            <div className="text-center">
                                <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {mode === "verify" && (
                        <form onSubmit={verifyCode}>
                            {verifyError && <div className="text-danger mb-3 small">{verifyError}</div>}
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    placeholder="Enter code"
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    required
                                />
                                <label htmlFor="code"><FaUser className="me-2" />Verification Code</label>
                            </div>

                            {generatedCode && (
                                <div className="text-muted small mb-3">
                                    Demo code: <strong>{generatedCode}</strong>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                                Verify
                            </button>

                            <div className="text-center d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={() => { setMode("forgot"); setGeneratedCode(""); }}
                                    style={{ textDecoration: 'none', color: '#64748b' }}
                                >
                                    Resend
                                </button>
                                <Link to="/login" style={{ textDecoration: 'none', color: '#64748b' }}>
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {mode === "reset" && (
                        <form onSubmit={submitReset}>
                            {resetError && <div className="text-danger mb-3 small">{resetError}</div>}
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    placeholder="New password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="newPassword"><FaLock className="me-2" />New Password</label>
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmNewPassword"
                                    placeholder="Confirm new password"
                                    value={resetConfirmPassword}
                                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="confirmNewPassword"><FaLock className="me-2" />Confirm New Password</label>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                                Update Password
                            </button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => setMode("login")}
                                    style={{ textDecoration: 'none' }}
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
