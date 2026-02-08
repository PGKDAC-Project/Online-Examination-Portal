import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useExamSecurity } from "./useExamSecurity";
import { useFullscreenEnforcement } from "./useFullscreenEnforcement";
import { startExam, getExamQuestions, submitExam as fetchSubmitExam, getAvailableExams } from "../../../services/student/studentService";
import ReviewAnswers from "./ReviewAnswers";
import "./AttemptExam.css";
import { toast } from "react-toastify";

const AttemptExam = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const examPassword = location.state?.examPassword;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examDuration, setExamDuration] = useState(60);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [timeLeft, setTimeLeft] = useState(examDuration * 60);
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
            const answer = answers[index];
            // Convert answer to JSON string
            if (typeof answer === 'object') {
                formattedAnswers[question.id] = JSON.stringify(answer);
            } else {
                formattedAnswers[question.id] = answer;
            }
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
        // First verify password
        await startExam(examId, examPassword);
        // Get exam details for duration
        const examDetails = await getAvailableExams();
        const exam = examDetails.find(e => e.id === parseInt(examId));
        if (exam && exam.duration) {
          setExamDuration(exam.duration);
          setTimeLeft(exam.duration * 60);
        }
        // Then fetch questions
        const qList = await getExamQuestions(examId);
        // Sanitize questions - convert any object options to arrays
        const sanitizedQuestions = qList.map(q => {
          if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
            // Convert object to array of values
            q.options = Object.values(q.options);
          }
          return q;
        });
        setQuestions(sanitizedQuestions);
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
    if (currentQuestion.type === "MULTIPLE_SELECT" || currentQuestion.type === "multiple") {
      const prev = answers[current] || [];
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];

      setAnswers((prevState) => ({ ...prevState, [current]: updated }));
    } else if (currentQuestion.type === "MATCHING") {
      // For matching, option is in format "leftItem:rightItem"
      setAnswers((prevState) => ({
        ...prevState,
        [current]: { ...(prevState[current] || {}), ...option }
      }));
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
            {currentQuestion.type === "MATCHING" ? (
              <div className="matching-question">
                <h5>Match the following:</h5>
                {currentQuestion.leftItems && Array.isArray(currentQuestion.leftItems) && currentQuestion.leftItems.length > 0 ? (
                  currentQuestion.leftItems.map((leftItem, idx) => (
                    <div key={idx} className="matching-row">
                      <span className="left-item">{leftItem}</span>
                      <select
                        value={answers[current]?.[leftItem] || ""}
                        onChange={(e) => handleAnswerChange({ [leftItem]: e.target.value })}
                      >
                        <option value="">Select match</option>
                        {currentQuestion.rightItems && currentQuestion.rightItems.map((rightItem, ridx) => (
                          <option key={ridx} value={rightItem}>{rightItem}</option>
                        ))}
                      </select>
                    </div>
                  ))
                ) : (
                  <p>Matching question data not available</p>
                )}
              </div>
            ) : currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((opt, optIdx) => (
                <label key={`${current}-${optIdx}`} className="exam-option">
                  <input
                    type={
                      currentQuestion.type === "MULTIPLE_SELECT" || currentQuestion.type === "multiple"
                        ? "checkbox"
                        : "radio"
                    }
                    name={`q-${current}`}
                    checked={
                      currentQuestion.type === "MULTIPLE_SELECT" || currentQuestion.type === "multiple"
                        ? answers[current]?.includes(opt)
                        : answers[current] === opt
                    }
                    onChange={() => handleAnswerChange(opt)}
                  />
                  <span style={{ marginLeft: '8px' }}>{opt}</span>
                </label>
              ))
            ) : (
              <p>No options available for this question</p>
            )}
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
