import express from "express";

import {
  createInterview,
  update,
  getMine,
  getForRecruiter,
} from "../controllers/interviewController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// RECRUITER — Schedule an interview
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  createInterview
);

// STUDENT — View own interviews
router.get(
  "/me",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  getMine
);

// RECRUITER — View their interviews
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  getForRecruiter
);

// RECRUITER — Reschedule, cancel, or complete
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["RECRUITER"]),
  update
);

export default router;