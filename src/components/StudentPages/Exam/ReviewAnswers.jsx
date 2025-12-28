import React from 'react';
import './AttemptExam.css'; // Reusing exam styles

const ReviewAnswers = ({ questions, answers, onSubmit, onBack }) => {
  return (
    <div className="review-container container mt-4">
      <h2 className="mb-4 text-center">Review Your Answers</h2>
      <p className="text-center text-muted mb-5">
        Please review your answers before final submission. Once submitted, you cannot change them.
      </p>

      <div className="row">
        {questions.map((q, i) => {
           const userAnswer = answers[i];
           const isAnswered = userAnswer !== undefined && userAnswer !== null && (Array.isArray(userAnswer) ? userAnswer.length > 0 : true);
           
           return (
            <div key={i} className="col-12 mb-3">
              <div className={`card shadow-sm ${isAnswered ? 'border-success' : 'border-warning'}`}>
                <div className="card-header d-flex justify-content-between align-items-center bg-transparent">
                  <strong>Question {i + 1}</strong>
                  <span className={`badge ${isAnswered ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {isAnswered ? 'Answered' : 'Not Answered'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">{q.question}</p>
                  <p className="card-text text-muted">
                    <strong>Your Answer: </strong> 
                    {isAnswered 
                      ? (Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer) 
                      : <span className="text-danger">Not Attempted</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-between mt-5 mb-5">
        <button className="btn btn-secondary px-4" onClick={onBack}>
          &larr; Back to Exam
        </button>
        <button className="btn btn-primary px-4" onClick={onSubmit}>
          Confirm & Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ReviewAnswers;
