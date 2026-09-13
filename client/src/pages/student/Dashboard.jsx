import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
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
        "/dashboard/student"
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
      <DashboardLayout>
        <div className="dashboard-loading">
          <h1>Student Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="dashboard-error">
          <h1>Student Dashboard</h1>
          <p>{error}</p>

          <button
            type="button"
            className="dashboard-button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const profile =
    dashboard?.profile || {};

  const metrics =
    dashboard?.metrics || {};

  const upcomingInterviews =
    dashboard?.upcomingInterviews || [];

  const recentApplications =
    dashboard?.recentApplications || [];

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Student Dashboard</h1>

            <p>
              Track your placement progress,
              applications, and interviews.
            </p>
          </header>

          <section className="dashboard-section">
            <h2>Profile</h2>

            <div className="dashboard-info">
              <div className="dashboard-info-item">
                <p>Profile Completion</p>
                <h3>
                  {profile.profileCompletion ?? 0}%
                </h3>
              </div>

              <div className="dashboard-info-item">
                <p>Degree</p>
                <h3>
                  {profile.degree ||
                    "Not available"}
                </h3>
              </div>

              <div className="dashboard-info-item">
                <p>Graduation Year</p>
                <h3>
                  {profile.graduationYear ||
                    "Not available"}
                </h3>
              </div>

              <div className="dashboard-info-item">
                <p>CGPA</p>
                <h3>
                  {profile.cgpa ??
                    "Not available"}
                </h3>
              </div>

              <div className="dashboard-info-item">
                <p>Backlogs</p>
                <h3>
                  {profile.backlogs ?? 0}
                </h3>
              </div>
            </div>
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

                    const company =
                      job?.companyId;

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
                          Company:{" "}
                          {company?.name ||
                            "Company unavailable"}
                        </p>

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
                  "/student/interviews"
                )
              }
            >
              View Interviews
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

                    const company =
                      job?.companyId;

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
                          Company:{" "}
                          {company?.name ||
                            "Company unavailable"}
                        </p>

                        <p>
                          Location:{" "}
                          {job?.location ||
                            "Not specified"}
                        </p>

                        <p>
                          Salary:{" "}
                          {job?.salary != null
                            ? job.salary
                            : "Not specified"}
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
    </DashboardLayout>
  );
};

export default Dashboard;