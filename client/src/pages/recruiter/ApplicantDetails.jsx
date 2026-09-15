import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService.js";

const ApplicantDetails = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const applications = await getRecruiterApplications();

        const found = applications.find((item) => item._id === id);

        if (!found) {
          setError("Applicant not found.");
          return;
        }

        setApplication(found);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load applicant."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      setStatusLoading(true);
      setStatusError("");

      const updated = await updateApplicationStatus(id, status);

      setApplication((current) => ({
        ...current,
        ...updated,
      }));
    } catch (error) {
      setStatusError(
        error.response?.data?.message || "Unable to update application status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading applicant..." />
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <Link to="/recruiter/applicants" className="back-link">
          ← Back to Applicants
        </Link>

        <ErrorMessage message={error || "Applicant not found."} />
      </DashboardLayout>
    );
  }

  const student = application.studentId;
  const job = application.jobId;

  const statusOptions = {
    APPLIED: ["SHORTLISTED", "REJECTED"],
    SHORTLISTED: ["INTERVIEW", "REJECTED"],
    INTERVIEW: ["SELECTED", "REJECTED"],
    SELECTED: [],
    REJECTED: [],
    WITHDRAWN: [],
  };

  const nextStatuses = statusOptions[application.status] || [];

  return (
    <DashboardLayout>
      <Link to="/recruiter/applicants" className="back-link">
        ← Back to Applicants
      </Link>

      <div className="page-header page-header-row">
        <div>
          <h1>{student?.name || student?.userId?.name || "Student"}</h1>
          <p>{student?.email || student?.userId?.email || "Not available"}</p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="card section">
        <h2 className="section-title">Job</h2>

        <div className="detail-grid" style={{ marginTop: 0 }}>
          <div>
            <p className="detail-label">Title</p>
            <p className="detail-value">{job?.title || "Job unavailable"}</p>
          </div>

          <div>
            <p className="detail-label">Company</p>
            <p className="detail-value">{job?.companyId?.name || "Unknown"}</p>
          </div>

          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">{job?.location || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Salary</p>
            <p className="detail-value">₹{job?.salary ?? "Not specified"}</p>
          </div>
        </div>
      </div>

      <div className="card section">
        <h2 className="section-title">Update Status</h2>

        <ErrorMessage message={statusError} />

        {nextStatuses.length > 0 ? (
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {nextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                className={status === "REJECTED" ? "btn btn-outline" : "btn btn-primary"}
                onClick={() => handleStatusChange(status)}
                disabled={statusLoading}
              >
                {statusLoading && <span className="btn-spinner" />}
                {statusLoading ? "Updating..." : `Mark as ${status}`}
              </button>
            ))}
          </div>
        ) : (
          <p>No further status transitions are available.</p>
        )}
      </div>

      <div className="card section">
        <h2 className="section-title">Application Timeline</h2>

        {application.statusHistory?.length > 0 ? (
          <div className="timeline">
            {application.statusHistory.map((entry, index) => {
              const changedBy = entry.changedBy;

              return (
                <div className="timeline-item" key={entry._id || `${entry.status}-${index}`}>
                  <h3>{entry.status}</h3>

                  <p>
                    Date:{" "}
                    {entry.changedAt
                      ? new Date(entry.changedAt).toLocaleString()
                      : "Not available"}
                  </p>

                  <p>Changed By: {changedBy?.name || changedBy?.email || "Unknown"}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No status history available.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicantDetails;