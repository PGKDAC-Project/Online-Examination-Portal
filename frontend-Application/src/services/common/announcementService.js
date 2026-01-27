import axiosClient from "../axios/axiosClient";

const BASE_URL = "/admin/announcements";

export const getAllAnnouncements = async () => {
    return await axiosClient.get(BASE_URL);
};

export const createAnnouncement = async (data) => {
    return await axiosClient.post(BASE_URL, data);
};

export const deleteAnnouncement = async (id) => {
    return await axiosClient.delete(`${BASE_URL}/${id}`);
};
