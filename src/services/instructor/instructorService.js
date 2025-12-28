import { axiosClient } from "../axios/axiosClient";

export const getInstructorDashboard = async () => {
  const res = await axiosClient.get("/instructor/dashboard");
  return res.data;
};

export const getInstructorCourses = async () => {
  const res = await axiosClient.get("/instructor/courses");
  return res.data;
};

export const getInstructorExams = async () => {
  const res = await axiosClient.get("/instructor/exams");
  return res.data;
};
