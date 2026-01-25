import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaBook, FaShieldAlt, FaChartLine, FaArrowRight, FaUsers } from "react-icons/fa";
import { getAllBatches } from "../../services/admin/batchService";
import { getAllUsers } from "../../services/admin/userService";
import { getAllCourses } from "../../services/admin/courseService";
import { getAllExams } from "../../services/admin/examService";
import { getSystemLogs } from "../../services/admin/adminService";
import { toast } from "react-toastify";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    activeBatches: 0,
    activeCourses: 0,
    totalExams: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [batchesRes, usersRes, coursesRes, examsRes, logsRes] = await Promise.allSettled([
        getAllBatches(),
        getAllUsers(),
        getAllCourses(),
        getAllExams(),
        getSystemLogs()
      ]);

      // Extract data safely
      const batches = batchesRes.status === 'fulfilled' && Array.isArray(batchesRes.value) ? batchesRes.value : [];
      const users = usersRes.status === 'fulfilled' && Array.isArray(usersRes.value) ? usersRes.value : [];
      const courses = coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) ? coursesRes.value : [];
      const exams = examsRes.status === 'fulfilled' && Array.isArray(examsRes.value) ? examsRes.value : [];
      const logs = logsRes.status === 'fulfilled' && Array.isArray(logsRes.value) ? logsRes.value : [];

      // Calculate Stats
      const students = users.filter(u => (u.role || "").toLowerCase() === "student").length;
      const instructors = users.filter(u => (u.role || "").toLowerCase() === "instructor").length;

      const today = new Date().toISOString().slice(0, 7); // YYYY-MM
      const activeBatches = batches.filter(b => b.endDate >= today).length;

      const activeCourses = courses.filter(c => c.status === "Active").length;
      const totalExams = exams.length;

      // Process Logs (Latest 5)
      // Assuming logs are returned; if not sorted by backend, sort here
      const sortedLogs = logs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setStats({
        totalStudents: students,
        totalInstructors: instructors,
        activeBatches,
        activeCourses,
        totalExams,
        recentActivity: sortedLogs
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, link, delay }) => (
    <div className="col-lg-2 col-md-4 col-sm-6">
      <Link to={link || "#"} className="text-decoration-none">
        <div className="card-custom p-3 h-100 hover-card border-0 shadow-sm" style={{ animationDelay: `${delay}ms` }}>
          <div className="text-center mb-3">
            <div className={`d-inline-flex align-items-center justify-content-center rounded-circle p-3 bg-${color} bg-opacity-10`}>
              <Icon className={`fs-4 text-${color}`} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="fw-bold mb-1 text-dark">{loading ? "-" : value}</h3>
            <h6 className="text-muted mb-0 small text-uppercase fw-bold">{title}</h6>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-gradient">Admin Dashboard</h2>
          <p className="text-muted mb-0">Overview of system performance and activities</p>
        </div>
        <Link to="/admin/analytics" className="btn btn-primary-custom shadow-sm">
          <FaChartLine className="me-2" /> View Full Analytics
        </Link>
      </div>

      {/* Stats Row - 5 Columns */}
      <div className="row g-4 mb-5 justify-content-center">
        <StatCard icon={FaUserGraduate} title="Total Students" value={stats.totalStudents} color="primary" link="/admin/users?role=student" delay={0} />
        <StatCard icon={FaChalkboardTeacher} title="Total Instructors" value={stats.totalInstructors} color="info" link="/admin/users?role=instructor" delay={100} />
        <StatCard icon={FaClipboardList} title="Active Batches" value={stats.activeBatches} color="success" link="/admin/batches" delay={200} />
        <StatCard icon={FaBook} title="Active Courses" value={stats.activeCourses} color="warning" link="/admin/courses" delay={300} />
        <StatCard icon={FaShieldAlt} title="Total Exams" value={stats.totalExams} color="danger" link="/admin/exams" delay={400} />
      </div>

      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-lg-8">
          <div className="card-custom p-4 h-100 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Activities</h5>
              <Link to="/admin/logs" className="btn btn-sm btn-light text-primary fw-medium">
                View All <FaArrowRight className="ms-1" size={12} />
              </Link>
            </div>
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-5 text-muted">No recent activities found.</div>
            ) : (
              <div className="list-group list-group-flush">
                {stats.recentActivity.map((log, idx) => (
                  <div key={log.id || idx} className="list-group-item px-0 py-3 border-bottom d-flex align-items-center">
                    <div className={`me-3 rounded-circle p-2 bg-${log.status === 'Success' ? 'success' : 'danger'} bg-opacity-10`}>
                      <div className={`rounded-circle bg-${log.status === 'Success' ? 'success' : 'danger'}`} style={{ width: '8px', height: '8px' }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 fw-medium text-dark">{log.action}</h6>
                        <small className="text-muted">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">by <span className="fw-medium text-secondary">{log.user || "System"}</span> ({log.role})</small>
                        <small className="text-muted">{new Date(log.time).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card-custom p-4 h-100 bg-primary text-white border-0 shadow" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <h5 className="fw-bold mb-4 text-white">Quick Actions</h5>
            <div className="d-grid gap-3">
              <Link to="/admin/users/create" className="btn btn-light text-primary fw-bold text-start p-3 shadow-sm action-btn">
                <FaUsers className="me-2" /> Add New User
              </Link>
              <Link to="/admin/batches" className="btn btn-light text-primary fw-bold text-start p-3 shadow-sm action-btn">
                <FaClipboardList className="me-2" /> Manage Batches
              </Link>
              <Link to="/admin/courses" className="btn btn-light text-primary fw-bold text-start p-3 shadow-sm action-btn">
                <FaBook className="me-2" /> Add New Course
              </Link>
              <Link to="/admin/exams" className="btn btn-light text-primary fw-bold text-start p-3 shadow-sm action-btn">
                <FaShieldAlt className="me-2" /> Monitor Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
