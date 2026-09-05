import express from "express";

import {
  approveCompany,
  createCompany,
  getMyCompany,
  updateMyCompany,
} from "../controllers/companyController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin: approve a company
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveCompany
);

// Recruiter: create a company
router.post(
  "/",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  createCompany
);

// Recruiter: get own company
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  getMyCompany
);

// Recruiter: update own company
router.put(
  "/me",
  authMiddleware,
  roleMiddleware("RECRUITER"),
  updateMyCompany
);

export default router;