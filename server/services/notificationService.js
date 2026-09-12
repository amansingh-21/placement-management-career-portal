import mongoose from "mongoose";

import Notification from "../models/Notification.js";

const error = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

export const createNotification = async (
  userId,
  type,
  message
) => {
  return Notification.create({
    userId,
    type,
    message,
  });
};

export const getMyNotifications = async (
  userId
) => {
  return Notification.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

export const markRead = async (
  userId,
  notificationId
) => {
  if (
    !mongoose.isValidObjectId(notificationId)
  ) {
    throw error(
      "Invalid notification ID",
      400
    );
  }

  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};