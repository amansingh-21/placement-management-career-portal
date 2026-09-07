import mongoose from "mongoose";

import {
  createJob as createJobService,
  listOpenJobs,
  getJobById as getJobByIdService,
  getRecruiterJobById as getRecruiterJobByIdService,
  getRecruiterJobs,
  getPendingJobs as getPendingJobsService,
  updateJob as updateJobService,
  submitJob as submitJobService,
  approveJob as approveJobService,
  rejectJob as rejectJobService,
  closeJob as closeJobService,
} from "../services/jobService.js";

export const createJob = async (
  req,
  res,
  next
) => {
  try {
    const job = await createJobService(
      req.user.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (
  req,
  res,
  next
) => {
  try {
    const jobs = await listOpenJobs(req.query);

    return res.status(200).json({
      success: true,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
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

    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobById = async (
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

    const job = await getRecruiterJobByIdService(
      req.user.userId,
      id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (
  req,
  res,
  next
) => {
  try {
    const jobs = await getRecruiterJobs(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingJobs = async (
  req,
  res,
  next
) => {
  try {
    const jobs = await getPendingJobsService();

    return res.status(200).json({
      success: true,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
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

    const job = await updateJobService(
      req.user.userId,
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitJob = async (
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

    const job = await submitJobService(
      req.user.userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Job submitted for approval",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveJob = async (
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

    const job = await approveJobService(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Pending job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job approved successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectJob = async (
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

    const job = await rejectJobService(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Pending job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job rejected successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const closeJob = async (
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

    const job = await closeJobService(
      req.user.userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Job closed successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};