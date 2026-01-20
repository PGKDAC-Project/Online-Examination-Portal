import React from 'react';
import { Link } from 'react-router-dom';
import { FaPollH, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { mockExamResults } from './mockExamResult';

const ResultsList = () => {
    const results = Object.values(mockExamResults);

    return (
        <div className="container mt-4">
            <h2 className="mb-4"><FaPollH className="me-2" /> My Results</h2>
            
            {results.length === 0 ? (
                <div className="alert alert-info">
                    No results available yet.
                </div>
            ) : (
                <div className="row g-4">
                    {results.map((result) => (
                        <div key={result.examId} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{result.examName}</h5>
                                    
                                    <div className="mt-3">
                                        <p className="mb-1 text-muted">
                                            <FaChartLine className="me-2" /> 
                                            Score: <strong>{result.score} / {result.totalMarks}</strong>
                                        </p>
                                        <p className="mb-1 text-muted">
                                            <FaChartLine className="me-2" />
                                            Percentage: <strong>{result.percentage}%</strong>
                                        </p>
                                        <p className="mb-3">
                                            <span className={`badge ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                                                {result.status}
                                            </span>
                                        </p>
                                    </div>

                                    <Link 
                                        to={`/student/exams/${result.examId}/result`} 
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
