import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createInstructorExam, getInstructorCourses } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';

const CreateExam = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [exam, setExam] = useState({
        title: '',
        courseId: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: 60,
        passingMarks: 40,
        instructions: '',
        examPassword: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            const user = getCurrentUser();
            if (user) {
                try {
                    const data = await getInstructorCourses(user.id);
                    setCourses(Array.isArray(data) ? data : []);
                } catch (err) {
                    toast.error("Failed to load courses");
                }
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setExam({ ...exam, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        const title = (exam.title || "").trim();
        const courseId = exam.courseId;
        const passingMarks = Number(exam.passingMarks);

        if (!title) {
            toast.error("Please enter exam title.");
            return;
        }
        if (!courseId) {
            toast.error("Please select a course.");
            return;
        }
        if (!passingMarks || passingMarks <= 0) {
            toast.error("Please enter valid passing marks.");
            return;
        }

        const payload = {
            examTitle: title,
            scheduledDate: exam.date,
            startTime: exam.startTime + ":00", // Append seconds if needed by LocalTime
            endTime: exam.endTime + ":00",
            duration: Number(exam.duration) || 60,
            passingMarks: passingMarks,
            status: "SCHEDULED",
            courseId: Number(courseId),
            instructorId: user.id,
            examPassword: exam.examPassword || "" // Optional
        };

        try {
            const response = await createInstructorExam(payload);
            toast.success("Exam created successfully. Now add questions!");
            // Redirect to manage questions for the newly created exam
            if (response && response.id) {
                navigate(`/instructor/exams/${response.id}/questions`);
            } else {
                navigate(`/instructor/exams`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create exam");
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/exams')}>
                <FaArrowLeft /> Back to Exams
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Create New Exam</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Exam Title</label>
                                <input type="text" name="title" className="form-control" required onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Course</label>
                                <select name="courseId" className="form-select" required onChange={handleChange} value={exam.courseId}>
                                    <option value="">Select Course</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title} ({c.courseCode})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Date</label>
                                <input type="date" name="date" className="form-control" required onChange={handleChange} value={exam.date} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Start Time</label>
                                <input type="time" name="startTime" className="form-control" required onChange={handleChange} value={exam.startTime} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">End Time</label>
                                <input type="time" name="endTime" className="form-control" required onChange={handleChange} value={exam.endTime} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Duration (minutes)</label>
                                <input type="number" name="duration" className="form-control" value={exam.duration} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Passing Marks</label>
                                <input type="number" name="passingMarks" className="form-control" required min="1" value={exam.passingMarks} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Instructions</label>
                            <textarea name="instructions" className="form-control" rows="4" onChange={handleChange} value={exam.instructions}></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Exam Password</label>
                            <input type="text" name="examPassword" className="form-control" placeholder="Enter exam password" onChange={handleChange} value={exam.examPassword} required />
                            <small className="text-muted">Students will need this password to start the exam</small>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-success px-4">
                                <FaSave className="me-2" /> Create Exam
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;
