import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import EligibilityResult from "../../components/EligibilityResult.jsx";

import { getJobById, getEligibility } from "../../services/jobService.js";
import { applyToJob } from "../../services/applicationService.js";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [eligibility, setEligibility] = useState(null);

  const [loading, setLoading] = useState(true);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  const [applyLoading, setApplyLoading] = useState(false);

  const [error, setError] = useState("");

  const [eligibilityError, setEligibilityError] = useState("");

  const [applyMessage, setApplyMessage] = useState("");

  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load job."
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
        error.response?.data?.message || "Unable to check eligibility."
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

      setApplyMessage("Application submitted successfully.");
    } catch (error) {
      setApplyError(
        error.response?.data?.message || "Unable to submit application."
      );
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading job..." />
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <Link to="/student/jobs" className="back-link">
          ← Back to Jobs
        </Link>

        <ErrorMessage message={error || "Job not found."} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/student/jobs" className="back-link">
        ← Back to Jobs
      </Link>

      <div className="page-header">
        <h1>{job.title}</h1>
        <p>{job.companyId?.name || "Unknown company"}</p>
      </div>

      <div className="card section">
        <div className="detail-grid">
          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">{job.location || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Salary</p>
            <p className="detail-value">₹{job.salary ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Deadline</p>
            <p className="detail-value">
              {job.deadline
                ? new Date(job.deadline).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
        </div>

        <h2 className="section-title">Description</h2>
        <p style={{ marginBottom: "var(--space-6)" }}>{job.description}</p>

        <h2 className="section-title">Eligibility Criteria</h2>
        <div className="detail-grid" style={{ marginTop: "var(--space-3)" }}>
          <div>
            <p className="detail-label">Minimum CGPA</p>
            <p className="detail-value">{job.eligibility?.minCgpa ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Maximum Backlogs</p>
            <p className="detail-value">{job.eligibility?.maxBacklogs ?? "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Degree</p>
            <p className="detail-value">{job.eligibility?.degree || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Graduation Year</p>
            <p className="detail-value">{job.eligibility?.graduationYear || "Not specified"}</p>
          </div>

          <div>
            <p className="detail-label">Skills</p>
            <p className="detail-value">
              {job.eligibility?.skills?.join(", ") || "None specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="card section">
        <h2 className="section-title">Check Your Eligibility</h2>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCheckEligibility}
          disabled={eligibilityLoading}
        >
          {eligibilityLoading && <span className="btn-spinner" />}
          {eligibilityLoading ? "Checking..." : "Check Eligibility"}
        </button>

        <ErrorMessage message={eligibilityError} />

        <EligibilityResult result={eligibility} />
      </div>

      <div className="card section">
        <h2 className="section-title">Apply for this Job</h2>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleApply}
          disabled={applyLoading}
        >
          {applyLoading && <span className="btn-spinner" />}
          {applyLoading ? "Applying..." : "Apply Now"}
        </button>

        {applyMessage && (
          <div role="status" className="alert alert-success" style={{ marginTop: "var(--space-4)", marginBottom: 0 }}>
            <p>{applyMessage}</p>
          </div>
        )}

        {applyError && (
          <div style={{ marginTop: "var(--space-4)" }}>
            <ErrorMessage message={applyError} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;