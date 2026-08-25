import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
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

// 404 handler
app.use(notFoundMiddleware);

// Centralized error handler
app.use(errorMiddleware);

export default app;