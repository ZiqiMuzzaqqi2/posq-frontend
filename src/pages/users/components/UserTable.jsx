import {
  Edit2,
  Trash2,
  Power,
  PowerOff,
  User,
  Mail,
  Building2,
} from "lucide-react";

const getRoleBadgeColor = (role) => {
  switch (role) {
    case "SUPERADMIN":
      return "bg-purple-100 text-purple-700";
    case "ADMIN":
      return "bg-blue-100 text-blue-700";
    case "MANAGER":
      return "bg-green-100 text-green-700";
    case "KASIR":
      return "bg-orange-100 text-orange-700";
    case "GUDANG":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatRole = (role) => {
  switch (role) {
    case "SUPERADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    case "MANAGER":
      return "Manager";
    case "KASIR":
      return "Cashier";
    case "GUDANG":
      return "Warehouse";
    default:
      return role;
  }
};

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              User
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Branch
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Role
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Status
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-dark">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-sm text-gray">
                  <Mail size={12} />
                  {user.email}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-sm text-gray">
                  <Building2 size={12} />
                  {user.branch?.name || "-"}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                >
                  {formatRole(user.role)}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${
                      user.isActive
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-success" : "bg-gray-400"}`}
                  />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`p-1.5 rounded-lg transition-colors
                      ${
                        user.isActive
                          ? "text-warning hover:bg-warning/10"
                          : "text-success hover:bg-success/10"
                      }`}
                    title={user.isActive ? "Deactivate" : "Activate"}
                  >
                    {user.isActive ? (
                      <PowerOff size={16} />
                    ) : (
                      <Power size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onResetPassword(user)}
                    className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                    title="Reset Password"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2v6h-6" />
                      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                      <path d="M3 22v-6h6" />
                      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
