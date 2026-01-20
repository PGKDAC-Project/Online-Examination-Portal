import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTags } from 'react-icons/fa';

const TopicTagging = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft /> Back
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-warning text-dark">
                    <h4 className="mb-0"><FaTags className="me-2" /> Topic Tagging - {courseCode}</h4>
                </div>
                <div className="card-body">
                    <p>Manage topics and tag questions for better categorization.</p>
                    {/* Placeholder for complex tagging UI */}
                    <div className="alert alert-secondary">
                        Tagging interface would go here (Drag & Drop or Multi-select).
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicTagging;
