import axiosClient from "../axios/axiosClient";

export const getSystemLogs = async () => {
  return await axiosClient.get("/logs");
};

export const getSystemAnalytics = async () => {
  return await axiosClient.get("/analytics");
};

export const createUser = async (user) => {
  return await axiosClient.post("/users", user);
};

export const updateUser = async (id, user) => {
  return await axiosClient.put(`/users/${id}`, user);
};

export const deleteUser = async (id) => {
  return await axiosClient.delete(`/users/${id}`);
};
