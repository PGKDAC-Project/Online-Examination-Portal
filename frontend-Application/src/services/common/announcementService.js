import adminAxios from "../axios/adminAxios";

const BASE_URL = "/admin/announcements";

export const getAllAnnouncements = async () => {
    return await adminAxios.get(BASE_URL);
};

export const createAnnouncement = async (data) => {
    return await adminAxios.post(BASE_URL, data);
};

export const deleteAnnouncement = async (id) => {
    return await adminAxios.delete(`${BASE_URL}/${id}`);
};
