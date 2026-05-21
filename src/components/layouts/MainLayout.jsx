import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content - with margin left based on sidebar state */}
      <main
        className={`transition-all duration-300 min-h-screen
          ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Content Outlet untuk halaman anak */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
