import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const STORAGE_KEY = "instructorExamsV1";

const loadExams = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveExams = (exams) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
};

const CreateExam = () => {
    const navigate = useNavigate();
    const [exam, setExam] = useState({
        title: '',
        courseCode: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: 60,
        instructions: ''
    });

    const handleChange = (e) => {
        setExam({ ...exam, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = (exam.title || "").trim();
        const courseCode = (exam.courseCode || "").trim();
        if (!title) {
            toast.error("Please enter exam title.");
            return;
        }
        if (!courseCode) {
            toast.error("Please select a course.");
            return;
        }

        const id = `EXAM-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const nextExam = {
            id,
            title,
            courseCode,
            date: exam.date,
            startTime: exam.startTime,
            endTime: exam.endTime,
            duration: Number(exam.duration) || 60,
            instructions: exam.instructions || "",
            status: "Scheduled",
            questionIds: [],
        };

        const existing = loadExams();
        saveExams([...existing, nextExam]);
        toast.success("Exam created. Add questions now.");
        navigate(`/instructor/exams/${id}/edit`);
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
                                <select name="courseCode" className="form-select" required onChange={handleChange} value={exam.courseCode}>
                                    <option value="">Select Course</option>
                                    <option value="CS204">CS204 - Data Structures</option>
                                    <option value="CS210">CS210 - DBMS</option>
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

                        <div className="mb-3">
                            <label className="form-label">Instructions</label>
                            <textarea name="instructions" className="form-control" rows="4" onChange={handleChange} value={exam.instructions}></textarea>
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
