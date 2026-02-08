import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { getEnrolledStudents } from '../../../services/instructor/instructorService';
import { toast } from 'react-toastify';

const ViewEnrolledStudents = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEnrolledStudents();
    }, [courseId]);

    const loadEnrolledStudents = async () => {
        try {
            setLoading(true);
            const data = await getEnrolledStudents(courseId);
            setStudents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load enrolled students:', err);
            toast.error('Failed to load enrolled students');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                <FaArrowLeft /> Back to Courses
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0"><FaUserGraduate className="me-2" /> Enrolled Students - {courseId}</h4>
                    <span className="badge bg-light text-primary">{students.length} Students</span>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaUserGraduate size={48} className="mb-3 opacity-50" />
                            <p>No students enrolled in this course yet.</p>
                        </div>
                    ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.name || student.studentName}</td>
                                        <td>
                                            <a href={`mailto:${student.email}`} className="text-decoration-none">
                                                <FaEnvelope className="me-1" /> {student.email}
                                            </a>
                                        </td>
                                        <td>
                                            <span className={`badge ${student.status === 'Active' || student.enrollmentStatus === 'ENROLLED' ? 'bg-success' : 'bg-secondary'}`}>
                                                {student.status || student.enrollmentStatus || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewEnrolledStudents;
