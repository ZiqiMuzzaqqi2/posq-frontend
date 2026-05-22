import { NavLink, useNavigate } from "react-router-dom";
import { Store, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import useMenu from "../../hooks/useMenu";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { menuItems } = useMenu(); // Menggunakan hook untuk mendapatkan menu

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-secondary to-accent shadow-xl transition-all duration-300 z-20
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          <div className="bg-white/20 backdrop-blur p-2 rounded-xl">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PosQ</h1>
            <p className="text-white/60 text-[10px]">v1.0.0</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`
                }
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} />
                <span
                  className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
                >
                  {item.label}
                </span>
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-dark text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
        <div
          className={`flex items-center gap-3 mb-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="bg-white/20 p-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div
            className={`flex-1 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
          >
            <p className="text-white font-medium text-sm truncate">
              {user?.name}
            </p>
            <p className="text-white/60 text-xs capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:text-white hover:bg-red-600 transition-all duration-200
            ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={18} />
          <span
            className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
