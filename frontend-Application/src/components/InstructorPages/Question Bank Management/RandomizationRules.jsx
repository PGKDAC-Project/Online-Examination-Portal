import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRandom } from 'react-icons/fa';
import { getRandomizationRules, updateRandomizationRules } from '../../../services/instructor/randomizationService';
import { toast } from 'react-toastify';

const RandomizationRules = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();
    const [rules, setRules] = useState({
        total: 50,
        easyCount: 20,
        mediumCount: 20,
        hardCount: 10
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const data = await getRandomizationRules(courseCode);
                if (data) setRules(data);
            } catch (err) {
                console.error("Failed to fetch rules:", err);
                toast.error("Could not load randomization rules from server.");
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, [courseCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRandomizationRules(courseCode, rules);
            toast.success("Randomization rules saved successfully!");
        } catch (err) {
            toast.error("Failed to save rules: " + err.message);
        }
    };

    const handleChange = (e) => {
        setRules({ ...rules, [e.target.name]: Number(e.target.value) });
    };

    if (loading) return <div>Loading rules...</div>;

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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Total Questions to Select</label>
                            <input
                                type="number"
                                name="total"
                                className="form-control"
                                value={rules.total}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Easy Questions</label>
                            <input
                                type="number"
                                name="easyCount"
                                className="form-control"
                                value={rules.easyCount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Medium Questions</label>
                            <input
                                type="number"
                                name="mediumCount"
                                className="form-control"
                                value={rules.mediumCount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Hard Questions</label>
                            <input
                                type="number"
                                name="hardCount"
                                className="form-control"
                                value={rules.hardCount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success">Save Rules</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RandomizationRules;
