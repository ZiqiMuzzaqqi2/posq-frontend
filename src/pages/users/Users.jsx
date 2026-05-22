import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, Filter, Users2 } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import { userService } from "../../services/userService";
import { branchService } from "../../services/branchService";

import toast from "react-hot-toast";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import Button from "../../components/ui/Button";

const Users = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch users and branches on component mount
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Branch filter
    if (filterBranch) {
      filtered = filtered.filter((user) => user.branchId === filterBranch);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((user) =>
        filterStatus === "active" ? user.isActive : !user.isActive,
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterBranch, filterStatus, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await branchService.getAll();
      if (response.success) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Fetch branches error:", error);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      const response = await userService.toggleStatus(user.id);
      if (response.success) {
        toast.success(response.message);
        fetchUsers();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (selectedUser) {
        response = await userService.update(selectedUser.id, data);
        if (response.success) {
          toast.success("User updated successfully");
        }
      } else {
        response = await userService.create(data);
        if (response.success) {
          toast.success("User created successfully");
          if (response.data.temporaryPassword) {
            toast.success(
              `Temporary password: ${response.data.temporaryPassword}`,
              {
                duration: 8000,
              },
            );
          }
        }
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Submit user error:", error);
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await userService.delete(selectedUser.id);
      if (response.success) {
        toast.success(response.message);
        setIsDeleteModalOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBranch("");
    setFilterStatus("");
    setShowFilters(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Users2 className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Users Management</h1>
            <p className="text-gray text-sm mt-1">
              Manage all system users and their permissions
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-xl transition-colors ${showFilters ? "bg-primary border-primary text-secondary" : "border-gray-300 text-gray hover:bg-gray-50"}`}
              title="Toggle Filters"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={fetchUsers}
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray" />
            </button>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus size={18} />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-primary/10 rounded-xl">
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-secondary hover:text-accent transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onResetPassword={handleResetPassword}
          isLoading={isLoading}
        />
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        isLoading={isSubmitting}
        currentUserRole={currentUser?.role}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
