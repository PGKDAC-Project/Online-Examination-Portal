import { getJson, removeItem, setJson } from "../utils/storage";
import { mockUsers } from "../../components/AdminPages/mockAdminData";

const PASSWORD_OVERRIDES_KEY = "password_overrides";
const AUTH_USER_KEY = "auth_user";

const getPasswordOverrides = () => getJson(PASSWORD_OVERRIDES_KEY, {});
const setPasswordOverrides = (value) => setJson(PASSWORD_OVERRIDES_KEY, value);

const mergeUsersWithOverrides = () => {
  const overrides = getPasswordOverrides();
  return mockUsers.map((u) => {
    const emailKey = String(u.email ?? "").toLowerCase();
    const override = emailKey ? overrides[emailKey] : undefined;
    return override ? { ...u, password: override } : u;
  });
};

export const getCurrentUser = () => getJson(AUTH_USER_KEY, null);

export const setCurrentUser = (user) => setJson(AUTH_USER_KEY, user);

export const clearCurrentUser = () => removeItem(AUTH_USER_KEY);

export const loginWithEmailPassword = async ({ email, password }) => {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const users = mergeUsersWithOverrides();
  const matched = users.find(
    (u) => String(u.email ?? "").toLowerCase() === normalizedEmail && u.password === password
  );
  if (!matched) {
    const err = new Error("INVALID_CREDENTIALS");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const authUser = { id: matched.id, name: matched.name, role: matched.role, email: matched.email };
  setCurrentUser(authUser);
  return authUser;
};

export const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const users = mergeUsersWithOverrides();
  const exists = users.some((u) => String(u.email ?? "").toLowerCase() === normalizedEmail);
  if (!exists) {
    const err = new Error("EMAIL_NOT_FOUND");
    err.code = "EMAIL_NOT_FOUND";
    throw err;
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  return { email: normalizedEmail, code };
};

export const resetPassword = async ({ email, newPassword }) => {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const overrides = getPasswordOverrides();
  overrides[normalizedEmail] = newPassword;
  setPasswordOverrides(overrides);
  return true;
};
