import adminAxios from "../axios/adminAxios";

export const getSystemSettings = async () => {
    return await adminAxios.get("/admin/settings");
};

export const updateSystemSettings = async (settings) => {
    return await adminAxios.put("/admin/settings", settings);
};
