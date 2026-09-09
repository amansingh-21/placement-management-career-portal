import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService.js";

const ApplicantDetails = () => {
  const { id } = useParams();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] =
    useState("");

  const [statusLoading, setStatusLoading] =
    useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const applications =
          await getRecruiterApplications();

        const found = applications.find(
          (item) => item._id === id
        );

        if (!found) {
          setError("Applicant not found.");
          return;
        }

        setApplication(found);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load applicant."
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

      const updated =
        await updateApplicationStatus(
          id,
          status
        );

      setApplication((current) => ({
        ...current,
        ...updated,
      }));
    } catch (error) {
      setStatusError(
        error.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />

        <main>
          <p>Loading applicant...</p>
        </main>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <Navbar />

        <main>
          <Link to="/recruiter/applicants">
            ← Back to Applicants
          </Link>

          <p>
            {error || "Applicant not found."}
          </p>
        </main>
      </div>
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

  const nextStatuses =
    statusOptions[application.status] || [];

  return (
    <div>
      <Navbar />

      <main>
        <Link to="/recruiter/applicants">
          ← Back to Applicants
        </Link>

        <h1>Applicant Details</h1>

        <h2>
          {student?.name ||
            student?.userId?.name ||
            "Student"}
        </h2>

        <p>
          Email:{" "}
          {student?.email ||
            student?.userId?.email ||
            "Not available"}
        </p>

        <h2>Job</h2>

        <p>
          Title:{" "}
          {job?.title || "Job unavailable"}
        </p>

        <p>
          Company:{" "}
          {job?.companyId?.name ||
            "Unknown"}
        </p>

        <p>
          Location:{" "}
          {job?.location ||
            "Not specified"}
        </p>

        <p>
          Salary: ₹
          {job?.salary ?? "Not specified"}
        </p>

        <h2>Current Status</h2>

        <p>
          <strong>
            {application.status}
          </strong>
        </p>

        {nextStatuses.length > 0 && (
          <div>
            <h2>Update Status</h2>

            {nextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  handleStatusChange(status)
                }
                disabled={statusLoading}
              >
                {statusLoading
                  ? "Updating..."
                  : `Mark as ${status}`}
              </button>
            ))}
          </div>
        )}

        {nextStatuses.length === 0 && (
          <p>
            No further status transitions are
            available.
          </p>
        )}

        {statusError && (
          <p>{statusError}</p>
        )}

        <h2>Application Timeline</h2>

        {application.statusHistory?.length > 0 ? (
          <div>
            {application.statusHistory.map(
              (entry, index) => {
                const changedBy =
                  entry.changedBy;

                return (
                  <div
                    key={
                      entry._id ||
                      `${entry.status}-${index}`
                    }
                  >
                    <h3>
                      {entry.status}
                    </h3>

                    <p>
                      Date:{" "}
                      {entry.changedAt
                        ? new Date(
                            entry.changedAt
                          ).toLocaleString()
                        : "Not available"}
                    </p>

                    <p>
                      Changed By:{" "}
                      {changedBy?.name ||
                        changedBy?.email ||
                        "Unknown"}
                    </p>

                    {index <
                      application
                        .statusHistory
                        .length -
                        1 && <hr />}
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p>
            No status history available.
          </p>
        )}
      </main>
    </div>
  );
};

export default ApplicantDetails;