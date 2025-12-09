// scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");

// Import Admin model
const Admin = require("../models/Admin");

// Your DB connection
const { connectDB, disconnectDB } = require("../config/database");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      await disconnectDB();
      process.exit(0);
    }

    // Create new admin WITHOUT manually hashing password
    const admin = new Admin({
      username: "admin",
      password: "Dtc2026Admin@123",  // plain password
      role: "superadmin",
    });

    await admin.save(); // pre-save hook will hash it exactly once

    console.log("First admin created successfully!");
    console.log("Username: admin");
    console.log("Password: Dtc2026Admin@123  (CHANGE THIS AFTER LOGIN)");
    console.log("");
    console.log("Now login at: POST /api/auth/login");

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedAdmin();
