// src/components/InstructorPages/ExamManagement.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaPlusCircle,
    FaEdit,
    FaTrash,
    FaClone,
    FaEye,
    FaClock,
    FaCheckCircle,
    FaBroadcastTower
} from 'react-icons/fa';

function ExamManagement() {

    // Placeholder exam data (same dataset powers Student "Available Exams")
    const exams = [
        {
            id: 1,
            title: "DSA Midterm",
            course: "CS204",
            status: "Scheduled",
            date: "2025-10-30",
            time: "14:00 - 16:00"
        },
        {
            id: 2,
            title: "OS Quiz",
            course: "CS301",
            status: "Live",
            date: "2025-10-27",
            time: "10:00 - 10:30"
        },
        {
            id: 3,
            title: "DBMS Final",
            course: "CS210",
            status: "Completed",
            date: "2025-10-15",
            time: "09:00 - 12:00"
        }
    ];

    const statusBadge = (status) => {
        switch (status) {
            case "Scheduled":
                return "badge bg-primary";
            case "Live":
                return "badge bg-danger";
            case "Completed":
                return "badge bg-success";
            default:
                return "badge bg-secondary";
        }
    };

    return (
        <div>
            <h2 className="mb-4">Exam Creation & Management</h2>

            {/* Create Exam */}
            <div className="mb-4">
                <Link to="/instructor/exams/create" className="btn btn-success">
                    <FaPlusCircle className="me-2" />
                    Create New Exam
                </Link>
            </div>

            {/* Manage Exams */}
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
                                <th>Time Window</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.title}</td>
                                    <td>{exam.course}</td>
                                    <td>{exam.date}</td>
                                    <td>{exam.time}</td>
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

                                            {/* Edit allowed only before start */}
                                            {exam.status === "Scheduled" && (
                                                <Link
                                                    to={`/instructor/exams/${exam.id}/edit`}
                                                    className="btn btn-outline-primary"
                                                >
                                                    <FaEdit />
                                                </Link>
                                            )}

                                            {/* Cancel allowed only before start */}
                                            {exam.status === "Scheduled" && (
                                                <button className="btn btn-outline-danger">
                                                    <FaTrash />
                                                </button>
                                            )}

                                            {/* Clone always allowed */}
                                            <Link
                                                to={`/instructor/exams/${exam.id}/clone`}
                                                className="btn btn-outline-secondary"
                                            >
                                                <FaClone />
                                            </Link>

                                            {/* View status / monitoring */}
                                            <Link
                                                to={`/instructor/exams/${exam.id}`}
                                                className="btn btn-outline-dark"
                                            >
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

            {/* Clarification */}
            <div className="alert alert-info mt-4">
                <strong>Note:</strong> Students can only view and attempt exams marked as
                <strong> Scheduled </strong> or <strong> Live </strong>.
                All creation and management actions are restricted to instructors.
            </div>
        </div>
    );
}

export default ExamManagement;
