import adminAxios from "../axios/adminAxios";

export const getAllBatches = async () => {
    return await adminAxios.get("/admin/batches");
};

export const getBatchById = async (id) => {
    return await adminAxios.get(`/admin/batches/${id}`);
};

export const createBatch = async (batch) => {
    return await adminAxios.post("/admin/batches", batch);
};

export const updateBatch = async (id, batch) => {
    return await adminAxios.put(`/admin/batches/${id}`, batch);
};

export const deleteBatch = async (id) => {
    return await adminAxios.delete(`/admin/batches/${id}`);
};
