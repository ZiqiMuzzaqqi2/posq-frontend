import { useMemo } from 'react';
import useAuthStore from '../stores/authStore';
import { getMenuByRole, hasAccess, getFlatMenu, menuConfig } from '../constants/menus';

export const useMenu = () => {
    const { user } = useAuthStore();

    const menuItems = useMemo(() => {
        if (!user?.role) return [];
        return getMenuByRole(user.role);
    }, [user?.role]);

    const flatMenu = useMemo(() => {
        return getFlatMenu();
    }, []);

    const checkAccess = useMemo(() => {
        return (path) => {
            if (!user?.role) return false;
            return hasAccess(path, user.role);
        };
    }, [user?.role]);

    const getAllMenus = useMemo(() => menuConfig, []);

    return {
        menuItems,      // Menu dengan struktur parent-children
        flatMenu,       // Menu flat untuk routing
        checkAccess,    // Fungsi cek akses
        getAllMenus,    // Semua menu
    };
};

export default useMenu;