// src/components/StudentPages/StudentHome.jsx (renamed from StudentHome to StudentOverview for clarity)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBookOpen, FaClipboardList, FaHistory, FaPollH, FaClock } from 'react-icons/fa';
import { getCurrentUser } from "../../services/auth/authService";
import { getAllAnnouncements } from "../../services/common/announcementService";
import { toast } from 'react-toastify';
import axiosClient from '../../services/axios/axiosClient';

function StudentOverview() {
    const authUser = getCurrentUser();
    const [announcements, setAnnouncements] = useState([]);
    const [profile, setProfile] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableExams, setAvailableExams] = useState([]);
    const [examHistory, setExamHistory] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!authUser?.id) return;
                
                const [annoData, profileData, coursesData, examsData, historyData, resultsData] = await Promise.all([
                    getAllAnnouncements().catch(() => []),
                    axiosClient.get(`/student/profile/${authUser.id}`).catch(() => null),
                    axiosClient.get(`/student/courses/${authUser.id}`).catch(() => []),
                    axiosClient.get(`/student/exams/available/${authUser.id}`).catch(() => []),
                    axiosClient.get(`/student/results/${authUser.id}`).catch(() => []),
                    axiosClient.get(`/student/results/${authUser.id}`).catch(() => [])
                ]);

                const today = new Date().toISOString().split('T')[0];
                const relevant = (annoData || []).filter(a =>
                    (a.targetRole?.toLowerCase() === 'all' || a.targetRole?.toLowerCase() === 'student') &&
                    (!a.expiryDate || a.expiryDate >= today)
                );
                setAnnouncements(relevant);
                setProfile(profileData);
                setEnrolledCourses((coursesData || []).slice(0, 2));
                setAvailableExams((examsData || []).slice(0, 2));
                setExamHistory((historyData || []).slice(0, 2));
                setResults((resultsData || []).slice(0, 2));
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    const studentName = profile?.name || authUser?.name || "Student";
    const studentId = profile?.id ? `S${String(profile.id).padStart(5, "0")}` : "S00000";
    const studentEmail = profile?.email || authUser?.email || "";
    const lastLogin = "2025-10-27 20:30 PM";

    return (
        <div>
            <h1 className="mt-4 mb-4">Student Overview</h1>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><FaUserCircle className="me-2" /> My Profile</h5>
                </div>
                <div className="card-body">
                    <p className="card-text"><strong>Name:</strong> {studentName}</p>
                    <p className="card-text"><strong>Student ID:</strong> {studentId}</p>
                    <p className="card-text"><strong>Email:</strong> {studentEmail}</p>
                    <p className="card-text"><strong>Course:</strong> {profile?.course || 'Bachelor of Science in Computer Science'}</p>
                    <Link to="/student/profile" className="btn btn-sm btn-outline-primary me-2">View Full Profile</Link>
                    <Link to="/student/change-password" className="btn btn-sm btn-outline-secondary">Change Password</Link>
                    <span className="ms-3 text-muted"><FaClock className="me-1" /> Last Login: {lastLogin}</span>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-success"><FaBookOpen className="me-2" /> Enrolled Courses</h5>
                            <p className="card-text">Access your course materials, syllabus, and instructor details.</p>
                            <ul className="list-group list-group-flush mb-3">
                                {enrolledCourses.length === 0 ? (
                                    <li className="list-group-item">No enrolled courses</li>
                                ) : (
                                    enrolledCourses.map((course) => (
                                        <li key={course.id} className="list-group-item">{course.courseName || course.name}</li>
                                    ))
                                )}
                            </ul>
                            <Link to="/student/courses" className="btn btn-success btn-sm">View All Courses</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-danger"><FaClipboardList className="me-2" /> Available Exams</h5>
                            <p className="card-text">See upcoming exams, their schedules, and rules.</p>
                            <ul className="list-group list-group-flush mb-3">
                                {availableExams.length === 0 ? (
                                    <li className="list-group-item">No available exams</li>
                                ) : (
                                    availableExams.map((exam) => (
                                        <li key={exam.id} className="list-group-item">{exam.title} ({exam.scheduledDate})</li>
                                    ))
                                )}
                            </ul>
                            <Link to="/student/exams" className="btn btn-danger btn-sm">View All Exams</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-info"><FaHistory className="me-2" /> Exam History</h5>
                            <p className="card-text">Review your past exam attempts, dates, and status.</p>
                            <ul className="list-group list-group-flush mb-3">
                                {examHistory.length === 0 ? (
                                    <li className="list-group-item">No exam history</li>
                                ) : (
                                    examHistory.map((exam) => (
                                        <li key={exam.id} className="list-group-item">{exam.examTitle} - {exam.status}</li>
                                    ))
                                )}
                            </ul>
                            <Link to="/student/exam-history" className="btn btn-info btn-sm">View Exam History</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-warning"><FaPollH className="me-2" /> Results & Scorecard</h5>
                            <p className="card-text">Check your detailed scores, percentages, and pass/fail status.</p>
                            <ul className="list-group list-group-flush mb-3">
                                {results.length === 0 ? (
                                    <li className="list-group-item">No results available</li>
                                ) : (
                                    results.map((result) => (
                                        <li key={result.id} className="list-group-item">{result.examTitle} - {result.percentage}% ({result.status})</li>
                                    ))
                                )}
                            </ul>
                            <Link to="/student/results" className="btn btn-warning btn-sm">View All Results</Link>
                        </div>
                    </div>
                </div>

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

            </div>

        </div>
    );
}

export default StudentOverview;
