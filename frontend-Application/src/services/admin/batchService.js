import axiosClient from "../axios/axiosClient";

export const getAllBatches = async () => {
    return await axiosClient.get("/batches");
};

export const getBatchById = async (id) => {
    return await axiosClient.get(`/batches/${id}`);
};

export const createBatch = async (batch) => {
    return await axiosClient.post("/batches", batch);
};

export const updateBatch = async (id, batch) => {
    return await axiosClient.put(`/batches/${id}`, batch);
};

export const deleteBatch = async (id) => {
    return await axiosClient.delete(`/batches/${id}`);
};
