// src/components/StudentPages/ExamHistory.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExamHistory } from "../../../services/student/studentService";
import "./ExamHistory.css";

const ExamHistory = () => {
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        setLoading(true);
        const data = await getExamHistory();
        setExamHistory(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching exam history:", err);
        setError("Failed to load exam history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, []);

  if (loading) {
    return <div className="exam-history"><h2>📜 Exam History</h2><p>Loading exam history...</p></div>;
  }

  if (error) {
    return <div className="exam-history"><h2>📜 Exam History</h2><p className="error">{error}</p></div>;
  }

  return (
    <div className="exam-history">
      <h2>📜 Exam History</h2>

      {examHistory.length === 0 ? (
        <p>No exam history found.</p>
      ) : (
        <table className="exam-history-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Course</th>
              <th>Date</th>
              <th>Score</th>
              <th>Status</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {examHistory.map((exam) => (
              <tr key={exam.examId}>
                <td align="justify">{exam.examName}</td>
                <td>{exam.courseCode}</td>
                <td>{exam.attemptedOn}</td>

                <td>
                  {exam.score !== null
                    ? `${exam.score}/${exam.totalMarks}`
                    : "--"}
                </td>

                <td>
                  <span
                    className={`status ${exam.status === "Completed" ? "completed" : "auto"
                      }`}
                  >
                    {exam.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`result ${exam.result === "Pass"
                      ? "pass"
                      : exam.result === "Fail"
                        ? "fail"
                        : "pending"
                      }`}
                  >
                    {exam.result}
                  </span>
                </td>

                <td>
                  {exam.resultEnabled ? (
                    <button
                      onClick={() =>
                        navigate(`/student/exams/${exam.examId}/result`)
                      }
                    >
                      View Result
                    </button>
                  ) : (
                    <span className="muted">Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamHistory;
