import express from "express";
import { createJob, getJobs, approveJob, publishJob, getJobById, closeJob, updateJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("RECRUITER"), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.patch("/:id", authMiddleware, roleMiddleware("RECRUITER"), updateJob);
router.patch("/:id/approve", authMiddleware, roleMiddleware("ADMIN"), approveJob);
router.patch("/:id/publish", authMiddleware, roleMiddleware("ADMIN"), publishJob);
router.patch("/:id/close", authMiddleware, roleMiddleware("ADMIN"), closeJob);

export default router;