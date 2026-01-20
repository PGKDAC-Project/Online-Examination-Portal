import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const STORAGE_KEY = "instructorQuestionBankV1";

const loadQuestionBank = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveQuestionBank = (questions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

const ManageQuestions = () => {
    const { courseCode } = useParams();
    const navigate = useNavigate();

    const [allQuestions, setAllQuestions] = useState(() => {
        const defaults = [
            {
                id: "seed-cs204-1",
                courseCode: "CS204",
                type: "single",
                text: "What is a Binary Tree?",
                options: ["A graph", "A tree with max 2 children", "A sorting algorithm", "A database index"],
                correctAnswer: 1,
                difficulty: "Easy",
            },
            {
                id: "seed-cs204-2",
                courseCode: "CS204",
                type: "multiple",
                text: "Which of these are linear data structures?",
                options: ["Array", "Linked List", "Tree", "Graph"],
                correctAnswer: [0, 1],
                difficulty: "Medium",
            },
            {
                id: "seed-cs210-1",
                courseCode: "CS210",
                type: "truefalse",
                text: "A primary key can contain NULL values.",
                options: ["True", "False"],
                correctAnswer: "False",
                difficulty: "Easy",
            },
        ];

        const stored = loadQuestionBank();
        const hasAnySeed = stored.some((q) => typeof q?.id === "string" && q.id.startsWith("seed-"));
        if (stored.length === 0 || !hasAnySeed) {
            const existingIds = new Set(stored.map((q) => q?.id));
            const toAdd = defaults.filter((q) => !existingIds.has(q.id));
            const next = [...stored, ...toAdd];
            saveQuestionBank(next);
            return next;
        }
        return stored;
    });
    const [typeFilter, setTypeFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(null);

    const courseQuestions = useMemo(() => {
        const byCourse = allQuestions.filter((q) => q?.courseCode === courseCode);
        if (typeFilter === "all") return byCourse;
        return byCourse.filter((q) => q?.type === typeFilter);
    }, [allQuestions, courseCode, typeFilter]);

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

    const saveEdit = () => {
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

        if (draft.type === "single" || draft.type === "multiple") {
            const options = (draft.options || []).map((o) => (o || "").trim());
            if (options.length !== 4 || options.some((o) => !o)) {
                toast.error("Please fill all 4 options.");
                return;
            }
        }

        if (draft.type === "single") {
            const idx = Number(draft.correctAnswer);
            if (!Number.isInteger(idx) || idx < 0 || idx > 3) {
                toast.error("Select the correct option.");
                return;
            }
        }

        if (draft.type === "multiple") {
            const indices = Array.isArray(draft.correctAnswer) ? draft.correctAnswer : [];
            if (indices.length === 0) {
                toast.error("Select at least one correct option.");
                return;
            }
            if (indices.some((i) => !Number.isInteger(i) || i < 0 || i > 3)) {
                toast.error("Invalid correct options selected.");
                return;
            }
        }

        if (draft.type === "truefalse") {
            if (draft.correctAnswer !== "True" && draft.correctAnswer !== "False") {
                toast.error("Select True or False as correct answer.");
                return;
            }
        }

        if (draft.type === "matching") {
            const pairs = (draft.pairs || []).map((p) => ({
                left: String(p?.left || "").trim(),
                right: String(p?.right || "").trim(),
            }));
            if (pairs.length < 2) {
                toast.error("Add at least 2 matching pairs.");
                return;
            }
            if (pairs.some((p) => !p.left || !p.right)) {
                toast.error("Fill all matching pairs.");
                return;
            }
        }

        const nextAll = allQuestions.map((q) => {
            if (q.id !== draft.id) return q;
            return {
                ...q,
                type: draft.type,
                text: text,
                options: draft.type === "matching" ? [] : (draft.options || []).map((o) => (o || "").trim()),
                correctAnswer: draft.correctAnswer,
                difficulty: draft.difficulty || "Medium",
                marks: marks,
                pairs: draft.type === "matching" ? (draft.pairs || []).map((p) => ({ left: String(p?.left || "").trim(), right: String(p?.right || "").trim() })) : undefined,
            };
        });

        setAllQuestions(nextAll);
        saveQuestionBank(nextAll);
        toast.success("Question updated.");
        cancelEdit();
    };

    const deleteQuestion = (questionId) => {
        const ok = window.confirm("Delete this question?");
        if (!ok) return;
        const nextAll = allQuestions.filter((q) => q.id !== questionId);
        setAllQuestions(nextAll);
        saveQuestionBank(nextAll);
        toast.success("Question deleted.");
        if (editingId === questionId) cancelEdit();
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
