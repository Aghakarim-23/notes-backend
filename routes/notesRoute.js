import express from "express"

import { createNote, getNotes, noteDetail, deleteNote, noteEdit, getAllNotes} from "../controllers/notesController.js";
import { verifyToken } from "../middleware/auth.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router()

router.post("/createNote", verifyToken, createNote)

router.get("/getNotes", verifyToken, getNotes)

router.get('/noteDetail/:id', verifyToken, noteDetail)

router.put("/noteEdit/:id", verifyToken, noteEdit)

router.delete("/deleteNote/:id", verifyToken, deleteNote)

router.get("/getAllNotes", verifyToken, admin,  getAllNotes)


export default router
