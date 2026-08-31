import Company from "../models/Company.js";

export const approveCompany = async (companyId) => {
  const company = await Company.findByIdAndUpdate(
    companyId,
    {
      approvalStatus: "APPROVED",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return company;
};