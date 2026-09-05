import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import ProfileSection from "../../components/ProfileSection.jsx";
import SkillInput from "../../components/SkillInput.jsx";
import ProjectCard from "../../components/ProjectCard.jsx";
import CertificationCard from "../../components/CertificationCard.jsx";

import {
  getMyProfile,
  updateMyProfile,
  updateSkills,
  updateProjects,
  updateCertifications,
  uploadResume,
} from "../../services/studentService.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const [formData, setFormData] = useState({
    degree: "",
    graduationYear: "",
    cgpa: "",
    backlogs: "0",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
  });

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    issuer: "",
    year: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile();
        setProfile(data);

        if (data) {
          setFormData({
            degree: data.degree || "",
            graduationYear: data.graduationYear || "",
            cgpa: data.cgpa ?? "",
            backlogs: data.backlogs ?? "0",
          });

          setSkills(data.skills || []);
          setProjects(data.projects || []);
          setCertifications(data.certifications || []);
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to load your profile.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCertificationChange = (event) => {
    const { name, value } = event.target;

    setCertificationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddCertification = () => {
    setError("");
    setSuccess("");

    const name = certificationForm.name.trim();
    const issuer = certificationForm.issuer.trim();

    const year =
      certificationForm.year === "" ? "" : Number(certificationForm.year);

    if (!name) {
      setError("Certification name is required.");
      return;
    }

    if (!issuer) {
      setError("Certification issuer is required.");
      return;
    }

    if (
      year === "" ||
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      setError("Certification year must be between 1900 and 2100.");
      return;
    }

    setCertifications((previous) => [
      ...previous,
      {
        name,
        issuer,
        year,
      },
    ]);

    setCertificationForm({
      name: "",
      issuer: "",
      year: "",
    });
  };

  const handleRemoveCertification = (certificationToRemove) => {
    setCertifications((previous) =>
      previous.filter(
        (certification) =>
          certification !==
          certificationToRemove
      )
    );
  };

  const handleCertificationsSave = async () => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const data = await updateCertifications(certifications);

      setProfile(data);

      setCertifications(data.certifications || []);

      setSuccess("Certifications updated successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update your certifications.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = () => {
    setError("");
    setSuccess("");

    const title = projectForm.title.trim();
    const description = projectForm.description.trim();

    const technologies = projectForm.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter((technology) => technology.length > 0);

    if (!title) {
      setError("Project title is required.");
      return;
    }

    if (!description) {
      setError("Project description is required.");
      return;
    }

    setProjects((previous) => [
      ...previous,
      {
        title,
        description,
        technologies,
      },
    ]);

    setProjectForm({
      title: "",
      description: "",
      technologies: "",
    });
  };

  const handleRemoveProject = (projectToRemove) => {
    setProjects((previous) =>
      previous.filter((project) => project !== projectToRemove)
    );
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    setError("");
    setSuccess("");

    if (!resumeFile) {
      setError("Please select a resume.");
      return;
    }

    try {
      setResumeUploading(true);

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const data = await uploadResume(formData);

      setProfile(data);

      setResumeFile(null);

      setSuccess("Resume uploaded successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to upload your resume.";

      setError(message);
    } finally {
      setResumeUploading(false);
    }
  };

  const handleProjectsSave = async () => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const data = await updateProjects(projects);

      setProfile(data);
      setProjects(data.projects || []);

      setSuccess("Projects updated successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update your projects.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.cgpa !== "" && Number(formData.cgpa) > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    if (formData.cgpa !== "" && Number(formData.cgpa) < 0) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    if (
      formData.backlogs !== "" &&
      Number(formData.backlogs) < 0
    ) {
      setError("Backlogs cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const data = await updateMyProfile({
        degree: formData.degree.trim(),
        graduationYear:
          formData.graduationYear === ""
            ? undefined
            : Number(formData.graduationYear),
        cgpa:
          formData.cgpa === ""
            ? undefined
            : Number(formData.cgpa),
        backlogs:
          formData.backlogs === ""
            ? 0
            : Number(formData.backlogs),
      });

      setProfile(data);

      setFormData({
        degree: data.degree || "",
        graduationYear: data.graduationYear || "",
        cgpa: data.cgpa ?? "",
        backlogs: data.backlogs ?? "0",
      });

      setSuccess("Profile updated successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update your profile.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsSave = async () => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const data = await updateSkills(skills);

      setProfile(data);
      setSkills(data.skills || []);

      setSuccess("Skills updated successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update your skills.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <h1>My Profile</h1>

      {loading && (
        <Loader message="Loading your profile..." />
      )}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <ProfileSection title="Academic Information">
            <div>
              <label htmlFor="degree">
                Degree
              </label>

              <br />

              <input
                id="degree"
                name="degree"
                type="text"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            <br />

            <div>
              <label htmlFor="graduationYear">
                Graduation Year
              </label>

              <br />

              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2027"
              />
            </div>

            <br />

            <div>
              <label htmlFor="cgpa">
                CGPA
              </label>

              <br />

              <input
                id="cgpa"
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
              />
            </div>

            <br />

            <div>
              <label htmlFor="backlogs">
                Backlogs
              </label>

              <br />

              <input
                id="backlogs"
                name="backlogs"
                type="number"
                min="0"
                value={formData.backlogs}
                onChange={handleChange}
                placeholder="e.g. 0"
              />
            </div>

            <br />

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </ProfileSection>

          <ProfileSection title="Skills">
            <SkillInput
              skills={skills}
              onChange={setSkills}
            />

            <br />

            <button
              type="button"
              onClick={handleSkillsSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Skills"}
            </button>
          </ProfileSection>

          <ProfileSection title="Projects">
            <div>
              <label htmlFor="projectTitle">
                Project Title
              </label>

              <br />

              <input
                id="projectTitle"
                name="title"
                type="text"
                value={projectForm.title}
                onChange={handleProjectChange}
                placeholder="e.g. Placement Portal"
              />
            </div>

            <br />

            <div>
              <label htmlFor="projectDescription">
                Description
              </label>

              <br />

              <textarea
                id="projectDescription"
                name="description"
                value={projectForm.description}
                onChange={handleProjectChange}
                placeholder="Describe your project"
                rows="4"
              />
            </div>

            <br />

            <div>
              <label htmlFor="projectTechnologies">
                Technologies
              </label>

              <br />

              <input
                id="projectTechnologies"
                name="technologies"
                type="text"
                value={projectForm.technologies}
                onChange={handleProjectChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <br />

            <button
              type="button"
              onClick={handleAddProject}
            >
              Add Project
            </button>

            <br />
            <br />

            {projects.length === 0 ? (
              <p>No projects added yet.</p>
            ) : (
              <div>
                {projects.map((project, index) => (
                  <ProjectCard
                    key={`${project.title}-${index}`}
                    project={project}
                    onRemove={handleRemoveProject}
                  />
                ))}
              </div>
            )}

            <br />

            <button
              type="button"
              onClick={handleProjectsSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Projects"}
            </button>
          </ProfileSection>

          <ProfileSection title="Certifications">
            <div>
              <label htmlFor="certificationName">
                Certification Name
              </label>

              <br />

              <input
                id="certificationName"
                name="name"
                type="text"
                value={certificationForm.name}
                onChange={handleCertificationChange}
                placeholder="e.g. AWS Cloud Practitioner"
              />
            </div>

            <br />

            <div>
              <label htmlFor="certificationIssuer">
                Issuer
              </label>

              <br />

              <input
                id="certificationIssuer"
                name="issuer"
                type="text"
                value={certificationForm.issuer}
                onChange={handleCertificationChange}
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <br />

            <div>
              <label htmlFor="certificationYear">
                Year
              </label>

              <br />

              <input
                id="certificationYear"
                name="year"
                type="number"
                min="1900"
                max="2100"
                value={certificationForm.year}
                onChange={handleCertificationChange}
                placeholder="e.g. 2025"
              />
            </div>

            <br />

            <button
              type="button"
              onClick={handleAddCertification}
            >
              Add Certification
            </button>

            <br />
            <br />

            {certifications.length === 0 ? (
              <p>No certifications added yet.</p>
            ) : (
              <div>
                {certifications.map((certification, index) => (
                  <CertificationCard
                    key={`${certification.name}-${index}`}
                    certification={certification}
                    onRemove={handleRemoveCertification}
                  />
                ))}
              </div>
            )}

            <br />

            <button
              type="button"
              onClick={handleCertificationsSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Certifications"}
            </button>
          </ProfileSection>

          <ProfileSection title="Resume">
            <div>
              <label htmlFor="resume">
                Upload Resume
              </label>

              <br />

              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </div>

            <br />

            {resumeFile && (
              <p>
                Selected file: {resumeFile.name}
              </p>
            )}

            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={resumeUploading}
            >
              {resumeUploading ? "Uploading..." : "Upload Resume"}
            </button>
          </ProfileSection>

          {success && (
            <p>{success}</p>
          )}
        </form>
      )}
    </DashboardLayout>
  );
};

export default Profile;