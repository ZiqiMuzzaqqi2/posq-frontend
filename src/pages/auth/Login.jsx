import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import useAuthStore from "../../stores/authStore";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  // Features list untuk sisi kiri
  const features = [
    {
      icon: ShoppingBag,
      title: "Point of Sale",
      description: "Fast & easy transaction processing",
    },
    {
      icon: TrendingUp,
      title: "Real-time Stock",
      description: "Monitor inventory across branches",
    },
    {
      icon: Shield,
      title: "Multi-branch",
      description: "Manage multiple outlets effortlessly",
    },
    {
      icon: Zap,
      title: "Instant Reports",
      description: "Real-time business insights",
    },
  ];

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      </div>

      {/* Main Container - Fixed to screen height */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl animate-fade-in-up">
          {/* 2 Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40">
            {/* LEFT SIDE - Branding & Features */}
            <div className="bg-gradient-to-br from-secondary to-accent p-6 lg:p-8 flex flex-col justify-between min-h-[500px] lg:min-h-[550px]">
              {/* Logo & Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 backdrop-blur p-2.5 rounded-xl">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">PosQ</h1>
                    <p className="text-white/70 text-xs">
                      Point of Sale System
                    </p>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-white/80 text-xs leading-relaxed">
                    Login to access your dashboard and manage your business
                    operations efficiently.
                  </p>
                </div>

                {/* Features List - lebih compact */}
                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                        <feature.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-xs">
                          {feature.title}
                        </p>
                        <p className="text-white/60 text-[10px]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Text di Kiri */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/50 text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  <span>Secure & Reliable System</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form - lebih compact */}
            <div className="p-6 lg:p-8 bg-white/50 backdrop-blur-sm flex flex-col justify-center">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-3">
                  <Store className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-dark">Sign In</h2>
                <p className="text-gray text-xs mt-1">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Login Form - lebih compact spacing */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-3.5 h-3.5" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                 transition-all duration-200 bg-white/70
                                 ${errors.email ? "border-error focus:ring-error" : "border-gray-300"}`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-[10px] text-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray w-3.5 h-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-9 py-2 text-sm border rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                 transition-all duration-200 bg-white/70
                                 ${errors.password ? "border-error focus:ring-error" : "border-gray-300"}`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-secondary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[10px] text-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3 h-3 rounded border-gray-300 text-secondary focus:ring-primary"
                    />
                    <span className="text-[11px] text-gray">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-secondary hover:text-accent transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-error/10 border border-error/20 text-error rounded-xl p-2 text-[11px] text-center">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-secondary to-accent text-white py-2 rounded-xl font-medium text-sm
                             hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Demo Credentials - lebih compact */}
                <div className="bg-primary/20 backdrop-blur-sm rounded-xl p-3 mt-4">
                  <p className="font-medium text-secondary text-[10px] mb-1.5 text-center">
                    Demo Credentials:
                  </p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray">Super Admin:</span>
                      <span className="font-mono text-dark text-[9px]">
                        superadmin@posq.com / admin123
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray">Admin:</span>
                      <span className="font-mono text-dark text-[9px]">
                        admin@jakarta.posq.com / admin123
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray">Kasir:</span>
                      <span className="font-mono text-dark text-[9px]">
                        kasir@jakarta.posq.com / admin123
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer - lebih compact */}
          <p className="text-center text-white/50 text-[10px] mt-4">
            © 2024 PosQ System. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Login;
