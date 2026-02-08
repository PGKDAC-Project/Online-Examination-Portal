// src/components/InstructorPages/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBook,
    FaUsers,
    FaFileUpload,
    FaBullseye
} from 'react-icons/fa';
import { getInstructorCourses } from '../../../services/instructor/instructorService';
import { getCurrentUser } from '../../../services/auth/authService';
import { toast } from 'react-toastify';

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const user = getCurrentUser();
            if (user && user.id) {
                const data = await getInstructorCourses(user.id);
                setCourses(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading courses...</div>;

    return (
        <div>
            <h2 className="mb-4">Course Management</h2>

            {courses.length === 0 ? (
                <div className="alert alert-info">No courses assigned to you yet.</div>
            ) : (
                <div className="row g-4">
                    {courses.map(course => (
                        <div className="col-md-6 col-lg-4" key={course.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">

                                    <h5 className="card-title text-primary">
                                        <FaBook className="me-2" />
                                        {course.title}
                                    </h5>

                                    <p className="text-muted mb-2">
                                        Course Code: <strong>{course.courseCode}</strong>
                                    </p>

                                    <p className="mb-3">
                                        <FaUsers className="me-2 text-secondary" />
                                        {/* Assuming backend returns enrolled count, otherwise hardcode or fetch separately */}
                                        Enrolled Students: <strong>{course.enrolledCount || 'N/A'}</strong>
                                    </p>

                                    {/* Instructor Permissions */}
                                    <div className="d-grid gap-2">

                                        <Link
                                            to={`/instructor/courses/${course.id}/students`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <FaUsers className="me-1" />
                                            View Enrolled Students
                                        </Link>

                                        <Link
                                            to={`/instructor/courses/${course.id}/syllabus`}
                                            className="btn btn-outline-success btn-sm"
                                        >
                                            <FaFileUpload className="me-1" />
                                            Manage Syllabus
                                        </Link>

                                        <Link
                                            to={`/instructor/courses/${course.id}/outcomes`}
                                            className="btn btn-outline-warning btn-sm"
                                        >
                                            <FaBullseye className="me-1" />
                                            Define Course Outcomes
                                        </Link>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Permission clarity */}
            <div className="alert alert-info mt-5">
                <strong>Note:</strong> Students can view course details and syllabus only.
                Editing actions are restricted to instructors.
            </div>
        </div>
    );
}

export default CourseManagement;
