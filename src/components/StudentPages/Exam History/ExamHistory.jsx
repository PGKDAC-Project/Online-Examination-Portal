// src/components/StudentPages/ExamHistory.jsx
import { useNavigate } from "react-router";
import { mockExamHistory } from './mockExamHistory';
import "./ExamHistory.css";
const ExamHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="exam-history">
      <h2>📜 Exam History</h2>

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
          {mockExamHistory.map((exam) => (
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
                  className={`status ${
                    exam.status === "Completed" ? "completed" : "auto"
                  }`}
                >
                  {exam.status}
                </span>
              </td>

              <td>
                <span
                  className={`result ${
                    exam.result === "Pass"
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
    </div>
  );
};

export default ExamHistory;
