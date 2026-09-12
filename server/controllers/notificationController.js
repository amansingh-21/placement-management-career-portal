import {
  getMyNotifications,
  markRead,
} from "../services/notificationService.js";

const handleError = (res, error) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server error",
  });
};

export const getMine = async (req, res) => {
  try {
    const notifications =
      await getMyNotifications(
        req.user.userId
      );

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const read = async (req, res) => {
  try {
    const notification =
      await markRead(
        req.user.userId,
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    handleError(res, error);
  }
};