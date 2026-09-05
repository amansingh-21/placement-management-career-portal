import Company from "../models/Company.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

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

export const createCompany = async (userId, data) => {
  const existingProfile = await RecruiterProfile.findOne({
    userId,
  });

  if (existingProfile) {
    throw Object.assign(
      new Error("Recruiter already has a company"),
      { statusCode: 409 }
    );
  }

  if (!data.name || !data.name.trim()) {
    throw Object.assign(
      new Error("Company name is required"),
      { statusCode: 400 }
    );
  }

  const company = await Company.create({
    name: data.name.trim(),
    createdBy: userId,
    approvalStatus: "PENDING",
  });

  await RecruiterProfile.create({
    userId,
    companyId: company._id,
  });

  return company;
};

export const getMyCompany = async (userId) => {
  const profile = await RecruiterProfile.findOne({
    userId,
  }).populate("companyId");

  if (!profile) {
    return null;
  }

  return profile.companyId;
};

export const updateMyCompany = async (userId, data) => {
  const profile = await RecruiterProfile.findOne({
    userId,
  });

  if (!profile) {
    throw Object.assign(
      new Error("Recruiter profile not found"),
      { statusCode: 404 }
    );
  }

  if (!data.name || !data.name.trim()) {
    throw Object.assign(
      new Error("Company name is required"),
      { statusCode: 400 }
    );
  }

  const company = await Company.findOneAndUpdate(
    {
      _id: profile.companyId,
      createdBy: userId,
    },
    {
      $set: {
        name: data.name.trim(),
      },
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