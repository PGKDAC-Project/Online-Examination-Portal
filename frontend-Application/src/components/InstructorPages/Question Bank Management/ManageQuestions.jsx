import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getQuestionsByCourse, updateQuestion as updateQuestionService, deleteQuestion as deleteQuestionService } from '../../../services/instructor/questionService';

const ManageQuestions = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionsByCourse(courseCode);
                setAllQuestions(data || []);
            } catch (err) {
                console.error("Failed to fetch questions:", err);
                toast.error("Could not load questions for this course.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [courseCode]);

    const courseQuestions = useMemo(() => {
        if (typeFilter === "all") return allQuestions;
        return allQuestions.filter((q) => q?.type === typeFilter);
    }, [allQuestions, typeFilter]);

    const startEdit = (q) => {
        setEditingId(q.id);
        const correctAnswer = (() => {
            if (q.type === "multiple") {
                if (Array.isArray(q.correctAnswer)) return q.correctAnswer;
                return [];
            }
            if (q.type === "single") {
                if (Number.isInteger(q.correctAnswer)) return q.correctAnswer;
                if (typeof q.correctAnswer === "string" && q.options) {
                    const idx = q.options.indexOf(q.correctAnswer);
                    return idx >= 0 ? idx : "";
                }
                return "";
            }
            return q.correctAnswer ?? "";
        })();

        setDraft({
            id: q.id,
            courseCode: q.courseCode,
            type: q.type || "single",
            text: q.text || "",
            options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
            correctAnswer,
            pairs: Array.isArray(q.pairs) ? q.pairs : [
                { left: "", right: "" },
                { left: "", right: "" },
                { left: "", right: "" },
                { left: "", right: "" },
            ],
            difficulty: q.difficulty || "Medium",
            marks: q.marks || 1,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraft(null);
    };

    const updateDraft = (patch) => {
        setDraft((prev) => ({ ...prev, ...patch }));
    };

    const handleDraftTypeChange = (nextType) => {
        setDraft((prev) => {
            if (!prev) return prev;
            if (nextType === "truefalse") {
                return { ...prev, type: nextType, options: ["True", "False"], correctAnswer: "" };
            }
            if (nextType === "matching") {
                return {
                    ...prev,
                    type: nextType,
                    options: [],
                    correctAnswer: "",
                    pairs: [
                        { left: "", right: "" },
                        { left: "", right: "" },
                        { left: "", right: "" },
                        { left: "", right: "" },
                    ],
                };
            }
            return {
                ...prev,
                type: nextType,
                options: prev.options?.length === 4 ? prev.options : ["", "", "", ""],
                correctAnswer: nextType === "multiple" ? [] : "",
            };
        });
    };

    const toggleDraftMultipleIndex = (index) => {
        setDraft((prev) => {
            if (!prev) return prev;
            const current = Array.isArray(prev.correctAnswer) ? prev.correctAnswer : [];
            const next = current.includes(index) ? current.filter((i) => i !== index) : [...current, index];
            return { ...prev, correctAnswer: next };
        });
    };

    const saveEdit = async () => {
        if (!draft) return;
        const text = (draft.text || "").trim();
        const marks = Number(draft.marks);

        if (!text) {
            toast.error("Question text cannot be empty.");
            return;
        }
        if (!marks || marks <= 0) {
            toast.error("Marks must be greater than 0.");
            return;
        }

        const nextQuestionData = {
            ...draft,
            text,
            marks,
            options: draft.type === "matching" ? [] : (draft.options || []).map((o) => (o || "").trim()),
            pairs: draft.type === "matching" ? (draft.pairs || []).map((p) => ({ left: String(p?.left || "").trim(), right: String(p?.right || "").trim() })) : undefined,
        };

        try {
            await updateQuestionService(draft.id, nextQuestionData);
            setAllQuestions((prev) => prev.map((q) => q.id === draft.id ? nextQuestionData : q));
            toast.success("Question updated successfully.");
            cancelEdit();
        } catch (err) {
            toast.error("Failed to update question: " + err.message);
        }
    };

    const deleteQuestion = async (questionId) => {
        const ok = window.confirm("Are you sure you want to delete this question?");
        if (!ok) return;

        try {
            await deleteQuestionService(questionId);
            setAllQuestions((prev) => prev.filter((q) => q.id !== questionId));
            toast.success("Question deleted successfully.");
            if (editingId === questionId) cancelEdit();
        } catch (err) {
            toast.error("Failed to delete question: " + err.message);
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft /> Back
            </button>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Type</label>
                    <select className="form-select" style={{ width: 220 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="truefalse">True / False</option>
                        <option value="matching">Matching</option>
                    </select>
                </div>
                <button className="btn btn-success" onClick={() => navigate(`/instructor/question-bank/create?course=${courseCode}`)}>
                    <FaPlusCircle className="me-2" />
                    Add Question
                </button>
            </div>

            {draft && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <strong>Edit Question</strong>
                        <button type="button" className="btn btn-sm btn-light" onClick={cancelEdit}>
                            Cancel
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Difficulty</label>
                                <select className="form-select" value={draft.difficulty} onChange={(e) => updateDraft({ difficulty: e.target.value })}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Marks</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={draft.marks}
                                    onChange={(e) => updateDraft({ marks: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Type</label>
                                <select className="form-select" value={draft.type} onChange={(e) => handleDraftTypeChange(e.target.value)}>
                                    <option value="single">Single Choice</option>
                                    <option value="multiple">Multiple Choice</option>
                                    <option value="truefalse">True / False</option>
                                    <option value="matching">Matching</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Question Text</label>
                                <textarea className="form-control" rows="2" value={draft.text} onChange={(e) => updateDraft({ text: e.target.value })} />
                            </div>
                            {(draft.type === "single" || draft.type === "multiple") && (
                                <div className="col-12">
                                    <label className="form-label">Options</label>
                                    {(draft.options || ["", "", "", ""]).map((opt, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <div className="input-group-text">
                                                {draft.type === "single" ? (
                                                    <input
                                                        type="radio"
                                                        name="draftSingleCorrect"
                                                        aria-label={`Mark option ${idx + 1} as correct`}
                                                        checked={Number(draft.correctAnswer) === idx}
                                                        onChange={() => updateDraft({ correctAnswer: idx })}
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`Mark option ${idx + 1} as correct`}
                                                        checked={Array.isArray(draft.correctAnswer) && draft.correctAnswer.includes(idx)}
                                                        onChange={() => toggleDraftMultipleIndex(idx)}
                                                    />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={opt}
                                                onChange={(e) => {
                                                    const nextOptions = [...(draft.options || ["", "", "", ""])];
                                                    nextOptions[idx] = e.target.value;
                                                    updateDraft({ options: nextOptions });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {draft.type === "truefalse" && (
                                <div className="col-12">
                                    <label className="form-label">Correct Answer</label>
                                    <div className="d-flex gap-4">
                                        {["True", "False"].map((val) => (
                                            <label key={val} className="form-check-label d-flex align-items-center gap-2">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="draftTrueFalseCorrect"
                                                    value={val}
                                                    checked={draft.correctAnswer === val}
                                                    onChange={(e) => updateDraft({ correctAnswer: e.target.value })}
                                                />
                                                {val}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {draft.type === "matching" && (
                                <div className="col-12">
                                    <label className="form-label">Matching Pairs</label>
                                    {(draft.pairs || []).map((pair, idx) => (
                                        <div className="row g-2 mb-2" key={idx}>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={pair.left}
                                                    placeholder={`Left ${idx + 1}`}
                                                    onChange={(e) => {
                                                        const nextPairs = [...(draft.pairs || [])];
                                                        const current = nextPairs[idx] || { left: "", right: "" };
                                                        nextPairs[idx] = { ...current, left: e.target.value };
                                                        updateDraft({ pairs: nextPairs });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={pair.right}
                                                    placeholder={`Right ${idx + 1}`}
                                                    onChange={(e) => {
                                                        const nextPairs = [...(draft.pairs || [])];
                                                        const current = nextPairs[idx] || { left: "", right: "" };
                                                        nextPairs[idx] = { ...current, right: e.target.value };
                                                        updateDraft({ pairs: nextPairs });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" className="btn btn-primary" onClick={saveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                    <h4 className="mb-0">Manage Questions - {courseCode}</h4>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Type</th>
                                <th>Difficulty</th>
                                <th>Marks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseQuestions.map(q => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.text}</td>
                                    <td className="text-capitalize">{q.type}</td>
                                    <td><span className="badge bg-info">{q.difficulty}</span></td>
                                    <td>{q.marks || 1}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(q)} disabled={editingId === q.id}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteQuestion(q.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {courseQuestions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        No questions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageQuestions;
