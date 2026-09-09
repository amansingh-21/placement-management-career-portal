import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import {
  getMyApplications,
} from "../../services/applicationService.js";

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
          error.response?.data?.message ||
            "Unable to load applications."
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
          <p>Loading applications...</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main>
        <h1>My Applications</h1>

        {error && <p>{error}</p>}

        {!error && applications.length === 0 && (
          <div>
            <p>You have not applied to any jobs yet.</p>

            <Link to="/student/jobs">
              Browse Jobs
            </Link>
          </div>
        )}

        {applications.length > 0 && (
          <div>
            {applications.map((application) => {
              const job = application.jobId;

              return (
                <div key={application._id}>
                  <hr />

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
                    {job?.salary ?? "Not specified"}
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
                    Status:{" "}
                    <strong>
                      {application.status}
                    </strong>
                  </p>

                  <Link
                    to={`/student/applications/${application._id}`}
                  >
                    View Details
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

export default Applications;