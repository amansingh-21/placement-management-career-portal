import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import api from "../../services/api.js";
import {
  getCompanies,
  updateCompanyApproval,
} from "../../services/adminService.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [error, setError] = useState("");
  const [companyError, setCompanyError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/admin");

      setDashboard(response.data.dashboard);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setCompaniesLoading(true);
      setCompanyError("");

      const data = await getCompanies("PENDING");

      setCompanies(data);
    } catch (error) {
      setCompanyError(
        error.response?.data?.message || "Unable to load pending companies."
      );
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleCompanyApproval = async (companyId, approvalStatus) => {
    try {
      setCompanyError("");

      await updateCompanyApproval(companyId, approvalStatus);

      await fetchCompanies();
      await fetchDashboard();
    } catch (error) {
      setCompanyError(
        error.response?.data?.message || "Unable to update company approval."
      );
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1>Admin Dashboard</h1>
        </div>

        <Loader message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1>Admin Dashboard</h1>
        </div>

        <ErrorMessage message={error} />

        <button type="button" className="btn btn-primary" onClick={fetchDashboard}>
          Try Again
        </button>
      </DashboardLayout>
    );
  }

  const metrics = dashboard?.metrics || {};

  const upcomingInterviews = dashboard?.upcomingInterviews || [];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor placement activity across the system.</p>
      </div>

      <section className="section">
        <h2 className="section-title">User Summary</h2>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{metrics.totalUsers ?? 0}</p>
            <p className="stat-label">Total Users</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.totalStudents ?? 0}</p>
            <p className="stat-label">Students</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.totalRecruiters ?? 0}</p>
            <p className="stat-label">Recruiters</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Company Summary</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/admin/companies")}
          >
            Manage Companies
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{metrics.totalCompanies ?? 0}</p>
            <p className="stat-label">Total Companies</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.pendingCompanies ?? 0}</p>
            <p className="stat-label">Pending</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.approvedCompanies ?? 0}</p>
            <p className="stat-label">Approved</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.rejectedCompanies ?? 0}</p>
            <p className="stat-label">Rejected</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Company Approvals</h2>

        <ErrorMessage message={companyError} />

        {companiesLoading ? (
          <Loader message="Loading pending companies..." />
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing to review</h3>
            <p>No companies are waiting for approval.</p>
          </div>
        ) : (
          <div className="list-stack">
            {companies.map((company) => (
              <div className="list-item" key={company._id}>
                <div className="list-item-header">
                  <h3>{company.name}</h3>
                  <StatusBadge status={company.approvalStatus} />
                </div>

                <div className="list-item-footer">
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCompanyApproval(company._id, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCompanyApproval(company._id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="page-header-row section-title">
          <h2>Job Summary</h2>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/admin/jobs")}
          >
            Job Approvals
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{metrics.totalJobs ?? 0}</p>
            <p className="stat-label">Total Jobs</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.pendingJobs ?? 0}</p>
            <p className="stat-label">Pending Approval</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.approvedJobs ?? 0}</p>
            <p className="stat-label">Approved</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.rejectedJobs ?? 0}</p>
            <p className="stat-label">Rejected</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.publishedJobs ?? 0}</p>
            <p className="stat-label">Published</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">{metrics.closedJobs ?? 0}</p>
            <p className="stat-label">Closed</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Application Summary</h2>

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
        <h2 className="section-title">Interview Summary</h2>

        <div className="stat-grid" style={{ marginBottom: "var(--space-6)" }}>
          <div className="stat-card">
            <p className="stat-value">{metrics.totalInterviews ?? 0}</p>
            <p className="stat-label">Total Interviews</p>
          </div>
        </div>

        <h3 style={{ marginBottom: "var(--space-4)" }}>Upcoming Interviews</h3>

        {upcomingInterviews.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming interviews</h3>
            <p>Scheduled interviews across all companies will appear here.</p>
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
    </DashboardLayout>
  );
};

export default Dashboard;