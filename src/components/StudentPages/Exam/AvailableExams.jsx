import ExamCard from "./ExamCard";

const exams = [
  {
    examId: "EXAM001",
    title: "Data Structures Midterm",
    course: "CS101",
    startTime: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), // Started 1 hour ago
    endTime: new Date(new Date().setHours(new Date().getHours() + 48)).toISOString(),   // Ends in 48 hours
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
