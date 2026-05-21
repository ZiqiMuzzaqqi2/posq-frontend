import api from "./api";

export const userService = {
  // Get all users (with optional filters)
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.branch) queryParams.append("branch", params.branch);
    if (params.status) queryParams.append("status", params.status);

    const url = queryParams.toString()
      ? `/users?${queryParams.toString()}`
      : "/users";

    const response = await api.get(url);
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  // Update user
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Toggle user status (active/inactive)
  toggleStatus: async (id) => {
    const response = await api.patch(`/users/${id}/toggle`);
    return response.data;
  },
};
