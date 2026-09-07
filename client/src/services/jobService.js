import api from "./api.js";

export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data.data.jobs;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data.data.job;
};

export const getMyJobs = async () => {
  const response = await api.get("/jobs/my");

  return response.data.data.jobs;
};

export const getMyJobById = async (jobId) => {
  const response = await api.get(`/jobs/my/${jobId}`);

  return response.data.data.job;
};

export const getPendingJobs = async () => {
  const response = await api.get("/jobs/pending");

  return response.data.data.jobs;
};

export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);

  return response.data.data.job;
};

export const updateJob = async (
  jobId,
  jobData
) => {
  const response = await api.put(
    `/jobs/${jobId}`,
    jobData
  );

  return response.data.data.job;
};

export const submitJob = async (jobId) => {
  const response = await api.post(
    `/jobs/${jobId}/submit`
  );

  return response.data.data.job;
};

export const approveJob = async (jobId) => {
  const response = await api.patch(
    `/jobs/${jobId}/approve`
  );

  return response.data.data.job;
};

export const rejectJob = async (jobId) => {
  const response = await api.patch(
    `/jobs/${jobId}/reject`
  );

  return response.data.data.job;
};

export const closeJob = async (jobId) => {
  const response = await api.patch(
    `/jobs/${jobId}/close`
  );

  return response.data.data.job;
};