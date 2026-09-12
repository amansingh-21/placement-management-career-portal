import express from "express";

import {
  getMine,
  read,
} from "../controllers/notificationController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticated user — view own notifications
router.get(
  "/",
  authMiddleware,
  getMine
);

// Authenticated user — mark own notification as read
router.put(
  "/:id/read",
  authMiddleware,
  read
);

export default router;