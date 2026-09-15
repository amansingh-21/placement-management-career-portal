import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { getJobs } from "../../services/jobService.js";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs({
        search: searchValue,
      });

      setJobs(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchJobs(search);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Jobs</h1>
        <p>Browse open roles and apply to the ones that fit you.</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="Search by title or location"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <Loader message="Loading jobs..." />}

      <ErrorMessage message={error} />

      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <h3>No open jobs found</h3>
          <p>Try a different search term, or check back later.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="list-stack">
          {jobs.map((job) => (
            <article className="list-item" key={job._id}>
              <div className="list-item-header">
                <h2>{job.title}</h2>
                <span className="badge badge-accent">₹{job.salary}</span>
              </div>

              <div className="list-item-meta">
                <span>Company: {job.companyId?.name || "Unknown"}</span>
                <span>Location: {job.location || "Not specified"}</span>
                <span>
                  Deadline:{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "Not specified"}
                </span>
              </div>

              <div className="list-item-footer">
                <Link to={`/student/jobs/${job._id}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Jobs;