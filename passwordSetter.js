import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");

  const hashedPassword = await bcrypt.hash("Admin123admin", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();

