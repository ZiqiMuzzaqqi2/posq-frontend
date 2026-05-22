import {
  Package,
  ShoppingCart,
  Users,
  Store,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../../stores/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  // Stats data
  const stats = [
    {
      title: "Today's Sales",
      value: "Rp 2,500,000",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-secondary to-accent",
    },
    {
      title: "Total Products",
      value: "156",
      change: "+8",
      trend: "up",
      icon: Package,
      color: "from-accent to-primary",
    },
    {
      title: "Low Stock Alert",
      value: "8",
      change: "+3",
      trend: "down",
      icon: AlertCircle,
      color: "from-warning to-orange-400",
    },
    {
      title: "Active Employees",
      value: "12",
      change: "0",
      trend: "neutral",
      icon: Users,
      color: "from-primary to-secondary",
    },
  ];

  // Recent transactions data
  const recentTransactions = [
    {
      id: "INV-001",
      customer: "John Doe",
      amount: 250000,
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: "INV-002",
      customer: "Jane Smith",
      amount: 175000,
      time: "15 minutes ago",
      status: "completed",
    },
    {
      id: "INV-003",
      customer: "Bob Wilson",
      amount: 450000,
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: "INV-004",
      customer: "Alice Brown",
      amount: 89000,
      time: "3 hours ago",
      status: "completed",
    },
  ];

  // Low stock products
  const lowStockProducts = [
    { name: "Product A", stock: 3, minStock: 10, unit: "pcs" },
    { name: "Product B", stock: 5, minStock: 15, unit: "pcs" },
    { name: "Product C", stock: 2, minStock: 20, unit: "box" },
  ];

  return (
    <div className="p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Store className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
            , {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-white/80">
            Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-md`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium
                ${stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-error" : "text-gray"}`}
              >
                {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                {stat.trend === "down" && <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{stat.value}</p>
            <p className="text-sm text-gray mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Recent Transactions
                </h3>
                <p className="text-sm text-gray">Latest sales activity</p>
              </div>
              <button className="text-secondary hover:text-accent transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{transaction.id}</p>
                    <p className="text-sm text-gray">{transaction.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      Rp {transaction.amount.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray mt-1">
                      <Clock className="w-3 h-3" />
                      {transaction.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-warning/5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <h3 className="text-lg font-semibold text-dark">
                Low Stock Alert
              </h3>
            </div>
            <p className="text-sm text-gray mt-1">
              Products need immediate restocking
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((product, index) => (
              <div
                key={index}
                className="p-4 hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{product.name}</p>
                    <p className="text-sm text-gray">
                      Min stock: {product.minStock} {product.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-error">
                      Stock: {product.stock} {product.unit}
                    </p>
                    <button className="text-xs text-secondary hover:text-accent mt-1">
                      Restock Now →
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{
                      width: `${(product.stock / product.minStock) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
