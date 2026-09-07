import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getMyJobById,
  updateJob,
} from "../../services/jobService.js";

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

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await getMyJobById(id);

        setForm({
          title: job.title || "",
          description:
            job.description || "",
          location: job.location || "",
          salary: job.salary ?? "",
          deadline: job.deadline
            ? new Date(job.deadline)
                .toISOString()
                .slice(0, 16)
            : "",
          minCgpa:
            job.eligibility?.minCgpa ??
            "",
          maxBacklogs:
            job.eligibility?.maxBacklogs ??
            "",
          degree:
            job.eligibility?.degree || "",
          graduationYear:
            job.eligibility
              ?.graduationYear || "",
          skills:
            job.eligibility?.skills?.join(
              ", "
            ) || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load job."
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
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await updateJob(id, {
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
          "Unable to update job."
      );
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

  return (
    <div>
      <Navbar />

      <main>
        <h1>Edit Job</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">
              Job Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="salary">
              Salary
            </label>

            <input
              id="salary"
              name="salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="deadline">
              Application Deadline
            </label>

            <input
              id="deadline"
              name="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Eligibility</h2>

          <div>
            <label htmlFor="minCgpa">
              Minimum CGPA
            </label>

            <input
              id="minCgpa"
              name="minCgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.minCgpa}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="maxBacklogs">
              Maximum Backlogs
            </label>

            <input
              id="maxBacklogs"
              name="maxBacklogs"
              type="number"
              min="0"
              value={form.maxBacklogs}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="degree">
              Degree
            </label>

            <input
              id="degree"
              name="degree"
              type="text"
              value={form.degree}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="graduationYear">
              Graduation Year
            </label>

            <input
              id="graduationYear"
              name="graduationYear"
              type="number"
              value={form.graduationYear}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="skills">
              Skills
            </label>

            <input
              id="skills"
              name="skills"
              type="text"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <button type="submit">
            Update Job
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/jobs")
            }
          >
            Cancel
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditJob;