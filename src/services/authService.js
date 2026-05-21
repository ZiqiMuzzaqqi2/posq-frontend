import api from "./api";

export const authService = {
    // Login User
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: response.data.message };
    },

    // Get Me
    getMe: async () => {
        const response = await api.get('/auth/me');
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data.data;
        }
        throw new Error(response.data.message);
    },

    // Logout User
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Stored user
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }
}