import express from "express"
import { getAllUser, deleteUser, editRoleUser} from "../controllers/userControllers.js"
import { admin } from "../middleware/adminMiddleware.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, admin, getAllUser)
router.delete("/:id", verifyToken, admin, deleteUser)
router.put("/:id", verifyToken, admin, editRoleUser)


export default router