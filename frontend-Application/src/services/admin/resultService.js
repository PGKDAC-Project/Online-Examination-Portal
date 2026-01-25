import axiosClient from "../axios/axiosClient";

const BASE_URL = "/results";

export const getAllResults = async () => {
    return await axiosClient.get(BASE_URL);
};
