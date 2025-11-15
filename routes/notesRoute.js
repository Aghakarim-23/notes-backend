import express from "express"

import { createNote, getNotes } from "../controllers/notesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

router.post("/createNote", verifyToken, createNote)

router.get("/getNotes", verifyToken, getNotes)

export default router
