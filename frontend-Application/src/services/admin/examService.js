import adminAxios from "../axios/adminAxios";

export const getAllExams = async () => {
    return await adminAxios.get("/admin/exams");
};

export const getExamById = async (id) => {
    return await adminAxios.get(`/exams/${id}`);
};

export const createExam = async (exam) => {
    return await adminAxios.post("/admin/exams", exam);
};

export const deleteExam = async (id) => {
    return await adminAxios.delete(`/admin/exams/${id}`);
};
