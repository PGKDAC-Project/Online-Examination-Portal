const ExamResult = ({ score, total, violations, fullscreenViolations = 0, autoSubmitted }) => {
  return (
    <div className="exam-result">
      <h2>Exam Result</h2>

      <p>Score: {score} / {total}</p>

      <p>
        Violations Recorded: 
        <strong> {violations}</strong>
      </p>
      <p>
        Fullscreen Violations:
        <strong> {fullscreenViolations}</strong>
      </p>
      {autoSubmitted && (
        <p className="warning">
          ⚠ Exam was auto-submitted due to rule violations.
        </p>
      )}

      <button onClick={() => window.location.href = "/student/exams"}>
        Back to Available Exams
      </button>
    </div>
  );
};

export default ExamResult;
