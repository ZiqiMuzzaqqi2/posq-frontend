import { clsx } from "clsx";

const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={clsx(
          "border-4 border-primary border-t-secondary rounded-full animate-spin",
          sizes[size],
          className,
        )}
      />
    </div>
  );
};

export default Spinner;
