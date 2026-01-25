import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaPlusCircle,
    FaEdit,
    FaTrash,
    FaEye,
    FaClock,
    FaCheckCircle,
    FaBroadcastTower
} from 'react-icons/fa';
import { getAllExams, deleteExam as deleteExamService } from '../../../services/admin/examService';
import { toast } from 'react-toastify';

function ExamManagement() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await getAllExams();
                setExams(data || []);
            } catch (err) {
                console.error("Failed to fetch exams:", err);
                toast.error("Could not load exams from server.");
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const handleDelete = async (examId) => {
        const ok = window.confirm("Delete this exam?");
        if (!ok) return;
        try {
            await deleteExamService(examId);
            setExams(exams.filter((e) => String(e.id) !== String(examId)));
            toast.success("Exam deleted successfully.");
        } catch (err) {
            toast.error("Failed to delete exam: " + err.message);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case "Scheduled": return "badge bg-primary";
            case "Live": return "badge bg-danger";
            case "Completed": return "badge bg-success";
            default: return "badge bg-secondary";
        }
    };

    if (loading) return <div className="p-5 text-center">Loading exams...</div>;

    return (
        <div>
            <h2 className="mb-4">Exam Creation & Management</h2>

            <div className="mb-4">
                <Link to="/instructor/exams/create" className="btn btn-success">
                    <FaPlusCircle className="me-2" />
                    Create New Exam
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Manage Exams</h5>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Exam Title</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.title}</td>
                                    <td>{exam.courseCode || exam.course}</td>
                                    <td>{exam.date}</td>
                                    <td>
                                        <span className={statusBadge(exam.status)}>
                                            {exam.status === "Live" && <FaBroadcastTower className="me-1" />}
                                            {exam.status === "Scheduled" && <FaClock className="me-1" />}
                                            {exam.status === "Completed" && <FaCheckCircle className="me-1" />}
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            {exam.status === "Scheduled" && (
                                                <>
                                                    <Link to={`/instructor/exams/${exam.id}/edit`} className="btn btn-outline-primary">
                                                        <FaEdit />
                                                    </Link>
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(exam.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                            <Link to={`/instructor/exams/${exam.id}`} className="btn btn-outline-dark">
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ExamManagement;
