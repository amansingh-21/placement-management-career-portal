import express from "express";

import {
  apply,
  getMine,
  getForRecruiter,
  changeStatus,
} from "../controllers/applicationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// STUDENT — Apply to a job
router.post(
  "/jobs/:jobId/apply",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  apply
);

// STUDENT — View own applications
router.get(
  "/applications/me",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  getMine
);

// RECRUITER — View applications for their jobs
router.get(
  "/recruiter/applications",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  getForRecruiter
);

// RECRUITER — Update application status
router.put(
  "/applications/:id/status",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  changeStatus
);

export default router;