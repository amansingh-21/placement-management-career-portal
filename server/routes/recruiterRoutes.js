import express from "express";

import {
  getMe,
  updateMe,
} from "../controllers/recruiterController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("RECRUITER")
);

router.get("/me", getMe);

router.put("/me", updateMe);

export default router;