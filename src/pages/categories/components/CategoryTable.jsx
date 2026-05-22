import { Edit2, Trash2, Tags, Package } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Tags className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No categories found</p>
        <p className="text-xs text-gray-400 mt-1">
          Create your first category to start organizing products
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              #
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Category Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Description
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Products
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category.id}
              className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-gray">{index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Tags className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-dark">
                    {category.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray">
                  {category.description || "-"}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Package className="w-3 h-3 text-gray" />
                  <span className="text-sm font-medium text-dark">
                    {category._count?.products || 0}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    className={`p-1.5 rounded-lg transition-colors
                      ${
                        (category._count?.products || 0) > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-error hover:bg-error/10"
                      }`}
                    title={
                      (category._count?.products || 0) > 0
                        ? "Cannot delete category with products"
                        : "Delete category"
                    }
                    disabled={(category._count?.products || 0) > 0}
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

export default CategoryTable;
