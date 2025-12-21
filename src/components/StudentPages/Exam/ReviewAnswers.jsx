const ReviewAnswers = ({ questions, answers, onSubmit }) => {
  return (
    <div>
      <h3>Review Answers</h3>
      {questions.map((q, i) => (
        <p key={i}>
          Q{i + 1}: {answers[i] || "Not Attempted"}
        </p>
      ))}

      <button onClick={onSubmit}>Final Submit</button>
    </div>
  );
};

export default ReviewAnswers;