// src/components/InstructorPages/ExamHistory.jsx
import React from 'react';
import {
    FaHistory,
    FaUsers,
    FaChartBar,
    FaFileDownload,
    FaFileCsv,
    FaFilePdf
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';

function InstructorExamHistory() {

    // Aggregated past exam data (instructor-only)
    // Ideally this would come from an API, but for now we follow the pattern
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

    const handleDownload = (format, title) => {
        const data = exams.map(e => ({
            "Exam": e.title,
            "Course": e.course,
            "Date": e.date,
            "Attempted": e.attempted,
            "Passed": e.passed,
            "Avg Score": e.avgScore
        }));

        if (format === 'CSV') {
            exportToCSV(data, `exam_history_${title.replace(/\s+/g, '_')}`);
            toast.success(`Exported ${title} as CSV`);
        } else {
            const columns = ["Exam", "Course", "Date", "Attempted", "Passed", "Avg Score"];
            exportToPDF(data, columns, `Exam Report: ${title}`, `exam_history_${title.replace(/\s+/g, '_')}`);
            toast.success(`Exported ${title} as PDF`);
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold text-gradient">
                <FaHistory className="me-2" />
                Exam History (Instructor View)
            </h2>

            <div className="card-custom p-4 shadow-sm border-0">
                <div className="table-responsive">
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
                                    <td className="fw-medium">{exam.title}</td>
                                    <td>{exam.course}</td>
                                    <td>{exam.date}</td>
                                    <td>
                                        <FaUsers className="me-2 text-secondary" />
                                        {exam.attempted}
                                    </td>
                                    <td>{exam.passed}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <FaChartBar className="me-2 text-primary" />
                                            <span className="fw-bold">{exam.avgScore}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-danger d-flex align-items-center gap-1"
                                                onClick={() => handleDownload('PDF', exam.title)}
                                                title="Export PDF"
                                            >
                                                <FaFilePdf /> PDF
                                            </button>
                                            <button
                                                className="btn btn-outline-success d-flex align-items-center gap-1"
                                                onClick={() => handleDownload('CSV', exam.title)}
                                                title="Export CSV"
                                            >
                                                <FaFileCsv /> CSV
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="alert alert-info mt-4 d-flex align-items-center">
                <FaHistory className="me-2 fs-5" />
                <div>
                    <strong>Note:</strong> This view aggregates all student attempts.
                    Students can only see their personal exam history and individual scorecards.
                </div>
            </div>
        </div>
    );
}

export default InstructorExamHistory;
