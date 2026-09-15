import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getMyApplications } from "../../services/applicationService.js";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();

        setApplications(data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading applications..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of every job you've applied to.</p>
      </div>

      <ErrorMessage message={error} />

      {!error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>You have not applied to any jobs yet.</p>

          <Link to="/student/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      )}

      {applications.length > 0 && (
        <div className="list-stack">
          {applications.map((application) => {
            const job = application.jobId;

            return (
              <div className="list-item" key={application._id}>
                <div className="list-item-header">
                  <h2>{job?.title || "Job unavailable"}</h2>
                  <StatusBadge status={application.status} />
                </div>

                <div className="list-item-meta">
                  <span>Company: {job?.companyId?.name || "Unknown"}</span>
                  <span>Location: {job?.location || "Not specified"}</span>
                  <span>Salary: ₹{job?.salary ?? "Not specified"}</span>
                  <span>
                    Deadline:{" "}
                    {job?.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "Not specified"}
                  </span>
                </div>

                <div className="list-item-footer">
                  <Link
                    to={`/student/applications/${application._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applications;