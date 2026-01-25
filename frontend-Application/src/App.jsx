// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/Common/ProtectedRoute'; // Import Protection
//=======================================Student Imports==============================================
import { StudentLayoutProvider } from "./contexts/StudentLayoutContext";
// import AdminHome from './components/AdminPages/adminHome';

import StudentLayout from './components/StudentPages/Layout/StudentLayout';
import StudentOverview from './components/StudentPages/StudentOverview';
import StudentProfileView from './components/StudentPages/StudentProfileView';
import Login from './components/HomePage.jsx/login';
import ResetPassword from './components/HomePage.jsx/ResetPassword';
import Home from './components/HomePage.jsx/home';
import About from './components/HomePage.jsx/about';
import AppliedCourses from "./components/StudentPages/Applied Courses/AppliedCourses";
import AvailableCourses from "./components/StudentPages/AvailableCourses";
import Scorecard from "./components/StudentPages/Scorecard";
import AvailableExams from './components/StudentPages/Exam/AvailableExams';
import ExamInstructions from './components/StudentPages/Exam/ExamInstructions';
import ExamDetails from './components/StudentPages/Exam/ExamDetails';
import AttemptExam from './components/StudentPages/Exam/AttemptExam';
import ReviewAnswers from './components/StudentPages/Exam/ReviewAnswers';
import ExamResult from './components/StudentPages/Exam/ExamResult';
import ExamHistory from './components/StudentPages/Exam History/ExamHistory';
import StudentExamResult from './components/StudentPages/Result/ExamResult';
import ChangePassword from './components/StudentPages/ChangePassword';
import ResultsList from './components/StudentPages/Result/ResultsList';
import DetailedScorecard from './components/StudentPages/Result/DetailedScorecard';

//===================================Instructor Imports=================================================
import { InstructorLayoutProvider } from './contexts/InstructorLayoutContext';
import InstructorLayout from './components/InstructorPages/Layout/InstructorLayout';
import InstructorOverview from './components/InstructorPages/InstructorOverview';
import CourseManagement from './components/InstructorPages/Course Management/CourseManagement';
import ExamManagement from './components/InstructorPages/Exam Management/ExamManagement';
import ResultEvaluation from './components/InstructorPages/Result Evaluation/ResultEvaluation';
import LiveExamMonitoring from './components/InstructorPages/Live Exam Monitoring/LiveExamMonitoring';
import QuestionBankManagement from './components/InstructorPages/Question Bank Management/QuestionBankManagement';
import StudentPerformanceAnalytics from './components/InstructorPages/Student Performance Analytics/StudentPerformanceAnalytics';
import InstructorExamHistory from './components/InstructorPages/Exam History/ExamHistory';
import ProfileSettings from './components/InstructorPages/Profile Settings/ProfileSettings';
import AdminLayout from './components/AdminPages/Layout/AdminLayout';
import AdminOverview from './components/AdminPages/AdminOverview';
import UserManagement from './components/AdminPages/UserManagement';
import ActivityLogs from './components/AdminPages/ActivityLogs';
import ExamGovernance from './components/AdminPages/ExamGovernance';
import CourseGovernance from './components/AdminPages/CourseGovernance';
import SystemAnalytics from './components/AdminPages/SystemAnalytics';
import SystemSettings from './components/AdminPages/SystemSettings';
import UserEdit from './components/AdminPages/UserEdit';
import UserDetails from './components/AdminPages/UserDetails';
import UserCreate from './components/AdminPages/UserCreate';
import BatchManagement from './components/AdminPages/BatchManagement';
import AnnouncementManagement from './components/Common/AnnouncementManagement';

//===================================Instructor Sub-Pages===============================================
import ViewEnrolledStudents from './components/InstructorPages/Course Management/ViewEnrolledStudents';
import UploadSyllabus from './components/InstructorPages/Course Management/UploadSyllabus';
import DefineCourseOutcomes from './components/InstructorPages/Course Management/DefineCourseOutcomes';
import CreateExam from './components/InstructorPages/Exam Management/CreateExam';
import EditExam from './components/InstructorPages/Exam Management/EditExam';
import ViewExamDetails from './components/InstructorPages/Exam Management/ViewExamDetails';
import AddQuestion from './components/InstructorPages/Question Bank Management/AddQuestion';
import ImportQuestions from './components/InstructorPages/Question Bank Management/ImportQuestions';
import ManageQuestions from './components/InstructorPages/Question Bank Management/ManageQuestions';
import TopicTagging from './components/InstructorPages/Question Bank Management/TopicTagging';
import RandomizationRules from './components/InstructorPages/Question Bank Management/RandomizationRules';

import MaintenanceGuard from "./components/Common/MaintenanceGuard";

function App() {
  return (
    <BrowserRouter>
      <MaintenanceGuard>
        <Routes>
          {/* Main Home Route */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Authentication Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Admin Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminOverview />} />
              <Route path="/admin/batches" element={<BatchManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/create" element={<UserCreate />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/users/:id/edit" element={<UserEdit />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
              <Route path="/admin/exams" element={<ExamGovernance />} />
              <Route path="/admin/courses" element={<CourseGovernance />} />
              <Route path="/admin/analytics" element={<SystemAnalytics />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
              <Route path="/admin/announcements" element={<AnnouncementManagement />} />
            </Route>
          </Route>

          {/*================================ Student Dashboard Routes - Protected ==========================================*/}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayoutProvider><StudentLayout /></StudentLayoutProvider>}>
              {/* Overview */}
              <Route path="/student/home" element={<StudentOverview />} />
              {/* Profile */}
              <Route path="/student/profile" element={<StudentProfileView />} />
              {/* Enrolled Courses */}
              <Route path="/student/courses" element={<AppliedCourses />} />
              <Route path="/student/available-courses" element={<AvailableCourses />} />
              {/* Exams */}
              <Route path="/student/exams" element={<AvailableExams />} />
              <Route path="/student/scorecard/:resultId" element={<Scorecard />} />
              {/* Exam Instructions + Password */}
              <Route path="/student/exams/:examId/instructions" element={<ExamInstructions />} />
              {/* Exam Details */}
              <Route path="/student/exams/:examId/details" element={<ExamDetails />} />
              {/* Exam Result (Conditional Visibility) */}
              <Route path="/student/exams/:examId/result" element={<ExamResult />} />
              <Route path="/student/exam-history" element={<ExamHistory />} />
              <Route path="/student/results" element={<ResultsList />} />
              <Route path="/student/results/:examId/detailed" element={<DetailedScorecard />} />
              <Route path="/student/change-password" element={<ChangePassword />} />
            </Route>
            <Route path="/student/exams/:examId/attempt" element={<AttemptExam />} />
            <Route path="/student/exams/:examId/review" element={<ReviewAnswers />} />
          </Route>

          {/*================================ Instructor Dashboard Routes - Protected ==========================================*/}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route element={<InstructorLayoutProvider><InstructorLayout /></InstructorLayoutProvider>}>
              <Route path="/instructor/home" element={<InstructorOverview />} />
              <Route path="/instructor/announcements" element={<AnnouncementManagement />} />

              <Route path="/instructor/courses" element={<CourseManagement />} />
              <Route path="/instructor/courses/:courseId/students" element={<ViewEnrolledStudents />} />
              <Route path="/instructor/courses/:courseId/syllabus" element={<UploadSyllabus />} />
              <Route path="/instructor/courses/:courseId/outcomes" element={<DefineCourseOutcomes />} />

              <Route path="/instructor/exams" element={<ExamManagement />} />
              <Route path="/instructor/exams/create" element={<CreateExam />} />
              <Route path="/instructor/exams/:examId" element={<ViewExamDetails />} />
              <Route path="/instructor/exams/:examId/edit" element={<EditExam />} />

              <Route path="/instructor/results" element={<ResultEvaluation />} />
              <Route path="/instructor/live-exams" element={<LiveExamMonitoring />} />

              <Route path="/instructor/question-bank" element={<QuestionBankManagement />} />
              <Route path="/instructor/question-bank/create" element={<AddQuestion />} />
              <Route path="/instructor/question-bank/import" element={<ImportQuestions />} />
              <Route path="/instructor/question-bank/:courseCode" element={<ManageQuestions />} />
              <Route path="/instructor/question-bank/:courseCode/tags" element={<TopicTagging />} />
              <Route path="/instructor/question-bank/:courseCode/randomization" element={<RandomizationRules />} />

              <Route path="/instructor/analytics" element={<StudentPerformanceAnalytics />} />
              <Route path="/instructor/exam-history" element={<InstructorExamHistory />} />
              <Route path="/instructor/profile" element={<ProfileSettings />} />
            </Route>
          </Route>


          {/* Other utility routes */}
          <Route path="/editPassword" element={<Login />} />

          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<div className="container mt-5"><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </MaintenanceGuard>
    </BrowserRouter>
  );
}

export default App;
