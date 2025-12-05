import express from "express"
import { getAllUser, deleteUser} from "../controllers/userControllers.js"
import { admin } from "../middleware/adminMiddleware.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, admin, getAllUser)
router.delete("/:id", verifyToken, admin, deleteUser)


export default router