import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import {
  getRecruiterApplications,
} from "../../services/applicationService.js";

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
          error.response?.data?.message ||
            "Unable to load applicants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />

        <main>
          <p>Loading applicants...</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main>
        <h1>Applicants</h1>

        {error && <p>{error}</p>}

        {!error && applications.length === 0 && (
          <div>
            <p>No applications received yet.</p>
          </div>
        )}

        {applications.length > 0 && (
          <div>
            {applications.map((application) => {
              const student = application.studentId;
              const job = application.jobId;

              return (
                <div key={application._id}>
                  <hr />

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

                  <p>
                    Job:{" "}
                    {job?.title || "Job unavailable"}
                  </p>

                  <p>
                    Company:{" "}
                    {job?.companyId?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    Status:{" "}
                    <strong>
                      {application.status}
                    </strong>
                  </p>

                  <p>
                    Applied On:{" "}
                    {application.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleString()
                      : "Not available"}
                  </p>

                  <Link
                    to={`/recruiter/applicants/${application._id}`}
                  >
                    View Applicant
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applicants;