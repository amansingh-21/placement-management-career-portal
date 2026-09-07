import Navbar from "../../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <main>
        <h1>Admin Dashboard</h1>

        <p>
          Manage companies and job approvals from the admin panel.
        </p>

        <div>
          <button onClick={() => navigate("/admin/jobs")}>
            Job Approvals
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;