import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { mockUsers } from './mockAdminData';
import { toast } from 'react-toastify';
import { FaUser, FaSave, FaArrowLeft } from 'react-icons/fa';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const parsedId = Number.parseInt(id ?? '', 10);
  const foundUser = mockUsers.find(u => u.id === parsedId);
  const [user, setUser] = useState(() => (
    foundUser
      ? { ...foundUser, email: `${foundUser.name.toLowerCase().replace(' ', '.')}@example.com` }
      : { name: '', role: 'Student', status: 'Active', email: '' }
  ));

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to update user would go here
    toast.success("User updated successfully");
    navigate('/admin/users');
  };

  if (!foundUser) return <Navigate to="/admin/users" replace />;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/users')}>
        <FaArrowLeft /> Back to Users
      </button>
      
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0"><FaUser className="me-2" /> Edit User</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control"
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control"
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Role</label>
                <select 
                  className="form-select"
                  value={user.role} 
                  onChange={(e) => setUser({...user, role: e.target.value})}
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={user.status} 
                  onChange={(e) => setUser({...user, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-success">
                <FaSave className="me-2" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
