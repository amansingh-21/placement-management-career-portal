import api from "./api.js";

export const applyToJob = async (jobId) => {
  const response = await api.post(
    `/jobs/${jobId}/apply`
  );

  return response.data.application;
};

export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/me"
  );

  return response.data.applications;
};

export const getRecruiterApplications = async () => {
  const response = await api.get(
    "/recruiter/applications"
  );

  return response.data.applications;
};

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.put(
    `/applications/${applicationId}/status`,
    { status }
  );

  return response.data.application;
};