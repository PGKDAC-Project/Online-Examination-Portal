import axiosClient from "../axios/axiosClient";
import adminAxios from "../axios/adminAxios";

export const getSystemLogs = async () => {
  return await adminAxios.get("/admin/logs");
};

export const getSystemAnalytics = async () => {
  return await axiosClient.get("/analytics");
};

export const createUser = async (user) => {
  return await adminAxios.post("/admin/users", user);
};

export const updateUser = async (id, user) => {
  return await adminAxios.put(`/admin/users/${id}`, user);
};

export const deleteUser = async (id) => {
  return await adminAxios.delete(`/admin/users/${id}`);
};
