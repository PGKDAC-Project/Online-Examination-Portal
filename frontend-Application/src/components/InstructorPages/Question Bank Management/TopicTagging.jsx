import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTags, FaSearch, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getQuestionsByCourse, updateQuestionTags } from '../../../services/instructor/questionService';

const TopicTagging = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterText, setFilterText] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");

    const [selectedIds, setSelectedIds] = useState([]);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        fetchData();
    }, [courseCode]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getQuestionsByCourse(courseCode);
            setQuestions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredQuestions.map(q => q.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleAddTag = async () => {
        if (!newTag.trim()) return;

        try {
            const updates = selectedIds.map(id => {
                const question = questions.find(q => q.id === id);
                if (!question) return Promise.resolve();

                const currentTags = question.tags || [];
                if (currentTags.includes(newTag)) return Promise.resolve();

                return updateQuestionTags(id, [...currentTags, newTag]);
            });

            await Promise.all(updates);

            toast.success(`Tag '${newTag}' added to ${selectedIds.length} questions`);
            setNewTag("");
            setSelectedIds([]);
            fetchData(); // Refresh to see changes
        } catch (err) {
            toast.error("Failed to save tags");
        }
    };

    const handleRemoveTag = async (questionId, tagToRemove) => {
        try {
            const question = questions.find(q => q.id === questionId);
            if (!question) return;
            const newTags = (question.tags || []).filter(t => t !== tagToRemove);

            await updateQuestionTags(questionId, newTags);
            toast.success("Tag removed");
            fetchData();
        } catch (err) {
            toast.error("Failed to remove tag");
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesText = (q.text || "").toLowerCase().includes(filterText.toLowerCase());
        const matchesDifficulty = filterDifficulty === "All" || q.difficulty === filterDifficulty;
        return matchesText && matchesDifficulty;
    });

    return (
        <div className="container-fluid p-4">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft className="me-2" /> Back to Question Bank
            </button>

            <div className="card-custom p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0 text-gradient"><FaTags className="me-2" /> Topic Tagging - {courseCode}</h3>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text"><FaSearch /></span>
                            <input
                                className="form-control"
                                placeholder="Search questions..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterDifficulty}
                            onChange={e => setFilterDifficulty(e.target.value)}
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="col-md-5">
                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder="Enter tag to add..."
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                            />
                            <button className="btn btn-primary-custom" onClick={handleAddTag} disabled={selectedIds.length === 0 || !newTag}>
                                <FaPlus className="me-2" /> Add Tag to Selected ({selectedIds.length})
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={handleSelectAll}
                                        checked={filteredQuestions.length > 0 && selectedIds.length === filteredQuestions.length}
                                    />
                                </th>
                                <th>Question</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-5">Loading questions...</td></tr>
                            ) : filteredQuestions.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-5">No questions found.</td></tr>
                            ) : (
                                filteredQuestions.map(q => (
                                    <tr key={q.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedIds.includes(q.id)}
                                                onChange={() => handleSelect(q.id)}
                                            />
                                        </td>
                                        <td>{q.text}</td>
                                        <td>
                                            <span className={`badge ${q.difficulty === 'Easy' ? 'bg-success' :
                                                q.difficulty === 'Medium' ? 'bg-warning' : 'bg-danger'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2">
                                                {(q.tags || []).map(tag => (
                                                    <span key={tag} className="badge bg-secondary d-flex align-items-center">
                                                        {tag}
                                                        <FaTimes
                                                            className="ms-2 cursor-pointer text-light opacity-75 hover-opacity-100"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleRemoveTag(q.id, tag)}
                                                            title="Remove tag"
                                                        />
                                                    </span>
                                                ))}
                                                {(q.tags || []).length === 0 && <small className="text-muted">No tags</small>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopicTagging;
