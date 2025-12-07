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
import path from "path"


const envFile = process.env.NODE_ENV ===  "production" ? 
  path.resolve(".env.production") :
  path.resolve(".env.local") 



dotenv.config({path: envFile});

dotenv.config({path: path.resolve(".env")})

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));


console.log("Environment:", process.env.NODE_ENV);
console.log("Frontend URL:", process.env.FRONTEND_URL);

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
