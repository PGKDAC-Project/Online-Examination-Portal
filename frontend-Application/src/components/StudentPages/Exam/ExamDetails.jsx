import { useParams, useNavigate } from "react-router-dom";
import { mockExams } from './mockExams';

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = mockExams.find(e => e.examId === examId);
  if (!exam) return <h3>Invalid Exam</h3>;
    const startExam = () => {
    navigate(`/student/exams/${exam.examId}/attempt`);
    };
//   const startExam = () => {
//   document.documentElement.requestFullscreen()
//     .then(() => {
//       navigate(`/student/exams/${exam.examId}/attempt`);
//     })
//     .catch(() => {
//       alert("Fullscreen permission is required to start the exam.");
//     });
// };



  return (
    <div style={{ pointerEvents: "auto" }}>
      <h2>{exam.title}</h2>

      <ul>
        <li>Duration: {exam.duration} mins</li>
        <li>Total Questions: {exam.totalQuestions}</li>
      </ul>

      <button
        type="button"
        onClick={startExam}
        style={{
          zIndex: 9999,
          pointerEvents: "auto",
          cursor: "pointer"
        }}
      >
        Start Exam
      </button>
    </div>
  );
};

export default ExamDetails;
