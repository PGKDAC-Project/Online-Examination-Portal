// src/components/InstructorPages/ResultEvaluation.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaToggleOn,
    FaToggleOff
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const STORAGE_KEY = "instructorResultEvaluationV1";

const loadResultData = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
};

const saveResultData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

function ResultEvaluation() {
    const [state, setState] = useState(() => {
        const stored = loadResultData();
        if (stored?.exams?.length) {
            return {
                exams: stored.exams,
                selectedExamId: stored.selectedExamId || stored.exams[0].id,
            };
        }

        const seed = {
            selectedExamId: "EXAM-DBMS-2025-10-15",
            exams: [
                {
                    id: "EXAM-DBMS-2025-10-15",
                    title: "DBMS Midterm",
                    totalStudents: 120,
                    evaluated: 120,
                    passMark: 40,
                    resultPublished: false,
                    answerReviewAllowed: false,
                    scorecardReleased: false,
                    students: [
                        { id: "S101", name: "Ankit Singh", score: 72, status: "Pass" },
                        { id: "S102", name: "Riya Sharma", score: 34, status: "Fail" }
                    ]
                },
                {
                    id: "EXAM-DSA-2025-09-28",
                    title: "DSA Quiz 2",
                    totalStudents: 122,
                    evaluated: 122,
                    passMark: 35,
                    resultPublished: true,
                    answerReviewAllowed: true,
                    scorecardReleased: true,
                    students: [
                        { id: "S201", name: "Vikram Rao", score: 61, status: "Pass" },
                        { id: "S202", name: "Neha Patel", score: 28, status: "Fail" }
                    ]
                }
            ]
        };

        saveResultData(seed);
        return { exams: seed.exams, selectedExamId: seed.selectedExamId };
    });

    const exams = state.exams;
    const selectedExamId = state.selectedExamId;

    const setExams = (updater) => {
        setState((prev) => {
            const nextExams = typeof updater === "function" ? updater(prev.exams) : updater;
            return { ...prev, exams: nextExams };
        });
    };

    const setSelectedExamId = (value) => {
        setState((prev) => ({ ...prev, selectedExamId: value }));
    };

    useEffect(() => {
        if (!exams.length || !selectedExamId) return;
        saveResultData({ selectedExamId, exams });
    }, [exams, selectedExamId]);

    const selectedExam = useMemo(() => exams.find((e) => e.id === selectedExamId) || null, [exams, selectedExamId]);

    const updateSelectedExam = (patch) => {
        setExams((prev) =>
            prev.map((e) => (e.id === selectedExamId ? { ...e, ...patch } : e))
        );
    };

    const toggleControl = (key) => {
        if (!selectedExam) return;
        updateSelectedExam({ [key]: !selectedExam[key] });
        toast.success("Updated result settings.");
    };

    // const updateStudent = (id, changes) => {
    //     if (!selectedExam) return;
    //     const updated = (selectedExam.students || []).map(s => s.id === id ? { ...s, ...changes } : s);
        
    //     // Save to storage (simulate)
    //     // In real app, this would be an API call
    //     const allExams = loadExams();
    //     const examIndex = allExams.findIndex(e => e.id === selectedExam.id);
    //     if (examIndex !== -1) {
    //         allExams[examIndex].students = updated;
    //         localStorage.setItem(STORAGE_KEY, JSON.stringify(allExams));
    //         setSelectedExam(allExams[examIndex]);
    //     }
    // };

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
                            value={selectedExamId}
                            onChange={(e) => setSelectedExamId(e.target.value)}
                        >
                            {exams.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-muted">
                        {selectedExam ? selectedExam.id : ""}
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
                                value={selectedExam?.title || ""}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Total Students</label>
                            <input
                                type="number"
                                className="form-control"
                                value={selectedExam?.totalStudents ?? ""}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Evaluated</label>
                            <input
                                type="number"
                                className="form-control"
                                value={selectedExam?.evaluated ?? ""}
                                disabled={true}
                                readOnly
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Pass Threshold</label>
                            <input
                                type="number"
                                className="form-control"
                                value={selectedExam?.passMark ?? ""}
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
                            {(selectedExam?.students || []).map(student => {
                                const isPass = student.score >= (selectedExam?.passMark || 0);
                                return (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td style={{ width: 160 }}>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={student.score ?? ""}
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
                            {(selectedExam?.students || []).length === 0 && (
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
