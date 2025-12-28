// src/components/InstructorPages/StudentPerformanceAnalytics.jsx
import React from 'react';
import {
    FaChartLine,
    FaBullseye,
    FaLayerGroup,
    FaTrophy,
    FaExclamationCircle
} from 'react-icons/fa';

function StudentPerformanceAnalytics() {

    // Placeholder analytics data (aggregated, instructor-only)
    const coursePerformance = [
        { course: "CS204", avgScore: 68 },
        { course: "CS210", avgScore: 72 }
    ];

    const questionAccuracy = [
        { question: "Q1", accuracy: "92%" },
        { question: "Q5", accuracy: "41%" }
    ];

    const difficultyAnalysis = [
        { level: "Easy", accuracy: "85%" },
        { level: "Medium", accuracy: "64%" },
        { level: "Hard", accuracy: "38%" }
    ];

    const topPerformers = [
        { name: "Ankit Singh", score: 92 },
        { name: "Riya Sharma", score: 89 }
    ];

    const weakTopics = [
        "Normalization",
        "Deadlock Handling",
        "AVL Tree Rotations"
    ];

    return (
        <div>
            <h2 className="mb-4">Student Performance Analytics</h2>

            {/* Course-wise Performance */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <FaChartLine className="me-2" />
                    Course-wise Performance
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        {coursePerformance.map((item, idx) => (
                            <li key={idx}>
                                {item.course} — Average Score: <strong>{item.avgScore}%</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Question-wise Accuracy */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-secondary text-white">
                    <FaBullseye className="me-2" />
                    Question-wise Accuracy
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        {questionAccuracy.map((q, idx) => (
                            <li key={idx}>
                                {q.question} — Accuracy: <strong>{q.accuracy}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Difficulty Analysis */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-warning">
                    <FaLayerGroup className="me-2" />
                    Difficulty Analysis
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        {difficultyAnalysis.map((d, idx) => (
                            <li key={idx}>
                                {d.level} — Accuracy: <strong>{d.accuracy}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Top Performers */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-success text-white">
                    <FaTrophy className="me-2" />
                    Top Performers
                </div>
                <div className="card-body">
                    <ol className="mb-0">
                        {topPerformers.map((student, idx) => (
                            <li key={idx}>
                                {student.name} — <strong>{student.score}%</strong>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Weak Topics */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-danger text-white">
                    <FaExclamationCircle className="me-2" />
                    Weak Topics Identified
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        {weakTopics.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Permission clarity */}
            <div className="alert alert-info mt-4">
                <strong>Visibility Rule:</strong> Students can view only their individual results.
                Aggregate analytics, rankings, and topic-level insights are strictly instructor-only.
            </div>
        </div>
    );
}

export default StudentPerformanceAnalytics;
