// src/components/InstructorPages/InstructorOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserTie,
    FaBook,
    FaClipboardCheck,
    FaClock,
    FaBroadcastTower,
    FaChartBar
} from 'react-icons/fa';

function InstructorOverview() {

    // Placeholder data — replace with API/context later
    const instructorName = "Dr. Rahul Mehta";
    const instructorId = "I78901";
    const instructorEmail = "rahul.mehta@university.edu";
    const lastLogin = "2025-10-27 18:10 PM";

    return (
        <div>
            <h1 className="mt-4 mb-4">Instructor Overview</h1>

            {/* Profile Section */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">
                        <FaUserTie className="me-2" /> Instructor Profile
                    </h5>
                </div>
                <div className="card-body">
                    <p><strong>Name:</strong> {instructorName}</p>
                    <p><strong>Instructor ID:</strong> {instructorId}</p>
                    <p><strong>Email:</strong> {instructorEmail}</p>
                    <p><strong>Department:</strong> Computer Science</p>

                    <Link to="/instructor/profile" className="btn btn-sm btn-outline-dark me-2">
                        View Profile
                    </Link>
                    <Link to="/instructor/change-password" className="btn btn-sm btn-outline-secondary">
                        Change Password
                    </Link>

                    <span className="ms-3 text-muted">
                        <FaClock className="me-1" /> Last Login: {lastLogin}
                    </span>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="row g-4 mb-4">

                {/* Total Courses */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-success">
                                <FaBook className="me-2" /> Courses Handled
                            </h5>
                            <p className="display-6 fw-bold">4</p>
                            <Link to="/instructor/courses" className="btn btn-success btn-sm">
                                Manage Courses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Exams Created */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-danger">
                                <FaClipboardCheck className="me-2" /> Exams Created
                            </h5>
                            <p className="display-6 fw-bold">12</p>
                            <Link to="/instructor/exams" className="btn btn-danger btn-sm">
                                View Exams
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-primary">
                                <FaClock className="me-2" /> Upcoming Exams
                            </h5>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">
                                    DS Midterm – Oct 30, 14:00
                                </li>
                                <li className="list-group-item">
                                    OS Quiz – Nov 3, 11:00
                                </li>
                            </ul>
                            <Link to="/instructor/exams/upcoming" className="btn btn-primary btn-sm">
                                View Schedule
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Ongoing Exams (Live Monitoring) */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-warning">
                                <FaBroadcastTower className="me-2" /> Ongoing Exams
                            </h5>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">
                                    CN End Sem – 42 Students Online
                                </li>
                            </ul>
                            <Link to="/instructor/exams/live" className="btn btn-warning btn-sm">
                                Monitor Live
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recently Published Results */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-info">
                                <FaChartBar className="me-2" /> Published Results
                            </h5>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">
                                    DBMS Midterm – Published
                                </li>
                                <li className="list-group-item">
                                    Java Quiz – Published
                                </li>
                            </ul>
                            <Link to="/instructor/results" className="btn btn-info btn-sm">
                                View Results
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Announcements */}
                <div className="col-md-6 col-lg-8">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-secondary">
                                Notifications / Alerts
                            </h5>

                            <div className="alert alert-success">
                                Results for DBMS Midterm have been published.
                            </div>

                            <div className="alert alert-warning">
                                CN End Sem exam is currently live.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default InstructorOverview;
