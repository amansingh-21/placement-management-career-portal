import mongoose from "mongoose";

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import StudentProfile from "../models/StudentProfile.js";
import { checkEligibility } from "./eligibilityService.js";
import { canTransition } from "../utils/applicationTransitions.js";
import { createNotification } from "./notificationService.js";

const error = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

export const applyToJob = async (userId, jobId) => {
  if (!mongoose.isValidObjectId(jobId)) {
    throw error("Invalid job ID", 400);
  }

  const profile = await StudentProfile.findOne({
    userId,
  });

  if (!profile) {
    throw error(
      "Complete your student profile first",
      400
    );
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw error("Job not found", 404);
  }

  if (
    job.approvalStatus !== "APPROVED" ||
    job.status !== "PUBLISHED"
  ) {
    throw error("Job is not open", 400);
  }

  if (new Date(job.deadline) <= new Date()) {
    throw error(
      "Application deadline has passed",
      400
    );
  }

  const eligibility = checkEligibility(
    profile,
    job
  );

  if (!eligibility.eligible) {
    throw error(
      `Not eligible: ${eligibility.reasons.join("; ")}`,
      400
    );
  }

  const exists = await Application.findOne({
    studentId: profile._id,
    jobId,
  });

  if (exists) {
    throw error("Already applied", 409);
  }

  return Application.create({
    studentId: profile._id,
    jobId,
    status: "APPLIED",
    statusHistory: [
      {
        status: "APPLIED",
        changedBy: userId,
      },
    ],
  });
};

export const getMyApplications = async (userId) => {
  const profile = await StudentProfile.findOne({
    userId,
  });

  if (!profile) {
    throw error(
      "Complete your student profile first",
      400
    );
  }

  return Application.find({
    studentId: profile._id,
  })
    .populate({
      path: "jobId",
      populate: {
        path: "companyId",
        select: "name",
      },
    })
    .populate({
      path: "statusHistory.changedBy",
      select: "name email",
    })
    .sort({ createdAt: -1 });
};

export const getRecruiterApplications = async (
  recruiterUserId
) => {
  return Application.find()
    .populate({
      path: "jobId",
      match: {
        createdBy: recruiterUserId,
      },
      populate: {
        path: "companyId",
        select: "name",
      },
    })
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .populate({
      path: "statusHistory.changedBy",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .then((applications) =>
      applications.filter(
        (application) => application.jobId
      )
    );
};

export const updateStatus = async (
  applicationId,
  recruiterUserId,
  nextStatus
) => {
  if (!mongoose.isValidObjectId(applicationId)) {
    throw error(
      "Invalid application ID",
      400
    );
  }

  const application = await Application.findById(
    applicationId
  ).populate("jobId");

  if (!application) {
    throw error(
      "Application not found",
      404
    );
  }

  if (
    application.jobId.createdBy.toString() !==
    recruiterUserId.toString()
  ) {
    throw error("Not allowed", 403);
  }

  if (
    !canTransition(
      application.status,
      nextStatus
    )
  ) {
    throw error(
      "Invalid status transition",
      400
    );
  }

  application.status = nextStatus;

  application.statusHistory.push({
    status: nextStatus,
    changedBy: recruiterUserId,
  });

  await application.save();

  if (
    nextStatus === "SHORTLISTED" ||
    nextStatus === "REJECTED"
  ) {
    const messages = {
      SHORTLISTED:
        "Your application has been shortlisted.",
      REJECTED:
        "Your application has been rejected.",
    };

    const student = await StudentProfile.findById(
      application.studentId
    );

    if (student) {
      await createNotification(
        student.userId,
        nextStatus,
        messages[nextStatus]
      );
    }
  }

  return Application.findById(applicationId)
    .populate({
      path: "jobId",
      populate: {
        path: "companyId",
        select: "name",
      },
    })
    .populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .populate({
      path: "statusHistory.changedBy",
      select: "name email",
    });
};