// src/components/InstructorPages/ResultEvaluation.jsx
import React from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaUserGraduate,
    FaListOl,
    FaToggleOn,
    FaToggleOff
} from 'react-icons/fa';

function ResultEvaluation() {

    // Placeholder exam + result data
    const exam = {
        title: "DBMS Midterm",
        totalStudents: 120,
        evaluated: 120,
        passMark: 40,
        resultPublished: false,
        answerReviewAllowed: false,
        scorecardReleased: false
    };

    const students = [
        {
            id: "S101",
            name: "Ankit Singh",
            score: 72,
            status: "Pass"
        },
        {
            id: "S102",
            name: "Riya Sharma",
            score: 34,
            status: "Fail"
        }
    ];

    return (
        <div>
            <h2 className="mb-4">Result Evaluation & Publishing</h2>

            {/* Exam Summary */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white">
                    <strong>Exam Summary</strong>
                </div>
                <div className="card-body">
                    <p><strong>Exam:</strong> {exam.title}</p>
                    <p><strong>Total Students:</strong> {exam.totalStudents}</p>
                    <p><strong>Evaluated:</strong> {exam.evaluated}</p>
                    <p><strong>Pass Threshold:</strong> {exam.passMark} marks</p>
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
                        {exam.resultPublished
                            ? <FaToggleOn size={28} className="text-success" />
                            : <FaToggleOff size={28} className="text-danger" />}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Allow Answer Review</span>
                        {exam.answerReviewAllowed
                            ? <FaToggleOn size={28} className="text-success" />
                            : <FaToggleOff size={28} className="text-danger" />}
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <span>Release Scorecard</span>
                        {exam.scorecardReleased
                            ? <FaToggleOn size={28} className="text-success" />
                            : <FaToggleOff size={28} className="text-danger" />}
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
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.score}</td>
                                    <td>
                                        {student.status === "Pass"
                                            ? <span className="text-success">
                                                <FaCheckCircle className="me-1" /> Pass
                                              </span>
                                            : <span className="text-danger">
                                                <FaTimesCircle className="me-1" /> Fail
                                              </span>}
                                    </td>
                                </tr>
                            ))}
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
