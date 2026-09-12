import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import { createNotification } from "./notificationService.js";

const error = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

export const schedule = async (
  recruiterId,
  applicationId,
  scheduledAt
) => {
  if (
    !scheduledAt ||
    Number.isNaN(new Date(scheduledAt).getTime()) ||
    new Date(scheduledAt) <= new Date()
  ) {
    throw error(
      "Interview time must be in the future",
      400
    );
  }

  const application =
    await Application.findById(applicationId)
      .populate("jobId");

  if (!application) {
    throw error(
      "Application not found",
      404
    );
  }

  if (
    application.jobId.createdBy.toString() !==
    recruiterId.toString()
  ) {
    throw error(
      "Not allowed",
      403
    );
  }

  if (application.status !== "SHORTLISTED") {
    throw error(
      "Application must be shortlisted",
      400
    );
  }

  const existingInterview =
    await Interview.findOne({
      applicationId,
    });

  if (existingInterview) {
    throw error(
      "Interview already exists for this application",
      409
    );
  }

  const interview = await Interview.create({
    applicationId,
    recruiterId,
    scheduledAt,
    status: "SCHEDULED",
  });

  application.status = "INTERVIEW";

  application.statusHistory.push({
    status: "INTERVIEW",
    changedBy: recruiterId,
  });

  await application.save();

  const student = await StudentProfile.findById(
    application.studentId
  );

  if (student) {
    await createNotification(
      student.userId,
      "INTERVIEW",
      "Your interview has been scheduled."
    );
  }

  return interview;
};

export const updateInterview = async (
  interviewId,
  recruiterId,
  updates = {}
) => {
  const interview =
    await Interview.findById(interviewId)
      .populate({
        path: "applicationId",
        populate: {
          path: "jobId",
        },
      });

  if (!interview) {
    throw error(
      "Interview not found",
      404
    );
  }

  if (
    interview.recruiterId.toString() !==
    recruiterId.toString()
  ) {
    throw error(
      "Not allowed",
      403
    );
  }

  const { scheduledAt, status } = updates;

  if (!scheduledAt && !status) {
    throw error(
      "Provide scheduledAt or status",
      400
    );
  }

  let notificationType = null;
  let notificationMessage = null;

  if (scheduledAt) {
    const newDate = new Date(scheduledAt);

    if (
      Number.isNaN(newDate.getTime()) ||
      newDate <= new Date()
    ) {
      throw error(
        "Interview time must be in the future",
        400
      );
    }

    if (
      interview.status === "CANCELLED" ||
      interview.status === "COMPLETED"
    ) {
      throw error(
        "This interview cannot be rescheduled",
        400
      );
    }

    interview.scheduledAt = newDate;
    interview.status = "RESCHEDULED";

    notificationType = "INTERVIEW";
    notificationMessage =
      "Your interview has been rescheduled.";
  }

  if (status) {
    const allowedStatuses = [
      "RESCHEDULED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw error(
        "Invalid interview status",
        400
      );
    }

    if (
      interview.status === "CANCELLED" ||
      interview.status === "COMPLETED"
    ) {
      throw error(
        "This interview cannot be updated",
        400
      );
    }

    if (
      status === "RESCHEDULED" &&
      !scheduledAt
    ) {
      throw error(
        "Scheduled time is required for rescheduling",
        400
      );
    }

    interview.status = status;

    const messages = {
      RESCHEDULED:
        "Your interview has been rescheduled.",
      CANCELLED:
        "Your interview has been cancelled.",
      COMPLETED:
        "Your interview has been completed.",
    };

    notificationType = "INTERVIEW";
    notificationMessage = messages[status];
  }

  const savedInterview =
    await interview.save();

  const student = await StudentProfile.findById(
    interview.applicationId.studentId
  );

  if (
    student &&
    notificationType &&
    notificationMessage
  ) {
    await createNotification(
      student.userId,
      notificationType,
      notificationMessage
    );
  }

  return savedInterview;
};

export const getMyInterviews = async (
  userId
) => {
  const profile =
    await StudentProfile.findOne({
      userId,
    });

  if (!profile) {
    throw error(
      "Complete your student profile first",
      400
    );
  }

  return Interview.find()
    .populate({
      path: "applicationId",
      match: {
        studentId: profile._id,
      },
      populate: {
        path: "jobId",
        populate: {
          path: "companyId",
          select: "name",
        },
      },
    })
    .populate({
      path: "recruiterId",
      select: "name email",
    })
    .sort({ scheduledAt: 1 })
    .then((interviews) =>
      interviews.filter(
        (interview) =>
          interview.applicationId
      )
    );
};

export const getRecruiterInterviews = async (
  recruiterId
) => {
  return Interview.find({
    recruiterId,
  })
    .populate({
      path: "applicationId",
      populate: {
        path: "jobId",
        populate: {
          path: "companyId",
          select: "name",
        },
      },
    })
    .populate({
      path: "applicationId",
      populate: {
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
    })
    .sort({ scheduledAt: 1 });
};