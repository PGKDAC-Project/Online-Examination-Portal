import { axiosClient } from "../axios/axiosClient";

export const getStudentProfile = async () => {
  const res = await axiosClient.get("/student/profile");
  return res.data;
};

export const getStudentExams = async () => {
  const res = await axiosClient.get("/student/exams");
  return res.data;
};

export const submitExamAttempt = async (examId, payload) => {
  const res = await axiosClient.post(`/student/exams/${examId}/submit`, payload);
  return res.data;
};
