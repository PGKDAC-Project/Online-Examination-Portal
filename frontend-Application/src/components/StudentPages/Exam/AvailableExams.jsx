import { useEffect, useState } from "react";
import { getAvailableExams } from "../../../services/student/studentService";
import ExamCard from "./ExamCard";
import { toast } from "react-toastify";

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await getAvailableExams();
      const formatted = data.map(e => ({
        examId: e.id,
        title: e.examTitle,
        course: e.course ? `${e.course.courseCode} - ${e.course.title}` : "Unknown Course",
        startTime: combineDateTime(e.scheduledDate, e.startTime),
        endTime: combineDateTime(e.scheduledDate, e.endTime),
        duration: e.duration,
        totalQuestions: e.examQuestions ? e.examQuestions.length : 'N/A',
        totalMarks: e.totalMarks,
        negativeMarking: "No",
        passwordRequired: !!e.examPassword
      }));
      setExams(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const combineDateTime = (date, time) => {
     // Handle if date/time are arrays (Jackson default for Java 8 date/time)
     // or strings.
     if (Array.isArray(date)) {
         date = `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;
     }
     if (Array.isArray(time)) {
         time = `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`;
         if (time.length === 5) time += ":00";
     }
     
     if (!date || !time) return new Date().toISOString();
     return `${date}T${time}`;
  };

  if (loading) return <div className="p-4">Loading exams...</div>;

  return (
    <div className="exam-grid">
      {exams.length === 0 ? (
          <div className="col-12 text-center p-5">
              <h4>No exams available at the moment.</h4>
          </div>
      ) : (
          exams.map(exam => (
            <ExamCard key={exam.examId} exam={exam} />
          ))
      )}
    </div>
  );
};

export default AvailableExams;