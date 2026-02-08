import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import axiosClient from '../../../services/axios/axiosClient';

const DetailedScorecard = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetailedResult = async () => {
            try {
                const response = await axiosClient.get(`/results/${resultId}/detailed`);
                setResult(response);
            } catch (err) {
                console.error('Failed to fetch detailed result:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailedResult();
    }, [resultId]);

    if (loading) return <div className="p-5 text-center">Loading Detailed Result...</div>;
    if (!result) return <div className="p-5 text-center">No result found</div>;

    return (
        <div className="container-fluid p-4">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/student/results')}>
                <FaArrowLeft className="me-2" /> Back to Results
            </button>

            <div className="card-custom p-4 mb-4">
                <h2 className="fw-bold text-gradient mb-3">Detailed Scorecard</h2>
                <div className="row g-3">
                    <div className="col-md-3"><strong>Exam:</strong> {result.examName}</div>
                    <div className="col-md-3"><strong>Total Marks:</strong> {result.totalMarks}</div>
                    <div className="col-md-3"><strong>Obtained:</strong> {result.score}</div>
                    <div className="col-md-3">
                        <strong>Status:</strong>
                        <span className={`badge ms-2 ${result.status === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                            {result.status}
                        </span>
                    </div>
                </div>
                <div className="row g-3 mt-2">
                    <div className="col-md-3"><strong>Correct:</strong> {result.correct}</div>
                    <div className="col-md-3"><strong>Wrong:</strong> {result.wrong}</div>
                    <div className="col-md-3"><strong>Unattempted:</strong> {result.unattempted}</div>
                    <div className="col-md-3"><strong>Percentage:</strong> {result.percentage?.toFixed(2)}%</div>
                </div>
            </div>

            <div className="card-custom shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Q.No</th>
                                <th>Question</th>
                                <th>Your Answer</th>
                                {result.questions?.[0]?.correctAnswers && <th>Correct Answer</th>}
                                <th>Status</th>
                                <th>Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(result.questions || []).map((q, idx) => {
                                const selectedAnswer = q.selected ? JSON.parse(q.selected) : '-';
                                const displayAnswer = Array.isArray(selectedAnswer) ? selectedAnswer.join(', ') : selectedAnswer;
                                
                                return (
                                    <tr key={q.id}>
                                        <td>{idx + 1}</td>
                                        <td>{q.text}</td>
                                        <td>{displayAnswer}</td>
                                        {q.correctAnswers && <td>{q.correctAnswers.join(', ')}</td>}
                                        <td>
                                            {q.status === 'Correct' && <FaCheckCircle className="text-success" />}
                                            {q.status === 'Wrong' && <FaTimesCircle className="text-danger" />}
                                            {q.status === 'Unattempted' && <FaMinusCircle className="text-secondary" />}
                                            <span className="ms-2">{q.status}</span>
                                        </td>
                                        <td>{q.marksAwarded} / {q.marks}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DetailedScorecard;
