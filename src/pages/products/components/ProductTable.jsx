import {
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { useState } from "react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Product Image Component dengan error handling yang aman
const ProductImage = ({ imageUrl, productName }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Jika tidak ada URL atau error, tampilkan placeholder
  if (!imageUrl || hasError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  // Validasi URL - hanya tampilkan URL yang valid (http/https, bukan blob)
  const isValidUrl =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  if (!isValidUrl) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={productName}
        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

const ProductTable = ({
  products,
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark w-16">
              Image
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              SKU
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Product Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-dark">
              Category
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
              Buy Price
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-dark">
              Sell Price
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-dark">
              Stock
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
          {products.map((product) => {
            const totalStock =
              product.stocks?.reduce((sum, s) => sum + s.quantity, 0) || 0;
            const isLowStock = totalStock > 0 && totalStock <= 5;

            return (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-primary/10 transition-colors"
              >
                {/* Image Column */}
                <td className="py-3 px-4 text-center">
                  <ProductImage
                    imageUrl={product.imageUrl}
                    productName={product.name}
                  />
                </td>

                {/* SKU Column */}
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-secondary font-medium">
                    {product.sku}
                  </span>
                </td>

                {/* Product Name Column */}
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-dark">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray truncate max-w-[200px]">
                        {product.description}
                      </p>
                    )}
                  </div>
                </td>

                {/* Category Column */}
                <td className="py-3 px-4">
                  <CategoryBadge category={product.category} />
                </td>

                {/* Buy Price Column */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray">
                    {formatCurrency(product.buyPrice)}
                  </span>
                </td>

                {/* Sell Price Column */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-medium text-success">
                    {formatCurrency(product.sellPrice)}
                  </span>
                </td>

                {/* Stock Column */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium
                    ${totalStock === 0 ? "text-error" : isLowStock ? "text-warning" : "text-success"}`}
                  >
                    {totalStock}
                    {isLowStock && totalStock > 0 && (
                      <span className="text-xs text-warning" title="Low stock">
                        ⚠️
                      </span>
                    )}
                  </span>
                </td>

                {/* Status Column */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${
                        product.isActive
                          ? "bg-success/10 text-success"
                          : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-success" : "bg-gray-400"}`}
                    />
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onToggleStatus(product)}
                      className={`p-1.5 rounded-lg transition-colors
                        ${
                          product.isActive
                            ? "text-warning hover:bg-warning/10"
                            : "text-success hover:bg-success/10"
                        }`}
                      title={product.isActive ? "Deactivate" : "Activate"}
                    >
                      {product.isActive ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
