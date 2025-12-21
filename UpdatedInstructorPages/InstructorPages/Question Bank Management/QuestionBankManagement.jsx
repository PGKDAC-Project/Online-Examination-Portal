// src/components/InstructorPages/QuestionBankManagement.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaQuestionCircle,
    FaFileImport,
    FaRandom,
    FaTags,
    FaLayerGroup,
    FaPlusCircle
} from 'react-icons/fa';

function QuestionBankManagement() {

    // Placeholder data — per course question bank
    const questionBanks = [
        {
            courseCode: "CS204",
            courseName: "Data Structures & Algorithms",
            totalQuestions: 320
        },
        {
            courseCode: "CS210",
            courseName: "Database Management Systems",
            totalQuestions: 280
        }
    ];

    return (
        <div>
            <h2 className="mb-4">Question Bank Management</h2>

            {/* High-level actions */}
            <div className="mb-4 d-flex gap-2">
                <Link
                    to="/instructor/question-bank/create"
                    className="btn btn-success"
                >
                    <FaPlusCircle className="me-2" />
                    Add New Question
                </Link>

                <Link
                    to="/instructor/question-bank/import"
                    className="btn btn-outline-primary"
                >
                    <FaFileImport className="me-2" />
                    Import Questions (CSV / Excel)
                </Link>
            </div>

            {/* Question Bank per Course */}
            <div className="row g-4">
                {questionBanks.map(bank => (
                    <div className="col-md-6 col-lg-4" key={bank.courseCode}>
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body">

                                <h5 className="card-title text-primary">
                                    <FaLayerGroup className="me-2" />
                                    {bank.courseName}
                                </h5>

                                <p className="text-muted mb-2">
                                    Course Code: <strong>{bank.courseCode}</strong>
                                </p>

                                <p className="mb-3">
                                    <FaQuestionCircle className="me-2 text-secondary" />
                                    Total Questions: <strong>{bank.totalQuestions}</strong>
                                </p>

                                {/* Features / Actions */}
                                <div className="d-grid gap-2">

                                    <Link
                                        to={`/instructor/question-bank/${bank.courseCode}`}
                                        className="btn btn-outline-dark btn-sm"
                                    >
                                        View / Manage Questions
                                    </Link>

                                    <Link
                                        to={`/instructor/question-bank/${bank.courseCode}/tags`}
                                        className="btn btn-outline-warning btn-sm"
                                    >
                                        <FaTags className="me-1" />
                                        Difficulty & Topic Tagging
                                    </Link>

                                    <Link
                                        to={`/instructor/question-bank/${bank.courseCode}/randomization`}
                                        className="btn btn-outline-info btn-sm"
                                    >
                                        <FaRandom className="me-1" />
                                        Randomization Rules
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Question Types Info */}
            <div className="card mt-5 shadow-sm border-0">
                <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">Supported Question Types</h6>
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        <li>Single Choice (MCQ)</li>
                        <li>Multiple Choice (Multiple correct)</li>
                        <li>True / False</li>
                        <li>Numeric (optional)</li>
                    </ul>
                </div>
            </div>

            {/* Critical clarification */}
            <div className="alert alert-info mt-4">
                <strong>Important:</strong> Students never see the question bank.
                They only receive a <strong>final randomized paper</strong> at exam start.
                Question selection, tagging, and randomization are fully instructor-controlled.
            </div>
        </div>
    );
}

export default QuestionBankManagement;
