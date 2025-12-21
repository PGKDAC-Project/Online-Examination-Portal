import { useNavigate } from "react-router";

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();

  const now = new Date();
  const start = new Date(exam.startTime);
  const end = new Date(exam.endTime);

  //just for testing purpose commented
  const canStart = true;// now >= start && now <= end;

  return (
    <div className="exam-card">
      <h5>{exam.title}</h5>
      <p>{exam.course}</p>

      <ul>
        <li>Duration: {exam.duration} mins</li>
        <li>Total Questions: {exam.totalQuestions}</li>
        <li>Total Marks: {exam.totalMarks}</li>
        <li>Negative Marking: {exam.negativeMarking || "No"}</li>
      </ul>

      <button
        disabled={!canStart}
        onClick={() => navigate(`/student/exams/${exam.examId}/instructions`)}
      >
        Attempt Exam
      </button>
    </div>
  );
};

export default ExamCard;
