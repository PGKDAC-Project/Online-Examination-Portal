import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAvailableExams } from "../../../services/student/studentService";

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const exams = await getAvailableExams();
        const found = exams.find(e => String(e.id) === String(examId) || String(e.examId) === String(examId));
        setExam(found);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExam();
  }, [examId]);

  if (!exam) return <h3>Loading exam details...</h3>;
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
