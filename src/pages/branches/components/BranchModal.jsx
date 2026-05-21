import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Building2 } from "lucide-react";

const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().min(2, "Branch code must be at least 2 characters"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

const BranchModal = ({ isOpen, onClose, onSubmit, branch, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        code: branch.code,
        address: branch.address || "",
        phone: branch.phone || "",
      });
    } else {
      reset({
        name: "",
        code: "",
        address: "",
        phone: "",
      });
    }
  }, [branch, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">
                {branch ? "Edit Branch" : "Add New Branch"}
              </h2>
              <p className="text-sm text-gray">
                {branch
                  ? "Update branch information"
                  : "Create a new store branch"}
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
              Branch Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Cabang Pusat Jakarta"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.name ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Branch Code <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., HQ01"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.code ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("code")}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-error">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Address
            </label>
            <textarea
              rows={2}
              placeholder="Full address of the branch"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              {...register("address")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g., 021-1234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              {...register("phone")}
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
                  {branch ? "Updating..." : "Creating..."}
                </div>
              ) : branch ? (
                "Update Branch"
              ) : (
                "Create Branch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
