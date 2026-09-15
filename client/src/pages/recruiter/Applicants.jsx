import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getRecruiterApplications } from "../../services/applicationService.js";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecruiterApplications();

        setApplications(data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load applicants."
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
        <Loader message="Loading applicants..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Applicants</h1>
        <p>Everyone who has applied to your jobs.</p>
      </div>

      <ErrorMessage message={error} />

      {!error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Applications to your published jobs will appear here.</p>
        </div>
      )}

      {applications.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applied On</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => {
                const student = application.studentId;
                const job = application.jobId;

                return (
                  <tr key={application._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {student?.name || student?.userId?.name || "Student"}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        {student?.email || student?.userId?.email || "Not available"}
                      </div>
                    </td>

                    <td>{job?.title || "Job unavailable"}</td>

                    <td>{job?.companyId?.name || "Unknown"}</td>

                    <td>
                      <StatusBadge status={application.status} />
                    </td>

                    <td style={{ whiteSpace: "nowrap" }}>
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : "Not available"}
                    </td>

                    <td>
                      <Link
                        to={`/recruiter/applicants/${application._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applicants;