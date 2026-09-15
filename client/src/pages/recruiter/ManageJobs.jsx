import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import {
  getMyJobs,
  submitJob,
  closeJob,
} from "../../services/jobService.js";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      setJobs(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (jobId) => {
    try {
      setError("");

      await submitJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to submit job."
      );
    }
  };

  const handleClose = async (jobId) => {
    try {
      setError("");

      await closeJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to close job."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header page-header-row">
        <div>
          <h1>Manage Jobs</h1>
          <p>Create, submit, and close the roles you're hiring for.</p>
        </div>

        <Link to="/recruiter/jobs/create" className="btn btn-primary">
          Create Job
        </Link>
      </div>

      {loading && <Loader message="Loading jobs..." />}

      <ErrorMessage message={error} />

      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <h3>No jobs yet</h3>
          <p>You have not created any jobs.</p>

          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            Create your first job
          </Link>
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
                <span>
                  Deadline:{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "Not specified"}
                </span>
              </div>

              {(job.status === "DRAFT" && job.approvalStatus === "PENDING") ||
              (job.approvalStatus === "APPROVED" && job.status === "PUBLISHED") ? (
                <div className="list-item-footer">
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    {job.status === "DRAFT" && job.approvalStatus === "PENDING" && (
                      <>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSubmit(job._id)}
                        >
                          Submit for Approval
                        </button>
                      </>
                    )}

                    {job.approvalStatus === "APPROVED" && job.status === "PUBLISHED" && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleClose(job._id)}
                      >
                        Close Job
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageJobs;