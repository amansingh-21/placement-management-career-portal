import mongoose from "mongoose";

import {
  approveCompany as approveCompanyService,
  createCompany as createCompanyService,
  getMyCompany as getMyCompanyService,
  updateMyCompany as updateMyCompanyService,
} from "../services/companyService.js";

export const approveCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await approveCompanyService(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company approved successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const company = await createCompanyService(
      req.user.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCompany = async (req, res, next) => {
  try {
    const company = await getMyCompanyService(
      req.user.userId
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyCompany = async (req, res, next) => {
  try {
    const company = await updateMyCompanyService(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};