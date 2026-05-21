import api from './api';

export const branchService = {
    // Get All Branches
    getAll: async () => {
        const response = await api.get('/branches');
        return response.data;
    },

    // Get Branch by ID
    getById: async (id) => {
        const response = await api.get(`/branches/${id}`);
        return response.data;
    },

    // Create New Branch
    create: async (data) => {
        const response = await api.post('/branches', data);
        return response.data;
    },

    // Update Branch
    update: async (id, data) => {
        const response = await api.put(`/branches/${id}`, data);
        return response.data;
    },

    // Delete Branch
    delete: async (id) => {
        const response = await api.delete(`/branches/${id}`);
        return response.data;
    },

    // Toggle Branch Status
    toggleStatus: async (id) => {
        const response = await api.patch(`/branches/${id}/toggle`);
        return response.data;
    }
}
