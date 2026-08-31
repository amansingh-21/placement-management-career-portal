  import mongoose from "mongoose";
  import { 
    createJob as createJobService, 
    getPublishedJobs, 
    approveJob as approveJobService,  
    publishJob as publishJobService, 
    getJobById as getJobByIdService, 
    closeJob as closeJobService,
    updateJob as updateJobService, 
  } from "../services/jobService.js";

  export const createJob = async (req, res, next) => {
    try {
      const {
        companyId,
        eligibility,
        deadline,
      } = req.body;

      if (!companyId || !deadline) {
        return res.status(400).json({
          success: false,
          message: "Company ID and deadline are required",
        });
      }

      const job = await createJobService({
        companyId,
        eligibility,
        deadline,
        createdBy: req.user.userId,
      });

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

  export const getJobs = async (req, res, next) => {
    try {
      const jobs = await getPublishedJobs();

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

  export const approveJob = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await approveJobService(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
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

  export const publishJob = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await publishJobService(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job === "NOT_APPROVED") {
        return res.status(400).json({
          success: false,
          message: "Job must be approved before publishing",
        });
      }

      if (job === "COMPANY_NOT_APPROVED") {
        return res.status(400).json({
          success: false,
          message: "Company must be approved before publishing",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Job published successfully",
        data: {
          job,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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

  export const closeJob = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await closeJobService(id);

      if (!job) {
        return res.status(400).json({
          success: false,
          message: "Only published jobs can be closed",
        });
      }

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

  export const updateJob = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await updateJobService(
        id,
        req.user.userId,
        req.body
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found or access denied",
        });
      }

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