import axiosClient from "../axios/axiosClient";

export const getAllExams = async () => {
    return await axiosClient.get("/exams");
};

export const getExamById = async (id) => {
    return await axiosClient.get(`/exams/${id}`);
};

export const createExam = async (exam) => {
    return await axiosClient.post("/exams", exam);
};

// Admin might force create/delete exams, though usually Instructor job
export const deleteExam = async (id) => {
    return await axiosClient.delete(`/exams/${id}`);
};
