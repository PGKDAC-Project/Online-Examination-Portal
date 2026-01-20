import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCalendarAlt, FaBook } from 'react-icons/fa';
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

const ViewExamDetails = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const exam = useMemo(() => {
        const exams = loadExams();
        return exams.find((e) => String(e.id) === String(examId)) || null;
    }, [examId]);

    const ids = Array.isArray(exam?.questionIds) ? exam.questionIds : [];
    const questionCount = ids.length;
    const examCourseLabel = String(exam?.courseCode || exam?.course || "");
    const questionPreview = (() => {
        if (ids.length === 0) return [];
        const all = loadQuestionBank();
        const byId = new Map(all.map((q) => [String(q.id), q]));
        return ids.slice(0, 5).map((id) => byId.get(String(id))).filter(Boolean);
    })();

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
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Exam Details - {exam?.title || ""}</h4>
                    <span className={`badge ${exam?.status === 'Scheduled' ? 'bg-primary' : 'bg-success'}`}>{exam?.status || ""}</span>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5 className="text-muted">General Info</h5>
                            <p><FaBook className="me-2 text-primary" /> <strong>Course:</strong> {examCourseLabel}</p>
                            <p><FaCalendarAlt className="me-2 text-primary" /> <strong>Date:</strong> {exam?.date || ""}</p>
                            <p><FaClock className="me-2 text-primary" /> <strong>Time:</strong> {exam?.startTime || ""} - {exam?.endTime || ""}</p>
                            <p className="mb-0"><strong>Questions:</strong> {questionCount}</p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-muted">Instructions</h5>
                            <p className="border p-3 rounded bg-light">{exam?.instructions || ""}</p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => toast.info("Edit the exam to add/remove questions.")} disabled={!exam}>
                            Info
                        </button>
                        <button className="btn btn-primary" type="button" onClick={() => navigate(`/instructor/exams/${examId}/edit`)} disabled={!exam}>
                            Edit Exam
                        </button>
                    </div>
                </div>
            </div>

            {questionPreview.length > 0 && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-dark text-white">
                        <strong>Question Preview</strong>
                    </div>
                    <div className="card-body">
                        <ul className="mb-0">
                            {questionPreview.map((q) => (
                                <li key={q.id}>
                                    {q.text} ({q.type})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewExamDetails;
