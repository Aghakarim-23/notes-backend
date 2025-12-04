import express from "express"
import { getAllUser } from "../controllers/userControllers.js"

const router = express.Router()

router.get("/", getAllUser)


export default router