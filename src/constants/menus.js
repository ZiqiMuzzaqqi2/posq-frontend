import {
    LayoutDashboard,
    Building2,
    Users,
    Package,
    ShoppingCart,
    FileText,
    Settings,
    Tags,
} from 'lucide-react';

// Menu configuration dengan icon, path, label, dan roles yang diizinkan
export const menus = [
    {
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'KASIR', 'GUDANG'],
        order: 1,
    },
    {
        path: '/branches',
        icon: Building2,
        label: 'Branches',
        roles: ['SUPERADMIN', 'ADMIN'],
        order: 2,
    },
    {
        path: '/users',
        icon: Users,
        label: 'Users',
        roles: ['SUPERADMIN', 'ADMIN'],
        order: 3,
    },
    {
        path: '/categories',
        icon: Tags,
        label: 'Categories',
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'],
        order: 4,
    },
    {
        path: '/products',
        icon: Package,
        label: 'Products',
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'GUDANG'],
        order: 5,
    },
    {
        path: '/transactions',
        icon: ShoppingCart,
        label: 'Transactions',
        roles: ['SUPERADMIN', 'ADMIN', 'KASIR'],
        order: 6,
    },
    {
        path: '/reports',
        icon: FileText,
        label: 'Reports',
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'],
        order: 7,
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        roles: ['SUPERADMIN', 'ADMIN'],
        order: 8,
    },
];

// Helper function untuk mendapatkan menu berdasarkan role
export const getMenuByRole = (role) => {
    return menus
        .filter(menu => menu.roles.includes(role))
        .sort((a, b) => a.order - b.order);
};

// Helper function untuk cek apakah user memiliki akses ke path tertentu
export const hasAccess = (path, role) => {
    const menu = menus.find(menu => menu.path === path);
    return menu ? menu.roles.includes(role) : false;
};