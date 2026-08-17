import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().required(),

  date: Joi.date().iso().required(),

  location: Joi.string().trim().required(),

  totalSeats: Joi.number().integer().min(1).required(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100),

  description: Joi.string().trim(),

  date: Joi.date().iso(),

  location: Joi.string().trim(),

  totalSeats: Joi.number().integer().min(1),
}).min(1);
