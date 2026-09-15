import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

import {
  getRecruiterInterviews,
  scheduleInterview,
  updateInterview,
} from "../../services/interviewService.js";

import { getRecruiterApplications } from "../../services/applicationService.js";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [applicationId, setApplicationId] = useState("");

  const [scheduledAt, setScheduledAt] = useState("");

  const [rescheduleId, setRescheduleId] = useState("");

  const [rescheduleTime, setRescheduleTime] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [interviewData, applicationData] = await Promise.all([
        getRecruiterInterviews(),
        getRecruiterApplications(),
      ]);

      setInterviews(interviewData);
      setApplications(applicationData);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shortlistedApplications = applications.filter(
    (application) => application.status === "SHORTLISTED"
  );

  const handleSchedule = async (event) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setActionError("");

      if (!applicationId || !scheduledAt) {
        setActionError("Please select an application and interview time.");
        return;
      }

      await scheduleInterview(applicationId, new Date(scheduledAt).toISOString());

      setApplicationId("");
      setScheduledAt("");

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Unable to schedule interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const startReschedule = (interview) => {
    setActionError("");

    const date = new Date(interview.scheduledAt);

    const localDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setRescheduleId(interview._id);
    setRescheduleTime(localDateTime);
  };

  const cancelReschedule = () => {
    setRescheduleId("");
    setRescheduleTime("");
    setActionError("");
  };

  const handleReschedule = async (event) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setActionError("");

      if (!rescheduleTime) {
        setActionError("Please select a new interview date and time.");
        return;
      }

      await updateInterview(rescheduleId, {
        scheduledAt: new Date(rescheduleTime).toISOString(),
      });

      setRescheduleId("");
      setRescheduleTime("");

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Unable to reschedule interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (interviewId, status) => {
    try {
      setActionLoading(true);
      setActionError("");

      await updateInterview(interviewId, { status });

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Unable to update interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResultUpdate = async (interviewId, result) => {
    try {
      setActionLoading(true);
      setActionError("");

      await updateInterview(interviewId, { result });

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Unable to update interview result."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const minDateTime = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading interviews..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/recruiter/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="page-header">
        <h1>Interviews</h1>
        <p>Schedule interviews for shortlisted candidates and record results.</p>
      </div>

      <ErrorMessage message={error} />

      <section className="card section">
        <h2 className="section-title">Schedule Interview</h2>

        {shortlistedApplications.length === 0 && (
          <p>No shortlisted applications are available for scheduling.</p>
        )}

        {shortlistedApplications.length > 0 && (
          <form onSubmit={handleSchedule}>
            <div className="field">
              <label htmlFor="applicationId" className="field-label">
                Select Application
              </label>

              <select
                id="applicationId"
                className="select"
                value={applicationId}
                onChange={(event) => setApplicationId(event.target.value)}
              >
                <option value="">Select a shortlisted application</option>

                {shortlistedApplications.map((application) => {
                  const student = application.studentId;

                  const job = application.jobId;

                  const studentName =
                    student?.name || student?.userId?.name || "Student";

                  return (
                    <option key={application._id} value={application._id}>
                      {studentName} — {job?.title || "Job unavailable"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="field">
              <label htmlFor="scheduledAt" className="field-label">
                Interview Date &amp; Time
              </label>

              <input
                id="scheduledAt"
                type="datetime-local"
                className="input"
                value={scheduledAt}
                min={minDateTime}
                onChange={(event) => setScheduledAt(event.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading && <span className="btn-spinner" />}
                {actionLoading ? "Processing..." : "Schedule Interview"}
              </button>
            </div>
          </form>
        )}
      </section>

      <ErrorMessage message={actionError} />

      <section className="section">
        <h2 className="section-title">Scheduled Interviews</h2>

        {interviews.length === 0 && (
          <div className="empty-state">
            <h3>No interviews scheduled</h3>
            <p>Schedule one above to get started.</p>
          </div>
        )}

        {interviews.length > 0 && (
          <div className="list-stack">
            {interviews.map((interview) => {
              const application = interview.applicationId;

              const job = application?.jobId;

              const student = application?.studentId;

              const studentUser = student?.userId;

              const isRescheduling = rescheduleId === interview._id;

              const isCompleted = interview.status === "COMPLETED";

              const hasResult =
                interview.result && interview.result !== "PENDING";

              return (
                <div className="list-item" key={interview._id}>
                  <div className="list-item-header">
                    <h3>{job?.title || "Job unavailable"}</h3>

                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      <StatusBadge status={interview.status} />
                      <StatusBadge status={interview.result || "PENDING"} />
                    </div>
                  </div>

                  <div className="list-item-meta">
                    <span>
                      Student: {studentUser?.name || student?.name || "Student"}
                    </span>
                    <span>
                      Email:{" "}
                      {studentUser?.email || student?.email || "Not available"}
                    </span>
                    <span>Company: {job?.companyId?.name || "Unknown"}</span>
                    <span>
                      Interview Time:{" "}
                      {interview.scheduledAt
                        ? new Date(interview.scheduledAt).toLocaleString()
                        : "Not available"}
                    </span>
                  </div>

                  {isRescheduling && (
                    <form onSubmit={handleReschedule} style={{ marginTop: "var(--space-4)" }}>
                      <div className="field">
                        <label htmlFor={`reschedule-${interview._id}`} className="field-label">
                          New Interview Date &amp; Time
                        </label>

                        <input
                          id={`reschedule-${interview._id}`}
                          type="datetime-local"
                          className="input"
                          value={rescheduleTime}
                          min={minDateTime}
                          onChange={(event) => setRescheduleTime(event.target.value)}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={actionLoading}>
                          {actionLoading && <span className="btn-spinner" />}
                          {actionLoading ? "Processing..." : "Save Reschedule"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={cancelReschedule}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {!isRescheduling &&
                    !isCompleted &&
                    interview.status !== "CANCELLED" && (
                      <div className="list-item-footer">
                        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => startReschedule(interview)}
                            disabled={actionLoading}
                          >
                            Reschedule
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleStatusUpdate(interview._id, "CANCELLED")}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusUpdate(interview._id, "COMPLETED")}
                            disabled={actionLoading}
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    )}

                  {isCompleted && !hasResult && (
                    <div className="list-item-footer">
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        Record interview result
                      </span>

                      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleResultUpdate(interview._id, "PASSED")}
                          disabled={actionLoading}
                        >
                          Passed
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleResultUpdate(interview._id, "FAILED")}
                          disabled={actionLoading}
                        >
                          Failed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Interviews;