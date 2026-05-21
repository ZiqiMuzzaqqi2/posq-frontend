import { clsx } from "clsx";

const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          className={clsx(
            "w-full px-4 py-2 border rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            Icon && "pl-10",
            error ? "border-error focus:ring-error" : "border-gray-300",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Input;
