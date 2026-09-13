import {
  getStudentDashboard,
  getRecruiterDashboard,
  getAdminDashboard,
} from "../services/dashboardService.js";

const handleError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server error",
  });
};

export const getStudentDashboardData = async (
  req,
  res
) => {
  try {
    const dashboard =
      await getStudentDashboard(
        req.user.userId
      );

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getRecruiterDashboardData =
  async (req, res) => {
    try {
      const dashboard =
        await getRecruiterDashboard(
          req.user.userId
        );

      res.json({
        success: true,
        dashboard,
      });
    } catch (error) {
      handleError(res, error);
    }
  };

export const getAdminDashboardData = async (
  req,
  res
) => {
  try {
    const dashboard =
      await getAdminDashboard();

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    handleError(res, error);
  }
};