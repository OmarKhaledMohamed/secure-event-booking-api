import express from "express";
import { getMe } from "../controllers/userController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Authentication required
 */
router.get("/me", protect, getMe);

export default router;
