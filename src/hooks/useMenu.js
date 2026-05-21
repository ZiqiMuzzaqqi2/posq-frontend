import { useMemo } from 'react';
import useAuthStore from '../stores/authStore';
import { getMenuByRole, hasAccess, menus } from '../constants/menus';

// Hook untuk mendapatkan menu berdasarkan user yang login
export const useMenu = () => {
    const { user } = useAuthStore();

    const menuItems = useMemo(() => {
        if (!user?.role) return [];
        return getMenuByRole(user.role);
    }, [user?.role]);

    const checkAccess = useMemo(() => {
        return (path) => {
            if (!user?.role) return false;
            return hasAccess(path, user.role);
        };
    }, [user?.role]);

    const getAllMenus = useMemo(() => menus, []);

    return {
        menuItems,      // Menu yang diizinkan untuk user
        checkAccess,    // Fungsi untuk cek akses ke path tertentu
        getAllMenus,    // Semua menu (tanpa filter)
    };
};

export default useMenu;