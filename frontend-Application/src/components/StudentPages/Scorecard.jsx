import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMinusCircle, FaTrophy } from "react-icons/fa";
import { useEffect, useState } from "react";
import { mockExamResults } from "./Result/mockExamResult"; // Access existing mock data
import { exportToPDF } from "../../utils/exportUtils";

const Scorecard = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        // Mock fetch based on resultId (using examId as key for mock)
        // In real app, fetch /api/results/:id
        const data = mockExamResults[resultId];
        if (data) setResult(data);
    }, [resultId]);

    if (!result) return <div className="p-5 text-center">Loading Result or Not Found...</div>;

    const handleDownload = () => {
        // Simple export summary
        const data = [{
            "Exam": result.examName,
            "Score": `${result.score}/${result.totalMarks}`,
            "Percentage": `${result.percentage}%`,
            "Status": result.status,
            "Rank": result.rank || "N/A"
        }];
        exportToPDF(data, Object.keys(data[0]), "Scorecard", `scorecard_${resultId}`);
    };

    return (
        <div className="container-fluid p-4">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/student/results')}>
                <FaArrowLeft className="me-2" /> Back to Results
            </button>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card-custom p-0 overflow-hidden">
                        <div className={`p-5 text-center text-white ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'}`} style={{ background: result.status === 'Pass' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
                            <FaTrophy className="fs-1 mb-3 opacity-75" />
                            <h2 className="fw-bold mb-1">{result.examName}</h2>
                            <p className="lead mb-4 opacity-75">{result.status === 'Pass' ? 'Congratulations! You Passed.' : 'Better luck next time.'}</p>

                            <div className="row justify-content-center text-center">
                                <div className="col-md-3">
                                    <div className="display-4 fw-bold">{result.percentage}%</div>
                                    <small className="opacity-75">Percentage</small>
                                </div>
                                <div className="col-md-3 border-start border-light border-opacity-25">
                                    <div className="display-4 fw-bold">{result.score}</div>
                                    <small className="opacity-75">Score ({result.score}/{result.totalMarks})</small>
                                </div>
                                {result.rank && (
                                    <div className="col-md-3 border-start border-light border-opacity-25">
                                        <div className="display-4 fw-bold">#{result.rank}</div>
                                        <small className="opacity-75">Class Rank</small>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card-body p-4">
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success text-center">
                                        <FaCheckCircle className="text-success fs-3 mb-2" />
                                        <h4 className="fw-bold text-success mb-0">{result.correct}</h4>
                                        <small className="text-muted">Correct Answers</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-danger bg-opacity-10 border border-danger text-center">
                                        <FaTimesCircle className="text-danger fs-3 mb-2" />
                                        <h4 className="fw-bold text-danger mb-0">{result.wrong}</h4>
                                        <small className="text-muted">Wrong Answers</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary text-center">
                                        <FaMinusCircle className="text-secondary fs-3 mb-2" />
                                        <h4 className="fw-bold text-secondary mb-0">{result.unattempted}</h4>
                                        <small className="text-muted">Unattempted</small>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="btn btn-primary-custom px-5" onClick={handleDownload}>
                                    Download Scorecard PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scorecard;
