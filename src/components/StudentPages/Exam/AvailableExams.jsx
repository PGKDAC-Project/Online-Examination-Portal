import ExamCard from "./ExamCard";

const exams = [
  {
    examId: "EXAM001",
    title: "Data Structures Midterm",
    course: "CS101",
    startTime: "2025-03-20T10:00",
    endTime: "2025-03-20T12:00",
    duration: 120,
    totalQuestions: 50,
    totalMarks: 100,
    negativeMarking: "0.25 per wrong",
    passwordRequired: true,
    instructorInstructions: "Do not refresh the page.",
    rules: "No external resources allowed."
  }
];

const AvailableExams = () => {
  return (
    <div className="exam-grid">
      {exams.map(exam => (
        <ExamCard key={exam.examId} exam={exam} />
      ))}
    </div>
  );
};

export default AvailableExams;
