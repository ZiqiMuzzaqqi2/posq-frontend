import { Edit2, Trash2, Power, PowerOff, Building2 } from "lucide-react";

const BranchTable = ({
  branches,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No branches found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Code
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Branch Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Address
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Phone
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
          {branches.map((branch) => (
            <tr
              key={branch.id}
              className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
            >
              <td className="py-3 px-4 text-sm">
                <span className="font-mono text-secondary font-medium">
                  {branch.code}
                </span>
              </td>
              <td className="py-3 px-4 text-sm font-medium text-dark">
                {branch.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray">
                {branch.address || "-"}
              </td>
              <td className="py-3 px-4 text-sm text-gray">
                {branch.phone || "-"}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${
                      branch.isActive
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${branch.isActive ? "bg-success" : "bg-gray-400"}`}
                  />
                  {branch.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onToggleStatus(branch)}
                    className={`p-1.5 rounded-lg transition-colors
                      ${
                        branch.isActive
                          ? "text-warning hover:bg-warning/10"
                          : "text-success hover:bg-success/10"
                      }`}
                    title={branch.isActive ? "Deactivate" : "Activate"}
                  >
                    {branch.isActive ? (
                      <PowerOff size={16} />
                    ) : (
                      <Power size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(branch)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(branch)}
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

export default BranchTable;
