import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBullseye, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DefineCourseOutcomes = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [outcomes, setOutcomes] = useState([
        "Understand the basic concepts of programming.",
        "Analyze and design algorithms for real-world problems."
    ]);
    const [newOutcome, setNewOutcome] = useState("");

    const handleAdd = () => {
        if (newOutcome.trim()) {
            setOutcomes([...outcomes, newOutcome]);
            setNewOutcome("");
        }
    };

    const handleRemove = (index) => {
        const updated = outcomes.filter((_, i) => i !== index);
        setOutcomes(updated);
    };

    const handleSave = () => {
        toast.success(`Course outcomes for ${courseId} saved!`);
        navigate('/instructor/courses');
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                <FaArrowLeft /> Back to Courses
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-warning text-dark">
                    <h4 className="mb-0"><FaBullseye className="me-2" /> Define Course Outcomes - {courseId}</h4>
                </div>
                <div className="card-body">
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter a new course outcome..." 
                            value={newOutcome}
                            onChange={(e) => setNewOutcome(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleAdd}>
                            <FaPlus /> Add
                        </button>
                    </div>

                    <ul className="list-group mb-4">
                        {outcomes.map((outcome, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {index + 1}. {outcome}
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(index)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                        {outcomes.length === 0 && <li className="list-group-item text-muted text-center">No outcomes defined yet.</li>}
                    </ul>

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-success px-4" onClick={handleSave}>
                            Save Outcomes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefineCourseOutcomes;
