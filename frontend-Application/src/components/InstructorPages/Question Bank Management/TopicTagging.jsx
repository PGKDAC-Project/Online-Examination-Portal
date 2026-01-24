import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTags, FaSearch, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TopicTagging = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const [questions, setQuestions] = useState([
        { id: 1, text: "Explain React Virtual DOM.", tags: ["React", "Core"], difficulty: "Medium" },
        { id: 2, text: "What is useState?", tags: ["Hooks"], difficulty: "Easy" },
        { id: 3, text: "Difference between SQL and NoSQL.", tags: ["Database"], difficulty: "Hard" },
        { id: 4, text: "Explain Event Loop in Node.js.", tags: ["Node.js", "Async"], difficulty: "Hard" }
    ]);

    const [filter, setFilter] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [newTag, setNewTag] = useState("");

    const handleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkTag = () => {
        if (!newTag.trim()) return;
        setQuestions(prev => prev.map(q =>
            selectedIds.includes(q.id) && !q.tags.includes(newTag)
                ? { ...q, tags: [...q.tags, newTag] }
                : q
        ));
        toast.success(`Tag '${newTag}' added to ${selectedIds.length} questions`);
        setNewTag("");
        setSelectedIds([]);
    };

    const filteredQuestions = questions.filter(q => q.text.toLowerCase().includes(filter.toLowerCase()));

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
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text"><FaSearch /></span>
                            <input
                                className="form-control"
                                placeholder="Search questions..."
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder="Enter tag to add..."
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                            />
                            <button className="btn btn-primary-custom" onClick={handleBulkTag} disabled={selectedIds.length === 0 || !newTag}>
                                <FaSave className="me-2" /> Apply Tag
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>Select</th>
                                <th>Question</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.map(q => (
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
                                        {q.tags.map(tag => (
                                            <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopicTagging;
