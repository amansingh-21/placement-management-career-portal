import api from "./api.js";

export const scheduleInterview = async (
  applicationId,
  scheduledAt
) => {
  const response = await api.post(
    "/interviews",
    {
      applicationId,
      scheduledAt,
    }
  );

  return response.data.interview;
};

export const updateInterview = async (
  interviewId,
  data
) => {
  const response = await api.put(
    `/interviews/${interviewId}`,
    data
  );

  return response.data.interview;
};

export const getMyInterviews = async () => {
  const response = await api.get(
    "/interviews/me"
  );

  return response.data.interviews;
};

export const getRecruiterInterviews =
  async () => {
    const response = await api.get(
      "/interviews/recruiter"
    );

    return response.data.interviews;
  };