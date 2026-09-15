import { useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-shell">
      <Navbar onMenuToggle={() => setIsSidebarOpen((value) => !value)} />

      <div className="app-body">
        <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />

        {isSidebarOpen && (
          <div
            className="app-sidebar-backdrop"
            onClick={closeSidebar}
            role="presentation"
          />
        )}

        <main className="app-main">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;