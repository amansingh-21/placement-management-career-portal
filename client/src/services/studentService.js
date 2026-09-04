import api from "./api.js";

export const getMyProfile = async () => {
  const response = await api.get("/students/me");

  return response.data.profile;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.put(
    "/students/me",
    profileData
  );

  return response.data.profile;
};

export const updateSkills = async (skills) => {
  const response = await api.put(
    "/students/me/skills",
    {
      skills,
    }
  );

  return response.data.profile;
};

export const updateProjects = async (projects) => {
  const response = await api.put(
    "/students/me/projects",
    {
      projects,
    }
  );

  return response.data.profile;
};

export const updateCertifications = async (certifications) => {
  const response = await api.put(
    "/students/me/certifications",
    {
      certifications,
    }
  );

  return response.data.profile;
};

export const uploadResume = async (formData) => {
  const response = await api.post(
    "/students/me/resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.profile;
};