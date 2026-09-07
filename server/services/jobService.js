import Job from "../models/Job.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

export const createJob = async (userId, data) => {
  const profile = await RecruiterProfile.findOne({
    userId,
  }).populate("companyId");

  if (!profile?.companyId) {
    throw Object.assign(
      new Error("Company not found"),
      { statusCode: 400 }
    );
  }

  if (
    profile.companyId.approvalStatus !== "APPROVED"
  ) {
    throw Object.assign(
      new Error("Company is not approved"),
      { statusCode: 403 }
    );
  }

  if (!data.title?.trim()) {
    throw Object.assign(
      new Error("Job title is required"),
      { statusCode: 400 }
    );
  }

  if (!data.description?.trim()) {
    throw Object.assign(
      new Error("Job description is required"),
      { statusCode: 400 }
    );
  }

  if (!data.deadline) {
    throw Object.assign(
      new Error("Deadline is required"),
      { statusCode: 400 }
    );
  }

  if (new Date(data.deadline) <= new Date()) {
    throw Object.assign(
      new Error("Deadline must be in the future"),
      { statusCode: 400 }
    );
  }

  if (
    data.salary !== undefined &&
    Number(data.salary) < 0
  ) {
    throw Object.assign(
      new Error("Salary cannot be negative"),
      { statusCode: 400 }
    );
  }

  const job = await Job.create({
    title: data.title.trim(),
    description: data.description.trim(),
    location: data.location?.trim() || "",
    salary: Number(data.salary || 0),
    eligibility: data.eligibility || {},
    deadline: data.deadline,
    companyId: profile.companyId._id,
    createdBy: userId,
    approvalStatus: "PENDING",
    status: "DRAFT",
  });

  return job;
};

export const listOpenJobs = async (query = {}) => {
  const filter = {
    approvalStatus: "APPROVED",
    status: "PUBLISHED",
  };

  if (query.search?.trim()) {
    const search = query.search.trim();

    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        location: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return Job.find(filter)
    .populate("companyId", "name")
    .sort({ createdAt: -1 });
};

export const getJobById = async (jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    approvalStatus: "APPROVED",
    status: "PUBLISHED",
  })
    .populate("companyId", "name")
    .populate("createdBy", "name email");

  return job;
};

export const getRecruiterJobById = async (
  userId,
  jobId
) => {
  return Job.findOne({
    _id: jobId,
    createdBy: userId,
  })
    .populate("companyId", "name")
    .populate("createdBy", "name email");
};

export const getRecruiterJobs = async (userId) => {
  return Job.find({
    createdBy: userId,
  })
    .populate("companyId", "name")
    .sort({ createdAt: -1 });
};

export const getPendingJobs = async () => {
  return Job.find({
    approvalStatus: "PENDING",
    status: "DRAFT",
  })
    .populate("companyId", "name")
    .sort({ createdAt: -1 });
};

export const updateJob = async (
  userId,
  jobId,
  data
) => {
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw Object.assign(
      new Error("Job not found or access denied"),
      { statusCode: 404 }
    );
  }

  if (job.status !== "DRAFT") {
    throw Object.assign(
      new Error("Only draft jobs can be updated"),
      { statusCode: 400 }
    );
  }

  if (data.title !== undefined) {
    if (!String(data.title).trim()) {
      throw Object.assign(
        new Error("Job title is required"),
        { statusCode: 400 }
      );
    }

    job.title = String(data.title).trim();
  }

  if (data.description !== undefined) {
    if (!String(data.description).trim()) {
      throw Object.assign(
        new Error("Job description is required"),
        { statusCode: 400 }
      );
    }

    job.description = String(data.description).trim();
  }

  if (data.location !== undefined) {
    job.location = String(data.location).trim();
  }

  if (data.salary !== undefined) {
    if (Number(data.salary) < 0) {
      throw Object.assign(
        new Error("Salary cannot be negative"),
        { statusCode: 400 }
      );
    }

    job.salary = Number(data.salary);
  }

  if (data.deadline !== undefined) {
    if (new Date(data.deadline) <= new Date()) {
      throw Object.assign(
        new Error("Deadline must be in the future"),
        { statusCode: 400 }
      );
    }

    job.deadline = data.deadline;
  }

  if (data.eligibility !== undefined) {
    job.eligibility = data.eligibility;
  }

  await job.save();

  return job;
};

export const submitJob = async (
  userId,
  jobId
) => {
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw Object.assign(
      new Error("Job not found"),
      { statusCode: 404 }
    );
  }

  if (job.status !== "DRAFT") {
    throw Object.assign(
      new Error("Only draft jobs can be submitted"),
      { statusCode: 400 }
    );
  }

  if (job.approvalStatus !== "PENDING") {
    throw Object.assign(
      new Error("Only pending jobs can be submitted"),
      { statusCode: 400 }
    );
  }

  return job.save();
};

export const approveJob = async (jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    approvalStatus: "PENDING",
    status: "DRAFT",
  });

  if (!job) {
    return null;
  }

  job.approvalStatus = "APPROVED";
  job.status = "PUBLISHED";

  return job.save();
};

export const rejectJob = async (jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    approvalStatus: "PENDING",
    status: "DRAFT",
  });

  if (!job) {
    return null;
  }

  job.approvalStatus = "REJECTED";

  return job.save();
};

export const closeJob = async (
  userId,
  jobId
) => {
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw Object.assign(
      new Error("Job not found or access denied"),
      { statusCode: 404 }
    );
  }

  if (job.approvalStatus !== "APPROVED") {
    throw Object.assign(
      new Error("Only approved jobs can be closed"),
      { statusCode: 400 }
    );
  }

  job.status = "CLOSED";

  return job.save();
};