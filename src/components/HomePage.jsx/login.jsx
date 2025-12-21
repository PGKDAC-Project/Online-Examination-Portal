import { useState } from "react"; 
import { useNavigate, Link } from "react-router";
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        selectedRole: "" 
    });
    const [errors, setErrors] = useState({});

    const pageTitle = "Login";

    // Helper function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Helper function to validate password strength 
    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear existing error for the field as user types
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Client-side Validation
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        // Validate that a role has been selected
        if (!formData.selectedRole) {
            newErrors.selectedRole = "Please select your role.";
        }

        setErrors(newErrors);

        // If client-side validation fails, display errors and stop
        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(msg => {
                toast.error(msg, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
            return; // Stop execution if there are client-side errors
        }

        // --- BACKEND INTEGRATION START ---
        console.log(`Attempting login for role "${formData.selectedRole}" with data:`, {
            email: formData.email,
            password: formData.password
        });

        try {
            const apiUrl = '/api/login'; // Your generic login endpoint

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    // Send the selected role to the backend
                    requestedRole: formData.selectedRole,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log("Backend login success response:", data);

                // --- IMPORTANT ---
                // Store authentication token (e.g., JWT) and user data securely.
                // localStorage.setItem('authToken', data.token);
                // localStorage.setItem('userRole', data.user.role); // Backend MUST confirm the role
                // localStorage.setItem('userId', data.user.id);

                // Ensure the role confirmed by the backend matches the requested role
                const actualUserRole = data.user ? data.user.role : formData.selectedRole; // Fallback to requested if backend doesn't explicitly send

                // Navigate based on the confirmed role from the backend
                switch (actualUserRole) {
                    case "admin":
                        navigate("/admin/home"); // Updated path
                        toast.success("Admin login successful!");
                        break;
                    case "instructor":
                        navigate("/instructor/home"); // Updated path
                        toast.success("Instructor login successful!");
                        break;
                    case "student":
                        navigate("/student/home"); // Updated path
                        toast.success("Student login successful!");
                        break;
                    default:
                        // This case handles unexpected roles or issues from the backend
                        toast.error("Login successful, but an unknown role was returned. Please contact support.", {
                            position: "top-right",
                        });
                        navigate("/"); // Fallback to general home or error page
                        break;
                }
            } else {
                const errorData = await response.json();
                console.error("Backend login error:", errorData);
                toast.error(errorData.message || "Login failed. Please check your credentials and selected role.", {
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Network or API request failed:", error);
            toast.error("Network error. Could not connect to the server. Please try again later.", {
                position: "top-right",
            });
        }
        // --- BACKEND INTEGRATION END ---
    };

    return (
        <div className="container mt-5">
            <h2>{pageTitle}</h2> {/* Use the static pageTitle */}
            <form onSubmit={handleLogin}>
                {/* Role Selection Dropdown */}
                <div className="mb-3">
                    <label htmlFor="selectedRole" className="form-label">
                        I am a:</label>
                    <select
                        className={`form-select ${errors.selectedRole ? 'is-invalid' : ''}`}
                        id="selectedRole"
                        name="selectedRole"
                        value={formData.selectedRole}
                        onChange={handleChange}
                    >
                        <option value="">Select your role</option>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                        <option value="student">Student</option>
                    </select>
                    {errors.selectedRole && <div className="invalid-feedback">{errors.selectedRole}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                <button type="submit" className="btn btn-primary me-2">
                    Login
                </button>
                <Link to="/editPassword" className="btn btn-link-info">Forgot Password?</Link>
            </form>
        </div>
    );
}

export default Login;