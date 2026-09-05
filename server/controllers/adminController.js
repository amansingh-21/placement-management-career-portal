import mongoose from "mongoose";

import {
  listCompanies as listCompaniesService,
  setCompanyApproval as setCompanyApprovalService,
} from "../services/adminService.js";

export const listCompanies = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.query;

    if (
      status &&
      !["PENDING", "APPROVED", "REJECTED"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company status",
      });
    }

    const companies =
      await listCompaniesService(status);

    return res.status(200).json({
      success: true,
      data: {
        companies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const setCompanyApproval = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company =
      await setCompanyApprovalService(
        id,
        approvalStatus
      );

    return res.status(200).json({
      success: true,
      message: `Company ${approvalStatus.toLowerCase()} successfully`,
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};