import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Tags, FileText } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
});

const CategoryModal = ({ isOpen, onClose, onSubmit, category, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [category, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Tags className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">
                {category ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-sm text-gray">
                {category
                  ? "Update category information"
                  : "Create a new product category"}
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
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Category Name <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Tags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-4 h-4" />
              <input
                type="text"
                placeholder="e.g., Electronics, Fashion, Food"
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
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray w-4 h-4" />
              <textarea
                rows={3}
                placeholder="Brief description of this category..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                {...register("description")}
              />
            </div>
          </div>

          {/* Info note about delete */}
          {category && (category._count?.products || 0) > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
              <p className="text-xs text-warning">
                ⚠️ This category has {category._count.products} product(s). You
                cannot delete it until you move or delete these products.
              </p>
            </div>
          )}

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
                  {category ? "Updating..." : "Creating..."}
                </div>
              ) : category ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
