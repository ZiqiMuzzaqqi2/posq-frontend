import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Package, DollarSign, Tag, Hash } from "lucide-react";
import { categoryService } from "../../../services/categoryService";
import ImageUploader from "../../../components/ui/ImageUploader";

const productSchema = z.object({
  sku: z.string().min(2, "SKU minimal 2 karakter"),
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  description: z.string().optional(),
  buyPrice: z.number().min(1, "Harga beli harus diisi"),
  sellPrice: z.number().min(1, "Harga jual harus diisi"),
  categoryId: z.string().min(1, "Pilih kategori"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
});

const ProductModal = ({ isOpen, onClose, onSubmit, product, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      buyPrice: "",
      sellPrice: "",
      categoryId: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || "",
      });
    } else {
      reset({
        sku: "",
        name: "",
        description: "",
        buyPrice: "",
        sellPrice: "",
        categoryId: "",
        imageUrl: "",
      });
    }
  }, [product, reset]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-gray">
                {product
                  ? "Update product information"
                  : "Create a new product"}
              </p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                SKU <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
                <input
                  type="text"
                  placeholder="PRD001"
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                    ${errors.sku ? "border-error focus:ring-error" : "border-gray-300"}`}
                  {...register("sku")}
                />
              </div>
              {errors.sku && (
                <p className="mt-1 text-xs text-error">{errors.sku.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Category <span className="text-error">*</span>
              </label>
              <select
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                  ${errors.categoryId ? "border-error focus:ring-error" : "border-gray-300"}`}
                {...register("categoryId")}
                disabled={isLoadingCategories}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-error">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Product Name <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
              <input
                type="text"
                placeholder="Product name"
                className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                  ${errors.name ? "border-error focus:ring-error" : "border-gray-300"}`}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Product description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Buy Price <span className="text-error">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
                <input
                  type="number"
                  placeholder="0"
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                    ${errors.buyPrice ? "border-error focus:ring-error" : "border-gray-300"}`}
                  {...register("buyPrice", { valueAsNumber: true })}
                />
              </div>
              {errors.buyPrice && (
                <p className="mt-1 text-xs text-error">
                  {errors.buyPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Sell Price <span className="text-error">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
                <input
                  type="number"
                  placeholder="0"
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                    ${errors.sellPrice ? "border-error focus:ring-error" : "border-gray-300"}`}
                  {...register("sellPrice", { valueAsNumber: true })}
                />
              </div>
              {errors.sellPrice && (
                <p className="mt-1 text-xs text-error">
                  {errors.sellPrice.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <ImageUploader
              value={watch("imageUrl")}
              onChange={(url) => setValue("imageUrl", url)}
              onRemove={() => setValue("imageUrl", "")}
              label="Product Image"
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
              className="flex-1 bg-secondary text-white py-2 rounded-xl font-medium hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {product ? "Updating..." : "Creating..."}
                </div>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
