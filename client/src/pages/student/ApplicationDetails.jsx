import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getMyApplications } from "../../services/applicationService.js";

const ApplicationDetails = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const applications = await getMyApplications();

        const found = applications.find((item) => item._id === id);

        if (!found) {
          setError("Application not found.");
          return;
        }

        setApplication(found);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load application."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading application..." />
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <Link to="/student/applications" className="back-link">
          ← Back to Applications
        </Link>

        <ErrorMessage message={error || "Application not found."} />
      </DashboardLayout>
    );
  }

  const job = application.jobId;

  return (
    <DashboardLayout>
      <Link to="/student/applications" className="back-link">
        ← Back to Applications
      </Link>

      <div className="page-header-row" style={{ marginBottom: "var(--space-7)" }}>
        <div>
          <h1>{job?.title || "Job unavailable"}</h1>
          <p>{job?.companyId?.name || "Unknown company"}</p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="card section">
        <div className="detail-grid">
          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">{job?.location || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Salary</p>
            <p className="detail-value">₹{job?.salary ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Deadline</p>
            <p className="detail-value">
              {job?.deadline
                ? new Date(job.deadline).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
        </div>

        <h2 className="section-title">Job Description</h2>
        <p style={{ marginBottom: "var(--space-6)" }}>
          {job?.description || "No description available."}
        </p>

        <h2 className="section-title">Eligibility</h2>
        <div className="detail-grid" style={{ marginTop: "var(--space-3)" }}>
          <div>
            <p className="detail-label">Minimum CGPA</p>
            <p className="detail-value">{job?.eligibility?.minCgpa ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Maximum Backlogs</p>
            <p className="detail-value">{job?.eligibility?.maxBacklogs ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Degree</p>
            <p className="detail-value">{job?.eligibility?.degree || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Graduation Year</p>
            <p className="detail-value">{job?.eligibility?.graduationYear || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Skills</p>
            <p className="detail-value">
              {job?.eligibility?.skills?.join(", ") || "None specified"}
            </p>
          </div>
        </div>
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
                  <p>Date: {new Date(entry.changedAt).toLocaleString()}</p>
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

export default ApplicationDetails;