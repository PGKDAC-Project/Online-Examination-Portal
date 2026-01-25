import axiosClient from "../axios/axiosClient";

export const getQuestionsByCourse = async (courseId) => {
    return await axiosClient.get(`/questions?courseId=${courseId}`);
};

export const createQuestion = async (question) => {
    return await axiosClient.post("/questions", question);
};

export const updateQuestion = async (id, question) => {
    return await axiosClient.put(`/questions/${id}`, question);
};

export const deleteQuestion = async (id) => {
    return await axiosClient.delete(`/questions/${id}`);
};

export const updateQuestionTags = async (id, tags) => {
    return await axiosClient.patch(`/questions/${id}/tags`, { tags });
};

export const importQuestions = async (formData) => {
    // Ensure 'Content-Type': 'multipart/form-data' is set automatically by axios when passing FormData
    return await axiosClient.post("/questions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
