import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EXAMS_STORAGE_KEY = "instructorExamsV1";
const QUESTION_BANK_STORAGE_KEY = "instructorQuestionBankV1";

const loadExams = () => {
    try {
        const raw = localStorage.getItem(EXAMS_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveExams = (exams) => {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
};

const loadQuestionBank = () => {
    try {
        const raw = localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const EditExam = () => {
    const navigate = useNavigate();
    const { examId } = useParams();

    const [exam, setExam] = useState(() => {
        const exams = loadExams();
        return exams.find((e) => String(e.id) === String(examId)) || null;
    });
    const [showBank, setShowBank] = useState(false);
    const [bankQuery, setBankQuery] = useState("");

    const handleChange = (e) => {
        setExam((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : prev));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!exam) return;
        const title = (exam.title || "").trim();
        const courseCode = (exam.courseCode || "").trim();
        const passingMarks = Number(exam.passingMarks);

        if (!title) {
            toast.error("Exam title cannot be empty.");
            return;
        }
        if (!courseCode) {
            toast.error("Select a course.");
            return;
        }

        if (!passingMarks || passingMarks <= 0) {
            toast.error("Passing marks must be greater than 0.");
            return;
        }
        if (passingMarks >= totalMarks) {
            toast.error(`Passing marks must be less than total marks (${totalMarks}).`);
            return;
        }

        const exams = loadExams();
        const next = exams.map((e) => (String(e.id) === String(examId) ? { ...e, ...exam, title, courseCode, passingMarks } : e));
        saveExams(next);
        toast.success("Exam updated successfully!");
        navigate('/instructor/exams');
    };

    const bankQuestions = (() => {
        if (!exam?.courseCode) return [];
        const q = bankQuery.trim().toLowerCase();
        const all = loadQuestionBank().filter((x) => x?.courseCode === exam.courseCode);
        if (!q) return all;
        return all.filter((x) => String(x?.text || "").toLowerCase().includes(q) || String(x?.id || "").toLowerCase().includes(q));
    })();

    const questionsInExam = (() => {
        const all = loadQuestionBank();
        const byId = new Map(all.map((q) => [String(q.id), q]));
        const ids = Array.isArray(exam?.questionIds) ? exam.questionIds : [];
        return ids.map((id) => byId.get(String(id))).filter(Boolean);
    })();

    const totalMarks = questionsInExam.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

    const addQuestionToExam = (questionId) => {
        if (!exam) return;
        const nextIds = Array.isArray(exam.questionIds) ? exam.questionIds : [];
        if (nextIds.includes(questionId)) return;
        const updated = { ...exam, questionIds: [...nextIds, questionId] };
        setExam(updated);
        const exams = loadExams();
        const next = exams.map((e) => (String(e.id) === String(examId) ? updated : e));
        saveExams(next);
        toast.success("Question added to exam.");
    };

    const removeQuestionFromExam = (questionId) => {
        if (!exam) return;
        const nextIds = (Array.isArray(exam.questionIds) ? exam.questionIds : []).filter((id) => id !== questionId);
        const updated = { ...exam, questionIds: nextIds };
        setExam(updated);
        const exams = loadExams();
        const next = exams.map((e) => (String(e.id) === String(examId) ? updated : e));
        saveExams(next);
        toast.success("Question removed from exam.");
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/exams')}>
                <FaArrowLeft /> Back to Exams
            </button>

            {!exam && (
                <div className="alert alert-danger">
                    Exam not found.
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Edit Exam - {exam?.title || ""}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Exam Title</label>
                                <input type="text" name="title" className="form-control" value={exam?.title || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Course</label>
                                <select name="courseCode" className="form-select" value={exam?.courseCode || ""} onChange={handleChange} required disabled={!exam}>
                                    <option value="">Select Course</option>
                                    <option value="CS204">CS204 - Data Structures</option>
                                    <option value="CS210">CS210 - DBMS</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Passing Marks</label>
                                <input type="number" name="passingMarks" className="form-control" value={exam?.passingMarks || ""} onChange={handleChange} required disabled={!exam} />
                                <small className="text-muted">Total Marks: {totalMarks}</small>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Date</label>
                                <input type="date" name="date" className="form-control" value={exam?.date || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Start Time</label>
                                <input type="time" name="startTime" className="form-control" value={exam?.startTime || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">End Time</label>
                                <input type="time" name="endTime" className="form-control" value={exam?.endTime || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Instructions</label>
                            <textarea name="instructions" className="form-control" rows="4" value={exam?.instructions || ""} onChange={handleChange} disabled={!exam}></textarea>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary px-4" disabled={!exam}>
                                <FaSave className="me-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <strong>Exam Questions</strong>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => setShowBank((v) => !v)} disabled={!exam?.courseCode}>
                        {showBank ? "Hide Bank" : "Add From Question Bank"}
                    </button>
                </div>
                <div className="card-body">
                    {questionsInExam.length === 0 && (
                        <div className="text-muted">No questions added yet.</div>
                    )}

                    {questionsInExam.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: 200 }}>ID</th>
                                        <th>Question</th>
                                        <th style={{ width: 140 }}>Type</th>
                                        <th style={{ width: 120 }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionsInExam.map((q) => (
                                        <tr key={q.id}>
                                            <td>{q.id}</td>
                                            <td>{q.text}</td>
                                            <td className="text-capitalize">{q.type}</td>
                                            <td>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeQuestionFromExam(q.id)}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showBank && (
                        <div className="mt-3">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ maxWidth: 420 }}
                                    value={bankQuery}
                                    onChange={(e) => setBankQuery(e.target.value)}
                                    placeholder="Search questions by ID or text"
                                />
                                <button type="button" className="btn btn-outline-success" onClick={() => navigate(`/instructor/question-bank/create?course=${exam?.courseCode || ""}`)} disabled={!exam?.courseCode}>
                                    Create New Question
                                </button>
                            </div>

                            {bankQuestions.length === 0 && (
                                <div className="text-muted">No questions found in this course bank.</div>
                            )}

                            {bankQuestions.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 200 }}>ID</th>
                                                <th>Question</th>
                                                <th style={{ width: 140 }}>Type</th>
                                                <th style={{ width: 120 }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bankQuestions.map((q) => {
                                                const already = Array.isArray(exam?.questionIds) && exam.questionIds.includes(q.id);
                                                return (
                                                    <tr key={q.id}>
                                                        <td>{q.id}</td>
                                                        <td>{q.text}</td>
                                                        <td className="text-capitalize">{q.type}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => addQuestionToExam(q.id)}
                                                                disabled={already}
                                                            >
                                                                {already ? "Added" : "Add"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditExam;
