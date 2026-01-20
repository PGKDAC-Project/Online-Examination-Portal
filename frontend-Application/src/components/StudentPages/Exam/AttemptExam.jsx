import { useEffect, useState, useCallback, useRef } from "react";
import { useExamSecurity } from "./useExamSecurity";
import { useFullscreenEnforcement } from "./useFullscreenEnforcement";
import { mockQuestionBank } from "./mockQuestionBank";
import ReviewAnswers from "./ReviewAnswers";
import "./AttemptExam.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AttemptExam = ({ duration = 60 }) => {
  const questions = mockQuestionBank;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isReviewing, setIsReviewing] = useState(false);

  /* ================= SUBMIT LOGIC ================= */
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  const submitExam = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    toast.success("Exam submitted");
    navigate("/student/exams");
  }, [navigate]);

  const handleReviewSubmit = () => {
    setIsReviewing(true);
  };

  const autoSubmit = useCallback(() => {
    toast.warning("Exam auto-submitted due to violations");
    submitExam();
  }, [submitExam]);

  /* ================= SECURITY HOOKS ================= */

  const { violations } = useExamSecurity(autoSubmit);
  useFullscreenEnforcement(autoSubmit);

  
  /* ================= TIMER ================= */

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitExam]);

  /* ================= BLOCK ESC / F11 ================= */

  useEffect(() => {
    const blockKeys = (e) => {
      if (e.key === "Escape" || e.key === "F11") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

  /* ================= GUARD ================= */

  if (!questions.length) {
    return <h3>No questions available</h3>;
  }

  /* ================= REVIEW MODE ================= */
  if (isReviewing) {
    return (
        <ReviewAnswers 
            questions={questions} 
            answers={answers} 
            onSubmit={submitExam} 
            onBack={(index) => {
                if (typeof index === 'number') {
                    setCurrent(index);
                }
                setIsReviewing(false);
            }} 
        />
    );
  }

  const currentQuestion = questions[current];

  if (!currentQuestion) {
      return <div>Error: Question not found</div>;
  }

  /* ================= ANSWER HANDLING ================= */

  const handleAnswerChange = (option) => {
    if (currentQuestion.type === "multiple") {
      const prev = answers[current] || [];
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];

      setAnswers((prevState) => ({ ...prevState, [current]: updated }));
    } else {
      setAnswers((prevState) => ({ ...prevState, [current]: option }));
    }
  };

  const clearCurrentAnswer = () => {
    setAnswers((prevState) => {
      const next = { ...prevState };
      delete next[current];
      return next;
    });
  };

  /* ================Time Format===============*/
  const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
};


  /* ================= RENDER ================= */

return (
  <div className="exam-root">

    {/* TOP BAR */}
    <header className="exam-topbar">
      <div className="exam-title">
        <strong>DSA</strong>
        <span>Quiz</span>
      </div>

      <div className="exam-timer">
        <span>⏱ Time Left: {formatTime(timeLeft)}</span>
      </div>
      <div className="exam-violations">
        <span>⚠ Violations: {violations}</span>
      </div>
    </header>

    {/* MAIN CONTENT */}
    <div className="exam-main">

      {/* QUESTION AREA */}
      <section className="exam-question">
        <h4>Question {current + 1}</h4>
        <p>{currentQuestion.question}</p>

        <div className="exam-options">
          {currentQuestion.options.map((opt) => (
            <label key={opt} className="exam-option">
              <input
                type={
                  currentQuestion.type === "multiple"
                    ? "checkbox"
                    : "radio"
                }
                name={`q-${current}`}
                checked={
                  currentQuestion.type === "multiple"
                    ? answers[current]?.includes(opt)
                    : answers[current] === opt
                }
                onChange={() => handleAnswerChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </section>

      {/* RIGHT PANEL */}
      <aside className="exam-sidebar">
        <h5>Questions</h5>

        <div className="question-palette">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isReview = review.includes(idx);

            let cls = "palette-btn";
            if (isReview) cls += " review";
            else if (isAnswered) cls += " answered";
            else if (idx === current) cls += " active";

            return (
              <button
                key={idx}
                className={cls}
                onClick={() => setCurrent(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* LEGEND */}
        <div className="palette-legend">
          <div><span className="answered"></span> Answered</div>
          <div><span className="review"></span> Review</div>
          <div><span className="notvisited"></span> Not Visited</div>
        </div>
      </aside>
    </div>

    {/* FOOTER */}
    <footer className="exam-footer">
      <button onClick={clearCurrentAnswer}>
        Clear Answer
      </button>

      <button
        onClick={() =>
          setReview((prev) => (prev.includes(current) ? prev.filter((i) => i !== current) : [...prev, current]))
        }
      >
        {review.includes(current) ? "Unmark Review" : "Review Later"}
      </button>

      <button 
        onClick={() => setCurrent((c) => (c < questions.length - 1 ? c + 1 : c))}
        disabled={current === questions.length - 1}
        className={current === questions.length - 1 ? "disabled-btn" : ""}
      >
        Save & Next
      </button>

      <button className="submit" onClick={handleReviewSubmit}>
        Submit Exam
      </button>
    </footer>
  </div>
);

};

export default AttemptExam;
