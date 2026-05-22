import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { categoryService } from "../../services/categoryService";
import CategoryTable from "./components/CategoryTable";
import CategoryModal from "./components/CategoryModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Button from "../../components/ui/Button";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
        setFilteredCategories(response.data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    if (category._count?.products > 0) {
      toast.error(
        `Cannot delete "${category.name}" because it has ${category._count.products} product(s)`,
      );
      return;
    }
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (selectedCategory) {
        response = await categoryService.update(selectedCategory.id, data);
        if (response.success) {
          toast.success("Category updated successfully");
        }
      } else {
        response = await categoryService.create(data);
        if (response.success) {
          toast.success("Category created successfully");
        }
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Submit category error:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await categoryService.delete(selectedCategory.id);
      if (response.success) {
        toast.success(response.message);
        setIsDeleteModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Categories Management</h1>
        <p className="text-gray text-sm mt-1">
          Manage product categories for your inventory
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCategories}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray" />
          </button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={18} />
            Add Category
          </Button>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        category={selectedCategory}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Categories;
