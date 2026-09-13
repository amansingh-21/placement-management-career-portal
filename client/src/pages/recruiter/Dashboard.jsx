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
        "/dashboard/recruiter"
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
          <h1>Recruiter Dashboard</h1>
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
          <h1>Recruiter Dashboard</h1>

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

  const company =
    dashboard?.company || {};

  const metrics =
    dashboard?.metrics || {};

  const upcomingInterviews =
    dashboard?.upcomingInterviews || [];

  const recentApplications =
    dashboard?.recentApplications || [];

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Recruiter Dashboard</h1>

          <p>
            Manage your recruitment activities
            from one place.
          </p>
        </header>

        <section className="dashboard-section">
          <h2>Company</h2>

          <div className="dashboard-info">
            <div className="dashboard-info-item">
              <p>Company</p>

              <h3>
                {company.name ||
                  "Company not available"}
              </h3>
            </div>

            <div className="dashboard-info-item">
              <p>Approval Status</p>

              <h3>
                {company.approvalStatus ||
                  "Not available"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-button"
            onClick={() =>
              navigate(
                "/recruiter/company"
              )
            }
          >
            Manage Company
          </button>
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
                {metrics.publishedJobs ?? 0}
              </h3>
              <p>Published Jobs</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.closedJobs ?? 0}
              </h3>
              <p>Closed Jobs</p>
            </div>

            <div className="dashboard-card">
              <h3>
                {metrics.pendingJobs ?? 0}
              </h3>
              <p>Pending Approval</p>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-button"
            onClick={() =>
              navigate(
                "/recruiter/jobs"
              )
            }
          >
            Manage Jobs
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
          </div>

          <button
            type="button"
            className="dashboard-button"
            onClick={() =>
              navigate(
                "/recruiter/applicants"
              )
            }
          >
            View Applicants
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Upcoming Interviews</h2>

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

          <button
            type="button"
            className="dashboard-button"
            onClick={() =>
              navigate(
                "/recruiter/interviews"
              )
            }
          >
            Manage Interviews
          </button>
        </section>

        <section className="dashboard-section">
          <h2>Recent Applications</h2>

          {recentApplications.length ===
          0 ? (
            <div className="dashboard-empty">
              <p>
                No applications yet.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">
              {recentApplications.map(
                (application) => {
                  const job =
                    application.jobId;

                  const student =
                    application.studentId;

                  return (
                    <div
                      className="dashboard-list-item"
                      key={application._id}
                    >
                      <h3>
                        {job?.title ||
                          "Job title unavailable"}
                      </h3>

                      <p>
                        Degree:{" "}
                        {student?.degree ||
                          "Not available"}
                      </p>

                      <p>
                        Graduation Year:{" "}
                        {student?.graduationYear ||
                          "Not available"}
                      </p>

                      <p>
                        CGPA:{" "}
                        {student?.cgpa ??
                          "Not available"}
                      </p>

                      <span className="dashboard-status">
                        {application.status}
                      </span>

                      <p>
                        Applied:{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>
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