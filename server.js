import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js"
import notesRoute from "./routes/notesRoute.js"
import userRoute from "./routes/userRoute.js"
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  // origin: "https://agas-notes-app.netlify.app",
  origin: "http://localhost:5173",
}));
app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const PORT = process.env.PORT || 8001;

connectDB();

app.use("/api/auth", authRoutes )

app.use("/notes/", notesRoute)

app.use('/users', userRoute)

app.listen(PORT, () => {
  console.log(`App is working on ${PORT}`.bgGreen);
});
