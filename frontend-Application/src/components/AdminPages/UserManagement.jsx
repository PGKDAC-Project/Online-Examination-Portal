import { useMemo, useState } from 'react';
import { mockUsers } from './mockAdminData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
 
  const filtered = useMemo(() => {
    return mockUsers
      .filter(u => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || u.name.toLowerCase().includes(q);
        const matchesRole = role === 'All' || u.role === role;
        const matchesStatus = status === 'All' || u.status === status;
        return matchesQuery && matchesRole && matchesStatus;
      });
  }, [query, role, status]);
 
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
 
  const viewUser = (u) => navigate(`/admin/users/${u.id}`);
  const editUser = (u) => navigate(`/admin/users/${u.id}/edit`);
  const disableUser = (u) => toast.warn(`Disabled ${u.name}`);
  const createUser = () => navigate("/admin/users/create");
 
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={createUser}>
          + Add User
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search by name"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <select
          className="form-select"
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
        >
          <option>All</option>
          <option>Student</option>
          <option>Instructor</option>
          <option>Admin</option>
        </select>
        <select
          className="form-select"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option>All</option>
          <option>Active</option>
          <option>Disabled</option>
        </select>
      </div>
 
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
 
        <tbody>
          {pageData.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>{u.lastLogin}</td>
              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => viewUser(u)}>View</button>
                <button className="btn btn-sm btn-outline-success" onClick={() => editUser(u)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => disableUser(u)}>Disable</button>
              </td>
            </tr>
          ))}
          {pageData.length === 0 && (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
 
      <div className="d-flex justify-content-between align-items-center">
        <div>Showing {pageData.length} of {filtered.length}</div>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >Prev</button>
          <span className="btn btn-sm btn-light">{page} / {totalPages}</span>
          <button
            className="btn btn-sm btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
