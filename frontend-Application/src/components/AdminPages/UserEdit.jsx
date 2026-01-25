import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/admin/userService'; // Use real service
import { updateUser } from '../../services/admin/adminService';
import { getAllBatches } from '../../services/admin/batchService';
import { toast } from 'react-toastify';
import { FaUser, FaSave, FaArrowLeft } from 'react-icons/fa';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [users, batchList] = await Promise.all([
        getAllUsers(),
        getAllBatches()
      ]);
      const found = users.find(u => String(u.id) === String(id));
      if (!found) {
        toast.error("User not found");
        navigate('/admin/users');
        return;
      }
      setUser(found);

      const today = new Date().toISOString().split('T')[0];
      setBatches(Array.isArray(batchList) ? batchList.filter(b => b.endDate >= today) : []);
    } catch (err) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, user);
      // toast.success("User updated successfully"); // Removed per requirement
      navigate('/admin/users');
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

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
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={user.status}
                  onChange={(e) => setUser({ ...user, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Batch Dropdown - Visible only for Students */}
              {user.role === 'Student' && (
                <div className="col-md-4 mb-3">
                  <label className="form-label">Batch</label>
                  <select className="form-select" value={user.batchId || ""} onChange={(e) => setUser({ ...user, batchId: e.target.value })}>
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              )}
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
