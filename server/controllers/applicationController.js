import {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  updateStatus,
} from "../services/applicationService.js";

const handleError = (res, err) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error",
  });
};

export const apply = async (req, res) => {
  try {
    const application = await applyToJob(
      req.user.userId,
      req.params.jobId
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getMine = async (req, res) => {
  try {
    const applications = await getMyApplications(
      req.user.userId
    );

    res.json({
      success: true,
      applications,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getForRecruiter = async (req, res) => {
  try {
    const applications = await getRecruiterApplications(
      req.user.userId
    );

    res.json({
      success: true,
      applications,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const application = await updateStatus(
      req.params.id,
      req.user.userId,
      status
    );

    res.json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (err) {
    handleError(res, err);
  }
};