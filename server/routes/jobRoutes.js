import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  getMyJobById,
  getPendingJobs,
  updateJob,
  submitJob,
  approveJob,
  rejectJob,
  closeJob,
} from "../controllers/jobController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getJobs
);

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getPendingJobs
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  getMyJobs
);

router.get(
  "/my/:id",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  getMyJobById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  createJob
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  updateJob
);

router.post(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  submitJob
);

router.patch(
  "/:id/close",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  closeJob
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveJob
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectJob
);

router.get(
  "/:id",
  authMiddleware,
  getJobById
);

export default router;