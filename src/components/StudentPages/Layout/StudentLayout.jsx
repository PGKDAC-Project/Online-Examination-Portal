// src/components/StudentPages/StudentLayout.jsx
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router'; // Use Link and Outlet from react-router-dom
import { FaUserCircle, FaBookOpen, FaClipboardList, FaHistory, FaPollH, FaSignOutAlt, FaKey, FaClock, FaBars, FaSun, FaMoon, FaPalette } from 'react-icons/fa';

import './StudentHome.css'; // Keep your custom styles
import { useStudentLayout } from '../../../contexts/StudentLayoutContext';

function StudentLayout() {
    const { isSidebarToggled, toggleSidebar, theme, changeTheme } = useStudentLayout();
    const location = useLocation(); // To highlight active link

    // Placeholder for student's name, ID, etc. - in a real app, this would come from a global state or API
    const studentName = "Ankit Singh";
    const lastLogin = "2025-10-27 20:30 PM"; // Example last login time

    const handleLogout = () => {
        // Implement actual logout logic here (e.g., clear localStorage, call API, redirect)
        console.log("Student logged out.");
        // navigate('/login'); // Redirect to login page
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

                {/* Theme Switch */}
                <div className="list-group-item bg-transparent pt-3">
                    <div className="dropdown">
                    <button
                        className="btn btn-sm dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                        data-bs-toggle="dropdown"
                    >
                        <FaPalette className="me-2" /> Theme
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                        <button className="dropdown-item" onClick={() => changeTheme('light')}>
                            <FaSun className="me-2" /> Light
                        </button>
                        </li>
                        <li>
                        <button className="dropdown-item" onClick={() => changeTheme('dark')}>
                            <FaMoon className="me-2" /> Dark
                        </button>
                        </li>
                    </ul>
                    </div>
                </div>

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
                <nav className="navbar border-bottom">
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