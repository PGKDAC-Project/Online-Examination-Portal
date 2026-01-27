import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getExamById } from '../../../services/admin/examService';
import { getQuestionsByCourse } from '../../../services/instructor/questionService';
import { getExamQuestions, addQuestionToExam, removeQuestionFromExam } from '../../../services/instructor/instructorService';

const ExamQuestions = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [examId]);

    const loadData = async () => {
        try {
            setLoading(true);
            // getExamById returns the exam object directly (via axios interceptor)
            const examData = await getExamById(examId);
            setExam(examData);

            if (examData && examData.course) {
                const [allQuestions, currentQuestions] = await Promise.all([
                    getQuestionsByCourse(examData.course.id),
                    getExamQuestions(examId)
                ]);

                // currentQuestions is List<ExamQuestions> which has .question object
                const addedIds = new Set(currentQuestions.map(eq => eq.question.id));
                const available = allQuestions.filter(q => !addedIds.has(q.id));

                setAvailableQuestions(available);
                setAddedQuestions(currentQuestions);
            }
        } catch (error) {
            console.error("Failed to load exam questions:", error);
            toast.error("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (questionId) => {
        try {
            await addQuestionToExam(examId, questionId);
            toast.success("Question added to exam");
            loadData();
        } catch (error) {
            console.error("Failed to add question:", error);
            toast.error("Failed to add question.");
        }
    };

    const handleRemove = async (questionId) => {
        if (!window.confirm("Remove this question from exam?")) return;
        try {
            await removeQuestionFromExam(examId, questionId);
            toast.success("Question removed from exam");
            loadData();
        } catch (error) {
            console.error("Failed to remove question:", error);
            toast.error("Failed to remove question.");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!exam) return <div className="alert alert-danger">Exam not found</div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/instructor/exams" className="btn btn-outline-secondary mb-2">
                        <FaArrowLeft className="me-2" /> Back to Exams
                    </Link>
                    <h2>Manage Questions: {exam.examTitle}</h2>
                    <p className="text-muted">Course: {exam.course.courseCode} - {exam.course.title}</p>
                </div>
                <div className="text-end">
                     <span className="badge bg-primary fs-5">{addedQuestions.length} Questions Added</span>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Added Questions</h5>
                        </div>
                        <div className="card-body p-0" style={{maxHeight: '600px', overflowY: 'auto'}}>
                            {addedQuestions.length === 0 ? (
                                <div className="p-3 text-center text-muted">No questions added yet.</div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {addedQuestions.map((eq, index) => (
                                        <li key={eq.question.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="badge bg-secondary me-2">{index + 1}</span>
                                                <span className="fw-bold">{eq.question.questionText}</span>
                                                <div className="small text-muted">
                                                    Type: {eq.question.type} | Marks: {eq.question.marksAllotted}
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(eq.question.id)}>
                                                <FaTrash />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white">
                            <h5 className="mb-0">Available Questions (Question Bank)</h5>
                        </div>
                         <div className="card-body p-0" style={{maxHeight: '600px', overflowY: 'auto'}}>
                            {availableQuestions.length === 0 ? (
                                <div className="p-3 text-center text-muted">No available questions found for this course.</div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {availableQuestions.map((q) => (
                                        <li key={q.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="fw-bold">{q.questionText}</span>
                                                <div className="small text-muted">
                                                    Type: {q.type} | Marks: {q.marksAllotted} | Level: {q.level}
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-outline-success" onClick={() => handleAdd(q.id)}>
                                                <FaPlus /> Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamQuestions;