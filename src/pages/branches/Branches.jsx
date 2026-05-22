import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { branchService } from "../../services/branchService";
import BranchTable from "./components/BranchTable";
import BranchModal from "./components/BranchModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Button from "../../components/ui/Button";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Filter branches when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (branch.address &&
            branch.address.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches);
    }
  }, [searchTerm, branches]);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const response = await branchService.getAll();
      if (response.success) {
        setBranches(response.data);
        setFilteredBranches(response.data);
      }
    } catch (error) {
      console.error("Fetch branches error:", error);
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (branch) => {
    try {
      const response = await branchService.toggleStatus(branch.id);
      if (response.success) {
        toast.success(response.message);
        fetchBranches();
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
      if (selectedBranch) {
        // Update existing branch
        response = await branchService.update(selectedBranch.id, data);
        if (response.success) {
          toast.success("Branch updated successfully");
        }
      } else {
        // Create new branch
        response = await branchService.create(data);
        if (response.success) {
          toast.success("Branch created successfully");
        }
      }
      setIsModalOpen(false);
      fetchBranches();
    } catch (error) {
      console.error("Submit branch error:", error);
      toast.error(error.response?.data?.message || "Failed to save branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await branchService.delete(selectedBranch.id);
      if (response.success) {
        toast.success(response.message);
        setIsDeleteModalOpen(false);
        fetchBranches();
      }
    } catch (error) {
      console.error("Delete branch error:", error);
      toast.error(error.response?.data?.message || "Failed to delete branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Building2 className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">
              Branches Management
            </h1>
            <p className="text-gray text-sm mt-1">
              Manage all store branches across your organization
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, code, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBranches}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray" />
          </button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={18} />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <BranchTable
          branches={filteredBranches}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
      </div>

      {/* Branch Modal */}
      <BranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        branch={selectedBranch}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        branch={selectedBranch}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Branches;
