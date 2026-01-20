import { axiosClient } from "../axios/axiosClient";

export const getSystemLogs = async (params) => {
  const res = await axiosClient.get("/admin/logs", { params });
  return res.data;
};

export const createUser = async (payload) => {
  const res = await axiosClient.post("/admin/users", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await axiosClient.put(`/admin/users/${id}`, payload);
  return res.data;
};
