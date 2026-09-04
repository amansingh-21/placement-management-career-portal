import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    backlogs: {
      type: Number,
      required: true,
      min: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        technologies: {
          type: [String],
          default: [],
        },
      },
    ],

    certifications: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
    
          issuer: {
            type: String,
            required: true,
            trim: true,
          },
    
          year: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },

    resumePath: {
      type: String,
      default: null,
      trim: true,
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;