import axiosClient from "../axios/axiosClient";

export const getInstructorCourses = async () => {
  return await axiosClient.get("/instructor/courses");
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
