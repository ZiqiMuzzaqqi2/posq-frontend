import { useState, useEffect } from "react";
import { Search, RefreshCw, Filter, Plus, Package, Boxes } from "lucide-react";
import toast from "react-hot-toast";
import { stockService } from "../../services/stockService";
import { branchService } from "../../services/branchService";
import AdjustStockModal from "./components/AdjustStockModal";
import Button from "../../components/ui/Button";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStocks();
    fetchBranches();
  }, []);

  useEffect(() => {
    let filtered = [...stocks];

    if (searchTerm) {
      filtered = filtered.filter(
        (stock) =>
          stock.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterBranch) {
      filtered = filtered.filter((stock) => stock.branchId === filterBranch);
    }

    setFilteredStocks(filtered);
  }, [searchTerm, filterBranch, stocks]);

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await stockService.getAll();
      if (response.success) {
        setStocks(response.data);
        setFilteredStocks(response.data);
      }
    } catch (error) {
      console.error("Fetch stocks error:", error);
      toast.error("Failed to load stocks");
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

  const handleAdjustStock = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await stockService.adjustStock(data);
      if (response.success) {
        toast.success(response.message);
        setIsModalOpen(false);
        fetchStocks();
      }
    } catch (error) {
      console.error("Adjust stock error:", error);
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBranch("");
    setShowFilters(false);
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0)
      return { label: "Out of Stock", color: "text-error bg-error/10" };
    if (quantity <= minStock)
      return { label: "Low Stock", color: "text-warning bg-warning/10" };
    return { label: "In Stock", color: "text-success bg-success/10" };
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Boxes className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Stock Management</h1>
            <p className="text-gray text-sm mt-1">
              Monitor and manage product inventory across branches
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
              onClick={fetchStocks}
              className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray" />
            </button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Adjust Stock
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

            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-secondary hover:text-accent transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full animate-spin" />
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No stock data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
                    Branch
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    Current Stock
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    Min Stock
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
                    Sell Price
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => {
                  const status = getStockStatus(stock.quantity, stock.minStock);
                  return (
                    <tr
                      key={stock.id}
                      className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-dark">
                            {stock.product.name}
                          </p>
                          <p className="text-xs text-gray">
                            {stock.product.category?.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-secondary">
                          {stock.product.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray">
                          {stock.branch.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-sm font-semibold ${stock.quantity === 0 ? "text-error" : "text-dark"}`}
                        >
                          {stock.quantity} pcs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-gray">
                          {stock.minStock} pcs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium text-success">
                          {formatCurrency(stock.product.sellPrice)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
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

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdjustStock}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Stocks;
