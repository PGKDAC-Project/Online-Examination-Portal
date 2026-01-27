import adminAxios from "../axios/adminAxios";

export const getAllUsers = async () => {
    return await adminAxios.get("/admin/users");
};

export const getUserById = async (id) => {
    return await adminAxios.get(`/admin/users/${id}`);
};

export const getUsersByRole = async (role) => {
    return await adminAxios.get(`/admin/users?role=${role}`);
};

export const getAllInstructors = async () => {
    return await getUsersByRole("instructor");
};

export const updateUser = async (id, userData) => {
    return await adminAxios.put(`/admin/users/${id}`, userData);
};

export const deleteUser = async (id) => {
    return await adminAxios.delete(`/admin/users/${id}`);
};
