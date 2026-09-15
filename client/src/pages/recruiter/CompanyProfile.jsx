import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

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
            error.response?.data?.message || "Unable to load company profile."
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
        error.response?.data?.message || "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Company Profile</h1>
        <p>Your company details are shown to students on every job you post.</p>
      </div>

      {loading && <Loader message="Loading company profile..." />}

      {!loading && (
        <div className="form-card">
          <ErrorMessage message={error} />

          {success && (
            <div role="status" className="alert alert-success">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="companyName" className="field-label">
                Company Name
              </label>

              <input
                id="companyName"
                type="text"
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter company name"
              />
            </div>

            {company && (
              <div className="field">
                <span className="field-label">Approval Status</span>
                <div>
                  <StatusBadge status={company.approvalStatus} />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving && <span className="btn-spinner" />}
                {saving
                  ? "Saving..."
                  : company
                  ? "Update Company"
                  : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyProfile;