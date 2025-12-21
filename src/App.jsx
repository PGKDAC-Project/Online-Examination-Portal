// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router";

// Import the StudentLayoutProvider from the new 'contexts' directory
import { StudentLayoutProvider } from "./contexts/StudentLayoutContext"; // Corrected path
import AdminHome from './components/AdminPages/adminHome';
import InstructorHome from './components/InstructorPages/instructorHome';
import StudentLayout from './components/StudentPages/Layout/StudentLayout';
import StudentOverview from './components/StudentPages/StudentOverview';
import StudentProfileView from './components/StudentPages/StudentProfileView';
import Login from './components/HomePage.jsx/login';
import Home from './components/HomePage.jsx/home';
import AppliedCourses from "./components/StudentPages/Applied Courses/AppliedCourses";
import AvailableExams from './components/StudentPages/Exam/AvailableExams';
import ExamInstructions from './components/StudentPages/Exam/ExamInstructions';
import ExamDetails from './components/StudentPages/Exam/ExamDetails';
import AttemptExam from './components/StudentPages/Exam/AttemptExam';
import ReviewAnswers from './components/StudentPages/Exam/ReviewAnswers';
import ExamResult from './components/StudentPages/Exam/ExamResult';
import ExamHistory from './components/StudentPages/Exam History/ExamHistory';
import StudentExamResult from './components/StudentPages/Result/ExamResult';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          {/* Main Home Route */}
          <Route index element={<Home />} />

          {/* Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin and Instructor Home pages */}
          <Route path="/admin/home" element={<AdminHome/>} />
          <Route path="/instructor/home" element={<InstructorHome/>} />

          {/* Student Dashboard Routes */}
          <Route element={<StudentLayoutProvider><StudentLayout /></StudentLayoutProvider>}>
            {/* Overview */}
            <Route path="/student/home" element={<StudentOverview />} />
            {/* Profile */}
            <Route path="/student/profile" element={<StudentProfileView />} />
            {/* Enrolled Courses */}
            <Route path="/student/courses" element={<AppliedCourses/>} />
            {/* Exams */}
            <Route path="/student/exams" element={<AvailableExams/>} />
            {/* Exam Instructions + Password */}
            <Route path="/student/exams/:examId/instructions" element={<ExamInstructions />} />
            {/* Exam Details */}
            <Route path="/student/exams/:examId/details" element={<ExamDetails />} />
            {/* Exam Result (Conditional Visibility) */}
            <Route path="/student/exams/:examId/result" element={<ExamResult />} />
            <Route path="/student/exam-history" element={<ExamHistory/>} />
            <Route path="/student/results" element={<StudentExamResult/>} />
            <Route path="/student/change-password" element={<div>Student Change Password Page (Coming Soon)</div>} />
          </Route>
          {/* Attempt Exam (LIVE EXAM) */}
            <Route path="/student/exams/:examId/attempt"element={<AttemptExam />} />
            {/* Review Answers before Final Submit */}
            <Route path="/student/exams/:examId/review" element={<ReviewAnswers />} />

          {/* Other utility routes */}
          <Route path="/editPassword" element={<div>Forgot Password Page (Placeholder)</div>} />

          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<div className="container mt-5"><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;