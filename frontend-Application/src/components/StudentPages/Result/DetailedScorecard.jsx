import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import { getDetailedResult } from '../../../services/student/studentService';

const DetailedScorecard = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        getDetailedResult(examId).then(data => {
            setResult({
                ...data,
                // Mock question details if not in basic results
                questions: [
                    { id: 1, text: "What is React?", selected: "Library", correct: "Library", marks: 2, status: "Correct" },
                    { id: 2, text: "What is JSX?", selected: "HTML", correct: "Syntax Ext", marks: 0, status: "Wrong" },
                    { id: 3, text: "Explain V-DOM?", selected: "-", correct: "Virtual DOM", marks: 0, status: "Unattempted" },
                ]
            });
        }).catch(err => {
            console.error(err);
        });
    }, [examId]);

    if (!result) return <div className="p-5 text-center">Loading Detailed Result...</div>;

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
                        <span className={`badge ms-2 ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                            {result.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card-custom shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Q.No</th>
                                <th>Question</th>
                                <th>Selected Answer</th>
                                <th>Correct Answer</th>
                                <th>Status</th>
                                <th>Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(result.questions || []).map((q, idx) => (
                                <tr key={q.id}>
                                    <td>{idx + 1}</td>
                                    <td>{q.text}</td>
                                    <td>{q.selected}</td>
                                    <td>{q.correct}</td>
                                    <td>
                                        {q.status === 'Correct' && <FaCheckCircle className="text-success" />}
                                        {q.status === 'Wrong' && <FaTimesCircle className="text-danger" />}
                                        {q.status === 'Unattempted' && <FaMinusCircle className="text-secondary" />}
                                        <span className="ms-2">{q.status}</span>
                                    </td>
                                    <td>{q.marks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DetailedScorecard;
