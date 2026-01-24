import { mockUsers } from "../../components/AdminPages/mockAdminData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user service to get instructors
export const getAllInstructors = async () => {
    await delay(300);
    return mockUsers.filter(u => u.role === "Instructor");
};

export const getAllUsers = async () => {
    await delay(300);
    return mockUsers;
};
