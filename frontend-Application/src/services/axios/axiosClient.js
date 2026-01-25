import axios from "axios";

// Create Axios Instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/oep",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
axiosClient.interceptors.request.use(
  (config) => {
    // We now use the standalone 'token' key set by authService
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

// Response Interceptor: Handle Global Errors (e.g. 401)
axiosClient.interceptors.response.use(
  (response) => response.data, // Return data directly for cleaner service calls
  (error) => {
    const { response } = error;
    if (response) {
      // Log out if 401 Unauthorized occurs
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
        // Optional: Redirect to login or dispatch event
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
      }
      // Pass structured error message if available
      const customError = new Error(response.data?.message || "API Error");
      customError.data = response.data;
      customError.status = response.status;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
