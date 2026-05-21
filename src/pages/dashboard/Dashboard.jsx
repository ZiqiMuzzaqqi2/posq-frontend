import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  LogOut,
  User,
  Building2,
} from "lucide-react";
import useAuthStore from "../../stores/authStore";
import Button from "../../components/ui/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mock stats data (nanti akan diganti dengan API)
  const stats = [
    {
      title: "Today's Sales",
      value: "Rp 2,500,000",
      icon: ShoppingCart,
      color: "bg-secondary",
    },
    { title: "Products", value: "156", icon: Package, color: "bg-accent" },
    { title: "Low Stock", value: "8", icon: Store, color: "bg-warning" },
    { title: "Employees", value: "12", icon: Users, color: "bg-primary" },
  ];

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-blue-500 shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3 bg-light rounded-lg px-4 py-2">
                <div className="bg-secondary/10 p-2 rounded-full">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{user?.name}</p>
                  <p className="text-xs text-gray">{user?.role}</p>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-gray" />
                  <p className="text-xs text-gray">{user?.branch?.name}</p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r bg-blue-500 from-secondary to-accent rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-white/80">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-dark">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-dark">INV-2024-001</p>
                      <p className="text-xs text-gray">2 minutes ago</p>
                    </div>
                    <p className="font-semibold text-success">Rp 150,000</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-dark">
                        Product Name {i + 1}
                      </p>
                      <p className="text-xs text-warning">
                        Stock: {i + 2} left
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
