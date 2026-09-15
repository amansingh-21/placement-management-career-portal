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

      const response = await api.get("/dashboard/student");

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
          <h1>Student Dashboard</h1>
        </div>

        <Loader message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1>Student Dashboard</h1>
        </div>

        <ErrorMessage message={error} />

        <button type="button" className="btn btn-primary" onClick={fetchDashboard}>
          Try Again
        </button>
      </DashboardLayout>
    );
  }

  const profile = dashboard?.profile || {};

  const metrics = dashboard?.metrics || {};

  const upcomingInterviews = dashboard?.upcomingInterviews || [];

  const recentApplications = dashboard?.recentApplications || [];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Student Dashboard</h1>
        <p>Track your placement progress, applications, and interviews.</p>
      </div>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Profile</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/student/profile")}
          >
            Edit Profile
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{profile.profileCompletion ?? 0}%</p>
            <p className="stat-label">Profile Completion</p>
          </div>

          <div className="stat-card">
            <p className="stat-value" style={{ fontSize: 18 }}>
              {profile.degree || "Not available"}
            </p>
            <p className="stat-label">Degree</p>
          </div>

          <div className="stat-card">
            <p className="stat-value" style={{ fontSize: 18 }}>
              {profile.graduationYear || "Not available"}
            </p>
            <p className="stat-label">Graduation Year</p>
          </div>

          <div className="stat-card">
            <p className="stat-value" style={{ fontSize: 18 }}>
              {profile.cgpa ?? "Not available"}
            </p>
            <p className="stat-label">CGPA</p>
          </div>

          <div className="stat-card">
            <p className="stat-value" style={{ fontSize: 18 }}>
              {profile.backlogs ?? 0}
            </p>
            <p className="stat-label">Backlogs</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Application Summary</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/student/applications")}
          >
            View Applications
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

          <div className="stat-card">
            <p className="stat-value">{metrics.rejectedApplications ?? 0}</p>
            <p className="stat-label">Rejected</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Upcoming Interviews</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/student/interviews")}
          >
            View Interviews
          </button>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming interviews</h3>
            <p>Interviews scheduled by recruiters will appear here.</p>
          </div>
        ) : (
          <div className="list-stack">
            {upcomingInterviews.map((interview) => {
              const application = interview.applicationId;

              const job = application?.jobId;

              const company = job?.companyId;

              return (
                <div className="list-item" key={interview._id}>
                  <div className="list-item-header">
                    <h3>{job?.title || "Job title unavailable"}</h3>
                    <StatusBadge status={interview.status} />
                  </div>

                  <div className="list-item-meta">
                    <span>Company: {company?.name || "Company unavailable"}</span>
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
            <p>Apply to a job to start tracking your progress.</p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/student/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="list-stack">
            {recentApplications.map((application) => {
              const job = application.jobId;

              const company = job?.companyId;

              return (
                <div className="list-item" key={application._id}>
                  <div className="list-item-header">
                    <h3>{job?.title || "Job title unavailable"}</h3>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="list-item-meta">
                    <span>Company: {company?.name || "Company unavailable"}</span>
                    <span>Location: {job?.location || "Not specified"}</span>
                    <span>
                      Salary: {job?.salary != null ? job.salary : "Not specified"}
                    </span>
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