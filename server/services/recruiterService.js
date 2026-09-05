import RecruiterProfile from "../models/RecruiterProfile.js";

export const getMyProfile = async (userId) => {
  return RecruiterProfile.findOne({ userId })
    .populate("companyId");
};

export const updateMyProfile = async (userId, data) => {
  const profile = await RecruiterProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  ).populate("companyId");

  return profile;
};