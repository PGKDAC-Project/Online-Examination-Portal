import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ViewEnrolledStudents = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const students = [
        { id: 'S101', name: 'Ankit Singh', email: 'ankit@example.com', status: 'Active' },
        { id: 'S102', name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Active' },
        { id: 'S103', name: 'Priya Verma', email: 'priya@example.com', status: 'Inactive' },
    ];

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
                                        <td>{student.name}</td>
                                        <td>
                                            <a href={`mailto:${student.email}`} className="text-decoration-none">
                                                <FaEnvelope className="me-1" /> {student.email}
                                            </a>
                                        </td>
                                        <td>
                                            <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {student.status}
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
                </div>
            </div>
        </div>
    );
};

export default ViewEnrolledStudents;
