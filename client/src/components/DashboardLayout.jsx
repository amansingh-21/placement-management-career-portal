import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div>
        <Sidebar />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;