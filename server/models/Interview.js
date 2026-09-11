import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "SCHEDULED",
        "RESCHEDULED",
        "CANCELLED",
        "COMPLETED",
      ],
      default: "SCHEDULED",
    },

    result: {
      type: String,
      enum: ["PENDING", "PASSED", "FAILED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

export default Interview;