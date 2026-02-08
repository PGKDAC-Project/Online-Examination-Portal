import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBullseye, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { defineOutcomes } from '../../../services/instructor/instructorService';
import axiosClient from '../../../services/axios/axiosClient';

const DefineCourseOutcomes = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [outcomes, setOutcomes] = useState([]);
    const [newOutcome, setNewOutcome] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchOutcomes();
    }, [courseId]);

    const fetchOutcomes = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/courses/${courseId}`);
            if (response && response.outcomes && Array.isArray(response.outcomes)) {
                setOutcomes(response.outcomes);
            }
        } catch (err) {
            console.error('Failed to load outcomes:', err);
            setOutcomes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        if (newOutcome.trim()) {
            setOutcomes([...outcomes, newOutcome.trim()]);
            setNewOutcome("");
        }
    };

    const handleRemove = (index) => {
        const updated = outcomes.filter((_, i) => i !== index);
        setOutcomes(updated);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await defineOutcomes(courseId, { outcomes });
            toast.success('Course outcomes saved successfully!');
            navigate('/instructor/courses');
        } catch (err) {
            toast.error('Failed to save outcomes: ' + (err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
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
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
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
                        <button className="btn btn-success px-4" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Outcomes'}
                        </button>
                    </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DefineCourseOutcomes;
