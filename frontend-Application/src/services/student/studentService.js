import axiosClient from "../axios/axiosClient";

export const getStudentProfile = async () => {
  return await axiosClient.get("/profile");
};

export const getStudentDashboard = async () => {
  return await axiosClient.get("/dashboard");
};

export const getAvailableCourses = async () => {
  return await axiosClient.get("/courses/available");
};

export const enrollCourse = async (courseId) => {
  return await axiosClient.post(`/courses/${courseId}/enrollments`);
};

export const getAvailableExams = async () => {
  return await axiosClient.get("/exams/available");
};

export const getExamHistory = async () => {
  return await axiosClient.get("/student/exams");
};

export const startExam = async (examId, password) => {
  return await axiosClient.post(`/exams/${examId}/submissions`, { password });
};

export const submitExam = async (examId, answers) => {
  // Assuming submission update or finalization
  return await axiosClient.put(`/exams/${examId}/submissions`, { answers });
};

export const reportViolation = async (examId, violationData) => {
  return await axiosClient.post(`/exams/${examId}/violations`, violationData);
};

export const getDetailedResult = async (resultId) => {
  return await axiosClient.get(`/results/${resultId}`);
};
