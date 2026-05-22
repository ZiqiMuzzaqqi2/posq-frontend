import { useState, useEffect } from "react";
import {
  History,
  Search,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { stockService } from "../../services/stockService";
import { productService } from "../../services/productService";
import { branchService } from "../../services/branchService";
import useAuthStore from "../../stores/authStore";

const StockHistory = () => {
  const { user } = useAuthStore();
  const [mutations, setMutations] = useState([]);
  const [filteredMutations, setFilteredMutations] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterProduct, setFilterProduct] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchHistory();
    fetchProducts();
    fetchBranches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    mutations,
    searchTerm,
    filterProduct,
    filterBranch,
    filterType,
    startDate,
    endDate,
  ]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterProduct) params.productId = filterProduct;
      if (filterBranch) params.branchId = filterBranch;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (limit) params.limit = limit;

      const response = await stockService.getHistory(params);
      if (response.success) {
        setMutations(response.data);
        setFilteredMutations(response.data);
      }
    } catch (error) {
      console.error("Fetch history error:", error);
      toast.error("Failed to load stock history");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll({ status: "active" });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
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

  const applyFilters = () => {
    let filtered = [...mutations];

    // Search by product name or SKU
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by product
    if (filterProduct) {
      filtered = filtered.filter((m) => m.productId === filterProduct);
    }

    // Filter by branch
    if (filterBranch) {
      filtered = filtered.filter((m) => m.branchId === filterBranch);
    }

    // Filter by type
    if (filterType) {
      filtered = filtered.filter((m) => m.type === filterType);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((m) => new Date(m.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((m) => new Date(m.createdAt) <= end);
    }

    setFilteredMutations(filtered);
  };

  const handleApplyFilters = () => {
    fetchHistory();
  };

  const clearFilters = () => {
    setFilterProduct("");
    setFilterBranch("");
    setFilterType("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setShowFilters(false);
    fetchHistory();
  };

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  const getTypeBadge = (type) => {
    if (type === "IN") {
      return {
        label: "Stock In",
        color: "bg-success/10 text-success",
        icon: TrendingUp,
      };
    }
    return {
      label: "Stock Out",
      color: "bg-warning/10 text-warning",
      icon: TrendingDown,
    };
  };

  const getReferenceTypeLabel = (type) => {
    switch (type) {
      case "SALE":
        return "Penjualan";
      case "PURCHASE":
        return "Pembelian";
      case "ADJUSTMENT":
        return "Adjustment";
      case "RETURN":
        return "Return";
      default:
        return type;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <History className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Stock History</h1>
            <p className="text-gray text-sm mt-1">
              Track all stock movements across branches
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-2xl font-bold text-dark">{mutations.length}</p>
          <p className="text-sm text-gray">Total Mutations</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-2xl font-bold text-success">
            {mutations.filter((m) => m.type === "IN").length}
          </p>
          <p className="text-sm text-gray">Stock In</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-2xl font-bold text-warning">
            {mutations.filter((m) => m.type === "OUT").length}
          </p>
          <p className="text-sm text-gray">Stock Out</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-2xl font-bold text-secondary">
            {new Set(mutations.map((m) => m.productId)).size}
          </p>
          <p className="text-sm text-gray">Products Affected</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
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
              onClick={fetchHistory}
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-primary/10 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-dark mb-1">
                Product
              </label>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark mb-1">
                Branch
              </label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={user?.role === "ADMIN"}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-5 flex justify-end gap-2 mt-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-1.5 bg-secondary text-white rounded-lg text-sm hover:bg-accent transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full animate-spin" />
          </div>
        ) : filteredMutations.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No stock history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Branch
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    Before
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    After
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMutations.map((mutation) => {
                  const typeBadge = getTypeBadge(mutation.type);
                  const TypeIcon = typeBadge.icon;

                  return (
                    <tr
                      key={mutation.id}
                      className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-dark">
                            {formatDateTime(mutation.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-dark">
                            {mutation.product.name}
                          </p>
                          <p className="text-xs text-gray">
                            {mutation.product.sku}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray">
                          {mutation.branch.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeBadge.color}`}
                        >
                          <TypeIcon size={12} />
                          {typeBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-sm font-semibold ${mutation.type === "IN" ? "text-success" : "text-warning"}`}
                        >
                          {mutation.type === "IN" ? "+" : "-"}
                          {mutation.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-gray">
                          {mutation.beforeStock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium text-dark">
                          {mutation.afterStock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-600">
                          <FileText size={10} />
                          {getReferenceTypeLabel(mutation.referenceType)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500 truncate max-w-[200px] block">
                          {mutation.note || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockHistory;
