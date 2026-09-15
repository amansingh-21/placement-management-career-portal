import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import api from "../../services/api.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/recruiter");

      setDashboard(response.data.dashboard);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load dashboard."
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
        <div className="page-header">
          <h1>Recruiter Dashboard</h1>
        </div>

        <Loader message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1>Recruiter Dashboard</h1>
        </div>

        <ErrorMessage message={error} />

        <button type="button" className="btn btn-primary" onClick={fetchDashboard}>
          Try Again
        </button>
      </DashboardLayout>
    );
  }

  const company = dashboard?.company || {};

  const metrics = dashboard?.metrics || {};

  const upcomingInterviews = dashboard?.upcomingInterviews || [];

  const recentApplications = dashboard?.recentApplications || [];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage your recruitment activities from one place.</p>
      </div>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Company</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/recruiter/company")}
          >
            Manage Company
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Company</p>
            <p className="stat-value" style={{ fontSize: 18 }}>
              {company.name || "Company not available"}
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Approval Status</p>
            <div style={{ marginTop: "var(--space-2)" }}>
              <StatusBadge status={company.approvalStatus || "PENDING"} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Job Summary</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Manage Jobs
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{metrics.totalJobs ?? 0}</p>
            <p className="stat-label">Total Jobs</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.publishedJobs ?? 0}</p>
            <p className="stat-label">Published Jobs</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.closedJobs ?? 0}</p>
            <p className="stat-label">Closed Jobs</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.pendingJobs ?? 0}</p>
            <p className="stat-label">Pending Approval</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Application Summary</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/recruiter/applicants")}
          >
            View Applicants
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{metrics.totalApplications ?? 0}</p>
            <p className="stat-label">Total Applications</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.shortlistedApplications ?? 0}</p>
            <p className="stat-label">Shortlisted</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.interviewApplications ?? 0}</p>
            <p className="stat-label">Interviews</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.selectedApplications ?? 0}</p>
            <p className="stat-label">Selected</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Upcoming Interviews</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/recruiter/interviews")}
          >
            Manage Interviews
          </button>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming interviews</h3>
            <p>Scheduled interviews will appear here.</p>
          </div>
        ) : (
          <div className="list-stack">
            {upcomingInterviews.map((interview) => {
              const application = interview.applicationId;

              const job = application?.jobId;

              return (
                <div className="list-item" key={interview._id}>
                  <div className="list-item-header">
                    <h3>{job?.title || "Job title unavailable"}</h3>
                    <StatusBadge status={interview.status} />
                  </div>

                  <div className="list-item-meta">
                    <span>
                      Date:{" "}
                      {interview.scheduledAt
                        ? new Date(interview.scheduledAt).toLocaleString()
                        : "Date unavailable"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Recent Applications</h2>

        {recentApplications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p>Applications to your jobs will appear here.</p>
          </div>
        ) : (
          <div className="list-stack">
            {recentApplications.map((application) => {
              const job = application.jobId;

              const student = application.studentId;

              return (
                <div className="list-item" key={application._id}>
                  <div className="list-item-header">
                    <h3>{job?.title || "Job title unavailable"}</h3>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="list-item-meta">
                    <span>Degree: {student?.degree || "Not available"}</span>
                    <span>
                      Graduation Year: {student?.graduationYear || "Not available"}
                    </span>
                    <span>CGPA: {student?.cgpa ?? "Not available"}</span>
                    <span>
                      Applied:{" "}
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;