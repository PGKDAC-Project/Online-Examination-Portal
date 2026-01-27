import { useMemo, useState, useEffect } from 'react';
import { getAllUsers } from '../../services/admin/userService';
import { getAllBatches } from '../../services/admin/batchService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaFileCsv, FaFilePdf, FaPlus } from 'react-icons/fa';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, batchesData] = await Promise.all([
        getAllUsers(),
        getAllBatches()
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setBatches(Array.isArray(batchesData) ? batchesData : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const getBatchName = (id) => {
    const batch = batches.find(b => b.id === id || String(b.id) === String(id));
    return batch ? batch.batchName : '-';
  };

  const filtered = useMemo(() => {
    return users
      .filter(u => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchesRole = role === 'All' || (u.role && u.role === role);
        const matchesStatus = status === 'All' || (u.status && u.status === status);
        return matchesQuery && matchesRole && matchesStatus;
      });
  }, [users, query, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const viewUser = (u) => navigate(`/admin/users/${u.id}`);
  const editUser = (u) => navigate(`/admin/users/${u.id}/edit`);
  const disableUser = async (u) => {
    if (window.confirm(`Are you sure you want to disable ${u.name}?`)) {
      try {
        await updateUser(u.id, { ...u, status: "Disabled" });
        toast.success(`User ${u.name} disabled successfully`);
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to disable user");
      }
    }
  };
  const createUser = () => navigate("/admin/users/create");

  const handleExportCSV = () => {
    const data = filtered.map(u => ({
      "Name": u.name,
      "Email": u.email,
      "Role": u.role,
      "Batch": u.batchId ? getBatchName(u.batchId) : '-',
      "Status": u.status,
      "Last Login": u.lastLogin || '-'
    }));
    exportToCSV(data, "users_export");
  };

  const handleExportPDF = () => {
    const columns = ["Name", "Email", "Role", "Batch", "Status"];
    const data = filtered.map(u => ({
      "Name": u.name,
      "Email": u.email,
      "Role": u.role,
      "Batch": u.batchId ? getBatchName(u.batchId) : '-',
      "Status": u.status
    }));
    exportToPDF(data, columns, "User List", "users_export");
  };

  if (loading) return <div className="p-5 text-center">Loading Users...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold text-gradient">User Management</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm d-flex align-items-center" onClick={handleExportCSV}>
            <FaFileCsv className="me-2" /> Export CSV
          </button>
          <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={handleExportPDF}>
            <FaFilePdf className="me-2" /> Export PDF
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center" onClick={createUser}>
            <FaPlus className="me-2" /> Add User
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 bg-light p-3 rounded">
        <input
          className="form-control"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <select
          className="form-select"
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          className="form-select"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      <div className="card shadow-sm border-0">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map(u => (
              <tr key={u.id || u.email}>
                <td>
                  <div className="fw-medium">{u.name}</div>
                  <small className="text-muted">{u.email}</small>
                </td>
                <td><span className="badge bg-light text-dark border">{u.role}</span></td>
                <td>{u.batchId ? getBatchName(u.batchId) : '-'}</td>
                <td>
                  <span className={`badge ${u.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="text-muted small">{u.lastLogin || 'Never'}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary" onClick={() => viewUser(u)}>View</button>
                    <button className="btn btn-outline-success" onClick={() => editUser(u)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => disableUser(u)}>Disable</button>
                  </div>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr key="no-users">
                <td colSpan="6" className="text-center p-5">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">Showing {pageData.length} of {filtered.length} users</div>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >Prev</button>
          <button className="btn btn-sm btn-outline-secondary" disabled>
            {page} / {totalPages}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
