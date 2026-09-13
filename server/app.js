import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", eligibilityRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard",dashboardRoutes);

app.use("/uploads", express.static("uploads"));

// 404 handler
app.use(notFoundMiddleware);

// Centralized error handler
app.use(errorMiddleware);

export default app;