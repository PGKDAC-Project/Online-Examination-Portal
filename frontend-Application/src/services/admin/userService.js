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
