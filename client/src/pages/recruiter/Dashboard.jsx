import Navbar from "../../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

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
            Manage your company profile and check your company approval status.
          </p>

          <button
            type="button"
            onClick={() => navigate("/recruiter/company")}
          >
            Manage Company
          </button>
        </section>

        <section>
          <h2>Jobs</h2>

          <p>
            Create, manage, submit, and close your job postings.
          </p>

          <button
            type="button"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Manage Jobs
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;