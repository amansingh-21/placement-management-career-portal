import mongoose from "mongoose";
import { approveCompany as approveCompanyService } from "../services/companyService.js";

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