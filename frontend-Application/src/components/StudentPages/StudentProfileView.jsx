import React, { useState, useEffect } from 'react';
import { getCurrentUser } from "../../services/auth/authService";
import { toast } from 'react-toastify';
import axiosClient from '../../services/axios/axiosClient';

const StudentProfileView = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = getCurrentUser();
                if (!user?.id) {
                    toast.error('User not logged in');
                    return;
                }
                const profileData = await axiosClient.get(`/student/profile/${user.id}`);
                setStudent(profileData);
                setPhoneNumber(profileData.phoneNumber || '');
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveChanges = async () => {
        toast.info('Profile update functionality is not yet implemented on the backend');
    };

    if (loading) return <div>Loading...</div>;
    if (!student) return <div>No profile data available</div>;

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">My Profile</h1>

            <div className="card-custom mb-4 profile-header text-center py-4">
                <div className="rounded-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
                    {(student.name || 'S').charAt(0)}
                </div>
                <h2 className="mb-1 text-gradient fw-bold">{student.name || 'Student'}</h2>
                <p className="text-muted mb-0">{student.userCode || student.email}</p>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header profile-section-title">
                    <i className="fas fa-lock me-2"></i> System-Verified Fields
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-user me-2"></i> Full Name:
                            </p>
                            <p className="lead profile-field-value">{student.name || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-id-card me-2"></i> Student ID / Roll Number:
                            </p>
                            <p className="lead profile-field-value">{student.id ? `S${String(student.id).padStart(6, '0')}` : 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-envelope me-2"></i> Email ID (System):
                            </p>
                            <p className="lead profile-field-value">{student.email || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-user-circle me-2"></i> Username:
                            </p>
                            <p className="lead profile-field-value">{student.userCode || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-users me-2"></i> Batch:
                            </p>
                            <p className="lead profile-field-value">{student.batch?.batchName || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header profile-section-title">
                    <i className="fas fa-edit me-2"></i> Editable Fields
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label profile-field-label">Phone Number:</label>
                        <input type="tel" className="form-control" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <button className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileView;
