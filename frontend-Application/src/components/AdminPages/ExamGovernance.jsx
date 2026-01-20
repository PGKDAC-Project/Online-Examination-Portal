import { useState } from 'react';
import { mockExams } from './mockAdminData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ExamGovernance = () => {
  const [exams, setExams] = useState(mockExams);
  const navigate = useNavigate();

  const handleAction = (id, action) => {
    if (action === 'Logs') {
      navigate(`/admin/logs?examId=${encodeURIComponent(String(id))}`);
      return;
    }
    toast.info(`${action} for Exam ID: ${id}`);
    if (action === 'Cancel') {
      setExams(exams.map(e => e.id === id ? { ...e, status: 'Cancelled' } : e));
    }
  };

  return (
    <div>
      <h1>Exam Governance</h1>
      <p>Monitor ongoing exams and enforce policies.</p>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
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
            {exams.map(exam => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.instructor}</td>
                <td>
                  <span className={`badge ${
                    exam.status === 'Ongoing' ? 'bg-success' :
                    exam.status === 'Scheduled' ? 'bg-primary' :
                    exam.status === 'Completed' ? 'bg-secondary' : 'bg-danger'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td>{exam.scheduledTime}</td>
                <td>{exam.activeStudents}</td>
                <td>
                  {exam.malpracticeReports > 0 ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamGovernance;
