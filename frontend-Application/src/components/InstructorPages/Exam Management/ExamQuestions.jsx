import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorExam } from '../../../services/instructor/instructorService';
import { getQuestionsByCourse, createQuestion, updateQuestion } from '../../../services/instructor/questionService';
import { getExamQuestions, addQuestionToExam, removeQuestionFromExam } from '../../../services/instructor/instructorService';

const ExamQuestions = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        type: 'SINGLE',
        marksAllotted: 1,
        level: 'EASY',
        options: ['', '', '', ''],
        correctAnswer: '',
        correctAnswers: [],
        matchingPairs: [{ left: '', right: '' }, { left: '', right: '' }]
    });

    useEffect(() => {
        loadData();
    }, [examId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const examData = await getInstructorExam(examId);
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

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setNewQuestion({
            questionText: question.questionText,
            type: question.type,
            marksAllotted: question.marksAllotted,
            level: question.level,
            options: question.options || ['', '', '', ''],
            correctAnswer: question.correctAnswers?.[0] || '',
            correctAnswers: [...(question.correctAnswers || [])],
            matchingPairs: question.matchingPairs ? Object.entries(question.matchingPairs).map(([left, right]) => ({left, right})) : [{ left: '', right: '' }, { left: '', right: '' }]
        });
        setShowModal(true);
    };

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        if (!exam || !exam.course) return;
        
        try {
            const payload = {
                ...newQuestion,
                courseId: exam.course.id
            };
            
            if (newQuestion.type === 'MATCHING') {
                const pairsMap = {};
                newQuestion.matchingPairs.forEach(pair => {
                    if (pair.left && pair.right) {
                        pairsMap[pair.left] = pair.right;
                    }
                });
                payload.matchingPairs = pairsMap;
            }
            
            if (editingQuestion) {
                // For update, don't send courseId as it can't be changed
                const { courseId, ...updatePayload } = payload;
                await updateQuestion(editingQuestion.id, updatePayload);
                toast.success('Question updated successfully!');
            } else {
                await createQuestion(payload);
                toast.success('Question created and added to question bank!');
            }
            
            setShowModal(false);
            setEditingQuestion(null);
            setNewQuestion({
                questionText: '',
                type: 'SINGLE',
                marksAllotted: 1,
                level: 'EASY',
                options: ['', '', '', ''],
                correctAnswer: '',
                correctAnswers: [],
                matchingPairs: [{ left: '', right: '' }, { left: '', right: '' }]
            });
            loadData();
        } catch (error) {
            toast.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
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
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-1" /> Create New Question
                    </button>
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
                                            <div>
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(eq.question)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(eq.question.id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
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

            {/* Create Question Modal */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingQuestion ? 'Edit Question' : 'Create New Question'}</h5>
                                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingQuestion(null); }}></button>
                            </div>
                            <form onSubmit={handleCreateQuestion}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Question Text</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="3" 
                                            required
                                            value={newQuestion.questionText}
                                            onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Type</label>
                                            <select 
                                                className="form-select"
                                                value={newQuestion.type}
                                                onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                                            >
                                                <option value="SINGLE">Single Choice</option>
                                                <option value="MULTIPLE">Multiple Choice</option>
                                                <option value="TRUE_FALSE">True/False</option>
                                                <option value="MATCHING">Matching</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Marks</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                min="1"
                                                required
                                                value={newQuestion.marksAllotted}
                                                onChange={(e) => setNewQuestion({...newQuestion, marksAllotted: parseInt(e.target.value)})}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Level</label>
                                            <select 
                                                className="form-select"
                                                value={newQuestion.level}
                                                onChange={(e) => setNewQuestion({...newQuestion, level: e.target.value})}
                                            >
                                                <option value="EASY">Easy</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HARD">Hard</option>
                                            </select>
                                        </div>
                                    </div>
                                    {(newQuestion.type === 'SINGLE' || newQuestion.type === 'MULTIPLE') && (
                                        <>
                                            <label className="form-label">Options</label>
                                            {newQuestion.options.map((opt, idx) => (
                                                <div className="input-group mb-2" key={idx}>
                                                    <span className="input-group-text">{String.fromCharCode(65 + idx)}</span>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        required
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOpts = [...newQuestion.options];
                                                            newOpts[idx] = e.target.value;
                                                            setNewQuestion({...newQuestion, options: newOpts});
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {newQuestion.type === 'SINGLE' && (
                                                <div className="mb-3">
                                                    <label className="form-label">Correct Answer</label>
                                                    <select 
                                                        className="form-select"
                                                        required
                                                        value={newQuestion.correctAnswer}
                                                        onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                                    >
                                                        <option value="">Select correct answer...</option>
                                                        {newQuestion.options.map((opt, idx) => (
                                                            <option key={idx} value={opt}>
                                                                {String.fromCharCode(65 + idx)}: {opt || '(empty)'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {newQuestion.type === 'MULTIPLE' && (
                                                <div className="mb-3">
                                                    <label className="form-label">Correct Answers (Select multiple)</label>
                                                    {newQuestion.options.map((opt, idx) => (
                                                        <div className="form-check" key={idx}>
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                id={`correct-${idx}`}
                                                                checked={newQuestion.correctAnswers.includes(newQuestion.options[idx])}
                                                                onChange={(e) => {
                                                                    const optionValue = newQuestion.options[idx];
                                                                    let newCorrect = [...newQuestion.correctAnswers];
                                                                    if (e.target.checked) {
                                                                        if (!newCorrect.includes(optionValue)) {
                                                                            newCorrect.push(optionValue);
                                                                        }
                                                                    } else {
                                                                        newCorrect = newCorrect.filter(a => a !== optionValue);
                                                                    }
                                                                    setNewQuestion({...newQuestion, correctAnswers: newCorrect});
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor={`correct-${idx}`}>
                                                                {String.fromCharCode(65 + idx)}: {opt || '(empty)'}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {newQuestion.type === 'TRUE_FALSE' && (
                                        <div className="mb-3">
                                            <label className="form-label">Correct Answer</label>
                                            <select 
                                                className="form-select"
                                                value={newQuestion.correctAnswer}
                                                onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                <option value="TRUE">True</option>
                                                <option value="FALSE">False</option>
                                            </select>
                                        </div>
                                    )}
                                    {newQuestion.type === 'SHORT_ANSWER' && (
                                        <div className="mb-3">
                                            <label className="form-label">Model Answer</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                value={newQuestion.correctAnswer}
                                                onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                            />
                                        </div>
                                    )}
                                    {newQuestion.type === 'MATCHING' && (
                                        <>
                                            <label className="form-label">Matching Pairs</label>
                                            {newQuestion.matchingPairs.map((pair, idx) => (
                                                <div className="row mb-2" key={idx}>
                                                    <div className="col-5">
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Left item"
                                                            required
                                                            value={pair.left}
                                                            onChange={(e) => {
                                                                const newPairs = [...newQuestion.matchingPairs];
                                                                newPairs[idx].left = e.target.value;
                                                                setNewQuestion({...newQuestion, matchingPairs: newPairs});
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-2 text-center pt-2">↔</div>
                                                    <div className="col-5">
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Right item"
                                                            required
                                                            value={pair.right}
                                                            onChange={(e) => {
                                                                const newPairs = [...newQuestion.matchingPairs];
                                                                newPairs[idx].right = e.target.value;
                                                                setNewQuestion({...newQuestion, matchingPairs: newPairs});
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setNewQuestion({...newQuestion, matchingPairs: [...newQuestion.matchingPairs, { left: '', right: '' }]})}
                                            >
                                                <FaPlus /> Add Pair
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingQuestion(null); }}>Cancel</button>
                                    <button type="submit" className="btn btn-success">{editingQuestion ? 'Update Question' : 'Create Question'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamQuestions;