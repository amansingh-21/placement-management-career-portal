import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
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
      [event.target.name]:
        event.target.value,
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
          minCgpa:
            form.minCgpa === ""
              ? undefined
              : Number(form.minCgpa),

          maxBacklogs:
            form.maxBacklogs === ""
              ? undefined
              : Number(form.maxBacklogs),

          degree: form.degree || undefined,

          graduationYear:
            form.graduationYear === ""
              ? undefined
              : Number(
                  form.graduationYear
                ),

          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
      });

      navigate("/recruiter/jobs");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1>Create Job</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Job title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <br />

          <textarea
            name="description"
            placeholder="Job description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <br />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <br />

          <input
            name="salary"
            type="number"
            min="0"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
          />

          <br />

          <input
            name="deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={handleChange}
            required
          />

          <h3>Eligibility</h3>

          <input
            name="minCgpa"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="Minimum CGPA"
            value={form.minCgpa}
            onChange={handleChange}
          />

          <br />

          <input
            name="maxBacklogs"
            type="number"
            min="0"
            placeholder="Maximum Backlogs"
            value={form.maxBacklogs}
            onChange={handleChange}
          />

          <br />

          <input
            name="degree"
            placeholder="Degree"
            value={form.degree}
            onChange={handleChange}
          />

          <br />

          <input
            name="graduationYear"
            type="number"
            placeholder="Graduation Year"
            value={form.graduationYear}
            onChange={handleChange}
          />

          <br />

          <input
            name="skills"
            placeholder="Skills separated by commas"
            value={form.skills}
            onChange={handleChange}
          />

          <br />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Job"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateJob;