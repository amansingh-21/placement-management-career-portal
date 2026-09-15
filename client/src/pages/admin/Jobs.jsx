import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import {
  getPendingJobs,
  approveJob,
  rejectJob,
} from "../../services/jobService.js";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingJobs();

      setJobs(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load pending jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (jobId) => {
    try {
      setError("");

      await approveJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to approve job."
      );
    }
  };

  const handleReject = async (jobId) => {
    try {
      setError("");

      await rejectJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to reject job."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Job Approvals</h1>
        <p>Jobs submitted by recruiters that are waiting for review.</p>
      </div>

      {loading && <Loader message="Loading pending jobs..." />}

      <ErrorMessage message={error} />

      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <h3>Nothing to review</h3>
          <p>No jobs are waiting for approval.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="list-stack">
          {jobs.map((job) => (
            <article className="list-item" key={job._id}>
              <div className="list-item-header">
                <h2>{job.title}</h2>

                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  <StatusBadge status={job.status} />
                  <StatusBadge status={job.approvalStatus} />
                </div>
              </div>

              <div className="list-item-meta">
                <span>Company: {job.companyId?.name || "Unknown"}</span>
                <span>Location: {job.location || "Not specified"}</span>
                <span>Salary: ₹{job.salary}</span>
                <span>
                  Deadline:{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "Not specified"}
                </span>
              </div>

              <p>{job.description}</p>

              <div className="list-item-footer">
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(job._id)}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleReject(job._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminJobs;