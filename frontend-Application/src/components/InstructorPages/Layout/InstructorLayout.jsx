import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCurrentUser, getCurrentUser } from "../../../services/auth/authService";
import {
  FaBars,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaChartBar,
  FaBook,
  FaPlus,
  FaUsers,
  FaClipboardCheck,
  FaHistory,
  FaUserCog,
  FaClipboardList,
  FaBullhorn,
} from "react-icons/fa";

import { useInstructorLayout } from "../../../contexts/InstructorLayoutContext";
import "./InstructorLayout.css";

const InstructorLayout = () => {
  const { sidebarOpen, toggleSidebar, theme, changeTheme } = useInstructorLayout();
  const navigate = useNavigate();

  const authUser = useMemo(() => {
    return getCurrentUser();
  }, []);

  // Strict redirect
  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  const role = String(authUser.role ?? "").toLowerCase();
  if (role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    toast.dismiss();
    clearCurrentUser();
    navigate('/login');
  };

  return (
    <div className={`instructor-wrapper ${theme} ${sidebarOpen ? "" : "collapsed"}`}>

      {/* SIDEBAR */}
      <aside className="instructor-sidebar">
        <h2>Instructor Panel</h2>

        <nav>
          <NavLink to="/instructor/home"><FaChartBar /> Overview</NavLink>
          <NavLink to="/instructor/announcements"><FaBullhorn /> Announcements</NavLink>
          <NavLink to="/instructor/courses"><FaBook /> Manage Courses</NavLink>
          <NavLink to="/instructor/exams"><FaPlus /> Exam Management</NavLink>
          <NavLink to="/instructor/live-exams"><FaUsers /> Live Monitoring</NavLink>
          <NavLink to="/instructor/results"><FaClipboardCheck /> Result Evaluation</NavLink>
          <NavLink to="/instructor/question-bank"><FaClipboardList /> Question Bank</NavLink>
          <NavLink to="/instructor/exam-history"><FaHistory /> Exam History</NavLink>
          <NavLink to="/instructor/profile"><FaUserCog /> Profile</NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="theme-btn"
            onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
            {theme === "light" ? " Dark Mode" : " Light Mode"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="instructor-main">
        <header className="instructor-navbar">
          <button onClick={toggleSidebar} className="hamburger">
            <FaBars />
          </button>
          <h3>Welcome, {authUser?.name ?? "Instructor"}</h3>
        </header>

        <section className="instructor-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default InstructorLayout;
