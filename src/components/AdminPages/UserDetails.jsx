import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { mockLogs, mockUsers } from './mockAdminData';
import { FaUser, FaArrowLeft, FaEnvelope, FaIdBadge, FaCalendarAlt } from 'react-icons/fa';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const parsedId = Number.parseInt(id ?? '', 10);
  const foundUser = mockUsers.find(u => u.id === parsedId);

  if (!foundUser) return <Navigate to="/admin/users" replace />;

  const user = {
    ...foundUser,
    email: foundUser.email ?? `${foundUser.name.toLowerCase().replace(' ', '.')}@example.com`,
    joinDate: '2025-01-15'
  };

  const logs = mockLogs.filter(l => l.userId === parsedId);

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/users')}>
        <FaArrowLeft /> Back to Users
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h3 className="mb-0"><FaUser className="me-2" /> User Details</h3>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-2 text-center">
              <FaUser size={80} className="text-secondary mb-3" />
              <h4>{user.name}</h4>
              <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                {user.status}
              </span>
            </div>
            <div className="col-md-10">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <label className="text-muted small">Role</label>
                    <div className="d-flex align-items-center">
                      <FaIdBadge className="me-2 text-primary" />
                      <strong>{user.role}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <label className="text-muted small">Email</label>
                    <div className="d-flex align-items-center">
                      <FaEnvelope className="me-2 text-primary" />
                      <strong>{user.email}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <label className="text-muted small">Last Login</label>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      <strong>{user.lastLogin}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light">
                    <label className="text-muted small">Joined Date</label>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      <strong>{user.joinDate}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="mb-3">User Activity</h5>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Exam</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.time}</td>
                      <td>{log.action}</td>
                      <td>
                        <span className={`badge ${
                          log.status === 'Success' ? 'bg-success' : 
                          log.status === 'Violation' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td>{log.examId ?? '-'}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No activity recorded for this user</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
