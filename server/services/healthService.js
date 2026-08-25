import mongoose from "mongoose";

const getHealthStatus = () => {
  return {
    success: true,
    message: "API is running",
  };
};

const getDatabaseHealthStatus = () => {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    return {
      success: true,
      message: "Database connection is working",
    };
  }

  return {
    success: false,
    message: "Database is not connected",
  };
};

export default {
  getHealthStatus,
  getDatabaseHealthStatus,
};