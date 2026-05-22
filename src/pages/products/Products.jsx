import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, Filter, Package } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Button from "../../components/ui/Button";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId === filterCategory,
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((product) =>
        filterStatus === "active" ? product.isActive : !product.isActive,
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filterCategory, filterStatus, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getAll();
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (product) => {
    try {
      const response = await productService.toggleStatus(product.id);
      if (response.success) {
        toast.success(response.message);
        fetchProducts();
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
      if (selectedProduct) {
        response = await productService.update(selectedProduct.id, data);
        if (response.success) {
          toast.success("Product updated successfully");
        }
      } else {
        response = await productService.create(data);
        if (response.success) {
          toast.success("Product created successfully");
        }
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Submit product error:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await productService.delete(selectedProduct.id);
      if (response.success) {
        toast.success(response.message);
        setIsDeleteModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(
        error.response?.data?.message || "Failed to deactivate product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
    setShowFilters(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Package className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">
              Products Management
            </h1>
            <p className="text-gray text-sm mt-1">
              Manage all products and inventory
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
              placeholder="Search by name or SKU..."
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
              onClick={fetchProducts}
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray" />
            </button>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-primary/10 rounded-xl">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={selectedProduct}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Products;
