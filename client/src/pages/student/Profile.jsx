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
          error.response?.data?.message || "Unable to load your profile.";

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

    if (year === "" || !Number.isInteger(year) || year < 1900 || year > 2100) {
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
        (certification) => certification !== certificationToRemove
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
        error.response?.data?.message || "Unable to upload your resume.";

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
        error.response?.data?.message || "Unable to update your projects.";

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

    if (formData.backlogs !== "" && Number(formData.backlogs) < 0) {
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
        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa),
        backlogs: formData.backlogs === "" ? 0 : Number(formData.backlogs),
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
        error.response?.data?.message || "Unable to update your profile.";

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
        error.response?.data?.message || "Unable to update your skills.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const fileInputStyle = {
    border: "1px solid var(--color-border-strong)",
    borderRadius: "var(--radius-sm)",
    background: "var(--color-surface)",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "inherit",
    width: "100%",
    padding: "var(--space-3) var(--space-4)",
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>
          A complete profile improves your eligibility for more roles.
          {profile?.profileCompletion != null
            ? ` Currently ${profile.profileCompletion}% complete.`
            : ""}
        </p>
      </div>

      {loading && <Loader message="Loading your profile..." />}

      {!loading && (
        <>
          <ErrorMessage message={error} />

          {success && (
            <div role="status" className="alert alert-success">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <ProfileSection title="Academic Information">
              <div className="field">
                <label htmlFor="degree" className="field-label">
                  Degree
                </label>

                <input
                  id="degree"
                  name="degree"
                  type="text"
                  className="input"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science"
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
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                />
              </div>

              <div className="field">
                <label htmlFor="cgpa" className="field-label">
                  CGPA
                </label>

                <input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  className="input"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                />

                <span className="field-hint">Must be between 0 and 10.</span>
              </div>

              <div className="field">
                <label htmlFor="backlogs" className="field-label">
                  Backlogs
                </label>

                <input
                  id="backlogs"
                  name="backlogs"
                  type="number"
                  min="0"
                  className="input"
                  value={formData.backlogs}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving && <span className="btn-spinner" />}
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </ProfileSection>

            <ProfileSection title="Skills">
              <SkillInput skills={skills} onChange={setSkills} />

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSkillsSave}
                  disabled={saving}
                >
                  {saving && <span className="btn-spinner" />}
                  {saving ? "Saving..." : "Save Skills"}
                </button>
              </div>
            </ProfileSection>

            <ProfileSection title="Projects">
              <div className="field">
                <label htmlFor="projectTitle" className="field-label">
                  Project Title
                </label>

                <input
                  id="projectTitle"
                  name="title"
                  type="text"
                  className="input"
                  value={projectForm.title}
                  onChange={handleProjectChange}
                  placeholder="e.g. Placement Portal"
                />
              </div>

              <div className="field">
                <label htmlFor="projectDescription" className="field-label">
                  Description
                </label>

                <textarea
                  id="projectDescription"
                  name="description"
                  className="textarea"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  placeholder="Describe your project"
                  rows="4"
                />
              </div>

              <div className="field">
                <label htmlFor="projectTechnologies" className="field-label">
                  Technologies
                </label>

                <input
                  id="projectTechnologies"
                  name="technologies"
                  type="text"
                  className="input"
                  value={projectForm.technologies}
                  onChange={handleProjectChange}
                  placeholder="React, Node.js, MongoDB"
                />

                <span className="field-hint">
                  Separate each technology with a comma.
                </span>
              </div>

              <div className="form-actions" style={{ marginBottom: "var(--space-6)" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddProject}
                >
                  Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="empty-state">
                  <h3>No projects yet</h3>
                  <p>Add a project above to showcase your work.</p>
                </div>
              ) : (
                <div className="list-stack">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={`${project.title}-${index}`}
                      project={project}
                      onRemove={handleRemoveProject}
                    />
                  ))}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleProjectsSave}
                  disabled={saving}
                >
                  {saving && <span className="btn-spinner" />}
                  {saving ? "Saving..." : "Save Projects"}
                </button>
              </div>
            </ProfileSection>

            <ProfileSection title="Certifications">
              <div className="field">
                <label htmlFor="certificationName" className="field-label">
                  Certification Name
                </label>

                <input
                  id="certificationName"
                  name="name"
                  type="text"
                  className="input"
                  value={certificationForm.name}
                  onChange={handleCertificationChange}
                  placeholder="e.g. AWS Cloud Practitioner"
                />
              </div>

              <div className="field">
                <label htmlFor="certificationIssuer" className="field-label">
                  Issuer
                </label>

                <input
                  id="certificationIssuer"
                  name="issuer"
                  type="text"
                  className="input"
                  value={certificationForm.issuer}
                  onChange={handleCertificationChange}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="field">
                <label htmlFor="certificationYear" className="field-label">
                  Year
                </label>

                <input
                  id="certificationYear"
                  name="year"
                  type="number"
                  min="1900"
                  max="2100"
                  className="input"
                  value={certificationForm.year}
                  onChange={handleCertificationChange}
                  placeholder="e.g. 2025"
                />
              </div>

              <div className="form-actions" style={{ marginBottom: "var(--space-6)" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddCertification}
                >
                  Add Certification
                </button>
              </div>

              {certifications.length === 0 ? (
                <div className="empty-state">
                  <h3>No certifications yet</h3>
                  <p>Add a certification above to strengthen your profile.</p>
                </div>
              ) : (
                <div className="list-stack">
                  {certifications.map((certification, index) => (
                    <CertificationCard
                      key={`${certification.name}-${index}`}
                      certification={certification}
                      onRemove={handleRemoveCertification}
                    />
                  ))}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCertificationsSave}
                  disabled={saving}
                >
                  {saving && <span className="btn-spinner" />}
                  {saving ? "Saving..." : "Save Certifications"}
                </button>
              </div>
            </ProfileSection>

            <ProfileSection title="Resume">
              <div className="field">
                <label htmlFor="resume" className="field-label">
                  Upload Resume
                </label>

                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  style={fileInputStyle}
                />

                <span className="field-hint">Accepted formats: PDF, DOC, DOCX.</span>
              </div>

              {resumeFile && (
                <p style={{ marginBottom: "var(--space-4)", fontSize: 14 }}>
                  Selected file: <strong>{resumeFile.name}</strong>
                </p>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResumeUpload}
                  disabled={resumeUploading}
                >
                  {resumeUploading && <span className="btn-spinner" />}
                  {resumeUploading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </ProfileSection>
          </form>
        </>
      )}
    </DashboardLayout>
  );
};

export default Profile;