import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./AdminLayout.css";
import { toast } from "react-toastify";
import { clearCurrentUser, getCurrentUser } from "../../../services/auth/authService";
import {
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCogs,
  FaBook,
  FaShieldAlt,
  FaBars,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaBullhorn
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const authUser = useMemo(() => {
    return getCurrentUser();
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Strict redirect using conditional rendering (prevents flash of content)
  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  const role = String(authUser.role ?? "").toLowerCase();
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    toast.dismiss();
    clearCurrentUser();
    navigate('/login');
  };

  return (
    <div className={`admin-wrapper ${theme} ${sidebarOpen ? "" : "collapsed"}`}>
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>

        <NavLink to="/admin/dashboard"><FaChartBar /> Overview</NavLink>
        <NavLink to="/admin/announcements"><FaBullhorn /> Announcements</NavLink>
        <NavLink to="/admin/batches"><FaClipboardList /> Batch Management</NavLink>
        <NavLink to="/admin/users"><FaUsers /> Users</NavLink>
        <NavLink to="/admin/logs"><FaClipboardList /> Activity Logs</NavLink>
        <NavLink to="/admin/exams"><FaShieldAlt /> Exams</NavLink>
        <NavLink to="/admin/courses"><FaBook /> Courses</NavLink>
        <NavLink to="/admin/analytics"><FaChartBar /> Analytics</NavLink>
        <NavLink to="/admin/settings"><FaCogs /> Settings</NavLink>

        <div className="admin-sidebar-footer mt-auto pt-3 border-top">
          <button className="sidebar-btn" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            {theme === 'light' ? ' Dark Mode' : ' Light Mode'}
          </button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-navbar">
          <button type="button" onClick={toggleSidebar} className="admin-hamburger" aria-label="Toggle sidebar">
            <FaBars />
          </button>
          <h3 className="admin-navbar-title">Welcome, {authUser?.name ?? "Admin"}</h3>
        </header>

        <section className="admin-content-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
