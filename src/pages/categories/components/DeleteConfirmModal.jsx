import { X, AlertTriangle, Tags } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-error/10 p-2 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-dark">
                Delete Category
              </h2>
              <p className="text-sm text-gray">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete category:
          </p>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
              <Tags className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="font-semibold text-dark">{category?.name}</p>
              {category?.description && (
                <p className="text-sm text-gray">{category.description}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Note: Categories with products cannot be deleted. Please delete or
            reassign products first.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || (category?._count?.products || 0) > 0}
            className="flex-1 bg-error text-white py-2 rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              "Yes, Delete Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
