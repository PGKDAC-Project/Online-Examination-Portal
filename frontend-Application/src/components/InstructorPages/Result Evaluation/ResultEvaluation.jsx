import React, { useEffect, useState } from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaToggleOn,
    FaToggleOff
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorExams } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';
import axiosClient from '../../../services/axios/axiosClient';

function ResultEvaluation() {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            loadExamResults(selectedExamId);
        }
    }, [selectedExamId]);

    const loadExams = async () => {
        try {
            const user = getCurrentUser();
            if (user && user.id) {
                const data = await getInstructorExams(user.id);
                const completed = data.filter(exam => exam.status === 'COMPLETED');
                setExams(completed);
                if (completed.length > 0) {
                    setSelectedExamId(completed[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to load exams:', error);
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const loadExamResults = async (examId) => {
        try {
            const exam = exams.find(e => e.id === examId);
            setSelectedExam(exam);
            const response = await axiosClient.get(`/instructor/exams/${examId}/results`);
            setResults(response || []);
        } catch (error) {
            console.error('Failed to load results:', error);
            setResults([]);
        }
    };

    const toggleControl = async (key) => {
        if (!selectedExam) return;
        try {
            const newValue = !selectedExam[key];
            await axiosClient.patch(`/instructor/exams/${selectedExamId}/settings`, {
                [key]: newValue
            });
            setSelectedExam({ ...selectedExam, [key]: newValue });
            toast.success('Updated result settings');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    return (
        <div>
            <h2 className="mb-4">Result Evaluation & Publishing</h2>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <label className="form-label mb-0">Past Exams</label>
                        <select
                            className="form-select"
                            style={{ width: 320 }}
                            value={selectedExamId || ''}
                            onChange={(e) => setSelectedExamId(Number(e.target.value))}
                        >
                            {exams.length === 0 && <option value="">No completed exams</option>}
                            {exams.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.examTitle}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-muted">
                        {selectedExam ? `${selectedExam.scheduledDate}` : ""}
                    </div>
                </div>
            </div>

            {/* Exam Summary */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white">
                    <strong>Exam Summary</strong>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Exam</label>
                            <input
                                className="form-control"
                                value={selectedExam?.examTitle || ""}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Total Students</label>
                            <input
                                type="number"
                                className="form-control"
                                value={results.length || 0}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Evaluated</label>
                            <input
                                type="number"
                                className="form-control"
                                value={results.filter(r => r.isEvaluated).length || 0}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Pass Threshold</label>
                            <input
                                type="number"
                                className="form-control"
                                value={selectedExam?.passingMarks || 0}
                                disabled={true}
                                title="Pass mark is set during exam creation"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Controls */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <strong>Result Controls</strong>
                </div>

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Publish Result</span>
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => toggleControl("resultPublished")}
                            disabled={!selectedExam}
                            aria-label="Toggle Publish Result"
                        >
                            {selectedExam?.resultPublished
                                ? <FaToggleOn size={28} className="text-success" />
                                : <FaToggleOff size={28} className="text-danger" />}
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Allow Answer Review</span>
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => toggleControl("answerReviewAllowed")}
                            disabled={!selectedExam}
                            aria-label="Toggle Allow Answer Review"
                        >
                            {selectedExam?.answerReviewAllowed
                                ? <FaToggleOn size={28} className="text-success" />
                                : <FaToggleOff size={28} className="text-danger" />}
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <span>Release Scorecard</span>
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => toggleControl("scorecardReleased")}
                            disabled={!selectedExam}
                            aria-label="Toggle Release Scorecard"
                        >
                            {selectedExam?.scorecardReleased
                                ? <FaToggleOn size={28} className="text-success" />
                                : <FaToggleOff size={28} className="text-danger" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Student-wise Scores */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-secondary text-white">
                    <strong>Student-wise Scores</strong>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Score</th>
                                <th>Result</th>
                            </tr>
                        </thead>

                        <tbody>
                            {results.map(result => {
                                const isPass = result.totalScore >= (selectedExam?.passingMarks || 0);
                                return (
                                <tr key={result.id}>
                                    <td>{result.student?.userCode || 'N/A'}</td>
                                    <td>{result.student?.userName || 'N/A'}</td>
                                    <td style={{ width: 160 }}>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={result.totalScore || 0}
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {isPass
                                                ? <span className="badge bg-success">
                                                    <FaCheckCircle className="me-1" /> Pass
                                                  </span>
                                                : <span className="badge bg-danger">
                                                    <FaTimesCircle className="me-1" /> Fail
                                                  </span>}
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-4">
                                        No student records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dependency note */}
            <div className="alert alert-warning mt-4">
                <strong>Dependency:</strong> Student Result Page visibility depends on these controls.
                Results, answer review, and scorecards must not be accessible unless explicitly enabled.
            </div>
        </div>
    );
}

export default ResultEvaluation;
