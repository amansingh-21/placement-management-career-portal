import Company from "../models/Company.js";

export const listCompanies = async (status) => {
  const filter = status
    ? { approvalStatus: status }
    : {};

  return Company.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

export const setCompanyApproval = async (
  companyId,
  approvalStatus
) => {
  if (
    !["APPROVED", "REJECTED"].includes(
      approvalStatus
    )
  ) {
    throw Object.assign(
      new Error("Invalid approval status"),
      { statusCode: 400 }
    );
  }

  const company =
    await Company.findByIdAndUpdate(
      companyId,
      {
        approvalStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!company) {
    throw Object.assign(
      new Error("Company not found"),
      { statusCode: 404 }
    );
  }

  return company;
};