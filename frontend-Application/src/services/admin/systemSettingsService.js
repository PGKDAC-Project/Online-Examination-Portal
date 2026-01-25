import axiosClient from "../axios/axiosClient";

export const getSystemSettings = async () => {
    return await axiosClient.get("/settings");
};

export const updateSystemSettings = async (settings) => {
    return await axiosClient.put("/settings", settings);
};
