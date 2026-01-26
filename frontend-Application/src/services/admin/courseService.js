import adminAxios from "../axios/adminAxios";

export const getAllCourses = async () => {
    return await adminAxios.get("/admin/courses");
};

export const getCourseById = async (id) => {
    return await adminAxios.get(`/admin/courses/${id}`);
};

export const createCourse = async (course) => {
    return await adminAxios.post("/admin/courses", course);
};

export const updateCourse = async (id, course) => {
    return await adminAxios.put(`/admin/courses/${id}`, course);
};

export const updateCourseStatus = async (id, status) => {
    return await adminAxios.patch(`/admin/courses/${id}/status`, { status });
};

export const deleteCourse = async (id) => {
    return await adminAxios.delete(`/admin/courses/${id}`);
};
