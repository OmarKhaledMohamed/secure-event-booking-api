import Joi from "joi";

export const createBookingSchema = Joi.object({
  event: Joi.string()
    .required()
    .messages({
      "string.empty": "Event is required",
      "any.required": "Event is required",
    }),

  seats: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Seats must be a number",
      "number.integer": "Seats must be an integer",
      "number.min": "At least one seat is required",
      "any.required": "Number of seats is required",
    }),
});

export const updateBookingSchema = Joi.object({
  seats: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Seats must be a number",
      "number.integer": "Seats must be an integer",
      "number.min": "At least one seat is required",
      "any.required": "Number of seats is required",
    }),
});