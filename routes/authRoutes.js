import express from "express";
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  changePassword,
  verifyEmail,
} from "../controllers/auhtController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *      summary: User register
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        email:
 *                          type: string
 *                        username:
 *                          type: string
 *                        password:
 *                           type: string
 *      responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email is already exists
 *       500:
 *         description: Server error
 *
 *
 *
 *
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

router.get("/refresh", refreshToken);

router.post("/forgotPassword", forgotPassword);

router.get("/reset-password/:token", verifyResetToken);

router.post("/reset-password/:token", resetPassword);

router.put("/change-password", verifyToken, changePassword)

router.get("/:token", verifyEmail)

export default router;
