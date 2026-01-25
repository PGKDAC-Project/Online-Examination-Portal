import axiosClient from "../axios/axiosClient";
import { getJson, removeItem, setJson } from "../utils/storage";

const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_KEY = "token";

export const getCurrentUser = () => getJson(AUTH_USER_KEY, null);

export const setCurrentUser = (user) => setJson(AUTH_USER_KEY, user);

export const setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);

export const clearCurrentUser = () => {
  removeItem(AUTH_USER_KEY);
  removeItem(AUTH_TOKEN_KEY);
};

export const loginWithEmailPassword = async ({ email, password }) => {
  // Backend endpoint is /auth/signin as seen in AuthController.java
  const response = await axiosClient.post("/auth/signin", { email, password });

  if (response.token) {
    setAuthToken(response.token);

    // Construct user object from flat AuthResp fields
    const user = {
      id: response.userId,
      role: response.role,
      token: response.token // redundancy for convenience
    };

    setCurrentUser(user);
    return user;
  }

  throw new Error(response.message || "Invalid response from server");
};

export const requestPasswordReset = async ({ email }) => {
  return await axiosClient.post("/auth/forgot-password", { email });
};

// Backend: /auth/reset-password/validate?token=...
export const validateResetToken = async (token) => {
  return await axiosClient.get(`/auth/reset-password/validate?token=${token}`);
};

// Backend ResetPasswordDto: { token, newPassword }
export const resetPassword = async ({ token, newPassword }) => {
  return await axiosClient.post("/auth/reset-password", { token, newPassword });
};
