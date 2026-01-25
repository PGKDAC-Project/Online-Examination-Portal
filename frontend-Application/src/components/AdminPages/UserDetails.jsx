import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../../services/admin/userService';
import { getSystemLogs } from '../../services/admin/adminService';
import { FaUser, FaArrowLeft, FaEnvelope, FaIdBadge, FaCalendarAlt } from 'react-icons/fa';
import { toast } from "react-toastify";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, allLogs] = await Promise.all([
          getUserById(id),
          getSystemLogs()
        ]);

        setUser(u);

        // Filter logs for this user (assuming logs contain userId or user email matching)
        const userLogs = Array.isArray(allLogs) ? allLogs.filter(l => String(l.userId) === String(id) || l.user === u.name) : [];
        setLogs(userLogs);
      } catch (err) {
        toast.error("Failed to load user details");
        // navigate('/admin/users'); // Optional: stay on page to see error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-5 text-center">Loading user details...</div>;
  if (!user) return <div className="p-5 text-center">User not found</div>;

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
                        <span className={`badge ${log.status === 'Success' ? 'bg-success' :
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
