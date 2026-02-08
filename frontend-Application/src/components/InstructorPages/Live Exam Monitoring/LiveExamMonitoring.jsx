import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FaUsers,
    FaUserCheck,
    FaExclamationTriangle,
    FaWindowClose,
    FaExternalLinkAlt,
    FaClock,
    FaCheckCircle
} from 'react-icons/fa';
import { getLiveExamStats, getLiveStudentStatuses, getInstructorExams } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';
import { toast } from 'react-toastify';

function LiveExamMonitoring() {
    const { examId } = useParams();
    const [stats, setStats] = useState({ attempted: 0, active: 0, autoSubmitted: 0 });
    const [violationsCount, setViolationsCount] = useState({ tabSwitches: 0, fullscreenExits: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ongoingExams, setOngoingExams] = useState([]);

    useEffect(() => {
        if (!examId) {
            loadOngoingExams();
            return;
        }
        
        const fetchLiveData = async () => {
            try {
                const [statsData, studentsData] = await Promise.all([
                    getLiveExamStats(examId),
                    getLiveStudentStatuses(examId)
                ]);
                setStats(statsData.summary || statsData);
                setViolationsCount(statsData.violations || { tabSwitches: 0, fullscreenExits: 0 });
                setStudents(studentsData || []);
            } catch (err) {
                console.error("Failed to fetch live monitoring data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveData();
        const interval = setInterval(fetchLiveData, 5000);
        return () => clearInterval(interval);
    }, [examId]);

    const loadOngoingExams = async () => {
        try {
            const user = getCurrentUser();
            if (user && user.id) {
                const data = await getInstructorExams(user.id);
                const ongoing = data.filter(exam => exam.status === 'ONGOING');
                setOngoingExams(ongoing);
            }
        } catch (error) {
            console.error("Failed to fetch ongoing exams:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case "In Progress":
                return "badge bg-primary";
            case "Submitted":
                return "badge bg-success";
            case "Auto-submitted":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    if (loading) return <div className="p-5 text-center">Loading live monitor...</div>;
    
    if (!examId) {
        return (
            <div>
                <h2 className="mb-4">Live Exam Monitoring</h2>
                {ongoingExams.length === 0 ? (
                    <div className="alert alert-info">No exams are currently ongoing.</div>
                ) : (
                    <div className="row">
                        {ongoingExams.map(exam => (
                            <div key={exam.id} className="col-md-6 mb-3">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{exam.examTitle}</h5>
                                        <p className="text-muted mb-2">
                                            Course: {exam.course?.courseCode} - {exam.course?.title}
                                        </p>
                                        <p className="mb-2">
                                            <FaClock className="me-2" />
                                            {exam.startTime} - {exam.endTime}
                                        </p>
                                        <Link 
                                            to={`/instructor/exams/${exam.id}/monitor`}
                                            className="btn btn-success"
                                        >
                                            Monitor Exam
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4">Live Exam Monitoring</h2>

            {/* Live Stats */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaUsers size={28} className="text-primary mb-2" />
                            <h6>Total Attempted</h6>
                            <h3>{stats.attempted}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaUserCheck size={28} className="text-success mb-2" />
                            <h6>Active Students</h6>
                            <h3>{stats.active}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaExclamationTriangle size={28} className="text-danger mb-2" />
                            <h6>Auto-Submitted</h6>
                            <h3>{stats.autoSubmitted}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Violation Summary */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-warning">
                    <strong>Violation Summary</strong>
                </div>
                <div className="card-body d-flex justify-content-between">
                    <span>
                        <FaExternalLinkAlt className="me-2 text-danger" />
                        Tab Switches: <strong>{violationsCount.tabSwitches}</strong>
                    </span>
                    <span>
                        <FaWindowClose className="me-2 text-danger" />
                        Fullscreen Exits: <strong>{violationsCount.fullscreenExits}</strong>
                    </span>
                </div>
            </div>

            {/* Student-wise Monitoring */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <strong>Student-wise Status</strong>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Tab Switches</th>
                                <th>Fullscreen Exits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <span className={statusBadge(student.status)}>
                                            {student.status === "In Progress" && <FaClock className="me-1" />}
                                            {student.status === "Submitted" && <FaCheckCircle className="me-1" />}
                                            {student.status === "Auto-submitted" && <FaExclamationTriangle className="me-1" />}
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>{student.tabSwitches}</td>
                                    <td>{student.fullscreenExits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security note */}
            <div className="alert alert-info mt-4">
                <strong>Security Note:</strong> Violations and auto-submissions are logged in real time.
                Final disciplinary decisions must be taken based on backend audit logs, not UI counters.
            </div>
            
            <div className="mt-3">
                <Link to="/instructor/live-exams" className="btn btn-outline-secondary">
                    Back to Ongoing Exams
                </Link>
            </div>
        </div>
    );
}

export default LiveExamMonitoring;
