import express from "express";
import { createJob, getJobs, approveJob, publishJob, getJobById, closeJob, updateJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("RECRUITER"), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.patch("/:id", authMiddleware, requireRole("RECRUITER"), updateJob);
router.patch("/:id/approve", authMiddleware, requireRole("ADMIN"), approveJob);
router.patch("/:id/publish", authMiddleware, requireRole("ADMIN"), publishJob);
router.patch("/:id/close", authMiddleware, requireRole("ADMIN"), closeJob);

export default router;