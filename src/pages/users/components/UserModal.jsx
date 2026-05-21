import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Users, Eye, EyeOff } from "lucide-react";
import { branchService } from "../../../services/branchService";

const userSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["SUPERADMIN", "ADMIN", "MANAGER", "KASIR", "GUDANG"]),
    branchId: z.string().min(1, "Please select a branch"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  })
  .refine(
    (data) => {
      // Password is required only for new user creation
      if (!data.password && !data.id) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  );

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
  currentUserRole,
}) => {
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "KASIR",
      branchId: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        password: "",
      });
    } else {
      reset({
        name: "",
        email: "",
        role: "KASIR",
        branchId: "",
        password: "",
      });
    }
  }, [user, reset]);

  const fetchBranches = async () => {
    setIsLoadingBranches(true);
    try {
      const response = await branchService.getAll();
      if (response.success) {
        // Filter active branches only
        setBranches(response.data.filter((b) => b.isActive));
      }
    } catch (error) {
      console.error("Fetch branches error:", error);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  if (!isOpen) return null;

  // SUPERADMIN can create/edit all roles
  // ADMIN cannot create/edit SUPERADMIN
  const availableRoles =
    currentUserRole === "SUPERADMIN"
      ? ["SUPERADMIN", "ADMIN", "MANAGER", "KASIR", "GUDANG"]
      : ["ADMIN", "MANAGER", "KASIR", "GUDANG"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">
                {user ? "Edit User" : "Add New User"}
              </h2>
              <p className="text-sm text-gray">
                {user ? "Update user information" : "Create a new system user"}
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
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., John Doe"
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
              Email Address <span className="text-error">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g., user@posq.com"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.email ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Branch <span className="text-error">*</span>
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.branchId ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("branchId")}
              disabled={isLoadingBranches}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
            {errors.branchId && (
              <p className="mt-1 text-xs text-error">
                {errors.branchId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Role <span className="text-error">*</span>
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                ${errors.role ? "border-error focus:ring-error" : "border-gray-300"}`}
              {...register("role")}
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role === "SUPERADMIN"
                    ? "Super Admin"
                    : role === "ADMIN"
                      ? "Admin"
                      : role === "MANAGER"
                        ? "Manager"
                        : role === "KASIR"
                          ? "Cashier"
                          : "Warehouse"}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-error">{errors.role.message}</p>
            )}
          </div>

          {/* Password field - required for new user, optional for edit */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Password {!user && <span className="text-error">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  user
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                className={`w-full pr-10 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all
                  ${errors.password ? "border-error focus:ring-error" : "border-gray-300"}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-secondary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-error">
                {errors.password.message}
              </p>
            )}
            {user && (
              <p className="mt-1 text-xs text-gray-400">
                Leave blank to keep current password
              </p>
            )}
          </div>

          {/* Warning for SUPERADMIN role */}
          {selectedRole === "SUPERADMIN" &&
            currentUserRole !== "SUPERADMIN" && (
              <div className="bg-warning/10 border border-warning/20 text-warning rounded-xl p-2 text-xs text-center">
                ⚠️ You don't have permission to assign SUPERADMIN role
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
              disabled={
                isLoading ||
                (selectedRole === "SUPERADMIN" &&
                  currentUserRole !== "SUPERADMIN")
              }
              className="flex-1 bg-secondary text-white py-2 rounded-xl font-medium hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {user ? "Updating..." : "Creating..."}
                </div>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
