import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Interview from "../models/Interview.js";
import Job from "../models/Job.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";

const error = (message, statusCode) =>
  Object.assign(new Error(message), {
    statusCode,
  });

export const getStudentDashboard = async (
  userId
) => {
  const student =
    await StudentProfile.findOne({
      userId,
    });

  if (!student) {
    throw error(
      "Student profile not found",
      404
    );
  }

  const studentApplicationIds =
    await Application.find({
      studentId: student._id,
    }).distinct("_id");

  const [
    totalApplications,
    shortlistedApplications,
    interviewApplications,
    selectedApplications,
    rejectedApplications,
    upcomingInterviews,
    recentApplications,
  ] = await Promise.all([
    Application.countDocuments({
      studentId: student._id,
    }),

    Application.countDocuments({
      studentId: student._id,
      status: "SHORTLISTED",
    }),

    Application.countDocuments({
      studentId: student._id,
      status: "INTERVIEW",
    }),

    Application.countDocuments({
      studentId: student._id,
      status: "SELECTED",
    }),

    Application.countDocuments({
      studentId: student._id,
      status: "REJECTED",
    }),

    Interview.find({
      applicationId: {
        $in: studentApplicationIds,
      },
      status: {
        $in: [
          "SCHEDULED",
          "RESCHEDULED",
        ],
      },
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .populate({
        path: "applicationId",
        populate: {
          path: "jobId",
          select: "title companyId",
          populate: {
            path: "companyId",
            select: "name",
          },
        },
      })
      .sort({
        scheduledAt: 1,
      })
      .limit(5),

    Application.find({
      studentId: student._id,
    })
      .populate({
        path: "jobId",
        select:
          "title companyId location salary",
        populate: {
          path: "companyId",
          select: "name",
        },
      })
      .sort({
        createdAt: -1,
      })
      .limit(5),
  ]);

  return {
    profile: {
      profileCompletion:
        student.profileCompletion,
      degree: student.degree,
      graduationYear:
        student.graduationYear,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
    },

    metrics: {
      totalApplications,
      shortlistedApplications,
      interviewApplications,
      selectedApplications,
      rejectedApplications,
    },

    upcomingInterviews,
    recentApplications,
  };
};

export const getRecruiterDashboard = async (
  userId
) => {
  const recruiter =
    await RecruiterProfile.findOne({
      userId,
    });

  if (!recruiter) {
    throw error(
      "Recruiter profile not found",
      404
    );
  }

  const jobIds = await Job.find({
    createdBy: userId,
  }).distinct("_id");

  const [
    company,
    totalJobs,
    publishedJobs,
    closedJobs,
    pendingJobs,
    totalApplications,
    shortlistedApplications,
    interviewApplications,
    selectedApplications,
    upcomingInterviews,
    recentApplications,
  ] = await Promise.all([
    Company.findById(
      recruiter.companyId
    ).select("name approvalStatus"),

    Job.countDocuments({
      createdBy: userId,
    }),

    Job.countDocuments({
      createdBy: userId,
      status: "PUBLISHED",
    }),

    Job.countDocuments({
      createdBy: userId,
      status: "CLOSED",
    }),

    Job.countDocuments({
      createdBy: userId,
      approvalStatus: "PENDING",
    }),

    Application.countDocuments({
      jobId: {
        $in: jobIds,
      },
    }),

    Application.countDocuments({
      jobId: {
        $in: jobIds,
      },
      status: "SHORTLISTED",
    }),

    Application.countDocuments({
      jobId: {
        $in: jobIds,
      },
      status: "INTERVIEW",
    }),

    Application.countDocuments({
      jobId: {
        $in: jobIds,
      },
      status: "SELECTED",
    }),

    Interview.find({
      recruiterId: userId,
      status: {
        $in: [
          "SCHEDULED",
          "RESCHEDULED",
        ],
      },
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .populate({
        path: "applicationId",
        populate: [
          {
            path: "jobId",
            select: "title",
          },
          {
            path: "studentId",
            select:
              "userId degree graduationYear cgpa",
          },
        ],
      })
      .sort({
        scheduledAt: 1,
      })
      .limit(5),

    Application.find({
      jobId: {
        $in: jobIds,
      },
    })
      .populate({
        path: "jobId",
        select: "title",
      })
      .populate({
        path: "studentId",
        select:
          "userId degree graduationYear cgpa",
      })
      .sort({
        createdAt: -1,
      })
      .limit(5),
  ]);

  return {
    company,

    metrics: {
      totalJobs,
      publishedJobs,
      closedJobs,
      pendingJobs,
      totalApplications,
      shortlistedApplications,
      interviewApplications,
      selectedApplications,
    },

    upcomingInterviews,
    recentApplications,
  };
};

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalStudents,
    totalRecruiters,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    rejectedCompanies,
    totalJobs,
    pendingJobs,
    approvedJobs,
    rejectedJobs,
    publishedJobs,
    closedJobs,
    totalApplications,
    shortlistedApplications,
    interviewApplications,
    selectedApplications,
    rejectedApplications,
    totalInterviews,
    upcomingInterviews,
  ] = await Promise.all([
    User.countDocuments(),

    StudentProfile.countDocuments(),

    RecruiterProfile.countDocuments(),

    Company.countDocuments(),

    Company.countDocuments({
      approvalStatus: "PENDING",
    }),

    Company.countDocuments({
      approvalStatus: "APPROVED",
    }),

    Company.countDocuments({
      approvalStatus: "REJECTED",
    }),

    Job.countDocuments(),

    Job.countDocuments({
      approvalStatus: "PENDING",
    }),

    Job.countDocuments({
      approvalStatus: "APPROVED",
    }),

    Job.countDocuments({
      approvalStatus: "REJECTED",
    }),

    Job.countDocuments({
      status: "PUBLISHED",
    }),

    Job.countDocuments({
      status: "CLOSED",
    }),

    Application.countDocuments(),

    Application.countDocuments({
      status: "SHORTLISTED",
    }),

    Application.countDocuments({
      status: "INTERVIEW",
    }),

    Application.countDocuments({
      status: "SELECTED",
    }),

    Application.countDocuments({
      status: "REJECTED",
    }),

    Interview.countDocuments(),

    Interview.find({
      status: {
        $in: [
          "SCHEDULED",
          "RESCHEDULED",
        ],
      },
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .populate({
        path: "applicationId",
        populate: {
          path: "jobId",
          select: "title",
        },
      })
      .sort({
        scheduledAt: 1,
      })
      .limit(5),
  ]);

  return {
    metrics: {
      totalUsers,
      totalStudents,
      totalRecruiters,

      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      rejectedCompanies,

      totalJobs,
      pendingJobs,
      approvedJobs,
      rejectedJobs,
      publishedJobs,
      closedJobs,

      totalApplications,
      shortlistedApplications,
      interviewApplications,
      selectedApplications,
      rejectedApplications,

      totalInterviews,
    },

    upcomingInterviews,
  };
};