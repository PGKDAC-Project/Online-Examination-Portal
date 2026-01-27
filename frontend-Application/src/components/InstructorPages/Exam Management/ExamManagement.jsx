import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorExams, deleteInstructorExam } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const user = getCurrentUser();
            if (user && user.id) {
                const data = await getInstructorExams(user.id);
                setExams(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch exams:", error);
            toast.error("Failed to load exams.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this exam?")) {
            try {
                await deleteInstructorExam(id);
                toast.success("Exam deleted successfully");
                loadExams();
            } catch (error) {
                console.error("Failed to delete exam:", error);
                toast.error("Failed to delete exam.");
            }
        }
    };

    if (loading) return <div className="p-5 text-center">Loading exams...</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Exam Management</h2>
                <Link to="/instructor/exams/create" className="btn btn-primary">
                    <FaPlus className="me-2" /> Create New Exam
                </Link>
            </div>

            {exams.length === 0 ? (
                <div className="alert alert-info text-center">
                    No exams found. Click "Create New Exam" to get started.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover shadow-sm align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Exam Title</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>
                                        <div className="fw-bold">{exam.examTitle}</div>
                                        <small className="text-muted">Duration: {exam.duration} mins</small>
                                    </td>
                                    <td>{exam.course ? exam.course.courseCode : 'N/A'}</td>
                                    <td>{exam.scheduledDate}</td>
                                    <td>{exam.startTime} - {exam.endTime}</td>
                                    <td>
                                        <span className={`badge ${exam.status === 'SCHEDULED' ? 'bg-warning' :
                                                exam.status === 'LIVE' ? 'bg-success' :
                                                    exam.status === 'COMPLETED' ? 'bg-secondary' : 'bg-primary'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <Link
                                                to={`/instructor/exams/${exam.id}/questions`}
                                                className="btn btn-sm btn-outline-info"
                                                title="Manage Questions"
                                            >
                                                <FaClipboardList />
                                            </Link>
                                            <Link
                                                to={`/instructor/exams/${exam.id}/edit`}
                                                className="btn btn-sm btn-outline-primary"
                                                title="Edit Exam"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(exam.id)}
                                                title="Delete Exam"
                                            >
                                                <FaTrash />
                                            </button>
                                            {exam.status === 'LIVE' && (
                                                <Link
                                                    to={`/instructor/exams/${exam.id}/monitor`}
                                                    className="btn btn-sm btn-outline-success"
                                                    title="Monitor Live Exam"
                                                >
                                                    <FaEye />
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
