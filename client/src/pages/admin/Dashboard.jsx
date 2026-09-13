import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import api from "../../services/api.js";

import "../../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dashboard/admin"
      );

      setDashboard(
        response.data.dashboard
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />

        <div className="dashboard-loading">
          <h1>Admin Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />

        <div className="dashboard-error">
          <h1>Admin Dashboard</h1>

          <p>{error}</p>

          <button
            type="button"
            className="dashboard-button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metrics =
    dashboard?.metrics || {};

  const upcomingInterviews =
    dashboard?.upcomingInterviews || [];

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>

          <p>
            Monitor placement activity across
            the system.
          </p>
        </header>

        <section className="dashboard-section">
          <h2>User Summary</h2>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>
                {metrics.totalUsers ?? 0}
              </h3>
              <p>Total Users</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.totalStudents ?? 0}
              </h3>
              <p>Students</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.totalRecruiters ?? 0}
              </h3>
              <p>Recruiters</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Company Summary</h2>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>
                {metrics.totalCompanies ?? 0}
              </h3>
              <p>Total Companies</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.pendingCompanies ?? 0}
              </h3>
              <p>Pending</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.approvedCompanies ?? 0}
              </h3>
              <p>Approved</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.rejectedCompanies ?? 0}
              </h3>
              <p>Rejected</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Job Summary</h2>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>
                {metrics.totalJobs ?? 0}
              </h3>
              <p>Total Jobs</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.pendingJobs ?? 0}
              </h3>
              <p>Pending Approval</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.approvedJobs ?? 0}
              </h3>
              <p>Approved</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.rejectedJobs ?? 0}
              </h3>
              <p>Rejected</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.publishedJobs ?? 0}
              </h3>
              <p>Published</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.closedJobs ?? 0}
              </h3>
              <p>Closed</p>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-button"
            onClick={() =>
              navigate("/admin/jobs")
            }
          >
            Job Approvals
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Application Summary</h2>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>
                {metrics.totalApplications ??
                  0}
              </h3>
              <p>Total Applications</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.shortlistedApplications ??
                  0}
              </h3>
              <p>Shortlisted</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.interviewApplications ??
                  0}
              </h3>
              <p>Interviews</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.selectedApplications ??
                  0}
              </h3>
              <p>Selected</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.rejectedApplications ??
                  0}
              </h3>
              <p>Rejected</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Interview Summary</h2>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>
                {metrics.totalInterviews ?? 0}
              </h3>
              <p>Total Interviews</p>
            </div>
          </div>

          <h3>Upcoming Interviews</h3>

          {upcomingInterviews.length ===
          0 ? (
            <div className="dashboard-empty">
              <p>
                No upcoming interviews.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">
              {upcomingInterviews.map(
                (interview) => {
                  const application =
                    interview.applicationId;

                  const job =
                    application?.jobId;

                  return (
                    <div
                      className="dashboard-list-item"
                      key={interview._id}
                    >
                      <h3>
                        {job?.title ||
                          "Job title unavailable"}
                      </h3>

                      <p>
                        Date:{" "}
                        {interview.scheduledAt
                          ? new Date(
                              interview.scheduledAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                      <span className="dashboard-status">
                        {interview.status}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;