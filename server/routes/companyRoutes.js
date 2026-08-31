import express from "express";

import { approveCompany } from "../controllers/companyController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.patch(
  "/:id/approve",
  authMiddleware,
  requireRole("ADMIN"),
  approveCompany
);

export default router;