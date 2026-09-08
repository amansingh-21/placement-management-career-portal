import express from "express";

import { getEligibility } from "../controllers/eligibilityController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/jobs/:id/eligibility",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getEligibility
);

export default router;