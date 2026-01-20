// src/components/InstructorPages/CourseManagement.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaBook,
    FaUsers,
    FaFileUpload,
    FaBullseye
} from 'react-icons/fa';

function CourseManagement() {

    // Placeholder course data (same data source as student side)
    const courses = [
        {
            id: "CS101",
            title: "Introduction to Programming",
            students: 62
        },
        {
            id: "CS204",
            title: "Data Structures & Algorithms",
            students: 54
        }
    ];

    return (
        <div>
            <h2 className="mb-4">Course Management</h2>

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
                                    Course Code: <strong>{course.id}</strong>
                                </p>

                                <p className="mb-3">
                                    <FaUsers className="me-2 text-secondary" />
                                    Enrolled Students: <strong>{course.students}</strong>
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
                                        Upload / Update Syllabus
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

            {/* Permission clarity */}
            <div className="alert alert-info mt-5">
                <strong>Note:</strong> Students can view course details and syllabus only.
                Editing actions are restricted to instructors.
            </div>
        </div>
    );
}

export default CourseManagement;
