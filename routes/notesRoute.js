import express from "express"

import { createNote, getNotes, noteDetail, deleteNote} from "../controllers/notesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

router.post("/createNote", verifyToken, createNote)

router.get("/getNotes", verifyToken, getNotes)

router.get('/noteDetail/:id', verifyToken, noteDetail)

router.delete("/deleteNote/:id", verifyToken, deleteNote)

export default router
