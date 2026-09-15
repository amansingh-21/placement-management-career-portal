import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { createJob } from "../../services/jobService.js";

const CreateJob = () => {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createJob({
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
        error.response?.data?.message || "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Link to="/recruiter/jobs" className="back-link">
        ← Back to Manage Jobs
      </Link>

      <div className="page-header">
        <h1>Create Job</h1>
        <p>New jobs start as drafts. Submit for approval when you're ready.</p>
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
              placeholder="e.g. Frontend Engineer"
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
              placeholder="Describe the role, responsibilities, and what you're looking for"
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
              placeholder="e.g. Bengaluru"
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
              placeholder="Annual salary in ₹"
              value={form.salary}
              onChange={handleChange}
              required
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
              min="0"
              max="10"
              step="0.1"
              className="input"
              placeholder="e.g. 7.5"
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
              placeholder="e.g. 0"
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
              placeholder="e.g. B.E. Computer Science"
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
              placeholder="e.g. 2026"
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
              placeholder="React, Node.js, MongoDB"
              value={form.skills}
              onChange={handleChange}
            />

            <span className="field-hint">Separate each skill with a comma.</span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="btn-spinner" />}
              {loading ? "Creating..." : "Create Job"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/recruiter/jobs")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;