import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar.jsx";

import {
  getCompanies,
  updateCompanyApproval,
} from "../../services/adminService.js";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] =
    useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanies(status);

      setCompanies(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [status]);

  const handleApproval = async (
    companyId,
    approvalStatus
  ) => {
    try {
      setActionLoading(true);
      setError("");

      await updateCompanyApproval(
        companyId,
        approvalStatus
      );

      await fetchCompanies();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update company approval."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Company Management</h1>

        <div>
          <label htmlFor="status">
            Filter by Status
          </label>

          <br />

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">All</option>
            <option value="PENDING">
              Pending
            </option>
            <option value="APPROVED">
              Approved
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        <br />

        {loading && <p>Loading companies...</p>}

        {!loading && error && (
          <p>{error}</p>
        )}

        {!loading && !error && companies.length === 0 && (
          <p>No companies found.</p>
        )}

        {!loading &&
          companies.map((company) => (
            <section key={company._id}>
              <h2>{company.name}</h2>

              <p>
                Recruiter:{" "}
                {company.createdBy?.name ||
                  "Unknown"}
              </p>

              <p>
                Email:{" "}
                {company.createdBy?.email ||
                  "Unknown"}
              </p>

              <p>
                Status: {company.approvalStatus}
              </p>

              {company.approvalStatus ===
                "PENDING" && (
                <div>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleApproval(
                        company._id,
                        "APPROVED"
                      )
                    }
                  >
                    Approve
                  </button>

                  {" "}

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleApproval(
                        company._id,
                        "REJECTED"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              )}

              <hr />
            </section>
          ))}
      </main>
    </div>
  );
};

export default Companies;