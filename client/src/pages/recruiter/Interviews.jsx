import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getRecruiterInterviews,
  scheduleInterview,
  updateInterview,
} from "../../services/interviewService.js";

import {
  getRecruiterApplications,
} from "../../services/applicationService.js";

const Interviews = () => {
  const [interviews, setInterviews] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const [applicationId, setApplicationId] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [rescheduleId, setRescheduleId] =
    useState("");

  const [rescheduleTime, setRescheduleTime] =
    useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        interviewData,
        applicationData,
      ] = await Promise.all([
        getRecruiterInterviews(),
        getRecruiterApplications(),
      ]);

      setInterviews(interviewData);
      setApplications(applicationData);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status === "SHORTLISTED"
    );

  const handleSchedule = async (event) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setActionError("");

      if (!applicationId || !scheduledAt) {
        setActionError(
          "Please select an application and interview time."
        );
        return;
      }

      await scheduleInterview(
        applicationId,
        new Date(
          scheduledAt
        ).toISOString()
      );

      setApplicationId("");
      setScheduledAt("");

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Unable to schedule interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const startReschedule = (interview) => {
    setActionError("");

    const date = new Date(
      interview.scheduledAt
    );

    const localDateTime =
      new Date(
        date.getTime() -
          date.getTimezoneOffset() * 60000
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
        setActionError(
          "Please select a new interview date and time."
        );
        return;
      }

      await updateInterview(
        rescheduleId,
        {
          scheduledAt: new Date(
            rescheduleTime
          ).toISOString(),
        }
      );

      setRescheduleId("");
      setRescheduleTime("");

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Unable to reschedule interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (
    interviewId,
    status
  ) => {
    try {
      setActionLoading(true);
      setActionError("");

      await updateInterview(
        interviewId,
        { status }
      );

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Unable to update interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResultUpdate = async (
    interviewId,
    result
  ) => {
    try {
      setActionLoading(true);
      setActionError("");

      await updateInterview(
        interviewId,
        { result }
      );

      await fetchData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Unable to update interview result."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />

        <main>
          <p>Loading interviews...</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main>
        <h1>Recruiter Interviews</h1>

        <Link to="/recruiter/dashboard">
          ← Back to Dashboard
        </Link>

        <hr />

        <section>
          <h2>Schedule Interview</h2>

          {shortlistedApplications.length ===
            0 && (
            <p>
              No shortlisted applications are
              available for scheduling.
            </p>
          )}

          {shortlistedApplications.length >
            0 && (
            <form
              onSubmit={handleSchedule}
            >
              <div>
                <label>
                  Select Application
                </label>

                <select
                  value={applicationId}
                  onChange={(event) =>
                    setApplicationId(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select a shortlisted
                    application
                  </option>

                  {shortlistedApplications.map(
                    (application) => {
                      const student =
                        application.studentId;

                      const job =
                        application.jobId;

                      const studentName =
                        student?.name ||
                        student?.userId?.name ||
                        "Student";

                      return (
                        <option
                          key={
                            application._id
                          }
                          value={
                            application._id
                          }
                        >
                          {studentName} —{" "}
                          {job?.title ||
                            "Job unavailable"}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div>
                <label>
                  Interview Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  min={
                    new Date(
                      Date.now() -
                        new Date().getTimezoneOffset() *
                          60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  }
                  onChange={(event) =>
                    setScheduledAt(
                      event.target.value
                    )
                  }
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Schedule Interview"}
              </button>
            </form>
          )}
        </section>

        {error && (
          <p>{error}</p>
        )}

        {actionError && (
          <p>{actionError}</p>
        )}

        <hr />

        <section>
          <h2>Scheduled Interviews</h2>

          {interviews.length === 0 && (
            <p>
              No interviews scheduled yet.
            </p>
          )}

          {interviews.length > 0 && (
            <div>
              {interviews.map(
                (interview) => {
                  const application =
                    interview.applicationId;

                  const job =
                    application?.jobId;

                  const student =
                    application?.studentId;

                  const studentUser =
                    student?.userId;

                  const isRescheduling =
                    rescheduleId ===
                    interview._id;

                  const isCompleted =
                    interview.status ===
                    "COMPLETED";

                  const hasResult =
                    interview.result &&
                    interview.result !==
                      "PENDING";

                  return (
                    <div
                      key={interview._id}
                    >
                      <hr />

                      <h3>
                        {job?.title ||
                          "Job unavailable"}
                      </h3>

                      <p>
                        Student:{" "}
                        {studentUser?.name ||
                          student?.name ||
                          "Student"}
                      </p>

                      <p>
                        Email:{" "}
                        {studentUser?.email ||
                          student?.email ||
                          "Not available"}
                      </p>

                      <p>
                        Company:{" "}
                        {job?.companyId?.name ||
                          "Unknown"}
                      </p>

                      <p>
                        Interview Time:{" "}
                        {interview.scheduledAt
                          ? new Date(
                              interview.scheduledAt
                            ).toLocaleString()
                          : "Not available"}
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {interview.status}
                        </strong>
                      </p>

                      <p>
                        Result:{" "}
                        <strong>
                          {interview.result ||
                            "PENDING"}
                        </strong>
                      </p>

                      {isRescheduling && (
                        <form
                          onSubmit={
                            handleReschedule
                          }
                        >
                          <div>
                            <label>
                              New Interview
                              Date & Time
                            </label>

                            <input
                              type="datetime-local"
                              value={
                                rescheduleTime
                              }
                              min={
                                new Date(
                                  Date.now() -
                                    new Date().getTimezoneOffset() *
                                      60000
                                )
                                  .toISOString()
                                  .slice(0, 16)
                              }
                              onChange={(
                                event
                              ) =>
                                setRescheduleTime(
                                  event.target
                                    .value
                                )
                              }
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={
                              actionLoading
                            }
                          >
                            {actionLoading
                              ? "Processing..."
                              : "Save Reschedule"}
                          </button>

                          <button
                            type="button"
                            onClick={
                              cancelReschedule
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Cancel
                          </button>
                        </form>
                      )}

                      {!isRescheduling &&
                        !isCompleted &&
                        interview.status !==
                          "CANCELLED" && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                startReschedule(
                                  interview
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Reschedule
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  interview._id,
                                  "CANCELLED"
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  interview._id,
                                  "COMPLETED"
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Complete
                            </button>
                          </div>
                        )}

                      {isCompleted &&
                        !hasResult && (
                          <div>
                            <p>
                              Record Interview
                              Result:
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleResultUpdate(
                                  interview._id,
                                  "PASSED"
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Passed
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleResultUpdate(
                                  interview._id,
                                  "FAILED"
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Failed
                            </button>
                          </div>
                        )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Interviews;