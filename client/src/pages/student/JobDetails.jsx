import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import { getJobById } from "../../services/jobService.js";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <main>
          <p>Loading job...</p>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div>
        <Navbar />
        <main>
          <p>
            {error || "Job not found."}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main>
        <Link to="/student/jobs">
          ← Back to Jobs
        </Link>

        <h1>{job.title}</h1>

        <p>
          Company:{" "}
          {job.companyId?.name ||
            "Unknown"}
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

        <h2>Description</h2>

        <p>{job.description}</p>

        <h2>Eligibility</h2>

        <p>
          Minimum CGPA:{" "}
          {job.eligibility?.minCgpa ??
            "Not specified"}
        </p>

        <p>
          Maximum Backlogs:{" "}
          {job.eligibility?.maxBacklogs ??
            "Not specified"}
        </p>

        <p>
          Degree:{" "}
          {job.eligibility?.degree ||
            "Not specified"}
        </p>

        <p>
          Graduation Year:{" "}
          {job.eligibility?.graduationYear ||
            "Not specified"}
        </p>

        <p>
          Skills:{" "}
          {job.eligibility?.skills?.join(
            ", "
          ) || "None specified"}
        </p>
      </main>
    </div>
  );
};

export default JobDetails;