import { clsx } from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-secondary text-white hover:bg-opacity-90 focus:ring-secondary",
    outline:
      "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary",
    ghost: "text-secondary hover:bg-primary focus:ring-secondary",
    danger: "bg-error text-white hover:bg-opacity-90 focus:ring-error",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
