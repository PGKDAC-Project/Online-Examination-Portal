import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useExamSecurity } from "./useExamSecurity";
import { useFullscreenEnforcement } from "./useFullscreenEnforcement";
import { startExam as fetchExamQuestions, submitExam as fetchSubmitExam } from "../../../services/student/studentService";
import ReviewAnswers from "./ReviewAnswers";
import "./AttemptExam.css";
import { toast } from "react-toastify";

const AttemptExam = ({ duration = 60 }) => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const examPassword = location.state?.examPassword;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isReviewing, setIsReviewing] = useState(false);

  /* ================= SUBMIT LOGIC ================= */
  const submittedRef = useRef(false);

  const submitExam = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const formattedAnswers = {};
    Object.keys(answers).forEach(index => {
        const question = questions[index];
        if (question) {
            // For multiple choice, join array with comma or send as is? 
            // Backend expects String (JSON). studentService sends Object.
            // Backend converts Object value to String.
            // If it's an array (multiple choice), toString() will be "a,b".
            // That works for now.
            formattedAnswers[question.id] = answers[index];
        }
    });

    try {
        await fetchSubmitExam(examId, formattedAnswers);
        toast.success("Exam submitted");
        navigate("/student/exams");
    } catch (err) {
        console.error("Submission failed", err);
        toast.error("Failed to submit exam. Please contact admin.");
        // Should we allow retry? submittedRef is true now.
        // Maybe set submittedRef back to false if error?
        submittedRef.current = false; 
    }
  }, [navigate, answers, questions, examId]);

  const autoSubmit = useCallback(() => {
    toast.warning("Exam auto-submitted due to violations");
    submitExam();
  }, [submitExam]);

  /* ================= SECURITY HOOKS ================= */
  const { violations } = useExamSecurity(examId, autoSubmit);
  useFullscreenEnforcement(examId, autoSubmit);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (loading || isReviewing || timeLeft <= 0) {
      if (!loading && !isReviewing && timeLeft <= 0) {
        submitExam();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitExam, loading, isReviewing]);

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

  /* ================= FULLSCREEN BLOCKER STATE ================= */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [strictMode, setStrictMode] = useState(false);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    setStrictMode(!!settings.fullscreenEnforcement);

    const checkFull = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', checkFull);
    checkFull();

    return () => document.removeEventListener('fullscreenchange', checkFull);
  }, []);

  /* ================= LOAD QUESTIONS ================= */
  useEffect(() => {
    if (!examPassword) {
      toast.error("Access denied. Please enter exam password.");
      navigate(`/student/exams/${examId}/instructions`);
      return;
    }

    const loadQuestions = async () => {
      try {
        const response = await fetchExamQuestions(examId, examPassword);
        const qList = Array.isArray(response) ? response : (response.questions || []);
        setQuestions(qList);
      } catch (err) {
        toast.error("Failed to start exam. " + err.message);
        navigate("/student/exams");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [examId, examPassword, navigate]);

  const handleReviewSubmit = () => {
    setIsReviewing(true);
  };

  const requestFullScreen = () => {
    document.documentElement.requestFullscreen().catch(err => {
      toast.error("Could not enter fullscreen mode: " + err.message);
    });
  };

  if (loading) return <div className="p-5 text-center">Loading exam questions...</div>;

  if (!questions.length) {
    return <h3>No questions available</h3>;
  }

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

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (strictMode && !isFullscreen && !submittedRef.current) {
    return (
      <div className="exam-fullscreen-blocker p-5 text-center mt-5">
        <div className="card shadow-lg p-5 border-danger mx-auto" style={{ maxWidth: '600px' }}>
          <h1 className="text-danger mb-4">⚠ Security Violation</h1>
          <h3 className="mb-4">Fullscreen Mode Required</h3>
          <p className="lead mb-5">
            The admin has enabled strict proctoring for this exam.
            You cannot proceed unless you are in **Full Screen** mode.
          </p>
          <p className="text-muted mb-4">
            Violations Recorded: <strong>{violations}</strong> / 3
            <br />
            Exceeding limit will auto-submit your exam.
          </p>
          <button className="btn btn-danger btn-lg px-5 py-3 fw-bold" onClick={requestFullScreen}>
            ENABLE FULLSCREEN TO CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-root">
      <header className="exam-topbar">
        <div className="exam-title">
          <strong>Exam Portal</strong>
          <span>Attempt Exam</span>
        </div>

        <div className="exam-timer">
          <span>⏱ Time Left: {formatTime(timeLeft)}</span>
        </div>
        <div className="exam-violations">
          <span>⚠ Violations: {violations}</span>
        </div>
      </header>

      <div className="exam-main">
        <section className="exam-question">
          <h4>Question {current + 1}</h4>
          <p>{currentQuestion.questionText || currentQuestion.question}</p>

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
          <div className="palette-legend">
            <div><span className="answered"></span> Answered</div>
            <div><span className="review"></span> Review</div>
            <div><span className="notvisited"></span> Not Visited</div>
          </div>
        </aside>
      </div>

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
