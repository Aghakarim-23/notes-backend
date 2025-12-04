import express from "express"
import { getAllUser, deleteUser} from "../controllers/userControllers.js"

const router = express.Router()

router.get("/", getAllUser)
router.delete("/:id", deleteUser)


export default router