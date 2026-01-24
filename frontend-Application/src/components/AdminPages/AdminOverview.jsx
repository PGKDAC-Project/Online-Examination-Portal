import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaClipboardCheck, FaExclamationTriangle, FaChartLine, FaBook } from "react-icons/fa";
import { mockLogs, mockExams, mockUsers, mockCourses, mockBatches } from "./mockAdminData"; // Assuming mockBatches added
import { getAllBatches } from "../../services/admin/batchService";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeExams: 0,
    activeCourses: 0,
    activeBatches: 0,
    violationsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching
    setTimeout(async () => {
      const batches = await getAllBatches(); // Use service for batches as it might have local changes
      setStats({
        totalUsers: mockUsers.length,
        activeExams: mockExams.filter(e => e.status === "Ongoing" || e.status === "Scheduled").length,
        activeCourses: mockCourses.filter(c => c.status === "Active").length,
        activeBatches: batches.length, // approximation
        violationsToday: mockLogs.filter(l => l.status === "Violation" && l.time.includes("2025-12-28")).length // Mock date check
      });
      setLoading(false);
    }, 500);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <div className="col-md-3 col-sm-6">
      <Link to={link || "#"} className="text-decoration-none">
        <div className="card-custom p-4 h-100 hover-card">
          <div className="d-flex align-items-center">
            <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
              <Icon className={`fs-3 text-${color}`} />
            </div>
            <div>
              <h6 className="text-muted mb-1 text-uppercase small fw-bold">{title}</h6>
              <h3 className="fw-bold mb-0 text-dark">{loading ? "-" : value}</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient">Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, Admin</p>
        </div>
        <Link to="/admin/analytics" className="btn btn-primary-custom">
          <FaChartLine className="me-2" /> View Full Analytics
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <StatCard icon={FaUsers} title="Total Users" value={stats.totalUsers} color="primary" link="/admin/users" />
        <StatCard icon={FaClipboardCheck} title="Active Exams" value={stats.activeExams} color="success" link="/admin/exams" />
        <StatCard icon={FaBook} title="Active Courses" value={stats.activeCourses} color="info" link="/admin/courses" />
        <StatCard icon={FaExclamationTriangle} title="Violations (Today)" value={stats.violationsToday} color="danger" link="/admin/logs" />
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-custom p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Activity</h5>
              <Link to="/admin/logs" className="small text-primary">View All</Link>
            </div>
            <ul className="list-group list-group-flush">
              {mockLogs.slice(0, 5).map(log => (
                <li key={log.id} className="list-group-item px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className={`badge rounded-pill me-3 bg-${log.status === 'Success' ? 'light text-success border border-success' : 'light text-danger border border-danger'
                      }`}>
                      {log.action}
                    </span>
                    <div>
                      <h6 className="mb-0 fw-medium">{log.user}</h6>
                      <small className="text-muted">{log.role}</small>
                    </div>
                  </div>
                  <small className="text-muted">{log.time.split(' ')[1]}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-custom p-4 h-100 bg-primary text-white" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
            <h5 className="fw-bold mb-3 text-white">Quick Actions</h5>
            <div className="d-grid gap-3">
              <Link to="/admin/users/create" className="btn btn-light text-primary fw-medium text-start">
                <FaUsers className="me-2" /> Add New User
              </Link>
              <Link to="/admin/batches" className="btn btn-light text-primary fw-medium text-start">
                <FaBook className="me-2" /> Manage Batches
              </Link>
              <Link to="/admin/exams" className="btn btn-light text-primary fw-medium text-start">
                <FaClipboardCheck className="me-2" /> Monitor Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
