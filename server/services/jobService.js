import Job from "../models/Job.js";
import "../models/Company.js";
import "../models/User.js";

export const createJob = async ({
  companyId,
  eligibility,
  deadline,
  createdBy,
}) => {
  const job = await Job.create({
    companyId,
    eligibility,
    deadline,
    createdBy,
  });

  return job;
};

export const getPublishedJobs = async () => {
  const jobs = await Job.find({
    approvalStatus: "APPROVED",
    status: "PUBLISHED",
  })
    .populate({
      path: "companyId",
      match: {
        approvalStatus: "APPROVED",
      },
    })
    .populate("createdBy", "name email");

  return jobs.filter((job) => job.companyId !== null);
};

export const approveJob = async (jobId) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      approvalStatus: "APPROVED",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return job;
};

export const publishJob = async (jobId) => {
  const job = await Job.findById(jobId).populate("companyId");

  if (!job) {
    return null;
  }

  if (job.approvalStatus !== "APPROVED") {
    return "NOT_APPROVED";
  }

  if (job.companyId.approvalStatus !== "APPROVED") {
    return "COMPANY_NOT_APPROVED";
  }

  job.status = "PUBLISHED";
  await job.save();

  return job;
};

export const getJobById = async (jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    approvalStatus: "APPROVED",
    status: "PUBLISHED",
  })
    .populate({
      path: "companyId",
      match: {
        approvalStatus: "APPROVED",
      },
    })
    .populate("createdBy", "name email");

  if (!job || !job.companyId) {
    return null;
  }

  return job;
};

export const closeJob = async (jobId) => {
  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      status: "PUBLISHED",
    },
    {
      status: "CLOSED",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return job;
};

export const updateJob = async (jobId, recruiterId, updateData) => {
  
  const job = await Job.findOne({
    _id: jobId,
    createdBy: recruiterId,
    status: "DRAFT",
    approvalStatus: "PENDING",
  });

  if (!job) {
    return null;
  }

  job.eligibility = updateData.eligibility ?? job.eligibility;
  job.deadline = updateData.deadline ?? job.deadline;

  await job.save();

  return job;
};