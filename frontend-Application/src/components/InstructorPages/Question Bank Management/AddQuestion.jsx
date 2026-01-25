import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createQuestion as createQuestionService } from '../../../services/instructor/questionService';

const AddQuestion = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCourse = useMemo(() => (searchParams.get("course") || "").trim(), [searchParams]);

    const [question, setQuestion] = useState({
        course: preselectedCourse,
        type: 'single',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        pairs: [
            { left: "", right: "" },
            { left: "", right: "" },
            { left: "", right: "" },
            { left: "", right: "" },
        ],
        difficulty: 'Medium',
        marks: 1,
    });

    const handleChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        const nextType = e.target.value;
        setQuestion((prev) => {
            if (nextType === "truefalse") {
                return {
                    ...prev,
                    type: nextType,
                    options: ["True", "False"],
                    correctAnswer: "",
                };
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
                options: prev.options.length === 4 ? prev.options : ["", "", "", ""],
                correctAnswer: nextType === "multiple" ? [] : "",
            };
        });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        setQuestion({ ...question, options: newOptions });
    };

    const toggleMultipleCorrectIndex = (index) => {
        setQuestion((prev) => {
            const current = Array.isArray(prev.correctAnswer) ? prev.correctAnswer : [];
            const next = current.includes(index) ? current.filter((i) => i !== index) : [...current, index];
            return { ...prev, correctAnswer: next };
        });
    };

    const handlePairChange = (index, key, value) => {
        setQuestion((prev) => {
            const pairs = Array.isArray(prev.pairs) ? prev.pairs : [];
            const next = pairs.length ? [...pairs] : [
                { left: "", right: "" },
                { left: "", right: "" },
                { left: "", right: "" },
                { left: "", right: "" },
            ];
            const current = next[index] || { left: "", right: "" };
            next[index] = { ...current, [key]: value };
            return { ...prev, pairs: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const courseCode = (question.course || "").trim();
        const text = (question.text || "").trim();
        const difficulty = question.difficulty || "Medium";
        const marks = Number(question.marks);

        if (!courseCode) {
            toast.error("Please select a course.");
            return;
        }
        if (!text) {
            toast.error("Please enter question text.");
            return;
        }
        if (!marks || marks <= 0) {
            toast.error("Please enter valid marks (greater than 0).");
            return;
        }

        const nextQuestionData = {
            ...question,
            courseCode,
            text,
            difficulty,
            marks,
        };

        try {
            await createQuestionService(nextQuestionData);
            toast.success("Question created successfully!");
            navigate(`/instructor/question-bank/${courseCode}`);
        } catch (err) {
            toast.error("Failed to create question: " + err.message);
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft /> Back
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Add New Question</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Course</label>
                                <select name="course" className="form-select" required onChange={handleChange} value={question.course}>
                                    <option value="">Select Course</option>
                                    <option value="CS204">CS204</option>
                                    <option value="CS210">CS210</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Difficulty</label>
                                <select name="difficulty" className="form-select" onChange={handleChange} value={question.difficulty}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Marks</label>
                                <input
                                    type="number"
                                    name="marks"
                                    className="form-control"
                                    min="1"
                                    value={question.marks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Question Type</label>
                            <select name="type" className="form-select" value={question.type} onChange={handleTypeChange}>
                                <option value="single">Single Choice</option>
                                <option value="multiple">Multiple Choice</option>
                                <option value="truefalse">True / False</option>
                                <option value="matching">Matching</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Question Text</label>
                            <textarea name="text" className="form-control" rows="3" required onChange={handleChange} value={question.text}></textarea>
                        </div>

                        {(question.type === "single" || question.type === "multiple") && (
                            <div className="mb-3">
                                <label className="form-label">Options</label>
                                {question.options.map((opt, i) => (
                                    <div key={i} className="input-group mb-2">
                                        <div className="input-group-text">
                                            {question.type === "single" ? (
                                                <input
                                                    type="radio"
                                                    name="singleCorrect"
                                                    aria-label={`Mark option ${i + 1} as correct`}
                                                    checked={Number(question.correctAnswer) === i}
                                                    onChange={() => setQuestion((prev) => ({ ...prev, correctAnswer: i }))}
                                                />
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Mark option ${i + 1} as correct`}
                                                    checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(i)}
                                                    onChange={() => toggleMultipleCorrectIndex(i)}
                                                />
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(i, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {question.type === "truefalse" && (
                            <div className="mb-3">
                                <label className="form-label">Correct Answer</label>
                                <div className="d-flex gap-4">
                                    {["True", "False"].map((val) => (
                                        <label key={val} className="form-check-label d-flex align-items-center gap-2">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="correctAnswer"
                                                value={val}
                                                checked={question.correctAnswer === val}
                                                onChange={handleChange}
                                            />
                                            {val}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {question.type === "matching" && (
                            <div className="mb-3">
                                <label className="form-label">Matching Pairs</label>
                                {(question.pairs || []).map((pair, idx) => (
                                    <div className="row g-2 mb-2" key={idx}>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Left ${idx + 1}`}
                                                value={pair.left}
                                                onChange={(e) => handlePairChange(idx, "left", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Right ${idx + 1}`}
                                                value={pair.right}
                                                onChange={(e) => handlePairChange(idx, "right", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-success px-4">
                                <FaSave className="me-2" /> Add Question
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
