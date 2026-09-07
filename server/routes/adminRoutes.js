import express from "express";

import {
  listCompanies,
  setCompanyApproval,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/companies", authMiddleware, roleMiddleware("ADMIN"), listCompanies);
router.put("/companies/:id/approval", authMiddleware, roleMiddleware("ADMIN"), setCompanyApproval);

export default router;