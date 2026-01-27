import axiosClient from "../axios/axiosClient";

export const getQuestionsByCourse = async (courseId) => {
    return await axiosClient.get(`/instructor/questions/course/${courseId}`);
};

export const createQuestion = async (question) => {
    return await axiosClient.post("/instructor/questions", question);
};

export const updateQuestion = async (id, question) => {
    return await axiosClient.put(`/instructor/questions/${id}`, question);
};

export const deleteQuestion = async (id) => {
    return await axiosClient.delete(`/instructor/questions/${id}`);
};

export const updateQuestionTags = async (id, tags) => {
    return await axiosClient.patch(`/instructor/questions/${id}/tags`, { tags });
};

export const importQuestions = async (formData) => {
    // Ensure 'Content-Type': 'multipart/form-data' is set automatically by axios when passing FormData
    return await axiosClient.post("/instructor/questions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
