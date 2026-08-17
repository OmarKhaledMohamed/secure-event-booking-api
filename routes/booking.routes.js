import express from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";

import {
  createBookingSchema,
  updateBookingSchema,
} from "../validators/bookingValidator.js";

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *             properties:
 *               event:
 *                 type: string
 *                 example: 6a837029fefc6c4c4f90faf3
 *               seats:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation failed or insufficient seats
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Event not found
 */
router.post("/", protect, validate(createBookingSchema), createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", protect, getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a837029fefc6c4c4f90faf3
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking not found
 */
router.get("/:id", protect, getBookingById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seats:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Validation failed or insufficient seats
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking not found
 */
router.patch("/:id", protect, validate(updateBookingSchema), updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", protect, cancelBooking);

export default router;
