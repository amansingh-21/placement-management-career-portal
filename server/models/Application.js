import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEW",
        "REJECTED",
        "SELECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            required: true,
          },

          changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          changedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  { studentId: 1, jobId: 1 },
  { unique: true }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;