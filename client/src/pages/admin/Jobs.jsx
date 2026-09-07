import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar.jsx";

import {
  getPendingJobs,
  approveJob,
  rejectJob,
} from "../../services/jobService.js";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingJobs();

      setJobs(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load pending jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (jobId) => {
    try {
      setError("");

      await approveJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to approve job."
      );
    }
  };

  const handleReject = async (jobId) => {
    try {
      setError("");

      await rejectJob(jobId);

      await fetchJobs();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reject job."
      );
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Job Approvals</h1>

        {loading && (
          <p>Loading pending jobs...</p>
        )}

        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <p>No pending jobs found.</p>
          )}

        {!loading &&
          !error &&
          jobs.map((job) => (
            <article key={job._id}>
              <h2>{job.title}</h2>

              <p>
                Company:{" "}
                {job.companyId?.name ||
                  "Unknown"}
              </p>

              <p>
                Approval Status:{" "}
                {job.approvalStatus}
              </p>

              <p>
                Job Status: {job.status}
              </p>

              <p>
                Description:{" "}
                {job.description}
              </p>

              <p>
                Location:{" "}
                {job.location || "Not specified"}
              </p>

              <p>
                Salary: ₹{job.salary}
              </p>

              <p>
                Deadline:{" "}
                {new Date(
                  job.deadline
                ).toLocaleDateString()}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleApprove(job._id)
                }
              >
                Approve
              </button>

              {" "}

              <button
                type="button"
                onClick={() =>
                  handleReject(job._id)
                }
              >
                Reject
              </button>

              <hr />
            </article>
          ))}
      </main>
    </div>
  );
};

export default AdminJobs;