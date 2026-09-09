import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import {
  getMyApplications,
} from "../../services/applicationService.js";

const ApplicationDetails = () => {
  const { id } = useParams();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const applications =
          await getMyApplications();

        const found = applications.find(
          (item) => item._id === id
        );

        if (!found) {
          setError("Application not found.");
          return;
        }

        setApplication(found);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load application."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />

        <main>
          <p>Loading application...</p>
        </main>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <Navbar />

        <main>
          <Link to="/student/applications">
            ← Back to Applications
          </Link>

          <p>
            {error ||
              "Application not found."}
          </p>
        </main>
      </div>
    );
  }

  const job = application.jobId;

  return (
    <div>
      <Navbar />

      <main>
        <Link to="/student/applications">
          ← Back to Applications
        </Link>

        <h1>Application Details</h1>

        <h2>
          {job?.title || "Job unavailable"}
        </h2>

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
          {job?.salary ??
            "Not specified"}
        </p>

        <p>
          Deadline:{" "}
          {job?.deadline
            ? new Date(
                job.deadline
              ).toLocaleDateString()
            : "Not specified"}
        </p>

        <p>
          Current Status:{" "}
          <strong>
            {application.status}
          </strong>
        </p>

        <h2>Job Description</h2>

        <p>
          {job?.description ||
            "No description available."}
        </p>

        <h2>Eligibility</h2>

        <p>
          Minimum CGPA:{" "}
          {job?.eligibility?.minCgpa ??
            "Not specified"}
        </p>

        <p>
          Maximum Backlogs:{" "}
          {job?.eligibility?.maxBacklogs ??
            "Not specified"}
        </p>

        <p>
          Degree:{" "}
          {job?.eligibility?.degree ||
            "Not specified"}
        </p>

        <p>
          Graduation Year:{" "}
          {job?.eligibility
            ?.graduationYear ||
            "Not specified"}
        </p>

        <p>
          Skills:{" "}
          {job?.eligibility?.skills?.join(
            ", "
          ) || "None specified"}
        </p>

        <hr />

        <h2>Application Timeline</h2>

        {application.statusHistory?.length >
        0 ? (
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
                      {new Date(
                        entry.changedAt
                      ).toLocaleString()}
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

export default ApplicationDetails;