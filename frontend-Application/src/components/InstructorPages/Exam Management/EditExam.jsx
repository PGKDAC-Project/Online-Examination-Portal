import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInstructorExam, updateInstructorExam } from '../../../services/instructor/instructorService';

const EditExam = () => {
    const navigate = useNavigate();
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await getInstructorExam(examId);
                // Format dates for input fields
                if (data.scheduledDate) {
                    data.date = data.scheduledDate;
                }
                if (data.startTime) {
                    data.startTime = data.startTime.substring(0, 5); // HH:mm
                }
                if (data.endTime) {
                    data.endTime = data.endTime.substring(0, 5); // HH:mm
                }
                setExam(data);
            } catch (err) {
                toast.error("Failed to load exam");
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId]);

    const handleChange = (e) => {
        setExam((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : prev));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!exam) return;
        
        const payload = {
            examTitle: exam.examTitle,
            scheduledDate: exam.date,
            startTime: exam.startTime + ":00",
            endTime: exam.endTime + ":00",
            duration: Number(exam.duration),
            passingMarks: Number(exam.passingMarks),
            status: exam.status,
            examPassword: exam.examPassword
        };

        try {
            await updateInstructorExam(examId, payload);
            toast.success("Exam updated successfully!");
            navigate('/instructor/exams');
        } catch (err) {
            toast.error("Failed to update exam");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

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
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Edit Exam - {exam?.examTitle || ""}</h4>
                    <button 
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => navigate(`/instructor/exams/${examId}/questions`)}
                    >
                        <FaQuestionCircle className="me-1" /> Manage Questions
                    </button>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Exam Title</label>
                                <input type="text" name="examTitle" className="form-control" value={exam?.examTitle || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Course</label>
                                <input type="text" className="form-control" value={exam?.course?.title || ""} disabled />
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

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Duration (minutes)</label>
                                <input type="number" name="duration" className="form-control" value={exam?.duration || ""} onChange={handleChange} required disabled={!exam} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Passing Marks</label>
                                <input type="number" name="passingMarks" className="form-control" value={exam?.passingMarks || ""} onChange={handleChange} required disabled={!exam} />
                                <small className="text-muted">Total Marks: {exam?.totalMarks || 0}</small>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Exam Password</label>
                            <input type="text" name="examPassword" className="form-control" placeholder="Enter exam password" value={exam?.examPassword || ""} onChange={handleChange} disabled={!exam} required />
                            <small className="text-muted">Students will need this password to start the exam</small>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary px-4" disabled={!exam}>
                                <FaSave className="me-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditExam;
