import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, TrendingUp, TrendingDown, Package, Building2 } from "lucide-react";
import { productService } from "../../../services/productService";
import { branchService } from "../../../services/branchService";

const adjustStockSchema = z.object({
  productId: z.string().min(1, "Pilih produk"),
  branchId: z.string().min(1, "Pilih cabang"),
  quantity: z.number().int().positive("Quantity harus lebih dari 0"),
  type: z.enum(["IN", "OUT"]),
  note: z.string().optional(),
});

const AdjustStockModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      productId: "",
      branchId: "",
      quantity: 1,
      type: "IN",
      note: "",
    },
  });

  const selectedProductId = watch("productId");
  const selectedType = watch("type");

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchBranches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId, products]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll({ status: "active" });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setIsLoadingData(false);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    setSelectedProduct(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${selectedType === "IN" ? "bg-success/10" : "bg-warning/10"}`}
            >
              {selectedType === "IN" ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-warning" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">Adjust Stock</h2>
              <p className="text-sm text-gray">Add or remove product stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Transaction Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("type", "IN")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all
                  ${
                    selectedType === "IN"
                      ? "bg-success/10 border-success text-success"
                      : "border-gray-300 text-gray hover:border-success hover:text-success"
                  }`}
              >
                <TrendingUp size={16} />
                Stock In
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "OUT")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all
                  ${
                    selectedType === "OUT"
                      ? "bg-warning/10 border-warning text-warning"
                      : "border-gray-300 text-gray hover:border-warning hover:text-warning"
                  }`}
              >
                <TrendingDown size={16} />
                Stock Out
              </button>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Product <span className="text-error">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
                <select
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
          ${errors.productId ? "border-error focus:ring-error" : "border-gray-300"}`}
                  {...register("productId")}
                  disabled={isLoadingData}
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compact product info on the side */}
              {selectedProduct && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/15 rounded-xl">
                  <Package size={14} className="text-secondary" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-dark">
                      {selectedProduct.sku}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {formatCurrency(selectedProduct.sellPrice)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.productId && (
              <p className="mt-1 text-xs text-error">
                {errors.productId.message}
              </p>
            )}
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Branch <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
              <select
                className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                  ${errors.branchId ? "border-error focus:ring-error" : "border-gray-300"}`}
                {...register("branchId")}
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
            </div>
            {errors.branchId && (
              <p className="mt-1 text-xs text-error">
                {errors.branchId.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Quantity <span className="text-error">*</span>
            </label>
            <input
              type="number"
              min="1"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.quantity ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-error">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Reason for stock adjustment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              {...register("note")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2 rounded-xl font-medium transition-all disabled:opacity-50
                ${
                  selectedType === "IN"
                    ? "bg-success text-white hover:bg-green-700"
                    : "bg-warning text-white hover:bg-orange-700"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : selectedType === "IN" ? (
                "Add Stock"
              ) : (
                "Remove Stock"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
