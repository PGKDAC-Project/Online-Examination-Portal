// src/components/InstructorPages/ExamHistory.jsx
import React from 'react';
import {
    FaHistory,
    FaUsers,
    FaChartBar,
    FaFileDownload,
    FaFileCsv
} from 'react-icons/fa';

function ExamHistory() {

    // Aggregated past exam data (instructor-only)
    const exams = [
        {
            id: 1,
            title: "DBMS Midterm",
            course: "CS210",
            date: "2025-10-15",
            attempted: 118,
            passed: 86,
            avgScore: 67
        },
        {
            id: 2,
            title: "DSA Quiz 2",
            course: "CS204",
            date: "2025-09-28",
            attempted: 122,
            passed: 91,
            avgScore: 71
        }
    ];

    return (
        <div>
            <h2 className="mb-4">
                <FaHistory className="me-2" />
                Exam History (Instructor View)
            </h2>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <strong>Past Exams</strong>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Exam</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Attempted</th>
                                <th>Passed</th>
                                <th>Avg Score</th>
                                <th>Reports</th>
                            </tr>
                        </thead>

                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.title}</td>
                                    <td>{exam.course}</td>
                                    <td>{exam.date}</td>
                                    <td>
                                        <FaUsers className="me-1 text-secondary" />
                                        {exam.attempted}
                                    </td>
                                    <td>{exam.passed}</td>
                                    <td>
                                        <FaChartBar className="me-1 text-primary" />
                                        {exam.avgScore}%
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">

                                            <button className="btn btn-outline-primary">
                                                <FaFileDownload />
                                            </button>

                                            <button className="btn btn-outline-success">
                                                <FaFileCsv />
                                            </button>

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
                <strong>Note:</strong> This view aggregates all student attempts.
                Students can only see their personal exam history and individual scorecards.
            </div>
        </div>
    );
}

export default ExamHistory;
