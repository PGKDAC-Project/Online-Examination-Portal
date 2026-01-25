import axiosClient from "../axios/axiosClient";

export const getAllUsers = async () => {
    return await axiosClient.get("/users");
};

export const getUserById = async (id) => {
    return await axiosClient.get(`/users/${id}`);
};

export const getUsersByRole = async (role) => {
    // Assumes backend supports query param filtering
    return await axiosClient.get(`/users?role=${role}`);
};

export const getAllInstructors = async () => {
    return await getUsersByRole("instructor");
};
