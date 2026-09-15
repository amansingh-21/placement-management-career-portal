import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";

import { getMyJobById, updateJob } from "../../services/jobService.js";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    deadline: "",
    minCgpa: "",
    maxBacklogs: "",
    degree: "",
    graduationYear: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await getMyJobById(id);

        setForm({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          salary: job.salary ?? "",
          deadline: job.deadline
            ? new Date(job.deadline).toISOString().slice(0, 16)
            : "",
          minCgpa: job.eligibility?.minCgpa ?? "",
          maxBacklogs: job.eligibility?.maxBacklogs ?? "",
          degree: job.eligibility?.degree || "",
          graduationYear: job.eligibility?.graduationYear || "",
          skills: job.eligibility?.skills?.join(", ") || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);

      await updateJob(id, {
        title: form.title,
        description: form.description,
        location: form.location,
        salary: Number(form.salary),
        deadline: form.deadline,
        eligibility: {
          minCgpa: form.minCgpa === "" ? undefined : Number(form.minCgpa),

          maxBacklogs:
            form.maxBacklogs === "" ? undefined : Number(form.maxBacklogs),

          degree: form.degree || undefined,

          graduationYear:
            form.graduationYear === "" ? undefined : Number(form.graduationYear),

          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
      });

      navigate("/recruiter/jobs");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading job..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/recruiter/jobs" className="back-link">
        ← Back to Manage Jobs
      </Link>

      <div className="page-header">
        <h1>Edit Job</h1>
        <p>Changes apply to the draft until it's submitted for approval.</p>
      </div>

      <div className="form-card">
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title" className="field-label">
              Job Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              className="input"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description" className="field-label">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              className="textarea"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="location" className="field-label">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              className="input"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="salary" className="field-label">
              Salary
            </label>

            <input
              id="salary"
              name="salary"
              type="number"
              min="0"
              className="input"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="deadline" className="field-label">
              Application Deadline
            </label>

            <input
              id="deadline"
              name="deadline"
              type="datetime-local"
              className="input"
              value={form.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <h2 className="section-title" style={{ marginTop: "var(--space-7)" }}>
            Eligibility
          </h2>

          <div className="field">
            <label htmlFor="minCgpa" className="field-label">
              Minimum CGPA
            </label>

            <input
              id="minCgpa"
              name="minCgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              className="input"
              value={form.minCgpa}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="maxBacklogs" className="field-label">
              Maximum Backlogs
            </label>

            <input
              id="maxBacklogs"
              name="maxBacklogs"
              type="number"
              min="0"
              className="input"
              value={form.maxBacklogs}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="degree" className="field-label">
              Degree
            </label>

            <input
              id="degree"
              name="degree"
              type="text"
              className="input"
              value={form.degree}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="graduationYear" className="field-label">
              Graduation Year
            </label>

            <input
              id="graduationYear"
              name="graduationYear"
              type="number"
              className="input"
              value={form.graduationYear}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="skills" className="field-label">
              Skills
            </label>

            <input
              id="skills"
              name="skills"
              type="text"
              className="input"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />

            <span className="field-hint">Separate each skill with a comma.</span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="btn-spinner" />}
              {saving ? "Saving..." : "Update Job"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/recruiter/jobs")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditJob;