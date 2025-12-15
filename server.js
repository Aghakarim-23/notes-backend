import express from "express";
import cors from "cors";
import "colors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoute from "./routes/notesRoute.js";
import userRoute from "./routes/userRoute.js";
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

const frontendURL =
  process.env.NODE_ENV === "production"
    ? "https://agas-notes-app.netlify.app/"
    : "http://localhost:5173";

console.log("My env === ".green, frontendURL.bgYellow);

app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 8001;

connectDB();

app.use("/api/auth", authRoutes);

app.use("/notes/", notesRoute);

app.use("/users", userRoute);

app.listen(PORT, () => {
  console.log(`App is working on ${PORT}`.bgGreen);
});
