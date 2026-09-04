import express from "express";

import { approveCompany } from "../controllers/companyController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveCompany
);

export default router;