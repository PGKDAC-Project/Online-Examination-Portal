import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRandom } from 'react-icons/fa';

const RandomizationRules = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft /> Back
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-info text-white">
                    <h4 className="mb-0"><FaRandom className="me-2" /> Randomization Rules - {courseCode}</h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Number of Questions per Exam</label>
                            <input type="number" className="form-control" defaultValue={50} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Easy Questions</label>
                            <input type="number" className="form-control" defaultValue={20} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Medium Questions</label>
                            <input type="number" className="form-control" defaultValue={20} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Hard Questions</label>
                            <input type="number" className="form-control" defaultValue={10} />
                        </div>
                        <button className="btn btn-success">Save Rules</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RandomizationRules;
