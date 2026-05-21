import { create } from "zustand";
import { authService } from "../services/authService";

const useAuthStore = create((set) => ({
    user: authService.getStoredUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                set({
                    user: result.user,
                    isAuthenticated: true,
                    isLoading: false,
                })
                return { success: true };
            } else {
                set({ error: result.message, isLoading: false });
                return { success: false, message: result.message };
            }
        } catch (error) {
            set({ error: error.message || "Login failed", isLoading: false });
            return { success: false, message: error.message || "Login failed" };
        }
    },

    logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),
}))

export default useAuthStore;