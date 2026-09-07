import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

import {
  getMe,
  updateMe,
  updateSkills,
  updateProjects,
  updateCertifications,
  uploadResume as uploadResumeController,
} from "../controllers/studentController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("STUDENT"));

router.get("/me", getMe);
router.put("/me", updateMe);
router.put("/me/skills", updateSkills);
router.put("/me/projects", updateProjects);
router.put("/me/certifications", updateCertifications);

router.post("/me/resume", uploadResume.single("resume"), uploadResumeController);

export default router;