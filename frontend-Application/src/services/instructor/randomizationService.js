import axiosClient from "../axios/axiosClient";

export const getRandomizationRules = async (courseId) => {
    return await axiosClient.get(`/courses/${courseId}/randomization`);
};

export const updateRandomizationRules = async (courseId, rules) => {
    return await axiosClient.post(`/courses/${courseId}/randomization`, rules);
};
