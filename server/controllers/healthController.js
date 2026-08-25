import healthService from "../services/healthService.js";

const getHealth = (req, res) => {
  const result = healthService.getHealthStatus();

  res.status(200).json(result);
};

const getDatabaseHealth = (req, res) => {
  const result = healthService.getDatabaseHealthStatus();

  if (!result.success) {
    return res.status(500).json(result);
  }

  res.status(200).json(result);
};

export default {
  getHealth,
  getDatabaseHealth,
};