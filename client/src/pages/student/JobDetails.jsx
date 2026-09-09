import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import EligibilityResult from "../../components/EligibilityResult.jsx";

import {
  getJobById,
  getEligibility,
} from "../../services/jobService.js";

import {
  applyToJob,
} from "../../services/applicationService.js";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [eligibility, setEligibility] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [eligibilityLoading, setEligibilityLoading] =
    useState(false);

  const [applyLoading, setApplyLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [eligibilityError, setEligibilityError] =
    useState("");

  const [applyMessage, setApplyMessage] =
    useState("");

  const [applyError, setApplyError] =
    useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

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

  const handleCheckEligibility = async () => {
    try {
      setEligibilityLoading(true);
      setEligibilityError("");
      setEligibility(null);

      const result = await getEligibility(id);

      setEligibility(result);
    } catch (error) {
      setEligibilityError(
        error.response?.data?.message ||
          "Unable to check eligibility."
      );
    } finally {
      setEligibilityLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplyLoading(true);
      setApplyMessage("");
      setApplyError("");

      await applyToJob(id);

      setApplyMessage(
        "Application submitted successfully."
      );
    } catch (error) {
      setApplyError(
        error.response?.data?.message ||
          "Unable to submit application."
      );
    } finally {
      setApplyLoading(false);
    }
  };

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
          {job.location ||
            "Not specified"}
        </p>

        <p>
          Salary: ₹
          {job.salary ??
            "Not specified"}
        </p>

        <p>
          Deadline:{" "}
          {job.deadline
            ? new Date(
                job.deadline
              ).toLocaleDateString()
            : "Not specified"}
        </p>

        <h2>Description</h2>

        <p>
          {job.description}
        </p>

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
          {job.eligibility
            ?.graduationYear ||
            "Not specified"}
        </p>

        <p>
          Skills:{" "}
          {job.eligibility?.skills?.join(
            ", "
          ) ||
            "None specified"}
        </p>

        <hr />

        <h2>
          Check Your Eligibility
        </h2>

        <button
          type="button"
          onClick={handleCheckEligibility}
          disabled={eligibilityLoading}
        >
          {eligibilityLoading
            ? "Checking..."
            : "Check Eligibility"}
        </button>

        {eligibilityError && (
          <p>
            {eligibilityError}
          </p>
        )}

        <EligibilityResult
          result={eligibility}
        />

        <hr />

        <h2>
          Apply for this Job
        </h2>

        <button
          type="button"
          onClick={handleApply}
          disabled={applyLoading}
        >
          {applyLoading
            ? "Applying..."
            : "Apply Now"}
        </button>

        {applyMessage && (
          <p>
            {applyMessage}
          </p>
        )}

        {applyError && (
          <p>
            {applyError}
          </p>
        )}
      </main>
    </div>
  );
};

export default JobDetails;