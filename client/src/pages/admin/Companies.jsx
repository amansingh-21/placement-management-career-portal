import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import {
  getCompanies,
  updateCompanyApproval,
} from "../../services/adminService.js";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanies(status);

      setCompanies(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [status]);

  const handleApproval = async (companyId, approvalStatus) => {
    try {
      setActionLoading(true);
      setError("");

      await updateCompanyApproval(companyId, approvalStatus);

      await fetchCompanies();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update company approval."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Company Management</h1>
        <p>Review and approve companies registered by recruiters.</p>
      </div>

      <div className="search-bar">
        <div className="field" style={{ marginBottom: 0, minWidth: 220 }}>
          <label htmlFor="status" className="field-label">
            Filter by Status
          </label>

          <select
            id="status"
            className="select"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <Loader message="Loading companies..." />}

      <ErrorMessage message={error} />

      {!loading && !error && companies.length === 0 && (
        <div className="empty-state">
          <h3>No companies found</h3>
          <p>Try a different status filter.</p>
        </div>
      )}

      {!loading && companies.length > 0 && (
        <div className="list-stack">
          {companies.map((company) => (
            <section className="list-item" key={company._id}>
              <div className="list-item-header">
                <h2>{company.name}</h2>
                <StatusBadge status={company.approvalStatus} />
              </div>

              <div className="list-item-meta">
                <span>Recruiter: {company.createdBy?.name || "Unknown"}</span>
                <span>Email: {company.createdBy?.email || "Unknown"}</span>
              </div>

              {company.approvalStatus === "PENDING" && (
                <div className="list-item-footer">
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={actionLoading}
                      onClick={() => handleApproval(company._id, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={actionLoading}
                      onClick={() => handleApproval(company._id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Companies;