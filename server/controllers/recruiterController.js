import * as recruiterService from "../services/recruiterService.js";

export const getMe = async (req, res, next) => {
  try {
    const profile = await recruiterService.getMyProfile(
      req.user.userId
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const profile = await recruiterService.updateMyProfile(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};