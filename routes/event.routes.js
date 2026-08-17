import express from "express";

import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/protect.js";
import { restrictTo } from "../middleware/restrictTo.js";
import { validate } from "../middleware/validate.js";

import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
router.get("/", getEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get("/:id", getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - totalSeats
 *             properties:
 *               title:
 *                 type: string
 *                 example: Football Match
 *               description:
 *                 type: string
 *                 example: Friendly football match
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-20T18:00:00.000Z"
 *               location:
 *                 type: string
 *                 example: Cairo Stadium
 *               totalSeats:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Organizer only
 */
router.post(
  "/",
  protect,
  restrictTo("admin", "organizer"),
  validate(createEventSchema),
  createEvent,
);
/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
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
 *               title:
 *                 type: string
 *                 example: Updated Football Match
 *               description:
 *                 type: string
 *                 example: Updated event description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-25T18:00:00.000Z"
 *               location:
 *                 type: string
 *                 example: Cairo Stadium
 *               totalSeats:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Organizer only
 *       404:
 *         description: Event not found
 */ router.put(
  "/:id",
  protect,
  restrictTo("admin", "organizer"),
  validate(updateEventSchema),
  updateEvent,
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
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
 *         description: Event deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Organizer only
 *       404:
 *         description: Event not found
 */
router.delete("/:id", protect, restrictTo("admin", "organizer"), deleteEvent);

export default router;
