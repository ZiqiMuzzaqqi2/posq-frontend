import {
    LayoutDashboard,
    Building2,
    Users,
    Package,
    ShoppingCart,
    FileText,
    Settings,
    Tags,
    Boxes,
    History,
    AlertTriangle
} from 'lucide-react';

// Definisikan struktur menu dengan children
export const menuConfig = [
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
        roles: ['SUPERADMIN', 'ADMIN'],
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
        // Parent menu untuk Stock
        label: 'Stock',
        icon: Boxes,
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'GUDANG'],
        order: 6,
        children: [
            {
                path: '/stocks',
                icon: Boxes,
                label: 'Stock Management',
                roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'GUDANG'],
            },
            {
                path: '/stocks/history',
                icon: History,
                label: 'Stock History',
                roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'GUDANG'],
            },
            {
                path: '/stocks/low-stock',
                icon: AlertTriangle,
                label: 'Low Stock Alert',
                roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'GUDANG'],
            },
        ],
    },
    {
        // Parent menu untuk Transactions
        label: 'Transactions',
        icon: ShoppingCart,
        roles: ['SUPERADMIN', 'ADMIN', 'KASIR'],
        order: 7,
        children: [
            {
                path: '/transactions/sales',
                icon: ShoppingCart,
                label: 'Sales',
                roles: ['SUPERADMIN', 'ADMIN', 'KASIR'],
            },
            {
                path: '/transactions/purchases',
                icon: ShoppingCart,
                label: 'Purchases',
                roles: ['SUPERADMIN', 'ADMIN'],
            },
        ],
    },
    {
        path: '/reports',
        icon: FileText,
        label: 'Reports',
        roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'],
        order: 8,
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        roles: ['SUPERADMIN', 'ADMIN'],
        order: 9,
    },
];

// Helper function untuk flat menu (untuk routing & permission check)
export const getFlatMenu = () => {
    const flat = [];
    const flatten = (items) => {
        items.forEach(item => {
            flat.push(item);
            if (item.children) {
                flatten(item.children);
            }
        });
    };
    flatten(menuConfig);
    return flat;
};

// Helper function untuk mendapatkan menu berdasarkan role (dengan children)
export const getMenuByRole = (role) => {
    const filterByRole = (items) => {
        return items
            .filter(item => item.roles.includes(role))
            .map(item => {
                if (item.children) {
                    return {
                        ...item,
                        children: filterByRole(item.children),
                    };
                }
                return item;
            })
            .filter(item => {
                // Jika parent menu tidak memiliki children yang valid, sembunyikan
                if (item.children && item.children.length === 0) return false;
                return true;
            });
    };
    return filterByRole(menuConfig);
};

// Helper function untuk cek akses ke path
export const hasAccess = (path, role) => {
    const flatMenu = getFlatMenu();
    const menu = flatMenu.find(menu => menu.path === path);
    return menu ? menu.roles.includes(role) : false;
};