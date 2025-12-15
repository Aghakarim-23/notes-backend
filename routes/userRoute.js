import express from "express"
import { getAllUser, deleteUser, editRoleUser, editVerifyStatus} from "../controllers/userControllers.js"
import { admin } from "../middleware/adminMiddleware.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, admin, getAllUser)
router.delete("/:id", verifyToken, admin, deleteUser)
router.put("/:id/role", verifyToken, admin, editRoleUser)
router.put("/:id/verifyStatus", verifyToken, admin, editVerifyStatus)


export default router