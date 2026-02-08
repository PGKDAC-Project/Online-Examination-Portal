// src/components/StudentPages/ExamResult.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../services/axios/axiosClient";
import "./ExamResult.css";

const StudentExamResult = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await axiosClient.get(`/results/${resultId}`);
        setResult(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching exam result:", err);
        setError("Failed to load exam result. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return <div className="exam-result"><h2>📊 Exam Result</h2><p>Loading result...</p></div>;
  }

  if (error) {
    return <div className="exam-result"><h2>📊 Exam Result</h2><p className="error">{error}</p></div>;
  }

  if (!result) {
    return <h3>Result not found</h3>;
  }

  if (!result.resultPublished) {
    return <h3>📢 Result has not been published yet.</h3>;
  }

  return (
    <div className="exam-result">
      <h2>📊 Exam Result</h2>
      <h4>{result.examName}</h4>

      {/* Score Summary */}
      <div className="result-summary">
        <div>✅ Correct: {result.correct}</div>
        <div>❌ Wrong: {result.wrong}</div>
        <div>⚪ Un-attempted: {result.unattempted}</div>
      </div>

      {/* Marks */}
      <div className="result-marks">
        <p>
          <strong>Total Score:</strong> {result.score} / {result.totalMarks}
        </p>
        <p>
          <strong>Percentage:</strong> {result.percentage}%
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              result.status === "Pass" ? "pass-status" : "fail-status"
            }
          >
            {result.status}
          </span>
        </p>

        {result.rank && (
          <p>
            <strong>Rank:</strong> {result.rank}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentExamResult;
