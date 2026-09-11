import {
  schedule,
  updateInterview,
  getMyInterviews,
  getRecruiterInterviews,
} from "../services/interviewService.js";

const handleError = (res, err) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error",
  });
};

export const createInterview = async (
  req,
  res
) => {
  try {
    const {
      applicationId,
      scheduledAt,
    } = req.body;

    if (!applicationId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message:
          "Application ID and scheduled time are required",
      });
    }

    const interview = await schedule(
      req.user.userId,
      applicationId,
      scheduledAt
    );

    res.status(201).json({
      success: true,
      message:
        "Interview scheduled successfully",
      interview,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const update = async (
  req,
  res
) => {
  try {
    const interview =
      await updateInterview(
        req.params.id,
        req.user.userId,
        req.body
      );

    res.json({
      success: true,
      message:
        "Interview updated successfully",
      interview,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getMine = async (
  req,
  res
) => {
  try {
    const interviews =
      await getMyInterviews(
        req.user.userId
      );

    res.json({
      success: true,
      interviews,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getForRecruiter = async (
  req,
  res
) => {
  try {
    const interviews =
      await getRecruiterInterviews(
        req.user.userId
      );

    res.json({
      success: true,
      interviews,
    });
  } catch (err) {
    handleError(res, err);
  }
};