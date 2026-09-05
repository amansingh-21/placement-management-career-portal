import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <main>
        <h1>Recruiter Dashboard</h1>

        <section>
          <h2>Company</h2>

          <p>
            Manage your company profile and check your
            company approval status.
          </p>

          <button
            onClick={() => navigate("/recruiter/company")}
          >
            Manage Company
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;