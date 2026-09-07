import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getMyJobs,
  submitJob,
  closeJob,
} from "../../services/jobService.js";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      setJobs(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (jobId) => {
    try {
      setError("");

      await submitJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit job."
      );
    }
  };

  const handleClose = async (jobId) => {
    try {
      setError("");

      await closeJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to close job."
      );
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Manage Jobs</h1>

        <Link to="/recruiter/jobs/create">
          Create Job
        </Link>

        {loading && (
          <p>Loading jobs...</p>
        )}

        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <p>You have not created any jobs.</p>
          )}

        {!loading &&
          !error &&
          jobs.map((job) => (
            <article key={job._id}>
              <h2>{job.title}</h2>

              <p>
                Approval Status:{" "}
                {job.approvalStatus}
              </p>

              <p>
                Job Status: {job.status}
              </p>

              <p>
                Deadline:{" "}
                {new Date(
                  job.deadline
                ).toLocaleDateString()}
              </p>

              {job.status === "DRAFT" &&
                job.approvalStatus === "PENDING" && (
                  <>
                    <Link
                      to={`/recruiter/jobs/${job._id}/edit`}
                    >
                      Edit
                    </Link>

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        handleSubmit(job._id)
                      }
                    >
                      Submit for Approval
                    </button>
                  </>
                )}

              {job.approvalStatus === "APPROVED" &&
                job.status === "PUBLISHED" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleClose(job._id)
                    }
                  >
                    Close Job
                  </button>
                )}

              <hr />
            </article>
          ))}
      </main>
    </div>
  );
};

export default ManageJobs;