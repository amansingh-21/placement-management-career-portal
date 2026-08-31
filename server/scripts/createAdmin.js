import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin1@example.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    await User.create({
      name: "Test Admin",
      email: "admin1@example.com",
      passwordHash,
      role: "ADMIN",
    });

    console.log("Admin user created");
  } catch (error) {
    console.error("Failed to create admin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

createAdmin();