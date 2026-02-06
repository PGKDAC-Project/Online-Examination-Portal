import axios from "axios";

// Create Axios Instance for .NET Admin Service
const adminAxios = axios.create({
    // Fallback to local 7097 if environment variable is not set
    baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:7097",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Token
adminAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors
adminAxios.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("auth_user");
                if (window.location.pathname !== '/login') {
                    window.location.href = "/login";
                }
            }
            const customError = new Error(response.data?.message || response.data?.Message || "Admin Service API Error");
            customError.data = response.data;
            customError.status = response.status;
            return Promise.reject(customError);
        }
        return Promise.reject(error);
    }
);

export default adminAxios;
