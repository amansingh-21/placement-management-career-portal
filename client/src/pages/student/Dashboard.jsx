import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1>Student Dashboard</h1>

      <p>
        Welcome to the student dashboard.
      </p>

      <section>
        <h2>Interviews</h2>

        <p>
          View your scheduled, rescheduled, cancelled,
          and completed interviews.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/student/interviews")
          }
        >
          View Interviews
        </button>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;