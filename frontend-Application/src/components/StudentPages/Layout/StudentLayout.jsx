// src/components/StudentPages/StudentLayout.jsx
import React, { useEffect, useMemo } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBookOpen, FaClipboardList, FaHistory, FaPollH, FaSignOutAlt, FaKey, FaClock, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { toast } from "react-toastify";
import { clearCurrentUser, getCurrentUser } from "../../../services/auth/authService";

import './StudentHome.css'; // Keep your custom styles
import { useStudentLayout } from '../../../contexts/StudentLayoutContext';

function StudentLayout() {
    const { isSidebarToggled, toggleSidebar, theme, changeTheme } = useStudentLayout();
    const navigate = useNavigate();

    const authUser = useMemo(() => {
        return getCurrentUser();
    }, []);

    useEffect(() => {
        if (!authUser) {
            navigate("/login", { replace: true });
            return;
        }
        const role = String(authUser.role ?? "").toLowerCase();
        if (role !== "student") {
            navigate("/login", { replace: true });
        }
    }, [authUser, navigate]);

    const studentName = authUser?.name ?? "Student";
    const lastLogin = "2025-10-27 20:30 PM"; // Example last login time

    const handleLogout = () => {
        toast.dismiss();
        clearCurrentUser();
        navigate('/login'); // Redirect to login page
    };

    return (
        <div
            id="wrapper"
            className={`${isSidebarToggled ? 'toggled' : ''} ${theme}`}
            >
            {/* Sidebar */}
            <div id="sidebar-wrapper" className="border-right">
                <div className="sidebar-heading px-3 py-2">
                    Student Dashboard
                </div>


                <div className="list-group list-group-flush">
                <Link to="/student/home" className="list-group-item list-group-item-action">
                    <FaUserCircle className="me-2" /> Overview
                </Link>

                <Link to="/student/profile" className="list-group-item list-group-item-action">
                    <FaUserCircle className="me-2" /> View Profile
                </Link>

                <Link to="/student/courses" className="list-group-item list-group-item-action">
                    <FaBookOpen className="me-2" /> Enrolled Courses
                </Link>

                <Link to="/student/exams" className="list-group-item list-group-item-action">
                    <FaClipboardList className="me-2" /> Available Exams
                </Link>

                <Link to="/student/exam-history" className="list-group-item list-group-item-action">
                    <FaHistory className="me-2" /> Exam History
                </Link>

                <Link to="/student/results" className="list-group-item list-group-item-action">
                    <FaPollH className="me-2" /> Results & Scorecard
                </Link>

                <Link to="/student/change-password" className="list-group-item list-group-item-action">
                    <FaKey className="me-2" /> Change Password
                </Link>

                <button
                    type="button"
                    className="list-group-item list-group-item-action student-theme-btn"
                    onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === "light" ? <FaMoon className="me-2" /> : <FaSun className="me-2" />}
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="list-group-item list-group-item-action bg-danger text-white mt-3"
                >
                    <FaSignOutAlt className="me-2" /> Logout
                </button>
                </div>
            </div>

            {/* Page Content */}
            <div id="page-content-wrapper">
                <nav className="student-navbar">
                <div className="w-100 d-flex align-items-center px-3">
                    <button className="btn custom-toggle-btn" onClick={toggleSidebar}>
                    <FaBars />
                    </button>

                    <h4 className="ms-3 my-0">Welcome, {studentName}!</h4>

                    <div className="ms-auto text-muted">
                    <FaClock className="me-1" /> Last Login: {lastLogin}
                    </div>
                </div>
                </nav>


                <div className="flex-grow-1 main-content-padding">
                <Outlet />
                </div>
            </div>
            </div>

    );
}

export default StudentLayout;
