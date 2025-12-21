import "./QuestionNavigator.css"
const QuestionNavigator = ({ questions, current, setCurrent, review }) => {
  return (
    <div className="question-nav">
      {questions.map((_, index) => (
        <button
          key={index}
          className={`
            nav-btn
            ${current === index ? "active" : ""}
            ${review.includes(index) ? "review" : ""}
          `}
          onClick={() => setCurrent(index)}
        >
          {index + 1}
        </button>
      ))}

      {/* Security warning */}
      <p className="security-warning">
        ⚠ Copy, Paste & Tab Switching are strictly monitored.
      </p>
    </div>
  );
};

export default QuestionNavigator;
