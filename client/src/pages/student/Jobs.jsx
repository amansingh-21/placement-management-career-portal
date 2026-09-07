import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
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

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchJobs(search);
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Jobs</h1>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title or location"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        {loading && (
          <p>Loading jobs...</p>
        )}

        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <p>No open jobs found.</p>
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

              <Link
                to={`/student/jobs/${job._id}`}
              >
                View Details
              </Link>

              <hr />
            </article>
          ))}
      </main>
    </div>
  );
};

export default Jobs;