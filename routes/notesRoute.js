import express from "express"

import { createNote, getNotes, noteDetail } from "../controllers/notesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

router.post("/createNote", verifyToken, createNote)

router.get("/getNotes", verifyToken, getNotes)

router.get('/noteDetail/:id', verifyToken, noteDetail)

export default router
