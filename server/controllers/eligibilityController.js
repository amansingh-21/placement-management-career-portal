import mongoose from "mongoose";

import Job from "../models/Job.js";
import StudentProfile from "../models/StudentProfile.js";

import { checkEligibility } from "../services/eligibilityService.js";

export const getEligibility = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findOne({
      _id: id,
      approvalStatus: "APPROVED",
      status: "PUBLISHED",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const profile =
      await StudentProfile.findOne({
        userId: req.user.userId,
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          "Student profile not found",
      });
    }

    const result = checkEligibility(
      profile,
      job
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};