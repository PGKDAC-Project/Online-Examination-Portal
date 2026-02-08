import React, { useEffect, useState } from 'react';
import {
    FaHistory,
    FaUsers,
    FaChartBar,
    FaFileCsv,
    FaFilePdf
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { exportToCSV, exportToPDF } from '../../../utils/exportUtils';
import { getInstructorExams } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';
import axiosClient from '../../../services/axios/axiosClient';

function InstructorExamHistory() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExamHistory();
    }, []);

    const loadExamHistory = async () => {
        try {
            const user = getCurrentUser();
            if (user && user.id) {
                const data = await getInstructorExams(user.id);
                const completed = data.filter(exam => exam.status === 'COMPLETED');
                const historyData = await Promise.all(
                    completed.map(async (exam) => {
                        try {
                            const results = await axiosClient.get(`/instructor/exams/${exam.id}/results`);
                            const attempted = results.length;
                            const passed = results.filter(r => r.totalScore >= exam.passingMarks).length;
                            const avgScore = attempted > 0 
                                ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / attempted)
                                : 0;
                            return {
                                id: exam.id,
                                title: exam.examTitle,
                                course: exam.course?.courseCode || 'N/A',
                                date: exam.scheduledDate,
                                attempted,
                                passed,
                                avgScore
                            };
                        } catch (error) {
                            return {
                                id: exam.id,
                                title: exam.examTitle,
                                course: exam.course?.courseCode || 'N/A',
                                date: exam.scheduledDate,
                                attempted: 0,
                                passed: 0,
                                avgScore: 0
                            };
                        }
                    })
                );
                setExams(historyData);
            }
        } catch (error) {
            console.error('Failed to load exam history:', error);
            toast.error('Failed to load exam history');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) return <div className="p-5 text-center">Loading...</div>;

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
                                        <button
                                            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                                            onClick={() => handleDownload('CSV', exam.title)}
                                            title="Export CSV"
                                        >
                                            <FaFileCsv /> CSV
                                        </button>
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
