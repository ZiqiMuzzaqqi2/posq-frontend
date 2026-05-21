import { Store } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Store className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-white">PosQ</h1>
          <p className="text-white/80 mt-1">Point of Sale System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {title && (
            <h2 className="text-2xl font-semibold text-dark text-center mb-2">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray text-center mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
