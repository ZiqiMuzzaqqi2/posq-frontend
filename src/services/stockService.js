import api from './api';

export const stockService = {
    // Get all stocks (with filters)
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.branchId) queryParams.append('branchId', params.branchId);
        if (params.productId) queryParams.append('productId', params.productId);
        if (params.search) queryParams.append('search', params.search);

        const url = queryParams.toString()
            ? `/stocks?${queryParams.toString()}`
            : '/stocks';

        const response = await api.get(url);
        return response.data;
    },

    // Get low stock products
    getLowStock: async () => {
        const response = await api.get('/stocks/low-stock');
        return response.data;
    },

    // Get stock history
    getHistory: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.productId) queryParams.append('productId', params.productId);
        if (params.branchId) queryParams.append('branchId', params.branchId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.limit) queryParams.append('limit', params.limit);

        const response = await api.get(`/stocks/history?${queryParams.toString()}`);
        return response.data;
    },

    // Adjust stock (IN/OUT)
    adjustStock: async (data) => {
        const response = await api.post('/stocks/adjust', data);
        return response.data;
    },

    // Update minimum stock
    updateMinStock: async (id, minStock) => {
        const response = await api.put(`/stocks/${id}/min-stock`, { minStock });
        return response.data;
    },

    // Get stock by ID
    getById: async (id) => {
        const response = await api.get(`/stocks/${id}`);
        return response.data;
    },
};