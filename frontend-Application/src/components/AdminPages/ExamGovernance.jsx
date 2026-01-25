import { useState, useEffect, useMemo } from 'react';
import { getAllExams } from '../../services/admin/examService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const ExamGovernance = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const matchesSearch = (e.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [exams, search, statusFilter]);

  const handleAction = (id, action) => {
    if (action === 'Logs') {
      navigate(`/admin/logs?examId=${encodeURIComponent(String(id))}`);
      return;
    }
    toast.info(`${action} feature coming soon for Exam ID: ${id}`);
  };

  const handleExportCSV = () => {
    const data = filteredExams.map(e => ({
      "Title": e.title,
      "Instructor": e.instructor || "N/A",
      "Status": e.status,
      "Time": e.scheduledTime,
      "Active Students": e.activeStudents || 0
    }));
    exportToCSV(data, "exam_list");
  };

  const handleExportPDF = () => {
    const columns = ["Title", "Instructor", "Status", "Time", "Active Students"];
    const data = filteredExams.map(e => ({
      "Title": e.title,
      "Instructor": e.instructor || "N/A",
      "Status": e.status,
      "Time": e.scheduledTime,
      "Active Students": e.activeStudents || 0
    }));
    exportToPDF(data, columns, "Exam Governance List", "exam_list");
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient">Exam Governance</h2>
          <p className="text-muted mb-0">Monitor ongoing exams and enforce policies.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm d-flex align-items-center" onClick={handleExportCSV}>
            <FaFileCsv className="me-2" /> Export CSV
          </button>
          <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={handleExportPDF}>
            <FaFilePdf className="me-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="card-custom p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span>
              <input
                className="form-control"
                placeholder="Search by Exam Title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-custom shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Exam Title</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Time</th>
                <th>Active Students</th>
                <th>Reports</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center p-4">Loading exams...</td></tr>
              ) : filteredExams.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-4">No exams found.</td></tr>
              ) : (
                filteredExams.map(exam => (
                  <tr key={exam.id}>
                    <td className="fw-medium">{exam.title}</td>
                    <td>{exam.instructor || "N/A"}</td>
                    <td>
                      <span className={`badge ${exam.status === 'Ongoing' ? 'bg-success' :
                          exam.status === 'Scheduled' ? 'bg-primary' :
                            exam.status === 'Completed' ? 'bg-secondary' : 'bg-danger'
                        }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td>{exam.scheduledTime}</td>
                    <td>{exam.activeStudents || 0}</td>
                    <td>
                      {(exam.malpracticeReports || 0) > 0 ? (
                        <span className="text-danger fw-bold">{exam.malpracticeReports} Flags</span>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        {exam.status === 'Ongoing' && (
                          <>
                            <button className="btn btn-sm btn-warning" onClick={() => handleAction(exam.id, 'Extend Time')}>
                              +15m
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleAction(exam.id, 'Cancel')}>
                              Stop
                            </button>
                          </>
                        )}
                        <button className="btn btn-sm btn-outline-dark" onClick={() => handleAction(exam.id, 'Logs')}>
                          Logs
                        </button>
                      </div>
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

export default ExamGovernance;
