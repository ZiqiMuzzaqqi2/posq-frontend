import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 10000
})


// Attach Token
api.interceptors.request.use(
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
)


// Handle Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {

            // Token is invalid or expired, logout user
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)
export default api;