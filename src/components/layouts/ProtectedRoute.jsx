import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Return Outlet untuk nested routes (MainLayout akan di-render di sini)
  return <Outlet />;
};

export default ProtectedRoute;
