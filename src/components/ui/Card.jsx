import { clsx } from "clsx";

const Card = ({ children, className = "", padding = "p-6" }) => {
  return (
    <div className={clsx("bg-white rounded-xl shadow-md", padding, className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={clsx("mb-4", className)}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={clsx("text-xl font-semibold text-dark", className)}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={clsx("text-sm text-gray", className)}>{children}</p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={clsx("mt-4 pt-4 border-t border-gray-200", className)}>
    {children}
  </div>
);

export default Card;
