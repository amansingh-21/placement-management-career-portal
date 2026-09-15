import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import { getMyInterviews } from "../../services/interviewService.js";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyInterviews();

        setInterviews(data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load interviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading interviews..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/student/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="page-header">
        <h1>My Interviews</h1>
        <p>Everything scheduled with recruiters, in one place.</p>
      </div>

      <ErrorMessage message={error} />

      {!error && interviews.length === 0 && (
        <div className="empty-state">
          <h3>No interviews scheduled</h3>
          <p>You have no interviews scheduled.</p>

          <Link to="/student/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      )}

      {!error && interviews.length > 0 && (
        <div className="list-stack">
          {interviews.map((interview) => {
            const application = interview.applicationId;
            const job = application?.jobId;
            const company = job?.companyId;
            const recruiter = interview.recruiterId;

            return (
              <div className="list-item" key={interview._id}>
                <div className="list-item-header">
                  <h2>{job?.title || "Job unavailable"}</h2>
                  <StatusBadge status={interview.status} />
                </div>

                <div className="list-item-meta">
                  <span>Company: {company?.name || "Unknown"}</span>
                  <span>Recruiter: {recruiter?.name || "Not available"}</span>
                  <span>Recruiter Email: {recruiter?.email || "Not available"}</span>
                  <span>
                    Date &amp; Time:{" "}
                    {interview.scheduledAt
                      ? new Date(interview.scheduledAt).toLocaleString()
                      : "Not available"}
                  </span>
                </div>

                <div className="list-item-footer">
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Result</span>
                  <StatusBadge status={interview.result || "PENDING"} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Interviews;