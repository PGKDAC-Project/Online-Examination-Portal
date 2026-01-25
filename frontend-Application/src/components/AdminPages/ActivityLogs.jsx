import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";
import { exportToCSV, exportToPDF } from "../../utils/exportUtils";
import { getSystemLogs } from "../../services/admin/adminService";
import { toast } from "react-toastify";

const ActivityLogs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [role, setRole] = useState('All');
  const [action, setAction] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Time');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getSystemLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const examIdParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("examId");
    return v ? String(v) : "";
  }, [location.search]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs
      .filter(l => (role === 'All' || l.role === role))
      .filter(l => (action === 'All' || l.action === action))
      .filter(l => !q || (l.user && l.user.toLowerCase().includes(q)))
      .filter(l => !examIdParam || String(l.examId ?? "") === examIdParam);
  }, [logs, role, action, query, examIdParam]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'Time') {
      return arr.sort((a, b) => new Date(b.time) - new Date(a.time)); // Default desc time
    }
    if (sort === 'Status') {
      return arr.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }
    if (sort === 'Service') {
      return arr.sort((a, b) => (a.serviceName || "").localeCompare(b.serviceName || ""));
    }
    return arr;
  }, [filtered, sort]);

  const handleExportCSV = () => {
    const data = sorted.map(log => ({
      "Time": log.time,
      "User": log.user,
      "Role": log.role,
      "Action": log.action,
      "Exam ID": log.examId || '-',
      "Status": log.status,
      "Service Name": log.serviceName || '-'
    }));
    exportToCSV(data, `admin_logs_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    const columns = ["Time", "User", "Role", "Action", "Status", "Service Name"];
    const data = sorted.map(log => ({
      "Time": log.time,
      "User": log.user,
      "Role": log.role,
      "Action": log.action,
      "Status": log.status,
      "Service Name": log.serviceName || '-'
    }));
    exportToPDF(data, columns, "System Activity Logs", `admin_logs_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient mb-0">System Activity Logs</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm d-flex align-items-center" onClick={handleExportCSV} disabled={sorted.length === 0}>
            <FaFileCsv className="me-2" /> Export CSV
          </button>
          <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={handleExportPDF} disabled={sorted.length === 0}>
            <FaFilePdf className="me-2" /> Export PDF
          </button>
        </div>
      </div>

      {examIdParam && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <div>Filtered by Exam ID: <strong>{examIdParam}</strong></div>
          <button className="btn btn-sm btn-outline-dark" onClick={() => navigate("/admin/logs")}>Clear</button>
        </div>
      )}

      <div className="card-custom p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="All">All Actions</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Profile Update">Profile Update</option>
              <option value="Tab Switch">Tab Switch</option>
              <option value="Exam Created">Exam Created</option>
              <option value="User Created">User Created</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search by user..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="Time">Sort by Time</option>
              <option value="Status">Sort by Status</option>
              <option value="Service">Sort by Service</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-custom p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Service Name</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center p-5">Loading logs...</td></tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted p-5">No logs found matching your criteria</td>
                </tr>
              ) : (
                sorted.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted small">
                      {new Date(log.time).toLocaleString()}
                    </td>
                    <td className="fw-medium">{log.user}</td>
                    <td><span className="badge bg-light text-dark border">{log.role}</span></td>
                    <td>{log.action}</td>
                    <td className="text-muted">{log.serviceName || '-'}</td>
                    <td>
                      <span className={`badge ${log.status === 'Success' ? 'bg-success' :
                        log.status === 'Violation' ? 'bg-danger' : 'bg-warning'
                        }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
