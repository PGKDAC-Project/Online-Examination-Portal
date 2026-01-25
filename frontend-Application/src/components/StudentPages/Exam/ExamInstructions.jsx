import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAvailableExams } from "../../../services/student/studentService";
import { toast } from "react-toastify";

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        const exams = await getAvailableExams();
        const foundExam = exams.find(e => e.examId === examId);

        if (!foundExam) {
          setError("Exam not found");
        } else {
          setExam(foundExam);
        }
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError("Failed to load exam details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  const handleProceed = () => {
    if (!exam) return;
    if (!password.trim()) {
      toast.warning("Please enter the exam password");
      return;
    }
    // Pass password to the attempt page which will send it to the backend
    navigate(`/student/exams/${examId}/attempt`, { state: { examPassword: password } });
  };

  if (loading) {
    return <div><h2>Loading exam instructions...</h2></div>;
  }

  if (error || !exam) {
    return <div><h3>{error || "Invalid Exam"}</h3></div>;
  }

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
