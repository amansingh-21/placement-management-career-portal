import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

import {
  getMyInterviews,
} from "../../services/interviewService.js";

const Interviews = () => {
  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyInterviews();

        setInterviews(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load interviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

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
        <h1>My Interviews</h1>

        <Link to="/student/dashboard">
          ← Back to Dashboard
        </Link>

        <hr />

        {error && <p>{error}</p>}

        {!error &&
          interviews.length === 0 && (
            <div>
              <p>
                You have no interviews scheduled.
              </p>

              <Link to="/student/jobs">
                Browse Jobs
              </Link>
            </div>
          )}

        {!error &&
          interviews.length > 0 && (
            <div>
              {interviews.map(
                (interview) => {
                  const application =
                    interview.applicationId;

                  const job =
                    application?.jobId;

                  const company =
                    job?.companyId;

                  const recruiter =
                    interview.recruiterId;

                  return (
                    <div
                      key={interview._id}
                    >
                      <hr />

                      <h2>
                        {job?.title ||
                          "Job unavailable"}
                      </h2>

                      <p>
                        Company:{" "}
                        {company?.name ||
                          "Unknown"}
                      </p>

                      <p>
                        Recruiter:{" "}
                        {recruiter?.name ||
                          "Not available"}
                      </p>

                      <p>
                        Recruiter Email:{" "}
                        {recruiter?.email ||
                          "Not available"}
                      </p>

                      <p>
                        Interview Date & Time:{" "}
                        {interview.scheduledAt
                          ? new Date(
                              interview.scheduledAt
                            ).toLocaleString()
                          : "Not available"}
                      </p>

                      <p>
                        Interview Status:{" "}
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
                    </div>
                  );
                }
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default Interviews;