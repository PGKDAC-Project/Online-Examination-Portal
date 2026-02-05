import React from 'react';
import { useNavigate } from "react-router-dom";
import "./InstructorOverview.css";

const InstructorOverview = () => {
  const navigate = useNavigate();

  // Mock dashboard stats (later replace with API)
  const stats = {
    courses: 4,
    totalExams: 12,
    upcomingExams: 2,
    liveExams: 1,
    pendingEvaluation: 3,
    totalQuestions: 420,
    avgScore: "68%",
    passRate: "72%"
  };

  return (
    <div className="instructor-overview">

      {/* ===== Header ===== */}
      <h2 className="overview-title">Instructor Dashboard</h2>
      <p className="overview-subtitle">
        Overview of courses, exams, evaluations, and student performance
      </p>

      {/* ===== KPI CARDS ===== */}
      <div className="overview-grid">

        <div className="overview-card" onClick={() => navigate("/instructor/courses")}>
          <h4>📘 Courses</h4>
          <p>{stats.courses} Assigned</p>
          <span>Manage Courses</span>
        </div>

        <div className="overview-card" onClick={() => navigate("/instructor/exams")}>
          <h4>📝 Exams</h4>
          <p>{stats.totalExams} Created</p>
          <span>Exam Management</span>
        </div>

        <div className="overview-card highlight" onClick={() => navigate("/instructor/live-exams")}>
          <h4>🔴 Live Exams</h4>
          <p>{stats.liveExams} Ongoing</p>
          <span>Monitor Now</span>
        </div>

        <div className="overview-card" onClick={() => navigate("/instructor/question-bank")}>
          <h4>📚 Question Bank</h4>
          <p>{stats.totalQuestions} Questions</p>
          <span>Manage Questions</span>
        </div>

      </div>

      {/* ===== SECOND ROW ===== */}
      <div className="overview-grid">

        <div className="overview-card" onClick={() => navigate("/instructor/results")}>
          <h4>🧮 Result Evaluation</h4>
          <p>{stats.pendingEvaluation} Pending</p>
          <span>Evaluate Results</span>
        </div>

        <div className="overview-card" onClick={() => navigate("/instructor/analytics")}>
          <h4>📊 Performance</h4>
          <p>Avg Score: {stats.avgScore}</p>
          <span>View Analytics</span>
        </div>

        <div className="overview-card" onClick={() => navigate("/instructor/exam-history")}>
          <h4>📜 Exam History</h4>
          <p>Past Exams</p>
          <span>View History</span>
        </div>

        <div className="overview-card" onClick={() => navigate("/instructor/profile")}>
          <h4>⚙ Profile</h4>
          <p>Settings</p>
          <span>Edit Profile</span>
        </div>

      </div>

      {/* ===== ANNOUNCEMENTS SECTION ===== */}
      <div className="mt-4">
        <h3 className="mb-3">📢 Admin Announcements</h3>
        <InstructorAnnouncements />
      </div>

    </div>
  );
};

const InstructorAnnouncements = () => {
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    import("../../services/common/announcementService").then(service => {
      service.getAllAnnouncements().then(data => {
        if (Array.isArray(data)) {
          const today = new Date().toISOString().split('T')[0];
          // Admin announcements (Role=All or Role=Instructor)
          const relevant = data.filter(a =>
            (a.targetRole?.toLowerCase() === 'all' || a.targetRole?.toLowerCase() === 'instructor') &&
            (!a.expiryDate || a.expiryDate >= today)
          );
          setList(relevant);
        }
      }).catch(err => console.error(err));
    });
  }, []);

  if (list.length === 0) return <p className="text-muted">No active announcements.</p>;

  return (
    <div className="row g-3">
      {list.map(anno => (
        <div key={anno.id} className="col-md-6">
          <div className="card shadow-sm border-start border-4 border-primary">
            <div className="card-body">
              <h5 className="card-title">{anno.title}</h5>
              <p className="card-text text-secondary">{anno.description}</p>
              <small className="text-muted">Target: {anno.targetRole}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstructorOverview;
