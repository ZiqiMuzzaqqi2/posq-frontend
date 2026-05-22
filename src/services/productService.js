import api from './api';

export const productService = {
    // Get all products (with optional filters)
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);

        const url = queryParams.toString()
            ? `/products?${queryParams.toString()}`
            : '/products';

        const response = await api.get(url);
        return response.data;
    },

    // Get product by ID
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Create new product
    create: async (data) => {
        const response = await api.post('/products', data);
        return response.data;
    },

    // Update product
    update: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    // Delete product (soft delete)
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // Toggle product status
    toggleStatus: async (id) => {
        const response = await api.patch(`/products/${id}/toggle`);
        return response.data;
    },
};