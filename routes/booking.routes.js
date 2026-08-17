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

router.post(
  "/",
  protect,
  validate(createBookingSchema),
  createBooking,
);

router.get(
  "/",
  protect,
  getBookings,
);

router.get(
  "/:id",
  protect,
  getBookingById,
);

router.patch(
  "/:id",
  protect,
  validate(updateBookingSchema),
  updateBooking,
);

router.delete(
  "/:id",
  protect,
  cancelBooking,
);

export default router;