import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import AuthLayout from "../../components/layouts/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Show/Hide Password & Forgot Password */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-secondary hover:text-accent flex items-center gap-1"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPassword ? "Hide" : "Show"} Password
          </button>
          <button
            type="button"
            className="text-sm text-secondary hover:text-accent"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Demo Credentials Info */}
        <div className="bg-primary/30 rounded-lg p-3 text-sm">
          <p className="font-medium text-secondary mb-1">Demo Credentials:</p>
          <div className="space-y-1 text-gray text-xs">
            <p>Super Admin: superadmin@posq.com / admin123</p>
            <p>Admin: admin@jakarta.posq.com / admin123</p>
            <p>Kasir: kasir@jakarta.posq.com / admin123</p>
          </div>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
