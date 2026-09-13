import Job from "../models/Job.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

const validateEligibility = (eligibility = {}) => {
  if (
    eligibility === null ||
    typeof eligibility !== "object" ||
    Array.isArray(eligibility)
  ) {
    throw Object.assign(
      new Error("Eligibility must be an object"),
      { statusCode: 400 }
    );
  }

  if (eligibility.minCgpa !== undefined) {
    const minCgpa = Number(eligibility.minCgpa);

    if (
      !Number.isFinite(minCgpa) ||
      minCgpa < 0 ||
      minCgpa > 10
    ) {
      throw Object.assign(
        new Error("Minimum CGPA must be between 0 and 10"),
        { statusCode: 400 }
      );
    }
  }

  if (eligibility.maxBacklogs !== undefined) {
    const maxBacklogs = Number(
      eligibility.maxBacklogs
    );

    if (
      !Number.isInteger(maxBacklogs) ||
      maxBacklogs < 0
    ) {
      throw Object.assign(
        new Error(
          "Maximum backlogs must be a non-negative integer"
        ),
        { statusCode: 400 }
      );
    }
  }

  if (eligibility.degree !== undefined) {
    if (
      typeof eligibility.degree !== "string" ||
      !eligibility.degree.trim()
    ) {
      throw Object.assign(
        new Error("Degree must be a valid value"),
        { statusCode: 400 }
      );
    }
  }

  if (eligibility.graduationYear !== undefined) {
    const graduationYear = Number(
      eligibility.graduationYear
    );

    if (
      !Number.isInteger(graduationYear) ||
      graduationYear < 1900 ||
      graduationYear > 2100
    ) {
      throw Object.assign(
        new Error(
          "Graduation year must be between 1900 and 2100"
        ),
        { statusCode: 400 }
      );
    }
  }

  if (eligibility.skills !== undefined) {
    if (!Array.isArray(eligibility.skills)) {
      throw Object.assign(
        new Error("Required skills must be an array"),
        { statusCode: 400 }
      );
    }

    const invalidSkill = eligibility.skills.some(
      (skill) =>
        typeof skill !== "string" ||
        !skill.trim()
    );

    if (invalidSkill) {
      throw Object.assign(
        new Error(
          "Each required skill must be a valid string"
        ),
        { statusCode: 400 }
      );
    }
  }
};

const validateSalary = (salary) => {
  const value = Number(salary);

  if (!Number.isFinite(value) || value < 0) {
    throw Object.assign(
      new Error("Salary must be a valid number greater than or equal to 0"),
      { statusCode: 400 }
    );
  }

  return value;
};

const validateDeadline = (deadline) => {
  if (!deadline) {
    throw Object.assign(
      new Error("Deadline is required"),
      { statusCode: 400 }
    );
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    throw Object.assign(
      new Error("Deadline must be a valid date"),
      { statusCode: 400 }
    );
  }

  if (date <= new Date()) {
    throw Object.assign(
      new Error("Deadline must be in the future"),
      { statusCode: 400 }
    );
  }

  return date;
};

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

  const deadline = validateDeadline(data.deadline);

  const salary =
    data.salary === undefined
      ? 0
      : validateSalary(data.salary);

  validateEligibility(data.eligibility || {});

  const job = await Job.create({
    title: data.title.trim(),
    description: data.description.trim(),
    location: data.location?.trim() || "",
    salary,
    eligibility: data.eligibility || {},
    deadline,
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
    job.salary = validateSalary(data.salary);
  }

  if (data.deadline !== undefined) {
    job.deadline = validateDeadline(data.deadline);
  }

  if (data.eligibility !== undefined) {
    validateEligibility(data.eligibility);
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
    createdBy: userId,
    _id: jobId,
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

  if (!job) return null;

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

  if (!job) return null;

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