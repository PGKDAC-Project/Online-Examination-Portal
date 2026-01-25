// src/components/StudentPages/StudentHome.jsx (renamed from StudentHome to StudentOverview for clarity)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBookOpen, FaClipboardList, FaHistory, FaPollH, FaClock } from 'react-icons/fa';
import { getCurrentUser } from "../../services/auth/authService";
import { getAllAnnouncements } from "../../services/common/announcementService";

function StudentOverview() {
    const authUser = getCurrentUser();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await getAllAnnouncements();
            if (Array.isArray(data)) {
                // Filter for Student or All, and check expiry if needed (assuming backend might return expired)
                const today = new Date().toISOString().split('T')[0];
                const relevant = data.filter(a =>
                    (a.targetRole === 'All' || a.targetRole === 'Student') &&
                    (!a.expiryDate || a.expiryDate >= today)
                );
                setAnnouncements(relevant);
            }
        } catch (err) {
            console.error("Failed to load announcements", err);
        }
    };

    const studentName = authUser?.name ?? "Student";
    const studentId = authUser?.id ? `S${String(authUser.id).padStart(5, "0")}` : "S00000";
    const studentEmail = authUser?.email ?? "";
    const lastLogin = "2025-10-27 20:30 PM"; // Example last login time

    return (
        <div> {/* No wrapper div here, as StudentLayout provides it */}
            <h1 className="mt-4 mb-4">Student Overview</h1>

            {/* Profile Section - A. View profile */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><FaUserCircle className="me-2" /> My Profile</h5>
                </div>
                <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {studentName}</p>
                    <p className="card-text"><strong>Student ID:</strong> {studentId}</p>
                    <p className="card-text"><strong>Email:</strong> {studentEmail}</p>
                    {/* Course info could be added here if readily available */}
                    <p className="card-text"><strong>Course:</strong> Bachelor of Science in Computer Science</p>
                    <Link to="/student/profile" className="btn btn-sm btn-outline-primary me-2">View Full Profile</Link>
                    <Link to="/student/change-password" className="btn btn-sm btn-outline-secondary">Change Password</Link>
                    <span className="ms-3 text-muted"><FaClock className="me-1" /> Last Login: {lastLogin}</span>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="row g-4 mb-4">
                {/* B. Enrolled Courses */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-success"><FaBookOpen className="me-2" /> Enrolled Courses</h5>
                            <p className="card-text">Access your course materials, syllabus, and instructor details.</p>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">Introduction to Programming</li>
                                <li className="list-group-item">Data Structures & Algorithms</li>
                                {/* Real data would populate this */}
                            </ul>
                            <Link to="/student/courses" className="btn btn-success btn-sm">View All Courses</Link>
                        </div>
                    </div>
                </div>

                {/* C. Available Exams */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-danger"><FaClipboardList className="me-2" /> Available Exams</h5>
                            <p className="card-text">See upcoming exams, their schedules, and rules.</p>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">CS101 Midterm (Oct 30, 14:00)</li>
                                <li className="list-group-item">MA205 Quiz (Nov 5, 10:00)</li>
                                {/* Real data would populate this */}
                            </ul>
                            <Link to="/student/exams" className="btn btn-danger btn-sm">View All Exams</Link>
                        </div>
                    </div>
                </div>

                {/* E. Exam History */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-info"><FaHistory className="me-2" /> Exam History</h5>
                            <p className="card-text">Review your past exam attempts, dates, and status.</p>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">CS101 Final - Completed</li>
                                <li className="list-group-item">PH100 Quiz 1 - Absent</li>
                                {/* Real data would populate this */}
                            </ul>
                            <Link to="/student/exam-history" className="btn btn-info btn-sm">View Exam History</Link>
                        </div>
                    </div>
                </div>

                {/* F. Results & Scorecard */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-warning"><FaPollH className="me-2" /> Results & Scorecard</h5>
                            <p className="card-text">Check your detailed scores, percentages, and pass/fail status.</p>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">CS101 Final - 85% (Pass)</li>
                                <li className="list-group-item">MA205 Midterm - 72% (Pass)</li>
                                {/* Real data would populate this */}
                            </ul>
                            <Link to="/student/results" className="btn btn-warning btn-sm">View All Results</Link>
                        </div>
                    </div>
                </div>

                {/* D. Attempt Exam - This will be a page, not a direct link from home, but triggered from "Available Exams" */}
                {/* Placeholder for future expansion or specific alerts */}
                <div className="col-md-6 col-lg-8">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Notifications / Announcements</h5>
                            <p className="card-text">Stay updated with important announcements and deadlines.</p>

                            {announcements.length === 0 ? (
                                <p className="text-muted small">No active announcements.</p>
                            ) : (
                                announcements.map(anno => (
                                    <div key={anno.id} className={`alert ${anno.targetRole === 'All' ? 'alert-info' : 'alert-warning'} mb-2`} role="alert">
                                        <strong>{anno.title}</strong>
                                        <div className="small">{anno.description}</div>
                                        {anno.expiryDate && <div className="text-muted" style={{ fontSize: '0.75rem' }}>Expires: {anno.expiryDate}</div>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div> {/* End Quick Access Cards Row */}

        </div>
    );
}

export default StudentOverview; // Export as StudentOverview
