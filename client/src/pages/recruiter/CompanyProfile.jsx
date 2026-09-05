import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar.jsx";

import {
  createCompany,
  getMyCompany,
  updateMyCompany,
} from "../../services/companyService.js";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCompany();

        setCompany(data);
        setName(data?.name || "");
      } catch (error) {
        if (error.response?.status === 404) {
          setCompany(null);
          setName("");
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load company profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Company name is required.");
      return;
    }

    try {
      setSaving(true);

      let data;

      if (company) {
        data = await updateMyCompany({
          name: name.trim(),
        });
      } else {
        data = await createCompany({
          name: name.trim(),
        });
      }

      setCompany(data);
      setName(data.name || "");

      setSuccess(
        company
          ? "Company updated successfully."
          : "Company created successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Company Profile</h1>

        {loading && <p>Loading company profile...</p>}

        {!loading && error && (
          <p>{error}</p>
        )}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="companyName">
                Company Name
              </label>

              <br />

              <input
                id="companyName"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter company name"
              />
            </div>

            <br />

            {company && (
              <div>
                <p>
                  <strong>Approval Status:</strong>{" "}
                  {company.approvalStatus}
                </p>
              </div>
            )}

            <br />

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : company
                ? "Update Company"
                : "Create Company"}
            </button>
          </form>
        )}

        {success && <p>{success}</p>}
      </main>
    </div>
  );
};

export default CompanyProfile;