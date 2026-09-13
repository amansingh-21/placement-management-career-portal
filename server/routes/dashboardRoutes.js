import express from "express";

import {
  getStudentDashboardData,
  getRecruiterDashboardData,
  getAdminDashboardData,
} from "../controllers/dashboardController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  getStudentDashboardData
);

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  getRecruiterDashboardData
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAdminDashboardData
);

export default router;