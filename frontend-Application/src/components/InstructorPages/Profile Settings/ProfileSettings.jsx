// src/components/InstructorPages/ProfileSettings.jsx
import React from 'react';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserShield,
    FaBook
} from 'react-icons/fa';

function ProfileSettings() {

    // Placeholder instructor data
    const instructor = {
        name: "Dr. Rahul Mehta",
        email: "rahul.mehta@university.edu",
        role: "Instructor",
        courses: [
            "CS204 - Data Structures",
            "CS210 - Database Management Systems"
        ]
    };

    return (
        <div>
            <h2 className="mb-4">Profile & Settings</h2>

            {/* Profile Information */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <FaUser className="me-2" />
                    Profile Information
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={instructor.name}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            <FaEnvelope className="me-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            defaultValue={instructor.email}
                        />
                    </div>

                    <button className="btn btn-success btn-sm">
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Change Password */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-secondary text-white">
                    <FaLock className="me-2" />
                    Change Password
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" />
                    </div>

                    <button className="btn btn-warning btn-sm">
                        Change Password
                    </button>
                </div>
            </div>

            {/* Role & Course Assignment (Read-only) */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <FaUserShield className="me-2" />
                    Role & Course Assignment
                </div>
                <div className="card-body">
                    <p>
                        <strong>Role:</strong> {instructor.role}
                    </p>

                    <p className="mb-2">
                        <FaBook className="me-2" />
                        <strong>Assigned Courses:</strong>
                    </p>

                    <ul>
                        {instructor.courses.map((course, idx) => (
                            <li key={idx}>{course}</li>
                        ))}
                    </ul>

                    <div className="alert alert-info mt-3">
                        Role and course assignments are managed by administrators
                        and cannot be modified here.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;
