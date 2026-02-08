import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPollH, FaChartLine } from 'react-icons/fa';
import { getExamHistory } from '../../../services/student/studentService';

const ResultsList = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExamHistory().then(data => {
            if (Array.isArray(data)) {
                 const formatted = data.map(r => ({
                     id: r.id,
                     examId: r.exam ? r.exam.id : null,
                     examName: r.exam ? r.exam.examTitle : "Unknown Exam",
                     score: r.totalScore,
                     totalMarks: r.totalMarks,
                     percentage: r.totalMarks > 0 ? ((r.totalScore / r.totalMarks) * 100).toFixed(2) : 0,
                     status: r.status === 'PASSED' ? 'Pass' : (r.status === 'FAILED' ? 'Fail' : r.status)
                 }));
                 setResults(formatted);
            } else {
                setResults([]);
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4">Loading results...</div>;
    // Map backend response to UI structure if needed, or assume backend matches
    // For now we assume backend returns array of result objects
    const list = results;

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold text-gradient"><FaPollH className="me-2" /> My Results</h2>

            {list.length === 0 ? (
                <div className="alert alert-info">
                    No results available yet.
                </div>
            ) : (
                <div className="row g-4">
                    {list.map((result) => (
                        <div key={result.examId || result.id} className="col-md-6 col-lg-4">
                            <div className="card-custom shadow-sm h-100 border-0">
                                <div className="card-body">
                                    <h5 className="card-title text-primary fw-bold mb-3">{result.examName}</h5>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted"><FaChartLine className="me-2" /> Score</span>
                                            <span className="fw-bold">{result.score} / {result.totalMarks}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Percentage</span>
                                            <span className="fw-bold">{result.percentage}%</span>
                                        </div>
                                        <div className="mt-3">
                                            <span className={`badge ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'} w-100 py-2`}>
                                                {result.status}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/student/results/${result.id}/detailed`}
                                        className="btn btn-outline-primary w-100"
                                    >
                                        View Detailed Scorecard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsList;
