import axiosClient from "../axios/axiosClient";

export const getAllCourses = async () => {
    return await axiosClient.get("/courses");
};

export const getCourseById = async (id) => {
    return await axiosClient.get(`/courses/${id}`);
};

export const createCourse = async (course) => {
    return await axiosClient.post("/courses", course);
};

export const updateCourse = async (id, course) => {
    return await axiosClient.put(`/courses/${id}`, course);
};

export const updateCourseStatus = async (id, status) => {
    return await axiosClient.patch(`/courses/${id}/status`, { status });
};

export const deleteCourse = async (id) => {
    return await axiosClient.delete(`/courses/${id}`);
};
