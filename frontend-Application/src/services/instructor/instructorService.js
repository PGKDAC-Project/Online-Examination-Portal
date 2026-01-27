import axiosClient from "../axios/axiosClient";

export const getInstructorCourses = async (instructorId) => {
  return await axiosClient.get(`/instructor/courses/${instructorId}`);
};

export const getEnrolledStudents = async (courseId) => {
  return await axiosClient.get(`/courses/${courseId}/enrollments`);
};

export const uploadSyllabus = async (courseId, syllabusData) => {
  return await axiosClient.post(`/courses/${courseId}/syllabus`, syllabusData);
};

export const defineOutcomes = async (courseId, outcomesData) => {
  return await axiosClient.post(`/courses/${courseId}/outcomes`, outcomesData);
};

export const getLiveExamStats = async (examId) => {
  return await axiosClient.get(`/exams/${examId}/live-stats`);
};

export const getLiveStudentStatuses = async (examId) => {
  return await axiosClient.get(`/exams/${examId}/live-students`);
};

export const createInstructorExam = async (examData) => {
  return await axiosClient.post("/instructor/exams", examData);
};

export const getInstructorExams = async (instructorId) => {
  return await axiosClient.get(`/instructor/exams/${instructorId}`);
};

export const deleteInstructorExam = async (examId) => {
  return await axiosClient.delete(`/instructor/exams/${examId}`);
};

export const addQuestionToExam = async (examId, questionId) => {
  return await axiosClient.post(`/instructor/exams/${examId}/questions/${questionId}`);
};

export const removeQuestionFromExam = async (examId, questionId) => {
  return await axiosClient.delete(`/instructor/exams/${examId}/questions/${questionId}`);
};

export const getExamQuestions = async (examId) => {
  return await axiosClient.get(`/instructor/exams/${examId}/questions`);
};
