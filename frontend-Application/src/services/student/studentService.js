import axiosClient from "../axios/axiosClient";
import { getCurrentUser } from "../auth/authService";

const getStudentId = () => {
    const user = getCurrentUser();
    return user ? user.id : null;
};

export const getStudentProfile = async () => {
  const id = getStudentId();
  if (!id) throw new Error("User not authenticated");
  return await axiosClient.get(`/student/profile/${id}`);
};

export const getStudentDashboard = async () => {
  // Assuming dashboard is aggregate of available courses/exams or just using profile for now
  // Since no direct dashboard endpoint exists, we can return profile or fetch minimal data
  // For now, let's just return profile as dashboard info
  return getStudentProfile(); 
};

export const getAvailableCourses = async () => {
  const id = getStudentId();
  return await axiosClient.get(`/student/courses/available/${id}`);
};

export const enrollCourse = async (courseId) => {
  const id = getStudentId();
  return await axiosClient.post(`/student/courses/${courseId}/enroll/${id}`);
};

export const getAvailableExams = async () => {
  const id = getStudentId();
  return await axiosClient.get(`/student/exams/available/${id}`);
};

export const getExamHistory = async () => {
  const id = getStudentId();
  return await axiosClient.get(`/student/results/${id}`);
};

export const startExam = async (examId, password) => {
  return await axiosClient.post(`/student/exams/${examId}/submissions`, { password });
};

export const getExamQuestions = async (examId) => {
  return await axiosClient.get(`/student/exams/${examId}/questions`);
};

export const submitExam = async (examId, answers) => {
  const id = getStudentId();
  return await axiosClient.post(`/student/exams/${examId}/submissions`, { answers, studentId: id });
};

export const reportViolation = async (examId, violationData) => {
  return await axiosClient.post(`/student/exams/${examId}/report-violation`, violationData);
};

export const getDetailedResult = async (resultId) => {
  return await axiosClient.get(`/results/${resultId}`);
};
