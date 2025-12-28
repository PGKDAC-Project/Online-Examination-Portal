import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockExams } from './mockExams';
import { toast } from "react-toastify";

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const exam = mockExams.find(e => e.examId === examId);

  if (!exam) return <h3>Invalid Exam</h3>;

  const handleProceed = () => {
    if (password.trim() !== exam.password.trim()) {
      toast.warning("Incorrect exam password");
      return;
    }
    navigate(`/student/exams/${examId}/details`);
  };

  return (
    <div>
      <h2>{exam.title}</h2>

      <h4>General Instructions</h4>
      <ul>
        <li>No refresh</li>
        <li>Auto-submit on time expiry</li>
        <li>Fullscreen mandatory during exam</li>
      </ul>

      <h4>Instructor Instructions</h4>
      <p>{exam.instructions}</p>

      <input
        type="password"
        placeholder="Enter exam password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleProceed}>Proceed</button>
    </div>
  );
};

export default ExamInstructions;
