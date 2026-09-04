import * as studentService from "../services/studentService.js";

export const getMe = async (req, res, next) => {
  try {
    const profile = await studentService.getMyProfile(
      req.user.userId
    );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const profile = await studentService.updateMyProfile(
      req.user.userId,
      req.body
    );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    const profile = await studentService.updateSkills(
      req.user.userId,
      skills
    );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjects = async (
  req,
  res,
  next
) => {
  try {
    const { projects } = req.body;

    const profile =
      await studentService.updateProjects(
        req.user.userId,
        projects
      );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCertifications = async (
  req,
  res,
  next
) => {
  try {
    const { certifications } = req.body;

    const profile =
      await studentService.updateCertifications(
        req.user.userId,
        certifications
      );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    const profile = await studentService.saveResume(
      req.user.userId,
      req.file.path
    );

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};