// src/components/InstructorPages/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axios/axiosClient';
import { getCurrentUser } from '../../../services/auth/authService';
import { getInstructorCourses } from '../../../services/instructor/instructorService';

function ProfileSettings() {
    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = getCurrentUser();
                if (!user?.id) {
                    toast.error('User not logged in');
                    return;
                }
                const profileData = await axiosClient.get(`/instructor/profile/${user.id}`);
                setInstructor(profileData);
                setName(profileData.name || '');
                setEmail(profileData.email || '');
                
                const coursesData = await getInstructorCourses(user.id);
                console.log('Courses data:', coursesData);
                setCourses(coursesData || []);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        toast.info('Profile update functionality is not yet implemented on the backend');
    };

    const handleChangePassword = async () => {
        toast.info('Password change functionality is not yet implemented on the backend');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-4">Profile & Settings</h2>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <FaUser className="me-2" />
                    Profile Information
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            <FaEnvelope className="me-1" />
                            Email
                        </label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button className="btn btn-success btn-sm" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-secondary text-white">
                    <FaLock className="me-2" />
                    Change Password
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className="btn btn-warning btn-sm" onClick={handleChangePassword}>
                        Change Password
                    </button>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <FaUserShield className="me-2" />
                    Role & Course Assignment
                </div>
                <div className="card-body">
                    <p>
                        <strong>Role:</strong> {instructor?.role || 'Instructor'}
                    </p>
                    <p className="mb-2">
                        <FaBook className="me-2" />
                        <strong>Assigned Courses:</strong>
                    </p>
                    <ul>
                        {courses.map((course) => {
                            console.log('Course:', course);
                            return (
                                <li key={course.id || course.courseId}>
                                    {course.courseCode || ''} - {course.name || course.courseName || ''}
                                </li>
                            );
                        })}
                    </ul>
                    {courses.length === 0 && <p className="text-muted">No courses assigned</p>}
                    <div className="alert alert-info mt-3">
                        Role and course assignments are managed by administrators and cannot be modified here.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;
