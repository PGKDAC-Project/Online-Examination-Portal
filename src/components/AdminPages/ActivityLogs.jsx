import { useMemo, useState } from "react";
import { mockLogs } from "./mockAdminData";
import { useLocation, useNavigate } from "react-router-dom";


const ActivityLogs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('All');
  const [action, setAction] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Time');

  const examIdParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("examId");
    return v ? String(v) : "";
  }, [location.search]);
 
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockLogs
      .filter(l => (role === 'All' || l.role === role))
      .filter(l => (action === 'All' || l.action === action))
      .filter(l => !q || l.user.toLowerCase().includes(q))
      .filter(l => !examIdParam || String(l.examId ?? "") === examIdParam);
  }, [role, action, query, examIdParam]);
 
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'Time') {
      return arr.sort((a, b) => a.time.localeCompare(b.time));
    }
    if (sort === 'Status') {
      return arr.sort((a, b) => a.status.localeCompare(b.status));
    }
    return arr;
  }, [filtered, sort]);
 
  return (
    <div>
      <h1>System Activity Logs</h1>

      {examIdParam && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <div>Filtered by Exam ID: <strong>{examIdParam}</strong></div>
          <button className="btn btn-sm btn-outline-dark" onClick={() => navigate("/admin/logs")}>Clear</button>
        </div>
      )}
 
      <div className="d-flex gap-2 mb-3">
        <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option>All</option>
          <option>Student</option>
          <option>Instructor</option>
          <option>Admin</option>
        </select>
        <select className="form-select" value={action} onChange={(e) => setAction(e.target.value)}>
          <option>All</option>
          <option>Login</option>
          <option>Logout</option>
          <option>Profile Update</option>
          <option>Tab Switch</option>
          <option>Exam Created</option>
          <option>User Created</option>
        </select>
        <input
          className="form-control"
          placeholder="Search by user"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Time</option>
          <option>Status</option>
        </select>
      </div>
 
      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Exam</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(log => (
            <tr key={log.id}>
              <td>{log.time}</td>
              <td>{log.user}</td>
              <td>{log.role}</td>
              <td>{log.action}</td>
              <td>{log.examId ?? '-'}</td>
              <td>
                <span className={`badge ${
                  log.status === 'Success' ? 'bg-success' : 
                  log.status === 'Violation' ? 'bg-danger' : 'bg-warning'
                }`}>
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">No logs found matching your criteria</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogs;
