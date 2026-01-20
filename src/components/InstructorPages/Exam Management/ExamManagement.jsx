// src/components/InstructorPages/ExamManagement.jsx
import React, { useState } from 'react';
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

const STORAGE_KEY = "instructorExamsV1";

const loadExams = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveExams = (exams) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
};

function ExamManagement() {

    const [exams, setExams] = useState(() => {
        const stored = loadExams();
        if (stored.length) return stored;
        const seed = [
            {
                id: "EXAM-DSA-2025-10-30",
                title: "DSA Midterm",
                courseCode: "CS204",
                status: "Scheduled",
                date: "2025-10-30",
                startTime: "14:00",
                endTime: "16:00",
                duration: 120,
                instructions: "Answer all questions.",
                questionIds: [],
            },
            {
                id: "EXAM-OS-2025-10-27",
                title: "OS Quiz",
                courseCode: "CS301",
                status: "Live",
                date: "2025-10-27",
                startTime: "10:00",
                endTime: "10:30",
                duration: 30,
                instructions: "Attempt all questions.",
                questionIds: [],
            },
            {
                id: "EXAM-DBMS-2025-10-15",
                title: "DBMS Final",
                courseCode: "CS210",
                status: "Completed",
                date: "2025-10-15",
                startTime: "09:00",
                endTime: "12:00",
                duration: 180,
                instructions: "No malpractice.",
                questionIds: [],
            }
        ];

        saveExams(seed);
        return seed;
    });

    const rows = exams.map((e) => ({
        ...e,
        time: e.startTime && e.endTime ? `${e.startTime} - ${e.endTime}` : (e.time || ""),
    }));

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

    const deleteExam = (examId) => {
        const ok = window.confirm("Delete this exam?");
        if (!ok) return;
        const next = exams.filter((e) => String(e.id) !== String(examId));
        setExams(next);
        saveExams(next);
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
                            {rows.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.title}</td>
                                    <td>{exam.courseCode || exam.course}</td>
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
                                                <button type="button" className="btn btn-outline-danger" onClick={() => deleteExam(exam.id)}>
                                                    <FaTrash />
                                                </button>
                                            )}

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
