import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// Database health check
app.get("/api/health/db", (req, res) => {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    return res.json({
      success: true,
      message: "Database connection is working",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Database is not connected",
  });
});

export default app;